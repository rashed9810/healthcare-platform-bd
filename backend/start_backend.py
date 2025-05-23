#!/usr/bin/env python3
"""
HealthConnect Backend Startup Script
"""

import os
import sys
import subprocess
import time
import logging
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        sys.exit(1)
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")

def install_dependencies():
    """Install Python dependencies"""
    print("📦 Installing Python dependencies...")
    try:
        subprocess.check_call([
            sys.executable, "-m", "pip", "install", "-r", "requirements.txt"
        ])
        print("✅ Dependencies installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        sys.exit(1)

def setup_environment():
    """Setup environment variables"""
    env_file = backend_dir / ".env"
    if not env_file.exists():
        print("📝 Creating .env file...")
        env_content = """
# HealthConnect Backend Environment Variables

# Basic Settings
DEBUG=True
HOST=0.0.0.0
PORT=8000

# Security
SECRET_KEY=your-secret-key-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database
DATABASE_URL=sqlite:///./healthconnect.db
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=healthconnect
REDIS_URL=redis://localhost:6379

# AI/ML APIs (Optional)
OPENAI_API_KEY=
HUGGINGFACE_API_KEY=

# Payment Gateways (Bangladesh)
BKASH_APP_KEY=
BKASH_APP_SECRET=
BKASH_USERNAME=
BKASH_PASSWORD=
NAGAD_MERCHANT_ID=
NAGAD_MERCHANT_KEY=

# Notifications
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMS_API_KEY=

# Logging
LOG_LEVEL=INFO
"""
        with open(env_file, "w") as f:
            f.write(env_content.strip())
        print("✅ .env file created")
    else:
        print("✅ .env file already exists")

def create_directories():
    """Create necessary directories"""
    directories = ["logs", "uploads", "models", "data"]
    for directory in directories:
        dir_path = backend_dir / directory
        dir_path.mkdir(exist_ok=True)
        print(f"✅ Directory created: {directory}")

def check_optional_services():
    """Check if optional services are running"""
    services = {
        "MongoDB": ("mongodb://localhost:27017", "MongoDB is optional but recommended for production"),
        "Redis": ("redis://localhost:6379", "Redis is optional but recommended for caching")
    }
    
    for service_name, (url, description) in services.items():
        try:
            if service_name == "MongoDB":
                import pymongo
                client = pymongo.MongoClient(url, serverSelectionTimeoutMS=2000)
                client.admin.command('ping')
                print(f"✅ {service_name} is running")
            elif service_name == "Redis":
                import redis
                r = redis.from_url(url, socket_connect_timeout=2)
                r.ping()
                print(f"✅ {service_name} is running")
        except Exception:
            print(f"⚠️  {service_name} is not running - {description}")

def download_models():
    """Download required AI models"""
    print("🤖 Setting up AI models...")
    try:
        # Download spaCy model
        subprocess.check_call([
            sys.executable, "-m", "spacy", "download", "en_core_web_sm"
        ])
        print("✅ spaCy model downloaded")
    except subprocess.CalledProcessError:
        print("⚠️  Failed to download spaCy model - some features may not work")

def start_server():
    """Start the FastAPI server"""
    print("🚀 Starting HealthConnect Backend...")
    print("📍 Server will be available at: http://localhost:8000")
    print("📖 API Documentation: http://localhost:8000/docs")
    print("🔍 Health Check: http://localhost:8000/health")
    print("\n" + "="*50)
    
    try:
        # Import and run the app
        import uvicorn
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        sys.exit(1)

def main():
    """Main startup function"""
    print("🏥 HealthConnect Python Backend Startup")
    print("="*50)
    
    # Change to backend directory
    os.chdir(backend_dir)
    
    # Check Python version
    check_python_version()
    
    # Setup environment
    setup_environment()
    
    # Create directories
    create_directories()
    
    # Install dependencies
    install_dependencies()
    
    # Download AI models
    download_models()
    
    # Check optional services
    check_optional_services()
    
    print("\n🎉 Setup completed successfully!")
    print("Starting server in 3 seconds...")
    time.sleep(3)
    
    # Start the server
    start_server()

if __name__ == "__main__":
    main()
