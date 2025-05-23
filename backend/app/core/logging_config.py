"""
Logging configuration for HealthConnect Backend
"""

import logging
import logging.handlers
import sys
from pathlib import Path
from datetime import datetime
import json

from .config import settings

def setup_logging():
    """Setup logging configuration"""
    
    # Create logs directory
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    
    # Create formatters
    detailed_formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s'
    )
    
    simple_formatter = logging.Formatter(
        '%(asctime)s - %(levelname)s - %(message)s'
    )
    
    # Create handlers
    handlers = []
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(simple_formatter)
    handlers.append(console_handler)
    
    # File handler
    file_handler = logging.handlers.RotatingFileHandler(
        settings.LOG_FILE,
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5
    )
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(detailed_formatter)
    handlers.append(file_handler)
    
    # Error file handler
    error_handler = logging.handlers.RotatingFileHandler(
        "logs/errors.log",
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(detailed_formatter)
    handlers.append(error_handler)
    
    # Configure root logger
    logging.basicConfig(
        level=getattr(logging, settings.LOG_LEVEL.upper()),
        handlers=handlers,
        force=True
    )
    
    # Configure specific loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("motor").setLevel(logging.WARNING)
    
    logger = logging.getLogger(__name__)
    logger.info("🔧 Logging configuration completed")

class HealthConnectLogger:
    """Custom logger for HealthConnect specific events"""
    
    def __init__(self, name: str):
        self.logger = logging.getLogger(name)
        
        # Create healthcare-specific log file
        healthcare_handler = logging.handlers.RotatingFileHandler(
            "logs/healthcare.log",
            maxBytes=10*1024*1024,
            backupCount=5
        )
        healthcare_formatter = logging.Formatter(
            '%(asctime)s - HEALTHCARE - %(levelname)s - %(message)s'
        )
        healthcare_handler.setFormatter(healthcare_formatter)
        self.logger.addHandler(healthcare_handler)
    
    def log_appointment(self, action: str, appointment_data: dict):
        """Log appointment-related events"""
        self.logger.info(f"APPOINTMENT_{action.upper()}: {json.dumps(appointment_data)}")
    
    def log_payment(self, action: str, payment_data: dict):
        """Log payment-related events"""
        self.logger.info(f"PAYMENT_{action.upper()}: {json.dumps(payment_data)}")
    
    def log_medical_analysis(self, analysis_type: str, data: dict):
        """Log medical analysis events"""
        self.logger.info(f"MEDICAL_ANALYSIS_{analysis_type.upper()}: {json.dumps(data)}")
    
    def log_user_action(self, user_id: str, action: str, details: dict = None):
        """Log user actions"""
        log_data = {
            "user_id": user_id,
            "action": action,
            "timestamp": datetime.utcnow().isoformat(),
            "details": details or {}
        }
        self.logger.info(f"USER_ACTION: {json.dumps(log_data)}")
    
    def log_error(self, error_type: str, error_details: dict):
        """Log errors with context"""
        self.logger.error(f"ERROR_{error_type.upper()}: {json.dumps(error_details)}")
    
    def log_security_event(self, event_type: str, details: dict):
        """Log security-related events"""
        self.logger.warning(f"SECURITY_{event_type.upper()}: {json.dumps(details)}")

# Create healthcare logger instance
healthcare_logger = HealthConnectLogger("healthconnect")

# Audit logger for compliance
class AuditLogger:
    """Audit logger for healthcare compliance"""
    
    def __init__(self):
        self.logger = logging.getLogger("audit")
        
        # Create audit-specific handler
        audit_handler = logging.handlers.RotatingFileHandler(
            "logs/audit.log",
            maxBytes=50*1024*1024,  # 50MB
            backupCount=10
        )
        audit_formatter = logging.Formatter(
            '%(asctime)s - AUDIT - %(message)s'
        )
        audit_handler.setFormatter(audit_formatter)
        self.logger.addHandler(audit_handler)
        self.logger.setLevel(logging.INFO)
    
    def log_data_access(self, user_id: str, resource: str, action: str):
        """Log data access for compliance"""
        audit_data = {
            "event_type": "DATA_ACCESS",
            "user_id": user_id,
            "resource": resource,
            "action": action,
            "timestamp": datetime.utcnow().isoformat(),
            "ip_address": "unknown"  # Will be filled by middleware
        }
        self.logger.info(json.dumps(audit_data))
    
    def log_medical_record_access(self, user_id: str, patient_id: str, action: str):
        """Log medical record access"""
        audit_data = {
            "event_type": "MEDICAL_RECORD_ACCESS",
            "user_id": user_id,
            "patient_id": patient_id,
            "action": action,
            "timestamp": datetime.utcnow().isoformat()
        }
        self.logger.info(json.dumps(audit_data))
    
    def log_prescription_access(self, user_id: str, prescription_id: str, action: str):
        """Log prescription access"""
        audit_data = {
            "event_type": "PRESCRIPTION_ACCESS",
            "user_id": user_id,
            "prescription_id": prescription_id,
            "action": action,
            "timestamp": datetime.utcnow().isoformat()
        }
        self.logger.info(json.dumps(audit_data))

# Create audit logger instance
audit_logger = AuditLogger()

# Performance logger
class PerformanceLogger:
    """Logger for performance monitoring"""
    
    def __init__(self):
        self.logger = logging.getLogger("performance")
        
        # Create performance-specific handler
        perf_handler = logging.handlers.RotatingFileHandler(
            "logs/performance.log",
            maxBytes=20*1024*1024,  # 20MB
            backupCount=5
        )
        perf_formatter = logging.Formatter(
            '%(asctime)s - PERFORMANCE - %(message)s'
        )
        perf_handler.setFormatter(perf_formatter)
        self.logger.addHandler(perf_handler)
        self.logger.setLevel(logging.INFO)
    
    def log_api_performance(self, endpoint: str, method: str, duration: float, status_code: int):
        """Log API performance metrics"""
        perf_data = {
            "event_type": "API_PERFORMANCE",
            "endpoint": endpoint,
            "method": method,
            "duration_ms": round(duration * 1000, 2),
            "status_code": status_code,
            "timestamp": datetime.utcnow().isoformat()
        }
        self.logger.info(json.dumps(perf_data))
    
    def log_database_performance(self, operation: str, duration: float, record_count: int = None):
        """Log database performance"""
        perf_data = {
            "event_type": "DATABASE_PERFORMANCE",
            "operation": operation,
            "duration_ms": round(duration * 1000, 2),
            "record_count": record_count,
            "timestamp": datetime.utcnow().isoformat()
        }
        self.logger.info(json.dumps(perf_data))

# Create performance logger instance
performance_logger = PerformanceLogger()

# Export loggers
__all__ = [
    "setup_logging",
    "healthcare_logger",
    "audit_logger", 
    "performance_logger",
    "HealthConnectLogger",
    "AuditLogger",
    "PerformanceLogger"
]
