#!/bin/bash

echo "🏥 HealthConnect Python Backend - Linux/Mac Startup"
echo "================================================"

# Change to script directory
cd "$(dirname "$0")"

echo "📍 Current directory: $(pwd)"
echo "🐍 Checking Python installation..."

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    if ! command -v python &> /dev/null; then
        echo "❌ Python is not installed or not in PATH"
        echo "💡 Please install Python 3.8+ from https://python.org"
        exit 1
    else
        PYTHON_CMD="python"
    fi
else
    PYTHON_CMD="python3"
fi

echo "✅ Python is available"

echo "📦 Installing basic dependencies..."
$PYTHON_CMD -m pip install fastapi uvicorn[standard] pydantic python-dotenv

echo "🚀 Starting HealthConnect Backend..."
echo "📍 Server will be available at: http://localhost:8000"
echo "📖 API Documentation: http://localhost:8000/docs"
echo "🔍 Health Check: http://localhost:8000/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo "================================================"

$PYTHON_CMD simple_start.py
