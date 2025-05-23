"""
AI Analysis endpoints for advanced medical analysis
"""

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, UploadFile, File
from typing import List, Optional, Dict, Any
from datetime import datetime
import logging

from ....core.database import get_mongodb
from ....services.ai_service import AIAnalysisService
from ....services.symptom_analyzer import SymptomAnalyzer
from ....services.prescription_analyzer import PrescriptionAnalyzer
from ....services.medical_image_analyzer import MedicalImageAnalyzer
from ....models.ai_models import (
    SymptomAnalysisRequest,
    SymptomAnalysisResponse,
    PrescriptionAnalysisRequest,
    PrescriptionAnalysisResponse,
    MedicalImageAnalysisResponse,
    HealthRiskAssessmentRequest,
    HealthRiskAssessmentResponse
)
from ....core.logging_config import healthcare_logger

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/analyze-symptoms", response_model=SymptomAnalysisResponse)
async def analyze_symptoms(
    request: SymptomAnalysisRequest,
    background_tasks: BackgroundTasks,
    db=Depends(get_mongodb)
):
    """
    Advanced AI-powered symptom analysis
    """
    try:
        # Initialize symptom analyzer
        analyzer = SymptomAnalyzer()
        
        # Perform analysis
        analysis_result = await analyzer.analyze_symptoms(
            symptoms=request.symptoms,
            patient_age=request.patient_age,
            patient_gender=request.patient_gender,
            medical_history=request.medical_history,
            severity_level=request.severity_level
        )
        
        # Log the analysis
        healthcare_logger.log_medical_analysis("symptom_analysis", {
            "patient_id": request.patient_id,
            "symptoms": request.symptoms,
            "analysis_confidence": analysis_result.confidence,
            "recommended_specialties": analysis_result.recommended_specialties
        })
        
        # Store analysis in database
        if db:
            analysis_record = {
                "patient_id": request.patient_id,
                "symptoms": request.symptoms,
                "analysis_result": analysis_result.dict(),
                "created_at": datetime.utcnow(),
                "analysis_type": "symptom_analysis"
            }
            await db.medical_analyses.insert_one(analysis_record)
        
        # Schedule follow-up recommendations
        background_tasks.add_task(
            schedule_follow_up_recommendations,
            request.patient_id,
            analysis_result
        )
        
        return analysis_result
        
    except Exception as e:
        logger.error(f"Error in symptom analysis: {str(e)}")
        raise HTTPException(status_code=500, detail="Analysis failed")

@router.post("/analyze-prescription", response_model=PrescriptionAnalysisResponse)
async def analyze_prescription(
    prescription_file: UploadFile = File(...),
    patient_id: Optional[str] = None,
    db=Depends(get_mongodb)
):
    """
    AI-powered prescription analysis using OCR and medical knowledge
    """
    try:
        # Initialize prescription analyzer
        analyzer = PrescriptionAnalyzer()
        
        # Read file content
        file_content = await prescription_file.read()
        
        # Analyze prescription
        analysis_result = await analyzer.analyze_prescription_image(
            image_data=file_content,
            filename=prescription_file.filename
        )
        
        # Log the analysis
        healthcare_logger.log_medical_analysis("prescription_analysis", {
            "patient_id": patient_id,
            "filename": prescription_file.filename,
            "medications_found": len(analysis_result.medications),
            "confidence": analysis_result.confidence
        })
        
        # Store analysis in database
        if db and patient_id:
            analysis_record = {
                "patient_id": patient_id,
                "filename": prescription_file.filename,
                "analysis_result": analysis_result.dict(),
                "created_at": datetime.utcnow(),
                "analysis_type": "prescription_analysis"
            }
            await db.medical_analyses.insert_one(analysis_record)
        
        return analysis_result
        
    except Exception as e:
        logger.error(f"Error in prescription analysis: {str(e)}")
        raise HTTPException(status_code=500, detail="Prescription analysis failed")

@router.post("/analyze-medical-image", response_model=MedicalImageAnalysisResponse)
async def analyze_medical_image(
    image_file: UploadFile = File(...),
    image_type: str = "xray",
    patient_id: Optional[str] = None,
    db=Depends(get_mongodb)
):
    """
    AI-powered medical image analysis
    """
    try:
        # Initialize medical image analyzer
        analyzer = MedicalImageAnalyzer()
        
        # Read file content
        file_content = await image_file.read()
        
        # Analyze medical image
        analysis_result = await analyzer.analyze_medical_image(
            image_data=file_content,
            image_type=image_type,
            filename=image_file.filename
        )
        
        # Log the analysis
        healthcare_logger.log_medical_analysis("medical_image_analysis", {
            "patient_id": patient_id,
            "image_type": image_type,
            "filename": image_file.filename,
            "findings_count": len(analysis_result.findings),
            "confidence": analysis_result.confidence
        })
        
        # Store analysis in database
        if db and patient_id:
            analysis_record = {
                "patient_id": patient_id,
                "image_type": image_type,
                "filename": image_file.filename,
                "analysis_result": analysis_result.dict(),
                "created_at": datetime.utcnow(),
                "analysis_type": "medical_image_analysis"
            }
            await db.medical_analyses.insert_one(analysis_record)
        
        return analysis_result
        
    except Exception as e:
        logger.error(f"Error in medical image analysis: {str(e)}")
        raise HTTPException(status_code=500, detail="Medical image analysis failed")

