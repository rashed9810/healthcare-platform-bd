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

# Enhanced symptom analysis endpoint for Bangladesh healthcare
@app.post("/api/v1/symptoms/analyze")
async def analyze_symptoms_enhanced(symptoms_data: dict):
    """Enhanced AI-powered symptom analysis with Bangladesh healthcare context"""
    symptoms = symptoms_data.get("symptoms", [])
    patient_age = symptoms_data.get("patient_age", 30)
    patient_gender = symptoms_data.get("patient_gender", "unknown")
    location = symptoms_data.get("location", "Dhaka")

    # Bangladesh-specific medical knowledge base
    bd_conditions = {
        "fever": {
            "common_causes": ["Dengue", "Typhoid", "Malaria", "Viral fever", "Chikungunya"],
            "specialists": ["General Physician", "Internal Medicine"],
            "urgency": "moderate" if patient_age > 60 or patient_age < 5 else "low",
            "tests": ["CBC", "Dengue NS1", "Typhoid test", "Malaria test"]
        },
        "diarrhea": {
            "common_causes": ["Food poisoning", "Cholera", "Dysentery", "Gastroenteritis"],
            "specialists": ["Gastroenterologist", "General Physician"],
            "urgency": "high" if "severe dehydration" in symptoms else "moderate",
            "tests": ["Stool examination", "CBC", "Electrolytes"]
        },
        "cough": {
            "common_causes": ["Tuberculosis", "Pneumonia", "Bronchitis", "Asthma"],
            "specialists": ["Pulmonologist", "General Physician"],
            "urgency": "high" if "blood in cough" in symptoms else "low",
            "tests": ["Chest X-ray", "Sputum test", "CBC"]
        },
        "chest pain": {
            "common_causes": ["Heart disease", "Acid reflux", "Muscle strain", "Anxiety"],
            "specialists": ["Cardiologist", "Emergency Medicine"],
            "urgency": "urgent",
            "tests": ["ECG", "Chest X-ray", "Cardiac enzymes"]
        }
    }

    # Analyze symptoms with Bangladesh context
    severity_score = len(symptoms) * 15
    urgency_level = "low"
    recommended_specialists = []
    possible_conditions = []
    suggested_tests = []

    # Age-based risk adjustment
    if patient_age > 60:
        severity_score += 25
    elif patient_age < 5:
        severity_score += 30
    elif patient_age < 18:
        severity_score += 10

    # Analyze each symptom
    for symptom in symptoms:
        symptom_lower = symptom.lower()
        for condition_key, condition_info in bd_conditions.items():
            if condition_key in symptom_lower:
                possible_conditions.extend(condition_info["common_causes"])
                recommended_specialists.extend(condition_info["specialists"])
                suggested_tests.extend(condition_info["tests"])

                if condition_info["urgency"] == "urgent":
                    urgency_level = "urgent"
                    severity_score += 40
                elif condition_info["urgency"] == "high" and urgency_level != "urgent":
                    urgency_level = "high"
                    severity_score += 25
                elif condition_info["urgency"] == "moderate" and urgency_level == "low":
                    urgency_level = "moderate"
                    severity_score += 15

    # Remove duplicates
    possible_conditions = list(set(possible_conditions))[:5]
    recommended_specialists = list(set(recommended_specialists))[:3]
    suggested_tests = list(set(suggested_tests))[:5]

    # Default recommendations if no specific matches
    if not recommended_specialists:
        recommended_specialists = ["General Physician"]
    if not possible_conditions:
        possible_conditions = ["Common viral infection", "Stress-related symptoms"]

    # Generate recommendations based on urgency
    if urgency_level == "urgent":
        recommendations = [
            "অবিলম্বে নিকটস্থ হাসপাতালে যান / Go to nearest hospital immediately",
            "জরুরি সেবার জন্য ৯৯৯ নম্বরে কল করুন / Call 999 for emergency services",
            "কোনো ওষুধ খাওয়ার আগে ডাক্তারের পরামর্শ নিন / Consult doctor before taking any medication"
        ]
    elif urgency_level == "high":
        recommendations = [
            "আজকেই ডাক্তার দেখান / See a doctor today",
            "লক্ষণগুলো খারাপ হলে হাসপাতালে যান / Go to hospital if symptoms worsen",
            "পর্যাপ্ত বিশ্রাম নিন / Take adequate rest"
        ]
    else:
        recommendations = [
            "২৪-৪৮ ঘন্টা লক্ষণ পর্যবেক্ষণ করুন / Monitor symptoms for 24-48 hours",
            "পর্যাপ্ত পানি পান করুন / Stay well hydrated",
            "প্রয়োজনে ডাক্তারের পরামর্শ নিন / Consult doctor if needed"
        ]

    # Calculate confidence based on symptom clarity
    confidence = 0.75
    if len(symptoms) >= 3:
        confidence += 0.1
    if any(symptom.lower() in bd_conditions for symptom in symptoms):
        confidence += 0.15
    confidence = min(confidence, 0.95)

    analysis_result = {
        "analysis_id": f"bd_analysis_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}",
        "patient_info": {
            "age": patient_age,
            "gender": patient_gender,
            "location": location
        },
        "symptoms": symptoms,
        "severity_score": min(severity_score, 100),
        "urgency_level": urgency_level,
        "confidence": confidence,
        "bangladesh_context": True,
        "analysis": {
            "possible_conditions": [
                {"name": condition, "probability": 0.8 - (i * 0.1), "context": "Common in Bangladesh"}
                for i, condition in enumerate(possible_conditions)
            ],
            "recommended_specialists": recommended_specialists,
            "suggested_tests": suggested_tests,
            "recommendations": recommendations
        },
        "emergency_info": {
            "national_emergency": "999",
            "ambulance": "199",
            "poison_control": "01777777777",
            "nearest_hospitals": [
                "Dhaka Medical College Hospital",
                "Square Hospital",
                "United Hospital"
            ]
        },
        "disclaimer": "এটি একটি AI-চালিত প্রাথমিক বিশ্লেষণ। পেশাদার চিকিৎসা পরামর্শের বিকল্প নয়। / This is an AI-powered preliminary analysis and not a substitute for professional medical advice.",
        "analysis_timestamp": datetime.utcnow().isoformat()
    }

    logger.info(f"Enhanced symptom analysis performed for {len(symptoms)} symptoms with Bangladesh context")
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
