#!/usr/bin/env python3
"""
Simple test server to verify FastAPI is working
"""

try:
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    import uvicorn
    from datetime import datetime
    
    print("✅ All imports successful")
    
    # Create FastAPI app
    app = FastAPI(
        title="HealthConnect Test Server",
        description="Test server to verify backend functionality",
        version="1.0.0"
    )
    
    # Add CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    @app.get("/")
    async def root():
        return {
            "message": "🏥 HealthConnect Backend Test Server",
            "status": "running",
            "timestamp": datetime.utcnow().isoformat(),
            "python_version": "3.12.0",
            "fastapi": "working",
            "uvicorn": "working"
        }
    
    @app.get("/health")
    async def health():
        return {
            "status": "healthy",
            "service": "HealthConnect Backend",
            "timestamp": datetime.utcnow().isoformat()
        }
    
    @app.get("/test")
    async def test():
        return {
            "test": "success",
            "message": "Backend is working perfectly!",
            "features": [
                "FastAPI server running",
                "CORS enabled",
                "Health check working",
                "Ready for frontend integration"
            ]
        }
    
    if __name__ == "__main__":
        print("🚀 Starting HealthConnect Test Server...")
        print("📍 Server will be available at: http://localhost:8001")
        print("🔍 Health check: http://localhost:8001/health")
        print("🧪 Test endpoint: http://localhost:8001/test")
        print("Press Ctrl+C to stop")
        print("=" * 50)
        
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=8001,
            log_level="info"
        )
        
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("💡 Please install required packages:")
    print("pip install fastapi uvicorn")
except Exception as e:
    print(f"❌ Error: {e}")
    print("💡 Please check your Python installation")
