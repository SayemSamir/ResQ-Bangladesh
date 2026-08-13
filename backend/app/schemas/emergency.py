from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class EmergencyCreate(BaseModel):
    title: str
    disaster_type: str
    description: Optional[str] = None
    location_address: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    severity: Optional[str] = "MEDIUM"


class EmergencyResponse(BaseModel):
    id: int
    user_id: int
    title: str
    disaster_type: str
    description: Optional[str]
    location_address: str
    latitude: Optional[float]
    longitude: Optional[float]
    severity: str
    status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

   
class EmergencyStatusUpdate(BaseModel):
    status: str  # PENDING, ASSIGNED, IN_PROGRESS, RESOLVED