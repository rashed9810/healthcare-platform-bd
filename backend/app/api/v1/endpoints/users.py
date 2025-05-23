"""User management endpoints"""
from fastapi import APIRouter
router = APIRouter()

@router.get("/profile")
async def get_profile():
    return {"message": "User profile endpoint"}
