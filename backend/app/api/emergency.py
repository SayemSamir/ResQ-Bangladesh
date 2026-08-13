from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.emergency import EmergencyRequest
from app.models.user import User
from app.schemas.emergency import (
    EmergencyCreate,
    EmergencyResponse,
    EmergencyStatusUpdate,
)
from app.security import get_current_user_id, require_roles

# prefix সারণো হলো যাতে main.py এর prefix="/emergency" এর সাথে Double Prefix (Double URL) না তৈরি হয়
router = APIRouter(
    tags=["Emergency Requests"]
)


@router.post("/report", response_model=EmergencyResponse, status_code=status.HTTP_201_CREATED)
def create_emergency_report(
    data: EmergencyCreate,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    new_report = EmergencyRequest(
        user_id=current_user_id,
        title=data.title,
        disaster_type=data.disaster_type,
        description=data.description,
        location_address=data.location_address,
        latitude=data.latitude,
        longitude=data.longitude,
        severity=data.severity
    )
    
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    
    return new_report


@router.get("/all", response_model=List[EmergencyResponse])
def get_all_emergencies(
    db: Session = Depends(get_db)
):
    return db.query(EmergencyRequest).order_by(EmergencyRequest.created_at.desc()).all()


@router.patch("/{emergency_id}/status", response_model=EmergencyResponse)
def update_emergency_status(
    emergency_id: int,
    status_data: EmergencyStatusUpdate,
    current_user: User = Depends(require_roles(["admin", "rescue_team"])),
    db: Session = Depends(get_db)
):
    emergency = db.query(EmergencyRequest).filter(EmergencyRequest.id == emergency_id).first()
    if not emergency:
        raise HTTPException(status_code=404, detail="Emergency request not found")
    
    emergency.status = status_data.status
    db.commit()
    db.refresh(emergency)
    
    return emergency