# 🐍 HealthConnect Python Backend

Advanced Python backend for HealthConnect healthcare platform built with FastAPI.

## 🚀 Features

### 🤖 **AI-Powered Medical Analysis**
- **Advanced Symptom Analysis** - AI-powered symptom checker with medical knowledge base
- **Prescription OCR** - Extract and analyze prescription information from images
- **Medical Image Analysis** - AI analysis of X-rays, CT scans, and other medical images
- **Health Risk Assessment** - Comprehensive health risk evaluation using ML
- **Patient Insights** - AI-generated insights and recommendations

### 🏥 **Healthcare Services**
- **Medical Records Management** - Secure patient data handling
- **Appointment Analytics** - Advanced scheduling analytics
- **Prescription Management** - Digital prescription processing
- **Notification System** - Multi-channel notifications (SMS, Email, Push)
- **Payment Integration** - Bangladesh payment gateway integration

### 🔧 **Technical Features**
- **FastAPI Framework** - High-performance async API
- **Multi-Database Support** - SQLite, MongoDB, Redis
- **Advanced Logging** - Healthcare compliance logging
- **Security** - JWT authentication, data encryption
- **Scalability** - Docker containerization, async processing

## 📋 **Requirements**

- Python 3.8+
- MongoDB (optional, recommended for production)
- Redis (optional, for caching)
- Tesseract OCR (for prescription analysis)

## 🛠 **Quick Start**

### **Option 1: Automated Setup (Recommended)**

```bash
# Navigate to backend directory
cd backend

# Run the automated setup script
python start_backend.py
```

This script will:
- ✅ Check Python version
- ✅ Install dependencies
- ✅ Setup environment variables
- ✅ Download AI models
- ✅ Start the server

### **Option 2: Manual Setup**

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Download spaCy model
python -m spacy download en_core_web_sm

# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### **Option 3: Docker Setup**

```bash
# Build Docker image
docker build -t healthconnect-backend .

# Run container
docker run -p 8000:8000 healthconnect-backend
```

## 🌐 **API Endpoints**

### **Core Endpoints**
- `GET /` - API information
- `GET /health` - Health check
- `GET /docs` - Interactive API documentation

### **AI Analysis**
- `POST /api/v1/ai/analyze-symptoms` - Symptom analysis
- `POST /api/v1/ai/analyze-prescription` - Prescription OCR
- `POST /api/v1/ai/analyze-medical-image` - Medical image analysis
- `POST /api/v1/ai/health-risk-assessment` - Health risk evaluation
- `GET /api/v1/ai/analysis-history/{patient_id}` - Analysis history

### **Healthcare Services**
- `GET /api/v1/users/profile` - User profile
- `GET /api/v1/doctors/` - Doctor management
- `GET /api/v1/appointments/` - Appointment management
- `GET /api/v1/medical-records/` - Medical records
- `POST /api/v1/payments/process` - Payment processing

## 🔧 **Configuration**

### **Environment Variables**

Create a `.env` file in the backend directory:

```env
# Basic Settings
DEBUG=True
HOST=0.0.0.0
PORT=8000

# Security
SECRET_KEY=your-secret-key-change-in-production

# Database
DATABASE_URL=sqlite:///./healthconnect.db
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=healthconnect
REDIS_URL=redis://localhost:6379

# AI/ML APIs
OPENAI_API_KEY=your-openai-key
HUGGINGFACE_API_KEY=your-huggingface-key

# Payment Gateways (Bangladesh)
BKASH_APP_KEY=your-bkash-key
BKASH_APP_SECRET=your-bkash-secret
NAGAD_MERCHANT_ID=your-nagad-id
NAGAD_MERCHANT_KEY=your-nagad-key

# Notifications
SMTP_HOST=your-smtp-host
SMTP_USER=your-email
SMTP_PASSWORD=your-password
SMS_API_KEY=your-sms-api-key
```

