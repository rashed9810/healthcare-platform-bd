import numpy as np
import json
import os
from pathlib import Path
import logging
import random

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DoctorRecommender:
    def __init__(self, model_path=None):
        """
        Initialize the doctor recommender.
        
        In a production environment, this would load a trained ML model
        for collaborative filtering or content-based recommendations.
        For this example, we'll use a rule-based approach.
        """
        # Mock doctor specialties for demonstration
        self.specialties = {
            'General Physician': ['fever', 'cough', 'cold', 'flu', 'headache', 'sore throat'],
            'Cardiologist': ['chest pain', 'palpitation', 'shortness of breath', 'heart', 'blood pressure'],
            'Neurologist': ['headache', 'migraine', 'dizziness', 'numbness', 'seizure', 'memory'],
            'Gastroenterologist': ['abdominal pain', 'nausea', 'vomiting', 'diarrhea', 'constipation', 'stomach'],
            'Dermatologist': ['rash', 'itching', 'skin', 'acne', 'hair loss'],
            'Orthopedist': ['joint pain', 'back pain', 'fracture', 'sprain', 'arthritis'],
            'Gynecologist': ['pregnancy', 'menstrual', 'vaginal', 'pelvic pain'],
            'Pediatrician': ['child', 'infant', 'baby', 'vaccination'],
            'ENT Specialist': ['ear pain', 'hearing loss', 'sinus', 'throat', 'nose'],
            'Ophthalmologist': ['eye', 'vision', 'glasses', 'cataract']
        }
        
        # Load ML model if available
        self.model = None
        if model_path:
            try:
                # This would load a trained model (e.g., collaborative filtering model)
                # self.model = load_model(model_path)
                logger.info(f"Loaded model from {model_path}")
            except Exception as e:
                logger.error(f"Error loading model: {str(e)}")
    
    def recommend(self, symptoms, user_id=None, limit=5):
        """
        Recommend doctors based on symptoms.
        
        Args:
            symptoms (str): The symptoms text
            user_id (str): User ID for personalized recommendations
            limit (int): Maximum number of recommendations to return
            
        Returns:
            list: List of doctor recommendations
        """
        if self.model and user_id:
            # Use ML model for personalized recommendations
            return self._predict_with_model(symptoms, user_id, limit)
        else:
            # Use rule-based approach
            return self._rule_based_recommendation(symptoms, limit)
    
    def _predict_with_model(self, symptoms, user_id, limit):
        """
        Use ML model to predict doctor recommendations.
        This is a placeholder for actual ML implementation.
        """
        # In a real implementation, this would use the model to make predictions
        pass
    
    def _rule_based_recommendation(self, symptoms, limit):
        """
        Use rule-based approach to recommend doctors.
        """
        symptoms_lower = symptoms.lower()
        
        # Calculate specialty scores based on keyword matches
        specialty_scores = {}
        for specialty, keywords in self.specialties.items():
            score = 0
            for keyword in keywords:
                if keyword in symptoms_lower:
                    score += 1
            if score > 0:
                specialty_scores[specialty] = score
        
        # If no matches, default to General Physician
        if not specialty_scores:
            specialty_scores['General Physician'] = 1
        
        # Sort specialties by score
        sorted_specialties = sorted(specialty_scores.items(), key=lambda x: x[1], reverse=True)
        
        # Generate mock doctor recommendations
        recommendations = []
        for i, (specialty, score) in enumerate(sorted_specialties):
            if i >= limit:
                break
                
            # In a real app, you would query the database for doctors with this specialty
            # For now, we'll generate mock data
            doctor_id = f"doc_{i+1}"
            match_score = min(100, 60 + score * 10 + random.randint(0, 10))
            
            recommendations.append({
                'doctorId': doctor_id,
                'matchScore': match_score,
                'reason': f"Recommended based on your symptoms related to {specialty.lower()}"
            })
        
        return recommendations
