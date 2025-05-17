from flask import Blueprint, request, jsonify
import logging
from ..models.doctor_recommender import DoctorRecommender
from ..utils.text_processor import TextProcessor

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize blueprint
recommend_bp = Blueprint('recommend', __name__)

# Initialize models
doctor_recommender = DoctorRecommender()
text_processor = TextProcessor()

@recommend_bp.route('/recommend-doctors', methods=['POST'])
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
