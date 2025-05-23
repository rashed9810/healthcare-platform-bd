"""
Advanced AI-powered symptom analysis service
"""

import asyncio
import json
import logging
from typing import List, Dict, Optional, Tuple
from datetime import datetime
import re

from ..models.ai_models import SymptomAnalysisResponse, MedicalCondition, RecommendedAction
from ..core.config import settings

logger = logging.getLogger(__name__)

class SymptomAnalyzer:
    """Advanced symptom analyzer using medical knowledge base and AI"""
    
    def __init__(self):
        self.medical_knowledge_base = self._load_medical_knowledge_base()
        self.symptom_patterns = self._load_symptom_patterns()
        self.emergency_keywords = self._load_emergency_keywords()
        
    def _load_medical_knowledge_base(self) -> Dict:
        """Load medical knowledge base for Bangladesh healthcare context"""
        return {
            "common_conditions": {
                "fever": {
                    "related_symptoms": ["headache", "body_ache", "chills", "fatigue"],
                    "possible_conditions": [
                        {"name": "Viral Fever", "probability": 0.6, "severity": "mild"},
                        {"name": "Dengue Fever", "probability": 0.3, "severity": "moderate"},
                        {"name": "Typhoid", "probability": 0.1, "severity": "severe"}
                    ],
                    "recommended_specialties": ["General Medicine", "Internal Medicine"]
                },
                "cough": {
                    "related_symptoms": ["sore_throat", "runny_nose", "chest_pain", "shortness_of_breath"],
                    "possible_conditions": [
                        {"name": "Common Cold", "probability": 0.5, "severity": "mild"},
                        {"name": "Bronchitis", "probability": 0.3, "severity": "moderate"},
                        {"name": "Pneumonia", "probability": 0.2, "severity": "severe"}
                    ],
                    "recommended_specialties": ["General Medicine", "Pulmonology"]
                },
                "stomach_pain": {
                    "related_symptoms": ["nausea", "vomiting", "diarrhea", "loss_of_appetite"],
                    "possible_conditions": [
                        {"name": "Gastritis", "probability": 0.4, "severity": "mild"},
                        {"name": "Food Poisoning", "probability": 0.3, "severity": "moderate"},
                        {"name": "Appendicitis", "probability": 0.1, "severity": "severe"}
                    ],
                    "recommended_specialties": ["Gastroenterology", "General Medicine"]
                },
                "headache": {
                    "related_symptoms": ["nausea", "sensitivity_to_light", "neck_stiffness", "fever"],
                    "possible_conditions": [
                        {"name": "Tension Headache", "probability": 0.6, "severity": "mild"},
                        {"name": "Migraine", "probability": 0.3, "severity": "moderate"},
                        {"name": "Meningitis", "probability": 0.05, "severity": "severe"}
                    ],
                    "recommended_specialties": ["Neurology", "General Medicine"]
                },
                "chest_pain": {
                    "related_symptoms": ["shortness_of_breath", "sweating", "nausea", "dizziness"],
                    "possible_conditions": [
                        {"name": "Muscle Strain", "probability": 0.4, "severity": "mild"},
                        {"name": "Acid Reflux", "probability": 0.3, "severity": "mild"},
                        {"name": "Heart Attack", "probability": 0.1, "severity": "severe"}
                    ],
                    "recommended_specialties": ["Cardiology", "Emergency Medicine"]
                }
            },
            "age_specific_conditions": {
                "pediatric": ["viral_infections", "ear_infections", "asthma"],
                "adult": ["hypertension", "diabetes", "heart_disease"],
                "elderly": ["arthritis", "osteoporosis", "dementia"]
            },
            "gender_specific_conditions": {
                "female": ["menstrual_disorders", "pregnancy_complications", "breast_conditions"],
                "male": ["prostate_issues", "erectile_dysfunction"]
            }
        }
    
    def _load_symptom_patterns(self) -> Dict:
        """Load symptom pattern recognition rules"""
        return {
            "severity_indicators": {
                "mild": ["slight", "minor", "occasional", "mild"],
                "moderate": ["persistent", "frequent", "noticeable", "moderate"],
                "severe": ["severe", "intense", "unbearable", "extreme", "sharp"]
            },
            "duration_patterns": {
                "acute": ["sudden", "immediate", "rapid", "quick"],
                "chronic": ["ongoing", "persistent", "long-term", "continuous"]
            },
            "emergency_patterns": {
                "cardiac": ["chest pain", "shortness of breath", "sweating", "nausea"],
                "neurological": ["severe headache", "confusion", "seizure", "paralysis"],
                "respiratory": ["difficulty breathing", "wheezing", "blue lips"],
                "gastrointestinal": ["severe abdominal pain", "blood in vomit", "black stool"]
            }
        }
    
    def _load_emergency_keywords(self) -> List[str]:
        """Load emergency keywords that require immediate attention"""
        return [
            "chest pain", "difficulty breathing", "severe headache", "unconscious",
            "seizure", "severe bleeding", "poisoning", "severe burns", "paralysis",
            "severe abdominal pain", "high fever", "confusion", "severe allergic reaction"
        ]
    
    async def analyze_symptoms(
        self,
        symptoms: List[str],
        patient_age: Optional[int] = None,
        patient_gender: Optional[str] = None,
        medical_history: Optional[List[str]] = None,
        severity_level: Optional[str] = None
    ) -> SymptomAnalysisResponse:
        """
        Perform comprehensive symptom analysis
        """
        try:
            # Normalize symptoms
            normalized_symptoms = self._normalize_symptoms(symptoms)
            
            # Check for emergency conditions
            emergency_level = self._assess_emergency_level(normalized_symptoms)
            
            # Analyze symptom patterns
            primary_conditions = self._analyze_symptom_patterns(
                normalized_symptoms, patient_age, patient_gender
            )
            
            # Calculate confidence score
            confidence = self._calculate_confidence(
                normalized_symptoms, primary_conditions, medical_history
            )
            
            # Generate recommendations
            recommendations = self._generate_recommendations(
                primary_conditions, emergency_level, patient_age
            )
            
            # Get recommended specialties
            specialties = self._get_recommended_specialties(primary_conditions)
            
            # Generate follow-up questions
            follow_up_questions = self._generate_follow_up_questions(
                normalized_symptoms, primary_conditions
            )
            
            return SymptomAnalysisResponse(
                analysis_id=f"analysis_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}",
                symptoms=symptoms,
                primary_conditions=primary_conditions,
                confidence=confidence,
                emergency_level=emergency_level,
                recommended_actions=recommendations,
                recommended_specialties=specialties,
                follow_up_questions=follow_up_questions,
                analysis_timestamp=datetime.utcnow(),
                disclaimer="This analysis is for informational purposes only and should not replace professional medical advice."
            )
            
        except Exception as e:
            logger.error(f"Error in symptom analysis: {str(e)}")
            raise
    
    def _normalize_symptoms(self, symptoms: List[str]) -> List[str]:
        """Normalize symptom descriptions"""
        normalized = []
        for symptom in symptoms:
            # Convert to lowercase and remove extra spaces
            normalized_symptom = re.sub(r'\s+', ' ', symptom.lower().strip())
            
            # Map common variations to standard terms
            symptom_mapping = {
                "tummy ache": "stomach pain",
                "belly pain": "stomach pain",
                "runny nose": "nasal congestion",
                "stuffy nose": "nasal congestion",
                "sore throat": "throat pain",
                "shortness of breath": "difficulty breathing"
            }
            
            normalized_symptom = symptom_mapping.get(normalized_symptom, normalized_symptom)
            normalized.append(normalized_symptom)
        
        return normalized
    
    def _assess_emergency_level(self, symptoms: List[str]) -> str:
        """Assess if symptoms indicate emergency condition"""
        emergency_score = 0
        
        for symptom in symptoms:
            for emergency_keyword in self.emergency_keywords:
                if emergency_keyword.lower() in symptom.lower():
                    emergency_score += 1
        
        # Check for emergency patterns
        for pattern_type, pattern_symptoms in self.symptom_patterns["emergency_patterns"].items():
            matching_symptoms = sum(1 for ps in pattern_symptoms if any(ps in s for s in symptoms))
            if matching_symptoms >= 2:
                emergency_score += 2
        
        if emergency_score >= 3:
            return "high"
        elif emergency_score >= 1:
            return "medium"
        else:
            return "low"
    
    def _analyze_symptom_patterns(
        self, 
        symptoms: List[str], 
        age: Optional[int], 
        gender: Optional[str]
    ) -> List[MedicalCondition]:
        """Analyze symptoms against medical knowledge base"""
        conditions = []
        
        # Find matching conditions from knowledge base
        for symptom in symptoms:
            for condition_key, condition_data in self.medical_knowledge_base["common_conditions"].items():
                if condition_key in symptom or any(rs in symptom for rs in condition_data["related_symptoms"]):
                    for possible_condition in condition_data["possible_conditions"]:
                        # Adjust probability based on age and gender
                        adjusted_probability = self._adjust_probability_for_demographics(
                            possible_condition["probability"], age, gender, possible_condition["name"]
                        )
                        
                        conditions.append(MedicalCondition(
                            name=possible_condition["name"],
                            probability=adjusted_probability,
                            severity=possible_condition["severity"],
                            description=f"Condition matching symptoms: {symptom}",
                            icd_code=self._get_icd_code(possible_condition["name"])
                        ))
        
        # Remove duplicates and sort by probability
        unique_conditions = {}
        for condition in conditions:
            if condition.name in unique_conditions:
                # Take the higher probability
                if condition.probability > unique_conditions[condition.name].probability:
                    unique_conditions[condition.name] = condition
            else:
                unique_conditions[condition.name] = condition
        
        # Sort by probability and return top 5
        sorted_conditions = sorted(unique_conditions.values(), key=lambda x: x.probability, reverse=True)
        return sorted_conditions[:5]
    
    def _adjust_probability_for_demographics(
        self, base_probability: float, age: Optional[int], gender: Optional[str], condition_name: str
    ) -> float:
        """Adjust condition probability based on patient demographics"""
        adjusted_prob = base_probability
        
        # Age-based adjustments
        if age:
            if age < 18:  # Pediatric
                if condition_name in ["Viral Fever", "Common Cold"]:
                    adjusted_prob *= 1.2
            elif age > 65:  # Elderly
                if condition_name in ["Pneumonia", "Heart Attack"]:
                    adjusted_prob *= 1.3
        
        # Gender-based adjustments
        if gender:
            if gender.lower() == "female" and condition_name == "Migraine":
                adjusted_prob *= 1.4
            elif gender.lower() == "male" and condition_name == "Heart Attack":
                adjusted_prob *= 1.2
        
        return min(adjusted_prob, 1.0)  # Cap at 1.0
    
    def _calculate_confidence(
        self, 
        symptoms: List[str], 
        conditions: List[MedicalCondition], 
        medical_history: Optional[List[str]]
    ) -> float:
        """Calculate confidence score for the analysis"""
        base_confidence = 0.7
        
        # Increase confidence if multiple symptoms match
        if len(symptoms) >= 3:
            base_confidence += 0.1
        
        # Increase confidence if conditions have high probability
        if conditions and conditions[0].probability > 0.6:
            base_confidence += 0.1
        
        # Adjust based on medical history
        if medical_history:
            for condition in conditions:
                if any(hist.lower() in condition.name.lower() for hist in medical_history):
                    base_confidence += 0.05
        
        return min(base_confidence, 0.95)  # Cap at 95%
    
    def _generate_recommendations(
        self, 
        conditions: List[MedicalCondition], 
        emergency_level: str, 
        age: Optional[int]
    ) -> List[RecommendedAction]:
        """Generate recommended actions based on analysis"""
        recommendations = []
        
        if emergency_level == "high":
            recommendations.append(RecommendedAction(
                action="Seek immediate emergency care",
                priority="urgent",
                description="Your symptoms may indicate a serious condition requiring immediate medical attention.",
                estimated_time="Immediately"
            ))
        elif emergency_level == "medium":
            recommendations.append(RecommendedAction(
                action="Consult a doctor within 24 hours",
                priority="high",
                description="Your symptoms should be evaluated by a healthcare professional soon.",
                estimated_time="Within 24 hours"
            ))
        else:
            recommendations.append(RecommendedAction(
                action="Schedule an appointment with your doctor",
                priority="medium",
                description="Consider scheduling a routine appointment to discuss your symptoms.",
                estimated_time="Within 1-3 days"
            ))
        
        # Add condition-specific recommendations
        if conditions:
            primary_condition = conditions[0]
            if primary_condition.severity == "mild":
                recommendations.append(RecommendedAction(
                    action="Monitor symptoms and rest",
                    priority="low",
                    description="Get adequate rest and monitor your symptoms for any changes.",
                    estimated_time="Ongoing"
                ))
            elif primary_condition.severity == "severe":
                recommendations.append(RecommendedAction(
                    action="Seek specialist consultation",
                    priority="high",
                    description=f"Consider consulting a specialist for {primary_condition.name}.",
                    estimated_time="Within 48 hours"
                ))
        
        return recommendations
    
    def _get_recommended_specialties(self, conditions: List[MedicalCondition]) -> List[str]:
        """Get recommended medical specialties"""
        specialties = set()
        
        for condition in conditions:
            condition_name = condition.name.lower()
            if "heart" in condition_name or "cardiac" in condition_name:
                specialties.add("Cardiology")
            elif "lung" in condition_name or "respiratory" in condition_name:
                specialties.add("Pulmonology")
            elif "stomach" in condition_name or "gastro" in condition_name:
                specialties.add("Gastroenterology")
            elif "neuro" in condition_name or "headache" in condition_name:
                specialties.add("Neurology")
            else:
                specialties.add("General Medicine")
        
        return list(specialties)
    
    def _generate_follow_up_questions(
        self, 
        symptoms: List[str], 
        conditions: List[MedicalCondition]
    ) -> List[str]:
        """Generate follow-up questions for better diagnosis"""
        questions = []
        
        if any("pain" in s for s in symptoms):
            questions.append("On a scale of 1-10, how would you rate your pain level?")
            questions.append("Does the pain worsen with movement or remain constant?")
        
        if any("fever" in s for s in symptoms):
            questions.append("Have you measured your temperature? If so, what was it?")
            questions.append("How long have you had the fever?")
        
        if any("cough" in s for s in symptoms):
            questions.append("Is your cough dry or do you produce phlegm?")
            questions.append("Does the cough worsen at night?")
        
        # Add condition-specific questions
        if conditions:
            primary_condition = conditions[0].name.lower()
            if "dengue" in primary_condition:
                questions.append("Have you been in an area with mosquito activity recently?")
            elif "heart" in primary_condition:
                questions.append("Do you have a family history of heart disease?")
        
        return questions[:5]  # Limit to 5 questions
    
    def _get_icd_code(self, condition_name: str) -> Optional[str]:
        """Get ICD-10 code for condition (simplified mapping)"""
        icd_mapping = {
            "Viral Fever": "R50.9",
            "Dengue Fever": "A90",
            "Common Cold": "J00",
            "Pneumonia": "J18.9",
            "Gastritis": "K29.7",
            "Migraine": "G43.9",
            "Heart Attack": "I21.9"
        }
        return icd_mapping.get(condition_name)
