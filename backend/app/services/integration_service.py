"""
Integration service to connect Python backend with Next.js frontend
"""

import httpx
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
import json
import asyncio

from ..core.config import settings
from ..core.logging_config import healthcare_logger

logger = logging.getLogger(__name__)

class NextJSIntegrationService:
    """Service to integrate with Next.js frontend"""
    
    def __init__(self):
        self.nextjs_base_url = "http://localhost:3002"  # Next.js server
        self.timeout = 30.0
        
    async def sync_appointment_data(self, appointment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Sync appointment data with Next.js"""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.nextjs_base_url}/api/appointments/sync",
                    json=appointment_data,
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code == 200:
                    healthcare_logger.log_appointment("sync_success", appointment_data)
                    return response.json()
                else:
                    logger.error(f"Failed to sync appointment: {response.status_code}")
                    return {"error": "Sync failed"}
                    
        except Exception as e:
            logger.error(f"Error syncing appointment: {str(e)}")
            return {"error": str(e)}
    
    async def send_ai_analysis_to_frontend(
        self, 
        patient_id: str, 
        analysis_result: Dict[str, Any]
    ) -> bool:
        """Send AI analysis results to frontend"""
        try:
            payload = {
                "patient_id": patient_id,
                "analysis_result": analysis_result,
                "timestamp": datetime.utcnow().isoformat(),
                "source": "python_backend"
            }
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.nextjs_base_url}/api/ai/analysis-result",
                    json=payload
                )
                
                return response.status_code == 200
                
        except Exception as e:
            logger.error(f"Error sending AI analysis: {str(e)}")
            return False
    
    async def get_patient_data(self, patient_id: str) -> Optional[Dict[str, Any]]:
        """Get patient data from Next.js"""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    f"{self.nextjs_base_url}/api/patients/{patient_id}"
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    logger.warning(f"Patient not found: {patient_id}")
                    return None
                    
        except Exception as e:
            logger.error(f"Error getting patient data: {str(e)}")
            return None
    
    async def update_appointment_status(
        self, 
        appointment_id: str, 
        status: str, 
        ai_analysis: Optional[Dict] = None
    ) -> bool:
        """Update appointment status in Next.js"""
        try:
            payload = {
                "appointment_id": appointment_id,
                "status": status,
                "updated_at": datetime.utcnow().isoformat(),
                "ai_analysis": ai_analysis
            }
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.patch(
                    f"{self.nextjs_base_url}/api/appointments/{appointment_id}/status",
                    json=payload
                )
                
                return response.status_code == 200
                
        except Exception as e:
            logger.error(f"Error updating appointment status: {str(e)}")
            return False

class PaymentIntegrationService:
    """Service to integrate payment processing with Next.js"""
    
    def __init__(self):
        self.nextjs_base_url = "http://localhost:3002"
        
    async def process_payment_callback(
        self, 
        payment_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Process payment callback from bKash/Nagad"""
        try:
            # Enhanced payment processing with AI fraud detection
            fraud_score = await self._analyze_payment_fraud(payment_data)
            
            enhanced_payment_data = {
                **payment_data,
                "fraud_score": fraud_score,
                "processed_by": "python_backend",
                "processed_at": datetime.utcnow().isoformat()
            }
            
            # Send to Next.js for final processing
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.nextjs_base_url}/api/payments/callback",
                    json=enhanced_payment_data
                )
                
                healthcare_logger.log_payment("callback_processed", enhanced_payment_data)
                return response.json()
                
        except Exception as e:
            logger.error(f"Error processing payment callback: {str(e)}")
            return {"error": str(e)}
    
    async def _analyze_payment_fraud(self, payment_data: Dict[str, Any]) -> float:
        """AI-powered fraud detection for payments"""
        # Mock implementation - in production, use ML models
        fraud_indicators = 0
        
        # Check for suspicious patterns
        amount = payment_data.get("amount", 0)
        if amount > 10000:  # High amount
            fraud_indicators += 0.2
        
        # Check time patterns
        hour = datetime.now().hour
        if hour < 6 or hour > 22:  # Unusual hours
            fraud_indicators += 0.1
        
        # Check payment method patterns
        payment_method = payment_data.get("payment_method", "")
        if payment_method not in ["bkash", "nagad"]:
            fraud_indicators += 0.3
        
        return min(fraud_indicators, 1.0)

