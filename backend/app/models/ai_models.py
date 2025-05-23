"""
Pydantic models for AI analysis features
"""

from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from enum import Enum

class SeverityLevel(str, Enum):
    """Severity levels for medical conditions"""
    MILD = "mild"
    MODERATE = "moderate"
    SEVERE = "severe"
    CRITICAL = "critical"

class EmergencyLevel(str, Enum):
    """Emergency levels for symptom analysis"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class Priority(str, Enum):
    """Priority levels for recommendations"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

# Symptom Analysis Models
class SymptomAnalysisRequest(BaseModel):
    """Request model for symptom analysis"""
    patient_id: str
    symptoms: List[str] = Field(..., min_items=1, description="List of symptoms")
    patient_age: Optional[int] = Field(None, ge=0, le=120)
    patient_gender: Optional[str] = Field(None, regex="^(male|female|other)$")
    medical_history: Optional[List[str]] = Field(default_factory=list)
    severity_level: Optional[str] = Field(None, regex="^(mild|moderate|severe)$")
    duration: Optional[str] = None
    additional_info: Optional[str] = None

class MedicalCondition(BaseModel):
    """Medical condition model"""
    name: str
    probability: float = Field(..., ge=0.0, le=1.0)
    severity: SeverityLevel
    description: str
    icd_code: Optional[str] = None
    symptoms_match: Optional[List[str]] = Field(default_factory=list)

class RecommendedAction(BaseModel):
    """Recommended action model"""
    action: str
    priority: Priority
    description: str
    estimated_time: str
    specialist_required: Optional[bool] = False
    follow_up_required: Optional[bool] = False

class SymptomAnalysisResponse(BaseModel):
    """Response model for symptom analysis"""
    analysis_id: str
    symptoms: List[str]
    primary_conditions: List[MedicalCondition]
    confidence: float = Field(..., ge=0.0, le=1.0)
    emergency_level: EmergencyLevel
    recommended_actions: List[RecommendedAction]
    recommended_specialties: List[str]
    follow_up_questions: List[str]
    analysis_timestamp: datetime
    disclaimer: str

# Prescription Analysis Models
class PrescriptionAnalysisRequest(BaseModel):
    """Request model for prescription analysis"""
    patient_id: Optional[str] = None
    image_data: Optional[str] = None  # Base64 encoded image
    prescription_text: Optional[str] = None

class Medication(BaseModel):
    """Medication model"""
    name: str
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    duration: Optional[str] = None
    instructions: Optional[str] = None
    drug_class: Optional[str] = None
    side_effects: Optional[List[str]] = Field(default_factory=list)
    interactions: Optional[List[str]] = Field(default_factory=list)
    confidence: float = Field(..., ge=0.0, le=1.0)

class PrescriptionAnalysisResponse(BaseModel):
    """Response model for prescription analysis"""
    analysis_id: str
    medications: List[Medication]
    doctor_name: Optional[str] = None
    prescription_date: Optional[datetime] = None
    confidence: float = Field(..., ge=0.0, le=1.0)
    warnings: List[str] = Field(default_factory=list)
    drug_interactions: List[str] = Field(default_factory=list)
    analysis_timestamp: datetime

# Medical Image Analysis Models
class MedicalImageFinding(BaseModel):
    """Medical image finding model"""
    finding: str
    location: Optional[str] = None
    severity: SeverityLevel
    confidence: float = Field(..., ge=0.0, le=1.0)
    description: str
    recommendation: Optional[str] = None

class MedicalImageAnalysisResponse(BaseModel):
    """Response model for medical image analysis"""
    analysis_id: str
    image_type: str
    findings: List[MedicalImageFinding]
    overall_assessment: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    recommendations: List[str]
    requires_specialist: bool
    analysis_timestamp: datetime

