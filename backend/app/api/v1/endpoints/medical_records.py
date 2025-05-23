"""Medical records endpoints"""
from fastapi import APIRouter
router = APIRouter()

@router.get("/")
async def get_medical_records():
    return {"message": "Medical records endpoint"}
