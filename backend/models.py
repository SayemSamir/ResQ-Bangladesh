from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    password: str
    role: Optional[str] = "user"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class EmergencyReport(BaseModel):
    title: str
    disasterType: str
    locationAddress: str
    description: str
    status: Optional[str] = "Pending"