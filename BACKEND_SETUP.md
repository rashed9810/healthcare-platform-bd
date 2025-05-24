# 🏥 HealthConnect Backend Setup Guide

## 🚀 Quick Start (Recommended)

### **Option 1: One-Click Startup (Windows)**
```bash
# Double-click this file or run in Command Prompt
backend\run_backend.bat
```

### **Option 2: One-Click Startup (Linux/Mac)**
```bash
# Make executable and run
chmod +x backend/run_backend.sh
./backend/run_backend.sh
```

### **Option 3: Simple Python Start**
```bash
cd backend
python simple_start.py
```

## 📋 Prerequisites

### **Required:**
- **Python 3.8+** (Download from [python.org](https://python.org))
- **pip** (Usually comes with Python)

### **Optional (for full features):**
- **MongoDB** (for production database)
- **Redis** (for caching and sessions)
- **Git** (for version control)

## 🛠️ Detailed Setup

### **Step 1: Navigate to Backend Directory**
```bash
cd backend
```

### **Step 2: Install Dependencies**

**Basic Installation (Minimal Features):**
```bash
pip install fastapi uvicorn[standard] pydantic python-dotenv
```

**Full Installation (All Features):**
```bash
pip install -r requirements.txt
```

### **Step 3: Start the Server**

**Simple Start (Recommended for Testing):**
```bash
python simple_start.py
```

**Full Start (All Features):**
```bash
python start_backend.py
```

**Manual Start:**
```bash
uvicorn main_minimal:app --host 0.0.0.0 --port 8000 --reload
```

## 🌐 Access Your Backend

Once started, your backend will be available at:

- **🏠 Main API:** http://localhost:8000
- **📖 API Documentation:** http://localhost:8000/docs
- **🔍 Health Check:** http://localhost:8000/health
- **📚 ReDoc:** http://localhost:8000/redoc

## 🎯 Available Endpoints

### **Core Endpoints:**
- `GET /` - API information
- `GET /health` - Health check
- `GET /docs` - Interactive API documentation

### **Healthcare Features:**
- `POST /api/v1/symptoms/analyze` - Symptom analysis
- `POST /api/v1/appointments/enhance` - AI appointment enhancement
- `GET /api/v1/analytics/summary` - Analytics summary
- `GET /api/v1/test/connection` - Frontend connection test

### **Integration:**
- `POST /api/v1/integration/sync` - Sync with Next.js frontend

## 🔧 Configuration

### **Environment Variables (.env file):**
```env
# Basic Settings
DEBUG=True
HOST=0.0.0.0
PORT=8000

# Security
SECRET_KEY=your-secret-key-change-in-production

# Database (Optional)
DATABASE_URL=sqlite:///./healthconnect.db
MONGODB_URL=mongodb://localhost:27017
REDIS_URL=redis://localhost:6379

# AI APIs (Optional)
OPENAI_API_KEY=your-openai-key
HUGGINGFACE_API_KEY=your-huggingface-key

# Bangladesh Payment Gateways (Optional)
BKASH_APP_KEY=your-bkash-key
NAGAD_MERCHANT_ID=your-nagad-id
```

## 🐛 Troubleshooting

### **Common Issues:**

**1. Python not found:**
```bash
# Install Python from https://python.org
# Make sure Python is in your PATH
python --version
```

**2. Permission denied (Linux/Mac):**
```bash
chmod +x run_backend.sh
sudo ./run_backend.sh
```

**3. Port already in use:**
```bash
# Change port in .env file or use different port
uvicorn main_minimal:app --port 8001
```

**4. Dependencies installation failed:**
```bash
# Update pip first
python -m pip install --upgrade pip
pip install fastapi uvicorn[standard]
```

**5. Module not found errors:**
```bash
# Install missing dependencies
pip install -r requirements.txt
```

## 🔄 Integration with Frontend

### **Connect to Next.js Frontend:**

1. **Start Backend:** `python simple_start.py`
2. **Start Frontend:** `npm run dev` (in main directory)
3. **Test Connection:** Visit http://localhost:8000/api/v1/test/connection

### **API Integration Example:**
```javascript
// In your Next.js app
const response = await fetch('http://localhost:8000/api/v1/symptoms/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    symptoms: ['headache', 'fever'],
    patient_age: 30
  })
});

const result = await response.json();
console.log(result);
```

## 📊 Features Available

### **✅ Working Features:**
- ✅ FastAPI server with CORS
- ✅ Health check endpoint
- ✅ Basic symptom analysis
- ✅ Appointment enhancement
- ✅ Analytics summary
- ✅ Frontend integration endpoints
- ✅ Interactive API documentation

### **🚧 Coming Soon:**
- 🚧 Advanced AI/ML models
- 🚧 Database integration
- 🚧 Authentication system
- 🚧 Payment gateway integration
- 🚧 Real-time notifications
- 🚧 Advanced analytics

## 🎉 Success Indicators

When everything is working correctly, you should see:

```
🏥 HealthConnect Python Backend - Simple Start
==================================================
✅ FastAPI is available
✅ Directory created: logs
✅ Directory created: uploads
📝 Creating basic .env file...
✅ .env file created

🚀 Starting FastAPI server...
📍 Server will be available at: http://localhost:8000
📖 API Documentation: http://localhost:8000/docs
🔍 Health Check: http://localhost:8000/health

Press Ctrl+C to stop the server
==================================================
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

## 🆘 Need Help?

If you encounter any issues:

1. **Check the logs** in the terminal
2. **Visit the health check** at http://localhost:8000/health
3. **Check API docs** at http://localhost:8000/docs
4. **Ensure Python 3.8+** is installed
5. **Try the minimal start** with `python simple_start.py`

## 🎯 Next Steps

1. **Start the backend** using any method above
2. **Test the API** at http://localhost:8000/docs
3. **Integrate with frontend** using the provided endpoints
4. **Customize configuration** in the .env file
5. **Add your own features** by modifying the Python code

Your HealthConnect backend is now ready to power your healthcare platform! 🚀
