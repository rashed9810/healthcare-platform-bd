"""Doctor management endpoints"""
from fastapi import APIRouter
router = APIRouter()

@router.get("/")
async def get_doctors():
    return {"message": "Doctors endpoint"}
