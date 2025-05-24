@echo off
echo 🏥 HealthConnect Python Backend - Windows Startup
echo ================================================

cd /d "%~dp0"

echo 📍 Current directory: %CD%
echo 🐍 Checking Python installation...

python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo 💡 Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

echo ✅ Python is available

echo 📦 Installing basic dependencies...
python -m pip install fastapi uvicorn[standard] pydantic python-dotenv

echo 🚀 Starting HealthConnect Backend...
echo 📍 Server will be available at: http://localhost:8000
echo 📖 API Documentation: http://localhost:8000/docs
echo 🔍 Health Check: http://localhost:8000/health
echo.
echo Press Ctrl+C to stop the server
echo ================================================

python simple_start.py

pause