class NotificationIntegrationService:
    """Service to handle notifications between Python backend and Next.js"""
    
    def __init__(self):
        self.nextjs_base_url = "http://localhost:3002"
        
    async def send_ai_alert(
        self, 
        patient_id: str, 
        alert_type: str, 
        message: str, 
        priority: str = "medium"
    ) -> bool:
        """Send AI-generated alerts to frontend"""
        try:
            notification_data = {
                "recipient_id": patient_id,
                "type": "ai_alert",
                "alert_type": alert_type,
                "message": message,
                "priority": priority,
                "source": "ai_analysis",
                "timestamp": datetime.utcnow().isoformat()
            }
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.nextjs_base_url}/api/notifications/send",
                    json=notification_data
                )
                
                return response.status_code == 200
                
        except Exception as e:
            logger.error(f"Error sending AI alert: {str(e)}")
            return False
    
    async def send_health_reminder(
        self, 
        patient_id: str, 
        reminder_type: str, 
        details: Dict[str, Any]
    ) -> bool:
        """Send health reminders based on AI analysis"""
        try:
            reminder_data = {
                "recipient_id": patient_id,
                "type": "health_reminder",
                "reminder_type": reminder_type,
                "details": details,
                "timestamp": datetime.utcnow().isoformat()
            }
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.nextjs_base_url}/api/notifications/health-reminder",
                    json=reminder_data
                )
                
                return response.status_code == 200
                
        except Exception as e:
            logger.error(f"Error sending health reminder: {str(e)}")
            return False

class DataSyncService:
    """Service to sync data between Python backend and Next.js"""
    
    def __init__(self):
        self.nextjs_base_url = "http://localhost:3002"
        
    async def sync_doctor_analytics(self, analytics_data: Dict[str, Any]) -> bool:
        """Sync doctor analytics with frontend"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.nextjs_base_url}/api/analytics/doctors/sync",
                    json=analytics_data
                )
                
                return response.status_code == 200
                
        except Exception as e:
            logger.error(f"Error syncing doctor analytics: {str(e)}")
            return False
    
    async def sync_appointment_analytics(self, analytics_data: Dict[str, Any]) -> bool:
        """Sync appointment analytics with frontend"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.nextjs_base_url}/api/analytics/appointments/sync",
                    json=analytics_data
                )
                
                return response.status_code == 200
                
        except Exception as e:
            logger.error(f"Error syncing appointment analytics: {str(e)}")
            return False
    
    async def get_real_time_data(self) -> Dict[str, Any]:
        """Get real-time data from Next.js"""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{self.nextjs_base_url}/api/data/real-time"
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    return {"error": "Failed to get real-time data"}
                    
        except Exception as e:
            logger.error(f"Error getting real-time data: {str(e)}")
            return {"error": str(e)}

# Create service instances
nextjs_integration = NextJSIntegrationService()
payment_integration = PaymentIntegrationService()
notification_integration = NotificationIntegrationService()
data_sync = DataSyncService()

# Background task to sync data periodically
async def periodic_data_sync():
    """Background task to sync data every 5 minutes"""
    while True:
        try:
            # Sync analytics data
            analytics_data = {
                "timestamp": datetime.utcnow().isoformat(),
                "source": "python_backend",
                "metrics": {
                    "ai_analyses_count": 150,
                    "successful_payments": 45,
                    "active_appointments": 23
                }
            }
            
            await data_sync.sync_appointment_analytics(analytics_data)
            logger.info("Periodic data sync completed")
            
        except Exception as e:
            logger.error(f"Error in periodic sync: {str(e)}")
        
        # Wait 5 minutes
        await asyncio.sleep(300)

# Export services
__all__ = [
    "nextjs_integration",
    "payment_integration", 
    "notification_integration",
    "data_sync",
    "periodic_data_sync"
]
