from typing import Optional
from pydantic import BaseModel, EmailStr
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.security import hash_password, verify_password, create_access_token


# --- Pydantic Schemas ---
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    password: str
    role: Optional[str] = "user"


router = APIRouter()


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    
    existing_email = db.query(User).filter(User.email == user_data.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Check existing phone
    if user_data.phone:
        existing_phone = db.query(User).filter(User.phone == user_data.phone).first()
        if existing_phone:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Phone number already registered"
            )

    hashed_pwd = hash_password(user_data.password)

    user_kwargs = {
        "email": user_data.email,
        "role": user_data.role or "user"
    }

    # Dynamically match User model field names
    if hasattr(User, "full_name"):
        user_kwargs["full_name"] = user_data.full_name
    elif hasattr(User, "name"):
        user_kwargs["name"] = user_data.full_name

    if hasattr(User, "phone"):
        user_kwargs["phone"] = user_data.phone

    if hasattr(User, "password_hash"):
        user_kwargs["password_hash"] = hashed_pwd
    elif hasattr(User, "hashed_password"):
        user_kwargs["hashed_password"] = hashed_pwd
    else:
        user_kwargs["password"] = hashed_pwd

    new_user = User(**user_kwargs)

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Registration failed: {str(e)}"
        )

    return {"message": "User created successfully", "user_id": new_user.id}


@router.post("/login")
def login(login_data: dict, db: Session = Depends(get_db)):
    email = login_data.get("email")
    password = login_data.get("password")

    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and password are required"
        )

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    # Check password dynamically regardless of model field name
    stored_hash = getattr(user, "password_hash", None) or getattr(user, "hashed_password", None) or getattr(user, "password", None)

    if not stored_hash or not verify_password(password, stored_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    access_token = create_access_token(data={"sub": str(user.id), "email": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}