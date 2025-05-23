"""
Minimal HealthConnect Python Backend for testing
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import logging

# Setup basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="HealthConnect Backend API",
    description="Advanced Python backend for HealthConnect healthcare platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0",
        "service": "HealthConnect Python Backend"
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "HealthConnect Python Backend API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "features": [
            "Advanced AI/ML Analysis",
            "Medical Data Processing",
            "Symptom Analysis Engine",
            "Prescription Processing",
            "Healthcare Analytics",
            "Real-time Monitoring"
        ]
    }

# Basic symptom analysis endpoint
@app.post("/api/v1/symptoms/analyze")
async def analyze_symptoms_basic(symptoms_data: dict):
    """Basic symptom analysis"""
    symptoms = symptoms_data.get("symptoms", [])
    patient_age = symptoms_data.get("patient_age", 30)

    # Mock analysis
    analysis_result = {
        "analysis_id": f"analysis_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}",
        "symptoms": symptoms,
        "confidence": 0.85,
        "emergency_level": "low",
        "recommendations": [
            "Monitor symptoms for 24 hours",
            "Stay hydrated and rest",
            "Consult a doctor if symptoms worsen"
        ],
        "possible_conditions": [
            {
                "name": "Common Cold",
                "probability": 0.7,
                "severity": "mild"
            },
            {
                "name": "Viral Infection",
                "probability": 0.3,
                "severity": "mild"
            }
        ],
        "analysis_timestamp": datetime.utcnow().isoformat()
    }

    logger.info(f"Symptom analysis performed for {len(symptoms)} symptoms")
    return analysis_result

# Basic appointment enhancement endpoint
@app.post("/api/v1/appointments/enhance")
async def enhance_appointment(appointment_data: dict):
    """Enhance appointment with AI insights"""

    # Extract data
    patient_id = appointment_data.get("patient_id")
    symptoms = appointment_data.get("symptoms", [])

    # Mock AI enhancement
    enhancement = {
        "appointment_id": appointment_data.get("appointment_id"),
        "patient_id": patient_id,
        "ai_priority_score": 0.75,
        "recommended_urgency": "medium",
        "ai_insights": [
            "Patient symptoms suggest routine consultation",
            "No emergency indicators detected",
            "Recommend standard appointment duration"
        ],
        "enhanced_at": datetime.utcnow().isoformat()
    }

    if symptoms:
        # Add symptom-based insights
        enhancement["symptom_analysis"] = {
            "symptoms_count": len(symptoms),
            "emergency_level": "low",
            "confidence": 0.8
        }

    logger.info(f"Appointment enhanced for patient {patient_id}")
    return enhancement

# Integration endpoint for Next.js
@app.post("/api/v1/integration/sync")
async def sync_with_nextjs(sync_data: dict):
    """Sync data with Next.js frontend"""

    data_type = sync_data.get("type", "unknown")
    payload = sync_data.get("data", {})

    # Mock processing
    result = {
        "sync_id": f"sync_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}",
        "type": data_type,
        "status": "success",
        "processed_records": len(payload) if isinstance(payload, list) else 1,
        "timestamp": datetime.utcnow().isoformat()
    }

    logger.info(f"Data sync completed: {data_type}")
    return result

# Analytics endpoint
@app.get("/api/v1/analytics/summary")
async def get_analytics_summary():
    """Get analytics summary"""

    return {
        "total_analyses": 156,
        "symptom_checks": 89,
        "appointment_enhancements": 67,
        "ai_confidence_avg": 0.87,
        "emergency_cases": 3,
        "last_updated": datetime.utcnow().isoformat(),
        "performance": {
            "avg_response_time": "245ms",
            "success_rate": "98.5%",
            "uptime": "99.9%"
        }
    }

# Test endpoint for frontend integration
@app.get("/api/v1/test/connection")
async def test_connection():
    """Test connection from frontend"""
    return {
        "status": "connected",
        "backend": "Python FastAPI",
        "frontend_compatible": True,
        "timestamp": datetime.utcnow().isoformat(),
        "message": "Python backend is ready for integration!"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
