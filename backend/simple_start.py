#!/usr/bin/env python3
"""
Simple startup script for HealthConnect Python Backend
"""

import os
import sys
import subprocess
from pathlib import Path

def install_basic_dependencies():
    """Install basic dependencies"""
    print("📦 Installing basic dependencies...")
    try:
        subprocess.check_call([
            sys.executable, "-m", "pip", "install",
            "fastapi", "uvicorn[standard]", "pydantic", "python-dotenv"
        ])
        print("✅ Basic dependencies installed")
        return True
    except subprocess.CalledProcessError:
        print("❌ Failed to install dependencies")
        return False

def main():
    """Simple startup without complex dependencies"""
    print("🏥 HealthConnect Python Backend - Simple Start")
    print("="*50)

    # Change to backend directory
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)

    # Check if FastAPI is installed
    try:
        import fastapi
        print("✅ FastAPI is available")
    except ImportError:
        print("⚠️ FastAPI not found. Installing...")
        if not install_basic_dependencies():
            print("❌ Installation failed. Please install manually:")
            print("pip install fastapi uvicorn[standard] pydantic python-dotenv")
            return

    # Create basic directories
    for directory in ["logs", "uploads"]:
        Path(directory).mkdir(exist_ok=True)
        print(f"✅ Directory created: {directory}")

    # Create basic .env file if it doesn't exist
    env_file = Path(".env")
    if not env_file.exists():
        print("📝 Creating basic .env file...")
        with open(env_file, "w") as f:
            f.write("""DEBUG=True
HOST=0.0.0.0
PORT=8000
SECRET_KEY=dev-secret-key
DATABASE_URL=sqlite:///./healthconnect.db
""")
        print("✅ .env file created")

    print("\n🚀 Starting FastAPI server...")
    print("📍 Server will be available at: http://localhost:8000")
    print("📖 API Documentation: http://localhost:8000/docs")
    print("🔍 Health Check: http://localhost:8000/health")
    print("\nPress Ctrl+C to stop the server")
    print("="*50)

    try:
        # Start with minimal version first
        subprocess.run([
            sys.executable, "-m", "uvicorn",
            "main_minimal:app",
            "--host", "0.0.0.0",
            "--port", "8000",
            "--reload"
        ])
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        print("💡 Try installing dependencies manually:")
        print("pip install fastapi uvicorn[standard] pydantic python-dotenv")

if __name__ == "__main__":
    main()
