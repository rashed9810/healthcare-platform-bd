import numpy as np
import re
import json
import os
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SymptomAnalyzer:
    def __init__(self, model_path=None):
        """
        Initialize the symptom analyzer.
        
        In a production environment, this would load a trained ML model.
        For this example, we'll use a rule-based approach.
        """
        self.symptom_keywords = {
            'headache': {
                'urgency': 5,
                'conditions': ['Tension Headache', 'Migraine'],
                'specialty': 'Neurologist'
            },
            'migraine': {
                'urgency': 6,
                'conditions': ['Migraine', 'Cluster Headache'],
                'specialty': 'Neurologist'
            },
            'fever': {
                'urgency': 6,
                'conditions': ['Viral Infection', 'Bacterial Infection'],
                'specialty': 'General Physician'
            },
            'cough': {
                'urgency': 4,
                'conditions': ['Common Cold', 'Upper Respiratory Infection'],
                'specialty': 'General Physician'
            },
            'chest pain': {
                'urgency': 9,
                'conditions': ['Angina', 'Myocardial Infarction'],
                'specialty': 'Cardiologist'
            },
            'shortness of breath': {
                'urgency': 8,
                'conditions': ['Asthma', 'COPD', 'Heart Failure'],
                'specialty': 'Pulmonologist'
            },
            'abdominal pain': {
                'urgency': 6,
                'conditions': ['Gastritis', 'Appendicitis', 'IBS'],
                'specialty': 'Gastroenterologist'
            },
            'nausea': {
                'urgency': 5,
                'conditions': ['Gastroenteritis', 'Food Poisoning'],
                'specialty': 'Gastroenterologist'
            },
            'diarrhea': {
                'urgency': 6,
                'conditions': ['Gastroenteritis', 'Food Poisoning', 'IBS'],
                'specialty': 'Gastroenterologist'
            },
            'rash': {
                'urgency': 4,
                'conditions': ['Allergic Reaction', 'Eczema', 'Contact Dermatitis'],
                'specialty': 'Dermatologist'
            },
            'joint pain': {
                'urgency': 5,
                'conditions': ['Arthritis', 'Rheumatoid Arthritis', 'Gout'],
                'specialty': 'Rheumatologist'
            },
            'back pain': {
                'urgency': 5,
                'conditions': ['Muscle Strain', 'Herniated Disc', 'Sciatica'],
                'specialty': 'Orthopedist'
            },
            'sore throat': {
                'urgency': 3,
                'conditions': ['Pharyngitis', 'Tonsillitis', 'Strep Throat'],
                'specialty': 'General Physician'
            },
            'ear pain': {
                'urgency': 4,
                'conditions': ['Otitis Media', 'Ear Infection'],
                'specialty': 'ENT Specialist'
            },
            'dizziness': {
                'urgency': 6,
                'conditions': ['Vertigo', 'Labyrinthitis', 'Hypotension'],
                'specialty': 'Neurologist'
            }
        }
        
        # Load ML model if available
        self.model = None
        if model_path:
            try:
                # This would load a trained model (e.g., TensorFlow, scikit-learn)
                # self.model = load_model(model_path)
                logger.info(f"Loaded model from {model_path}")
            except Exception as e:
                logger.error(f"Error loading model: {str(e)}")
    
    def analyze(self, symptoms, features=None):
        """
        Analyze symptoms and return urgency assessment.
        
        Args:
            symptoms (str): The symptoms text
            features (dict): Additional features like duration, severity
            
        Returns:
            dict: Analysis result with urgency score, possible conditions, etc.
        """
        if self.model:
            # Use ML model for prediction
            return self._predict_with_model(symptoms, features)
        else:
            # Use rule-based approach
            return self._rule_based_analysis(symptoms, features)
    
    def _predict_with_model(self, symptoms, features):
        """
        Use ML model to predict urgency and conditions.
        This is a placeholder for actual ML implementation.
        """
        # In a real implementation, this would use the model to make predictions
        pass
    
    def _rule_based_analysis(self, symptoms, features):
        """
        Use rule-based approach to analyze symptoms.
        """
        symptoms_lower = symptoms.lower()
        
        # Initialize variables
        urgency_scores = []
        possible_conditions = []
        specialties = []
        
        # Check for keywords in symptoms
        for keyword, info in self.symptom_keywords.items():
            if keyword in symptoms_lower:
                urgency_scores.append(info['urgency'])
                possible_conditions.extend(info['conditions'])
                specialties.append(info['specialty'])
        
        # If no keywords found, default values
        if not urgency_scores:
            urgency_scores = [5]  # Default moderate urgency
            possible_conditions = ['General Medical Condition']
            specialties = ['General Physician']
        
        # Calculate urgency score
        base_urgency = np.mean(urgency_scores)
        
        # Adjust based on features if provided
        if features:
            # Severity increases urgency
            if 'severity' in features:
                severity_factor = features['severity'] * 1.5
                base_urgency += severity_factor
            
            # Duration affects urgency (recent onset may be more urgent)
            if 'duration' in features:
                if features['duration'] == 0:  # today
                    base_urgency += 1
                elif features['duration'] == 3:  # months
                    base_urgency -= 1
        
        # Clamp urgency between 1-10
        final_urgency = max(1, min(10, round(base_urgency)))
        
        # Remove duplicates
        possible_conditions = list(set(possible_conditions))
        
        # Determine most common specialty
        if specialties:
            from collections import Counter
            specialty_counter = Counter(specialties)
            recommended_specialty = specialty_counter.most_common(1)[0][0]
        else:
            recommended_specialty = 'General Physician'
        
        # Determine recommended timeframe based on urgency
        if final_urgency >= 9:
            recommended_timeframe = "Immediately"
        elif final_urgency >= 7:
            recommended_timeframe = "Within 24 hours"
        elif final_urgency >= 5:
            recommended_timeframe = "Within 3 days"
        elif final_urgency >= 3:
            recommended_timeframe = "Within a week"
        else:
            recommended_timeframe = "At your convenience"
        
        return {
            'urgencyScore': final_urgency,
            'possibleConditions': possible_conditions[:3],  # Top 3 conditions
            'recommendedSpecialty': recommended_specialty,
            'recommendedTimeframe': recommended_timeframe
        }
