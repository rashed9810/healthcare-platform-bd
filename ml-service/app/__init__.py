from flask import Flask
from flask_cors import CORS
import os
from .routes import api_bp
from .config import Config

def create_app(config_class=Config):
    """Create and configure the Flask application"""
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Enable CORS
    CORS(app)
    
    # Register blueprints
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # Simple root route
    @app.route('/')
    def index():
        return {
            'name': 'HealthConnect Bangladesh ML API',
            'version': '1.0.0',
            'status': 'running'
        }
    
    return app
