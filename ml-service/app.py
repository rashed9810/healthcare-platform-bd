from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import numpy as np
from datetime import datetime
import logging

# Import ML modules
from models.symptom_analyzer import SymptomAnalyzer
from models.doctor_recommender import DoctorRecommender
from utils.text_processor import TextProcessor
from utils.translator import Translator

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize ML models
symptom_analyzer = SymptomAnalyzer()
doctor_recommender = DoctorRecommender()
text_processor = TextProcessor()
translator = Translator()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/analyze', methods=['POST'])
def analyze_symptoms():
    """Analyze symptoms and return urgency assessment"""
    try:
        data = request.json
        
        if not data or 'symptoms' not in data:
            return jsonify({'error': 'Missing symptoms data'}), 400
        
        symptoms = data['symptoms']
        duration = data.get('duration', 'days')
        severity = data.get('severity', 'moderate')
        language = data.get('language', 'en')
        
        # Translate if not in English
        if language != 'en':
            symptoms = translator.translate(symptoms, source=language, target='en')
        
        # Process text
        processed_text = text_processor.preprocess(symptoms)
        
        # Extract features
        features = text_processor.extract_features(processed_text)
        
        # Add duration and severity as features
        duration_mapping = {'today': 0, 'days': 1, 'weeks': 2, 'months': 3}
        severity_mapping = {'mild': 0, 'moderate': 1, 'severe': 2}
        
        features['duration'] = duration_mapping.get(duration, 1)
        features['severity'] = severity_mapping.get(severity, 1)
        
        # Analyze symptoms
        analysis_result = symptom_analyzer.analyze(
            symptoms=processed_text,
            features=features
        )
        
        return jsonify(analysis_result)
    
    except Exception as e:
        logger.error(f"Error analyzing symptoms: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/recommend-doctors', methods=['POST'])
def recommend_doctors():
    """Recommend doctors based on symptoms"""
    try:
        data = request.json
        
        if not data or 'symptoms' not in data:
            return jsonify({'error': 'Missing symptoms data'}), 400
        
        symptoms = data['symptoms']
        user_id = data.get('userId')
        
        # Process text
        processed_text = text_processor.preprocess(symptoms)
        
        # Get recommendations
        recommendations = doctor_recommender.recommend(
            symptoms=processed_text,
            user_id=user_id,
            limit=5
        )
        
        return jsonify(recommendations)
    
    except Exception as e:
        logger.error(f"Error recommending doctors: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
