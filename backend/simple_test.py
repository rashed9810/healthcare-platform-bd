#!/usr/bin/env python3
"""
Super simple test to check if Python and FastAPI work
"""

print("🏥 HealthConnect Backend Test")
print("=" * 40)

# Test 1: Python version
import sys
print(f"✅ Python version: {sys.version}")

# Test 2: FastAPI import
try:
    import fastapi
    print(f"✅ FastAPI version: {fastapi.__version__}")
except ImportError:
    print("❌ FastAPI not installed")
    print("💡 Run: pip install fastapi")
    exit(1)

# Test 3: Uvicorn import
try:
    import uvicorn
    print(f"✅ Uvicorn available")
except ImportError:
    print("❌ Uvicorn not installed")
    print("💡 Run: pip install uvicorn")
    exit(1)

# Test 4: Create simple app
try:
    from fastapi import FastAPI
    app = FastAPI()
    
    @app.get("/")
    def read_root():
        return {"message": "HealthConnect Backend is working!"}
    
    print("✅ FastAPI app created successfully")
except Exception as e:
    print(f"❌ Error creating app: {e}")
    exit(1)

print("\n🎉 All tests passed!")
print("🚀 Ready to start the server!")
print("\nTo start the server manually, run:")
print("uvicorn simple_test:app --host 0.0.0.0 --port 8000")
print("\nOr run this file with --serve flag:")
print("python simple_test.py --serve")

# Check if --serve flag is provided
if len(sys.argv) > 1 and sys.argv[1] == "--serve":
    print("\n🚀 Starting server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
