"""
Enhanced Notification endpoints for HealthConnect
Handles medication reminders, appointment notifications, and health check-ups
"""

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from typing import List, Dict, Any, Optional
from datetime import datetime
import logging

from ....core.database import get_mongodb
from ....services.notification_service import notification_service
from ....models.ai_models import NotificationRequest, NotificationResponse

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/medication-reminder", response_model=Dict[str, Any])
async def create_medication_reminder(
    user_id: str,
    medication_name: str,
    dosage: str,
    frequency: str,
    time: str,
    duration_days: int = 30,
    before_food: bool = False
):
    """Create a medication reminder"""
    try:
        await notification_service.initialize()
        result = await notification_service.create_medication_reminder(
            user_id=user_id,
            medication_name=medication_name,
            dosage=dosage,
            frequency=frequency,
            time=time,
            duration_days=duration_days,
            before_food=before_food
        )
        return result
    except Exception as e:
        logger.error(f"Error creating medication reminder: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/appointment-reminder", response_model=Dict[str, Any])
async def create_appointment_reminder(
    user_id: str,
    doctor_name: str,
    appointment_date: datetime,
    location: str,
    reminder_times: List[int] = [24, 2, 0.5]
):
    """Create appointment reminders"""
    try:
        await notification_service.initialize()
        result = await notification_service.create_appointment_reminder(
            user_id=user_id,
            doctor_name=doctor_name,
            appointment_date=appointment_date,
            location=location,
            reminder_times=reminder_times
        )
        return result
    except Exception as e:
        logger.error(f"Error creating appointment reminder: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/health-checkup-reminder", response_model=Dict[str, Any])
async def create_health_checkup_reminder(
    user_id: str,
    checkup_type: str,
    frequency: str,
    time: str,
    description: str = ""
):
    """Create health checkup reminder"""
    try:
        await notification_service.initialize()
        result = await notification_service.create_health_checkup_reminder(
            user_id=user_id,
            checkup_type=checkup_type,
            frequency=frequency,
            time=time,
            description=description
        )
        return result
    except Exception as e:
        logger.error(f"Error creating health checkup reminder: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/send", response_model=NotificationResponse)
async def send_notification(
    user_id: str,
    notification_request: NotificationRequest,
    background_tasks: BackgroundTasks
):
    """Send notification through multiple channels"""
    try:
        await notification_service.initialize()
        result = await notification_service.send_notification(
            user_id=user_id,
            notification_request=notification_request
        )
        return result
    except Exception as e:
        logger.error(f"Error sending notification: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/{user_id}", response_model=List[Dict[str, Any]])
async def get_user_reminders(user_id: str):
    """Get all reminders for a user"""
    try:
        await notification_service.initialize()
        reminders = await notification_service.get_user_reminders(user_id)
        return reminders
    except Exception as e:
        logger.error(f"Error getting user reminders: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/reminder/{reminder_id}", response_model=Dict[str, Any])
async def update_reminder(
    reminder_id: str,
    updates: Dict[str, Any]
):
    """Update a reminder"""
    try:
        await notification_service.initialize()
        success = await notification_service.update_reminder(reminder_id, updates)
        if success:
            return {"status": "updated", "reminder_id": reminder_id}
        else:
            raise HTTPException(status_code=404, detail="Reminder not found")
    except Exception as e:
        logger.error(f"Error updating reminder: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/reminder/{reminder_id}", response_model=Dict[str, Any])
async def delete_reminder(reminder_id: str):
    """Delete a reminder"""
    try:
        await notification_service.initialize()
        success = await notification_service.delete_reminder(reminder_id)
        if success:
            return {"status": "deleted", "reminder_id": reminder_id}
        else:
            raise HTTPException(status_code=404, detail="Reminder not found")
    except Exception as e:
        logger.error(f"Error deleting reminder: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def get_notifications():
    """Get notification system status"""
    return {
        "message": "Enhanced Notification System Active",
        "features": [
            "Medication Reminders",
            "Appointment Reminders",
            "Health Check-up Notifications",
            "Multi-channel Delivery (Push, Email, SMS)",
            "User Preference Management"
        ],
        "status": "operational"
    }
