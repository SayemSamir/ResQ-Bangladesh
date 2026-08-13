from fastapi import FastAPI
from app.database import Base, engine
from app.api.users import router as users_router

from app.api.emergency import router as emergency_router
from app.api import users, emergency

Base.metadata.create_all(bind=engine)


app = FastAPI()

app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(emergency.router, prefix="/emergency", tags=["Emergency Requests"])

@app.get("/")
def root():
    return {
        "message": "ResQ Bangladesh API is running",
        "status": "online"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }