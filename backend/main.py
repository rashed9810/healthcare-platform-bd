"""
HealthConnect Python Backend
FastAPI-based backend for advanced healthcare features
"""

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import uvicorn
import logging
from datetime import datetime
import os
from typing import Optional

# Import our modules
from app.core.config import settings
from app.core.database import init_db, close_db
from app.api.v1.api import api_router
from app.core.logging_config import setup_logging

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("🚀 Starting HealthConnect Python Backend...")
    await init_db()
    logger.info("✅ Database initialized")
    
    yield
    
    # Shutdown
    logger.info("🔄 Shutting down HealthConnect Python Backend...")
    await close_db()
    logger.info("✅ Database connections closed")

# Create FastAPI app
app = FastAPI(
    title="HealthConnect Backend API",
    description="Advanced Python backend for HealthConnect healthcare platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current authenticated user"""
    # This will integrate with your Next.js auth system
    token = credentials.credentials
    # TODO: Validate JWT token from Next.js
    return {"user_id": "temp_user", "token": token}

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0",
        "service": "HealthConnect Python Backend"
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "HealthConnect Python Backend API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "features": [
            "Advanced AI/ML Analysis",
            "Medical Data Processing", 
            "Symptom Analysis Engine",
            "Prescription Processing",
            "Healthcare Analytics",
            "Real-time Monitoring"
        ]
    }

# Include API routes
app.include_router(api_router, prefix="/api/v1")

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    logger.error(f"HTTP Exception: {exc.detail}")
    return {
        "error": True,
        "message": exc.detail,
        "status_code": exc.status_code,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unexpected error: {str(exc)}")
    return {
        "error": True,
        "message": "Internal server error",
        "status_code": 500,
        "timestamp": datetime.utcnow().isoformat()
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )
