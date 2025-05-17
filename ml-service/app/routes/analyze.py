from flask import Blueprint, request, jsonify
import logging
from ..models.symptom_analyzer import SymptomAnalyzer
from ..utils.text_processor import TextProcessor
from ..utils.translator import Translator

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize blueprint
analyze_bp = Blueprint('analyze', __name__)

# Initialize models
symptom_analyzer = SymptomAnalyzer()
text_processor = TextProcessor()
translator = Translator()

@analyze_bp.route('/analyze', methods=['POST'])
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
