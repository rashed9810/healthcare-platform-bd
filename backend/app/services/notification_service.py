"""
Advanced Notification Service for HealthConnect
Handles medication reminders, appointment notifications, and health check-ups
"""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from enum import Enum
import json

from ..core.database import get_mongodb
from ..models.ai_models import NotificationRequest, NotificationResponse, Priority
from .email_service import EmailService
from .sms_service import SMSService
from .push_notification_service import PushNotificationService

logger = logging.getLogger(__name__)

class NotificationType(str, Enum):
    MEDICATION_REMINDER = "medication_reminder"
    APPOINTMENT_REMINDER = "appointment_reminder"
    HEALTH_CHECKUP = "health_checkup"
    EMERGENCY_ALERT = "emergency_alert"
    SYSTEM_NOTIFICATION = "system_notification"
    CUSTOM_REMINDER = "custom_reminder"

class NotificationService:
    """Comprehensive notification service for health reminders"""
    
    def __init__(self):
        self.email_service = EmailService()
        self.sms_service = SMSService()
        self.push_service = PushNotificationService()
        self.db = None
        
    async def initialize(self):
        """Initialize database connection"""
        self.db = await get_mongodb()
        
    async def create_medication_reminder(
        self,
        user_id: str,
        medication_name: str,
        dosage: str,
        frequency: str,
        time: str,
        duration_days: int = 30,
        before_food: bool = False
    ) -> Dict[str, Any]:
        """Create a medication reminder"""
        try:
            reminder_data = {
                "user_id": user_id,
                "type": NotificationType.MEDICATION_REMINDER,
                "title": f"Take {medication_name}",
                "description": f"Take {dosage} of {medication_name}",
                "medication_details": {
                    "name": medication_name,
                    "dosage": dosage,
                    "before_food": before_food
                },
                "schedule": {
                    "frequency": frequency,  # daily, weekly, monthly
                    "time": time,
                    "duration_days": duration_days
                },
                "is_active": True,
                "created_at": datetime.utcnow(),
                "next_trigger": self._calculate_next_trigger(frequency, time)
            }
            
            result = await self.db.reminders.insert_one(reminder_data)
            
            # Schedule the notification
            await self._schedule_recurring_notification(str(result.inserted_id), reminder_data)
            
            logger.info(f"Created medication reminder for user {user_id}: {medication_name}")
            return {"id": str(result.inserted_id), "status": "created"}
            
        except Exception as e:
            logger.error(f"Error creating medication reminder: {e}")
            raise
            
    async def create_appointment_reminder(
        self,
        user_id: str,
        doctor_name: str,
        appointment_date: datetime,
        location: str,
        reminder_times: List[int] = [24, 2, 0.5]  # hours before
    ) -> Dict[str, Any]:
        """Create appointment reminders"""
        try:
            reminders_created = []
            
            for hours_before in reminder_times:
                reminder_time = appointment_date - timedelta(hours=hours_before)
                
                if reminder_time > datetime.utcnow():
                    reminder_data = {
                        "user_id": user_id,
                        "type": NotificationType.APPOINTMENT_REMINDER,
                        "title": f"Appointment with Dr. {doctor_name}",
                        "description": f"Upcoming appointment at {location}",
                        "appointment_details": {
                            "doctor_name": doctor_name,
                            "appointment_date": appointment_date.isoformat(),
                            "location": location,
                            "hours_before": hours_before
                        },
                        "schedule": {
                            "frequency": "once",
                            "trigger_time": reminder_time
                        },
                        "is_active": True,
                        "created_at": datetime.utcnow(),
                        "next_trigger": reminder_time
                    }
                    
                    result = await self.db.reminders.insert_one(reminder_data)
                    
                    # Schedule the notification
                    await self._schedule_one_time_notification(str(result.inserted_id), reminder_data)
                    
                    reminders_created.append({
                        "id": str(result.inserted_id),
                        "hours_before": hours_before,
                        "trigger_time": reminder_time.isoformat()
                    })
            
            logger.info(f"Created {len(reminders_created)} appointment reminders for user {user_id}")
            return {"reminders": reminders_created, "status": "created"}
            
        except Exception as e:
            logger.error(f"Error creating appointment reminders: {e}")
            raise
            
    async def create_health_checkup_reminder(
        self,
        user_id: str,
        checkup_type: str,
        frequency: str,
        time: str,
        description: str = ""
    ) -> Dict[str, Any]:
        """Create health checkup reminders"""
        try:
            reminder_data = {
                "user_id": user_id,
                "type": NotificationType.HEALTH_CHECKUP,
                "title": f"{checkup_type} Check",
                "description": description or f"Time for your {checkup_type.lower()} check",
                "checkup_details": {
                    "type": checkup_type,
                    "instructions": description
                },
                "schedule": {
                    "frequency": frequency,
                    "time": time
                },
                "is_active": True,
                "created_at": datetime.utcnow(),
                "next_trigger": self._calculate_next_trigger(frequency, time)
            }
            
            result = await self.db.reminders.insert_one(reminder_data)
            
            # Schedule the notification
            await self._schedule_recurring_notification(str(result.inserted_id), reminder_data)
            
            logger.info(f"Created health checkup reminder for user {user_id}: {checkup_type}")
            return {"id": str(result.inserted_id), "status": "created"}
            
        except Exception as e:
            logger.error(f"Error creating health checkup reminder: {e}")
            raise
            
    async def send_notification(
        self,
        user_id: str,
        notification_request: NotificationRequest
    ) -> NotificationResponse:
        """Send notification through multiple channels"""
        try:
            # Get user preferences
            user_prefs = await self._get_user_notification_preferences(user_id)
            
            results = []
            
            # Send push notification
            if "app" in notification_request.channels and user_prefs.get("push_enabled", True):
                push_result = await self.push_service.send_notification(
                    user_id=user_id,
                    title=notification_request.title,
                    message=notification_request.message,
                    data=notification_request.data
                )
                results.append({"channel": "push", "status": push_result})
            
            # Send email notification
            if "email" in notification_request.channels and user_prefs.get("email_enabled", False):
                email_result = await self.email_service.send_notification_email(
                    user_id=user_id,
                    subject=notification_request.title,
                    message=notification_request.message,
                    notification_type=notification_request.notification_type
                )
                results.append({"channel": "email", "status": email_result})
            
            # Send SMS notification
            if "sms" in notification_request.channels and user_prefs.get("sms_enabled", False):
                sms_result = await self.sms_service.send_notification_sms(
                    user_id=user_id,
                    message=f"{notification_request.title}: {notification_request.message}"
                )
                results.append({"channel": "sms", "status": sms_result})
            
            # Log notification
            await self._log_notification(user_id, notification_request, results)
            
            return NotificationResponse(
                notification_id=f"notif_{datetime.utcnow().timestamp()}",
                status="sent",
                channels_sent=len(results),
                delivery_results=results
            )
            
        except Exception as e:
            logger.error(f"Error sending notification: {e}")
            return NotificationResponse(
                notification_id="",
                status="failed",
                channels_sent=0,
                delivery_results=[],
                error=str(e)
            )
            
    async def get_user_reminders(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all reminders for a user"""
        try:
            reminders = await self.db.reminders.find(
                {"user_id": user_id, "is_active": True}
            ).sort("next_trigger", 1).to_list(length=None)
            
            return [self._format_reminder(reminder) for reminder in reminders]
            
        except Exception as e:
            logger.error(f"Error getting user reminders: {e}")
            return []
            
    async def update_reminder(self, reminder_id: str, updates: Dict[str, Any]) -> bool:
        """Update a reminder"""
        try:
            result = await self.db.reminders.update_one(
                {"_id": reminder_id},
                {"$set": {**updates, "updated_at": datetime.utcnow()}}
            )
            
            return result.modified_count > 0
            
        except Exception as e:
            logger.error(f"Error updating reminder: {e}")
            return False
            
    async def delete_reminder(self, reminder_id: str) -> bool:
        """Delete a reminder"""
        try:
            result = await self.db.reminders.update_one(
                {"_id": reminder_id},
                {"$set": {"is_active": False, "deleted_at": datetime.utcnow()}}
            )
            
            return result.modified_count > 0
            
        except Exception as e:
            logger.error(f"Error deleting reminder: {e}")
            return False
            
    def _calculate_next_trigger(self, frequency: str, time: str) -> datetime:
        """Calculate next trigger time based on frequency"""
        now = datetime.utcnow()
        hour, minute = map(int, time.split(':'))
        
        if frequency == "daily":
            next_trigger = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
            if next_trigger <= now:
                next_trigger += timedelta(days=1)
        elif frequency == "weekly":
            next_trigger = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
            days_ahead = 7 - now.weekday()
            next_trigger += timedelta(days=days_ahead)
        elif frequency == "monthly":
            next_trigger = now.replace(day=1, hour=hour, minute=minute, second=0, microsecond=0)
            if next_trigger <= now:
                next_trigger = next_trigger.replace(month=next_trigger.month + 1)
        else:
            next_trigger = now + timedelta(hours=1)  # Default to 1 hour
            
        return next_trigger
        
    async def _schedule_recurring_notification(self, reminder_id: str, reminder_data: Dict[str, Any]):
        """Schedule recurring notifications"""
        # This would integrate with a task scheduler like Celery or APScheduler
        # For now, we'll store the schedule in the database
        pass
        
    async def _schedule_one_time_notification(self, reminder_id: str, reminder_data: Dict[str, Any]):
        """Schedule one-time notifications"""
        # This would integrate with a task scheduler
        pass
        
    async def _get_user_notification_preferences(self, user_id: str) -> Dict[str, Any]:
        """Get user notification preferences"""
        try:
            user = await self.db.users.find_one({"_id": user_id})
            return user.get("notification_preferences", {
                "push_enabled": True,
                "email_enabled": False,
                "sms_enabled": False
            })
        except:
            return {"push_enabled": True, "email_enabled": False, "sms_enabled": False}
            
    async def _log_notification(self, user_id: str, request: NotificationRequest, results: List[Dict]):
        """Log notification for analytics"""
        try:
            log_entry = {
                "user_id": user_id,
                "notification_type": request.notification_type,
                "title": request.title,
                "channels_attempted": request.channels,
                "results": results,
                "timestamp": datetime.utcnow()
            }
            
            await self.db.notification_logs.insert_one(log_entry)
            
        except Exception as e:
            logger.error(f"Error logging notification: {e}")
            
    def _format_reminder(self, reminder: Dict[str, Any]) -> Dict[str, Any]:
        """Format reminder for API response"""
        return {
            "id": str(reminder["_id"]),
            "type": reminder["type"],
            "title": reminder["title"],
            "description": reminder["description"],
            "schedule": reminder["schedule"],
            "next_trigger": reminder["next_trigger"].isoformat() if reminder.get("next_trigger") else None,
            "is_active": reminder["is_active"],
            "created_at": reminder["created_at"].isoformat()
        }

# Global notification service instance
notification_service = NotificationService()
