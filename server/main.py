import os
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import JWTError, jwt
import motor.motor_asyncio
from bson import ObjectId

# --- Configuration ---
SECRET_KEY = "super-secret-key-resq-bangladesh"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day

# MongoDB Connection (Make sure MongoDB is running locally or use Atlas URI)
MONGO_DETAILS = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
db = client.resq_bangladesh_db

users_collection = db.get_collection("users")
reports_collection = db.get_collection("reports")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI(title="ResQ Bangladesh API", version="1.0.0")

# CORS Setup for Frontend Communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---
class UserRegister(BaseModel):
    fullName: str
    phone: str
    email: EmailStr
    password: str
    role: str = "user"

class UserInDB(BaseModel):
    id: str
    fullName: str
    phone: str
    email: str
    role: str

class Token(BaseModel):
    access_token: str
    token_type: str

class ReportCreate(BaseModel):
    title: str
    disasterType: str
    locationAddress: str
    description: str
    latitude: Optional[float] = 22.3569
    longitude: Optional[float] = 91.7832

class ReportStatusUpdate(BaseModel):
    status: str

# --- Helper Functions ---
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await users_collection.find_one({"email": email})
    if user is None:
        raise credentials_exception
    return {"id": str(user["_id"]), "email": user["email"], "role": user.get("role", "user")}

# --- API Endpoints ---
@app.get("/")
def read_root():
    return {"message": "ResQ Bangladesh API is up and running!"}

@app.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserRegister):
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    user_dict = {
        "fullName": user.fullName,
        "phone": user.phone,
        "email": user.email,
        "password": hashed_password,
        "role": user.role
    }
    
    result = await users_collection.insert_one(user_dict)
    return {"message": "User registered successfully", "id": str(result.inserted_id)}

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await users_collection.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"], "role": user.get("role", "user")}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/reports", status_code=status.HTTP_201_CREATED)
async def create_report(report: ReportCreate, current_user: dict = Depends(get_current_user)):
    report_dict = {
        "title": report.title,
        "disaster_type": report.disasterType,
        "location_address": report.locationAddress,
        "description": report.description,
        "latitude": report.latitude,
        "longitude": report.longitude,
        "status": "Pending",
        "user_id": current_user["id"],
        "created_at": datetime.utcnow()
    }
    result = await reports_collection.insert_one(report_dict)
    report_dict["id"] = str(result.inserted_id)
    del report_dict["_id"]
    return report_dict

@app.get("/reports")
async def get_reports():
    reports = []
    cursor = reports_collection.find().sort("created_at", -1)
    async for document in cursor:
        document["id"] = str(document["_id"])
        del document["_id"]
        reports.append(document)
    return reports

@app.patch("/reports/{report_id}/status")
async def update_report_status(report_id: str, status_update: ReportStatusUpdate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to update status")
    
    try:
        obj_id = ObjectId(report_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid report ID format")

    result = await reports_collection.update_one(
        {"_id": obj_id},
        {"$set": {"status": status_update.status}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Report not found")
        
    return {"message": "Report status updated successfully"}