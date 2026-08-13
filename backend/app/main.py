from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.api import users, emergency


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ResQ Bangladesh API",
    description="Emergency Management System API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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