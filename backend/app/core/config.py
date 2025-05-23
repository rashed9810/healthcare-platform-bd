"""
Configuration settings for HealthConnect Backend
"""

from pydantic_settings import BaseSettings
from typing import List, Optional
import os
from pathlib import Path

class Settings(BaseSettings):
    """Application settings"""
    
    # Basic app settings
    APP_NAME: str = "HealthConnect Backend"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"
    
    # CORS
    ALLOWED_HOSTS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://localhost:3002",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002"
    ]
    
    # Database settings
    DATABASE_URL: str = "sqlite:///./healthconnect.db"
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "healthconnect"
    
    # Redis settings (for caching)
    REDIS_URL: str = "redis://localhost:6379"
    
    # AI/ML Settings
    OPENAI_API_KEY: Optional[str] = None
    HUGGINGFACE_API_KEY: Optional[str] = None
    
    # Medical APIs
    FDA_API_KEY: Optional[str] = None
    MEDICAL_API_BASE_URL: str = "https://api.fda.gov"
    
    # File upload settings
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    UPLOAD_DIR: str = "uploads"
    ALLOWED_FILE_TYPES: List[str] = [
        "image/jpeg", "image/png", "image/gif",
        "application/pdf", "text/plain"
    ]
    
    # Email settings (for notifications)
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    
    # SMS settings (for Bangladesh)
    SMS_API_KEY: Optional[str] = None
    SMS_API_URL: str = "https://api.sms.net.bd"
    
    # Payment gateway settings
    BKASH_APP_KEY: Optional[str] = None
    BKASH_APP_SECRET: Optional[str] = None
    BKASH_USERNAME: Optional[str] = None
    BKASH_PASSWORD: Optional[str] = None
    BKASH_BASE_URL: str = "https://tokenized.sandbox.bka.sh/v1.2.0-beta"
    
    NAGAD_MERCHANT_ID: Optional[str] = None
    NAGAD_MERCHANT_KEY: Optional[str] = None
    NAGAD_BASE_URL: str = "http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/healthconnect.log"
    
    # Healthcare specific settings
    SYMPTOM_ANALYSIS_MODEL: str = "medical-bert-base"
    PRESCRIPTION_OCR_MODEL: str = "tesseract"
    
    # Bangladesh specific settings
    BANGLADESH_TIMEZONE: str = "Asia/Dhaka"
    DEFAULT_LANGUAGE: str = "en"
    SUPPORTED_LANGUAGES: List[str] = ["en", "bn"]
    
    # API Rate limiting
    RATE_LIMIT_PER_MINUTE: int = 100
    RATE_LIMIT_PER_HOUR: int = 1000
    
    # Monitoring and analytics
    ENABLE_ANALYTICS: bool = True
    ANALYTICS_RETENTION_DAYS: int = 90
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()

# Ensure upload directory exists
Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
Path("logs").mkdir(parents=True, exist_ok=True)
