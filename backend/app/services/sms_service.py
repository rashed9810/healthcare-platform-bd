"""
SMS Service for HealthConnect
Handles SMS notifications for Bangladesh mobile networks
"""

import logging
import requests
from typing import Dict, Any, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

class SMSService:
    """SMS notification service for Bangladesh"""
    
    def __init__(self):
        # SMS API configuration (would be loaded from environment variables)
        self.api_url = "https://api.sms.net.bd/sendsms"
        self.api_key = "your_sms_api_key"
        self.sender_id = "HealthConnect"
        self.enabled = False  # Set to True when configured
        
    async def send_notification_sms(
        self,
        user_id: str,
        message: str
    ) -> str:
        """Send SMS notification to user"""
        try:
            if not self.enabled:
                logger.info(f"SMS service disabled - would send: {message}")
                return "simulated_sent"
                
            # Get user phone number from database
            phone_number = await self._get_user_phone(user_id)
            if not phone_number:
                return "no_phone"
                
            # Format phone number for Bangladesh
            formatted_phone = self._format_bangladesh_phone(phone_number)
            
            # Prepare SMS data
            sms_data = {
                "api_key": self.api_key,
                "sender_id": self.sender_id,
                "message": message,
                "phone": formatted_phone
            }
            
            # Send SMS
            response = requests.post(self.api_url, data=sms_data, timeout=10)
            
            if response.status_code == 200:
                logger.info(f"SMS sent to {formatted_phone}")
                return "sent"
            else:
                logger.error(f"SMS failed: {response.text}")
                return "failed"
                
        except Exception as e:
            logger.error(f"Error sending SMS: {e}")
            return "failed"
            
    async def _get_user_phone(self, user_id: str) -> Optional[str]:
        """Get user phone number from database"""
        # This would query the database for user phone
        # For now, return a placeholder Bangladesh number
        return "+8801712345678"
        
    def _format_bangladesh_phone(self, phone: str) -> str:
        """Format phone number for Bangladesh"""
        # Remove any non-digit characters
        digits_only = ''.join(filter(str.isdigit, phone))
        
        # Handle different formats
        if digits_only.startswith('880'):
            return f"+{digits_only}"
        elif digits_only.startswith('01'):
            return f"+880{digits_only}"
        elif len(digits_only) == 11 and digits_only.startswith('1'):
            return f"+880{digits_only}"
        else:
            return f"+880{digits_only}"
