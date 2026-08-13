from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from database import users_collection, reports_collection
from models import UserRegister, UserLogin, EmergencyReport
from auth import hash_password, verify_password
from typing import List, Dict, Any

app = FastAPI(title="ResQ Bangladesh API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/users/register")
async def register_user(user: UserRegister):
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_pass = hash_password(user.password)
    user_dict = user.dict()
    user_dict["password"] = hashed_pass
    
    result = await users_collection.insert_one(user_dict)
    return {
        "message": "User registered successfully",
        "id": str(result.inserted_id)
    }

@app.post("/users/login")
async def login_user(credentials: UserLogin):
    user = await users_collection.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    return {
        "message": "Login successful",
        "email": user["email"],
        "role": user.get("role", "user")
    }

@app.post("/reports")
async def create_report(report: EmergencyReport):
    report_dict = report.dict()
    result = await reports_collection.insert_one(report_dict)
    return {
        "message": "Emergency report created successfully in MongoDB",
        "id": str(result.inserted_id)
    }

@app.get("/reports", response_model=List[Dict[str, Any]])
async def get_reports():
    reports = []
    cursor = reports_collection.find({})
    async for document in cursor:
        document["id"] = str(document["_id"])
        del document["_id"]
        reports.append(document)
    return reports