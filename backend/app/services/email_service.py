"""
Email Service for HealthConnect
Handles email notifications and reminders
"""

import logging
import smtplib
from email.mime.text import MimeText
from email.mime.multipart import MimeMultipart
from typing import Dict, Any, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

class EmailService:
    """Email notification service"""
    
    def __init__(self):
        # Email configuration (would be loaded from environment variables)
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587
        self.email_user = "healthconnect@example.com"
        self.email_password = "your_app_password"
        self.enabled = False  # Set to True when configured
        
    async def send_notification_email(
        self,
        user_id: str,
        subject: str,
        message: str,
        notification_type: str
    ) -> str:
        """Send notification email to user"""
        try:
            if not self.enabled:
                logger.info(f"Email service disabled - would send: {subject}")
                return "simulated_sent"
                
            # Get user email from database
            user_email = await self._get_user_email(user_id)
            if not user_email:
                return "no_email"
                
            # Create email content
            html_content = self._create_email_template(subject, message, notification_type)
            
            # Send email
            msg = MimeMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.email_user
            msg['To'] = user_email
            
            html_part = MimeText(html_content, 'html')
            msg.attach(html_part)
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.email_user, self.email_password)
                server.send_message(msg)
                
            logger.info(f"Email sent to {user_email}: {subject}")
            return "sent"
            
        except Exception as e:
            logger.error(f"Error sending email: {e}")
            return "failed"
            
    async def _get_user_email(self, user_id: str) -> Optional[str]:
        """Get user email from database"""
        # This would query the database for user email
        # For now, return a placeholder
        return f"user_{user_id}@example.com"
        
    def _create_email_template(self, subject: str, message: str, notification_type: str) -> str:
        """Create HTML email template"""
        template = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>{subject}</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }}
                .container {{ max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
                .header {{ text-align: center; margin-bottom: 30px; }}
                .logo {{ color: #3b82f6; font-size: 24px; font-weight: bold; }}
                .content {{ line-height: 1.6; color: #333; }}
                .footer {{ margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px; }}
                .button {{ display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🏥 HealthConnect</div>
                </div>
                <div class="content">
                    <h2>{subject}</h2>
                    <p>{message}</p>
                    <a href="https://healthconnect.com/dashboard" class="button">Open HealthConnect</a>
                </div>
                <div class="footer">
                    <p>This is an automated message from HealthConnect Bangladesh.</p>
                    <p>If you no longer wish to receive these emails, you can update your preferences in your account settings.</p>
                </div>
            </div>
        </body>
        </html>
        """
        return template