## 🤖 **AI Features**

### **Symptom Analysis**
```python
# Example API call
POST /api/v1/ai/analyze-symptoms
{
    "patient_id": "patient_123",
    "symptoms": ["fever", "headache", "cough"],
    "patient_age": 30,
    "patient_gender": "male",
    "medical_history": ["diabetes"]
}
```

### **Prescription Analysis**
```python
# Upload prescription image
POST /api/v1/ai/analyze-prescription
Content-Type: multipart/form-data
- prescription_file: [image file]
- patient_id: "patient_123"
```

### **Health Risk Assessment**
```python
POST /api/v1/ai/health-risk-assessment
{
    "patient_data": {
        "age": 45,
        "gender": "male",
        "weight": 80,
        "height": 175
    },
    "medical_history": ["hypertension"],
    "lifestyle_factors": [
        {"factor": "smoking", "value": true},
        {"factor": "exercise", "value": "moderate"}
    ],
    "family_history": ["heart_disease"]
}
```

## 📊 **Database Schema**

### **MongoDB Collections**
- `users` - User profiles and authentication
- `doctors` - Doctor information and availability
- `appointments` - Appointment scheduling and management
- `medical_analyses` - AI analysis results
- `medical_records` - Patient medical records
- `prescriptions` - Digital prescriptions
- `analytics` - System analytics and metrics

### **SQLite Tables**
- Used for caching and session management
- Backup storage for critical data

## 🔒 **Security**

- **JWT Authentication** - Secure token-based auth
- **Data Encryption** - Sensitive data encryption
- **HIPAA Compliance** - Healthcare data protection
- **Audit Logging** - Comprehensive audit trails
- **Rate Limiting** - API rate limiting
- **Input Validation** - Strict input validation

## 📈 **Monitoring**

### **Health Checks**
```bash
# Check API health
curl http://localhost:8000/health

# Check database connections
curl http://localhost:8000/api/v1/health/database
```

### **Logs**
- `logs/healthconnect.log` - General application logs
- `logs/healthcare.log` - Healthcare-specific events
- `logs/audit.log` - Compliance audit logs
- `logs/performance.log` - Performance metrics
- `logs/errors.log` - Error logs

## 🧪 **Testing**

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test
pytest tests/test_symptom_analyzer.py
```

## 🚀 **Deployment**

### **Production Deployment**

1. **Environment Setup**
   ```bash
   export DEBUG=False
   export DATABASE_URL=postgresql://user:pass@host:5432/db
   export MONGODB_URL=mongodb://host:27017
   ```

2. **Docker Deployment**
   ```bash
   docker-compose up -d
   ```

3. **Kubernetes Deployment**
   ```bash
   kubectl apply -f k8s/
   ```

## 🔗 **Integration with Next.js Frontend**

The Python backend integrates seamlessly with the Next.js frontend:

1. **Authentication** - Validates JWT tokens from Next.js
2. **API Calls** - RESTful API endpoints for frontend consumption
3. **Real-time Updates** - WebSocket support for live updates
4. **File Uploads** - Handles medical image and document uploads

### **Frontend Integration Example**
```javascript
// Call Python backend from Next.js
const analyzeSymptoms = async (symptoms) => {
  const response = await fetch('http://localhost:8000/api/v1/ai/analyze-symptoms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      patient_id: userId,
      symptoms: symptoms,
      patient_age: 30
    })
  });
  return response.json();
};
```

## 📞 **Support**

- **Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
- **Logs**: Check `logs/` directory for troubleshooting

## 🎯 **Next Steps**

1. **Setup MongoDB** for production database
2. **Configure Redis** for caching and sessions
3. **Add AI API keys** for enhanced analysis
4. **Setup payment gateways** for Bangladesh
5. **Configure notifications** (SMS, Email)
6. **Deploy to production** environment

---

🏥 **HealthConnect Python Backend** - Powering advanced healthcare with AI
