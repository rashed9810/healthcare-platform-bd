import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Base configuration"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'hard-to-guess-string'
    DEBUG = False
    TESTING = False
    
    # API settings
    API_TITLE = 'HealthConnect Bangladesh ML API'
    API_VERSION = '1.0.0'
    
    # Model paths
    MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models', 'trained')
    
    # Logging
    LOG_LEVEL = os.environ.get('LOG_LEVEL') or 'INFO'

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    LOG_LEVEL = 'DEBUG'

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration"""
    # Production-specific settings
    pass

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}

# Get configuration based on environment
def get_config():
    env = os.environ.get('FLASK_ENV') or 'default'
    return config[env]