@router.post("/health-risk-assessment", response_model=HealthRiskAssessmentResponse)
async def health_risk_assessment(
    request: HealthRiskAssessmentRequest,
    db=Depends(get_mongodb)
):
    """
    Comprehensive health risk assessment using AI
    """
    try:
        # Initialize AI analysis service
        ai_service = AIAnalysisService()
        
        # Perform health risk assessment
        assessment_result = await ai_service.assess_health_risks(
            patient_data=request.patient_data,
            medical_history=request.medical_history,
            lifestyle_factors=request.lifestyle_factors,
            family_history=request.family_history
        )
        
        # Log the assessment
        healthcare_logger.log_medical_analysis("health_risk_assessment", {
            "patient_id": request.patient_data.get("patient_id"),
            "risk_level": assessment_result.overall_risk_level,
            "risk_factors_count": len(assessment_result.risk_factors)
        })
        
        # Store assessment in database
        if db:
            assessment_record = {
                "patient_id": request.patient_data.get("patient_id"),
                "assessment_result": assessment_result.dict(),
                "created_at": datetime.utcnow(),
                "analysis_type": "health_risk_assessment"
            }
            await db.medical_analyses.insert_one(assessment_record)
        
        return assessment_result
        
    except Exception as e:
        logger.error(f"Error in health risk assessment: {str(e)}")
        raise HTTPException(status_code=500, detail="Health risk assessment failed")

@router.get("/analysis-history/{patient_id}")
async def get_analysis_history(
    patient_id: str,
    analysis_type: Optional[str] = None,
    limit: int = 20,
    db=Depends(get_mongodb)
):
    """
    Get patient's AI analysis history
    """
    try:
        if not db:
            raise HTTPException(status_code=503, detail="Database not available")
        
        # Build query
        query = {"patient_id": patient_id}
        if analysis_type:
            query["analysis_type"] = analysis_type
        
        # Get analysis history
        cursor = db.medical_analyses.find(query).sort("created_at", -1).limit(limit)
        analyses = await cursor.to_list(length=limit)
        
        # Convert ObjectId to string
        for analysis in analyses:
            analysis["_id"] = str(analysis["_id"])
        
        return {
            "patient_id": patient_id,
            "analyses": analyses,
            "total_count": len(analyses)
        }
        
    except Exception as e:
        logger.error(f"Error getting analysis history: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get analysis history")

@router.get("/ai-insights/{patient_id}")
async def get_ai_insights(
    patient_id: str,
    db=Depends(get_mongodb)
):
    """
    Get AI-generated insights for a patient
    """
    try:
        # Initialize AI service
        ai_service = AIAnalysisService()
        
        # Get patient's analysis history
        if db:
            cursor = db.medical_analyses.find({"patient_id": patient_id}).sort("created_at", -1)
            analyses = await cursor.to_list(length=50)
        else:
            analyses = []
        
        # Generate insights
        insights = await ai_service.generate_patient_insights(
            patient_id=patient_id,
            analysis_history=analyses
        )
        
        return insights
        
    except Exception as e:
        logger.error(f"Error generating AI insights: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate insights")

async def schedule_follow_up_recommendations(patient_id: str, analysis_result):
    """
    Background task to schedule follow-up recommendations
    """
    try:
        # This would integrate with your notification system
        # to send follow-up recommendations to patients
        logger.info(f"Scheduling follow-up for patient {patient_id}")
        
        # Example: Send notification after 24 hours if symptoms persist
        # This would be implemented with a task queue like Celery
        
    except Exception as e:
        logger.error(f"Error scheduling follow-up: {str(e)}")

@router.get("/ai-stats")
async def get_ai_statistics(db=Depends(get_mongodb)):
    """
    Get AI analysis statistics
    """
    try:
        if not db:
            return {"message": "Database not available"}
        
        # Get analysis statistics
        pipeline = [
            {
                "$group": {
                    "_id": "$analysis_type",
                    "count": {"$sum": 1},
                    "avg_confidence": {"$avg": "$analysis_result.confidence"}
                }
            }
        ]
        
        stats = await db.medical_analyses.aggregate(pipeline).to_list(length=None)
        
        return {
            "total_analyses": sum(stat["count"] for stat in stats),
            "analysis_breakdown": stats,
            "last_updated": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting AI statistics: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get statistics")