# Health Risk Assessment Models
class LifestyleFactor(BaseModel):
    """Lifestyle factor model"""
    factor: str
    value: Union[str, int, float, bool]
    risk_level: Optional[SeverityLevel] = None

class RiskFactor(BaseModel):
    """Risk factor model"""
    factor: str
    risk_level: SeverityLevel
    probability: float = Field(..., ge=0.0, le=1.0)
    description: str
    modifiable: bool = True

class HealthRiskAssessmentRequest(BaseModel):
    """Request model for health risk assessment"""
    patient_data: Dict[str, Any]
    medical_history: List[str] = Field(default_factory=list)
    lifestyle_factors: List[LifestyleFactor] = Field(default_factory=list)
    family_history: List[str] = Field(default_factory=list)
    current_medications: List[str] = Field(default_factory=list)

class HealthRiskAssessmentResponse(BaseModel):
    """Response model for health risk assessment"""
    assessment_id: str
    overall_risk_level: SeverityLevel
    risk_score: float = Field(..., ge=0.0, le=100.0)
    risk_factors: List[RiskFactor]
    protective_factors: List[str] = Field(default_factory=list)
    recommendations: List[RecommendedAction]
    lifestyle_modifications: List[str] = Field(default_factory=list)
    screening_recommendations: List[str] = Field(default_factory=list)
    follow_up_timeline: str
    assessment_timestamp: datetime

# AI Insights Models
class TrendAnalysis(BaseModel):
    """Trend analysis model"""
    metric: str
    trend: str  # "improving", "stable", "declining"
    change_percentage: float
    time_period: str
    significance: str  # "significant", "moderate", "minimal"

class PatientInsight(BaseModel):
    """Patient insight model"""
    insight_type: str
    title: str
    description: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    actionable: bool = True
    priority: Priority

class AIInsightsResponse(BaseModel):
    """Response model for AI insights"""
    patient_id: str
    insights: List[PatientInsight]
    trends: List[TrendAnalysis]
    health_score: float = Field(..., ge=0.0, le=100.0)
    risk_alerts: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
    generated_at: datetime

# Analytics Models
class AnalyticsMetric(BaseModel):
    """Analytics metric model"""
    metric_name: str
    value: Union[int, float, str]
    unit: Optional[str] = None
    trend: Optional[str] = None
    comparison_period: Optional[str] = None

class AnalyticsReport(BaseModel):
    """Analytics report model"""
    report_id: str
    report_type: str
    metrics: List[AnalyticsMetric]
    insights: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
    generated_at: datetime
    period: str

# Notification Models
class NotificationRequest(BaseModel):
    """Notification request model"""
    recipient_id: str
    notification_type: str
    title: str
    message: str
    priority: Priority = Priority.MEDIUM
    channels: List[str] = Field(default_factory=lambda: ["app"])  # app, email, sms
    scheduled_time: Optional[datetime] = None
    data: Optional[Dict[str, Any]] = Field(default_factory=dict)

class NotificationResponse(BaseModel):
    """Notification response model"""
    notification_id: str
    status: str
    sent_at: datetime
    delivery_status: Dict[str, str] = Field(default_factory=dict)

# Validation functions can be added to individual models as needed

# Export all models
__all__ = [
    "SeverityLevel",
    "EmergencyLevel",
    "Priority",
    "SymptomAnalysisRequest",
    "SymptomAnalysisResponse",
    "MedicalCondition",
    "RecommendedAction",
    "PrescriptionAnalysisRequest",
    "PrescriptionAnalysisResponse",
    "Medication",
    "MedicalImageAnalysisResponse",
    "MedicalImageFinding",
    "HealthRiskAssessmentRequest",
    "HealthRiskAssessmentResponse",
    "LifestyleFactor",
    "RiskFactor",
    "AIInsightsResponse",
    "PatientInsight",
    "TrendAnalysis",
    "AnalyticsReport",
    "AnalyticsMetric",
    "NotificationRequest",
    "NotificationResponse"
]
