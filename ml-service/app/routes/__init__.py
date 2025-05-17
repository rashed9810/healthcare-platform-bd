from flask import Blueprint
from .analyze import analyze_bp
from .recommend import recommend_bp

# Create a main blueprint to combine all routes
api_bp = Blueprint('api', __name__)

# Register route blueprints
api_bp.register_blueprint(analyze_bp)
api_bp.register_blueprint(recommend_bp)

# Define a simple health check route
@api_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return {'status': 'healthy'}
