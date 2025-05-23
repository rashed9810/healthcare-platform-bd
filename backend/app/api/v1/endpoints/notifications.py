"""Notification endpoints"""
from fastapi import APIRouter
router = APIRouter()

@router.get("/")
async def get_notifications():
    return {"message": "Notifications endpoint"}
