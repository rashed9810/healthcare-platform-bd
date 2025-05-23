"""
Symptom analysis endpoints
"""

from fastapi import APIRouter, Depends, HTTPException
from typing import List
from ....models.ai_models import SymptomAnalysisRequest, SymptomAnalysisResponse
from ....services.symptom_analyzer import SymptomAnalyzer

router = APIRouter()

@router.post("/analyze", response_model=SymptomAnalysisResponse)
async def analyze_symptoms(request: SymptomAnalysisRequest):
    """Analyze symptoms using AI"""
    analyzer = SymptomAnalyzer()
    return await analyzer.analyze_symptoms(
        symptoms=request.symptoms,
        patient_age=request.patient_age,
        patient_gender=request.patient_gender,
        medical_history=request.medical_history,
        severity_level=request.severity_level
    )

@router.get("/common")
async def get_common_symptoms():
    """Get list of common symptoms"""
    return {
        "symptoms": [
            "fever", "headache", "cough", "sore throat", "fatigue",
            "nausea", "vomiting", "diarrhea", "stomach pain", "chest pain",
            "shortness of breath", "dizziness", "muscle aches", "joint pain"
        ]
    }
