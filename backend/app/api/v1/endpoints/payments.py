"""Payment processing endpoints"""
from fastapi import APIRouter
router = APIRouter()

@router.post("/process")
async def process_payment():
    return {"message": "Payment processing endpoint"}
