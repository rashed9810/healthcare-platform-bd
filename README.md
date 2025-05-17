# HealthConnect Bangladesh - Healthcare AI Appointment Booking System

An AI-powered healthcare appointment booking platform designed to improve healthcare access in Bangladesh through intelligent doctor matching, multilingual support, and low-bandwidth optimization.

![HealthConnect Screenshot](public/images/healthconnect-screenshot.png)

## Project Overview

HealthConnect Bangladesh is a comprehensive healthcare platform that connects patients with healthcare professionals through an intelligent matching system. The platform features symptom analysis, doctor recommendations, appointment scheduling, and video consultations optimized for low-bandwidth environments.

### Key Features

- **AI-Driven Doctor Matching**: Intelligent system that matches patients with the right specialists based on symptoms and medical history
- **Multilingual Interface**: Full support for Bengali and English with AI translation for medical terms
- **Low Bandwidth Optimization**: Works reliably on 2G/3G connections with adaptive video quality
- **Secure Video Consultations**: End-to-end encrypted video calls optimized for low bandwidth
- **Mobile Payment Integration**: Seamless integration with popular mobile payment methods in Bangladesh
- **Geolocation-Based Recommendations**: Find doctors near you with real-time availability

## Tech Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **UI**: React, Tailwind CSS, shadcn/ui
- **State Management**: React Hooks
- **Form Handling**: React Hook Form, Zod

### Backend

- **API**: Next.js API Routes + Flask API (for ML components)
- **Authentication**: JWT + bcrypt
- **Database**: MongoDB / PostgreSQL
- **Video Call**: WebRTC + Peer.js
- **OCR**: Tesseract.js

### AI/ML Components

- **Symptom Analysis**: Python ML (Flask API) or TensorFlow.js
- **Doctor Matching**: Collaborative filtering + rule-based matching
- **Multilingual NLP**: BERT / IndicBERT / multilingual transformers

### Analytics

- **Dashboard**: Power BI Embed
- **Data Visualization**: Recharts

## Project Structure

```bash
healthcare-ai-booking-system/
├── .github/                        # GitHub workflows and templates
│   ├── workflows/                  # CI/CD workflows
│   │   ├── ci.yml                  # Continuous Integration workflow
│   │   └── deploy.yml              # Deployment workflow
│   └── ISSUE_TEMPLATE/             # Issue templates
├── .husky/                         # Git hooks for code quality
├── app/                            # Next.js App Router
│   ├── api/                        # API routes
│   │   ├── auth/                   # Authentication endpoints
│   │   │   ├── login/              # Login endpoint
│   │   │   ├── logout/             # Logout endpoint
│   │   │   └── register/           # Registration endpoint
│   │   ├── appointments/           # Appointment endpoints
│   │   ├── doctors/                # Doctor endpoints
│   │   ├── prescriptions/          # Prescription endpoints
│   │   └── symptoms/               # Symptom analysis endpoints
│   ├── (auth)/                     # Authentication pages
│   │   ├── login/                  # Login page
│   │   └── register/               # Registration page
│   ├── (dashboard)/                # Dashboard pages
│   │   ├── dashboard/              # User dashboard
│   │   └── appointments/           # Appointments management
│   ├── admin/                      # Admin section
│   │   ├── dashboard/              # Admin dashboard
│   │   ├── doctors/                # Doctor management
│   │   └── patients/               # Patient management
│   ├── find-doctor/                # Doctor search
│   ├── symptom-checker/            # Symptom analysis
│   └── layout.tsx                  # Root layout
├── components/                     # React components
│   ├── auth/                       # Authentication components
│   ├── dashboard/                  # Dashboard components
│   ├── doctors/                    # Doctor-related components
│   ├── layout/                     # Layout components
│   ├── patients/                   # Patient-related components
│   ├── symptom-checker/            # Symptom checker components
│   ├── ui/                         # UI components (shadcn)
│   └── video-call/                 # Video consultation components
├── config/                         # Configuration files
│   ├── site.ts                     # Site configuration
│   └── dashboard.ts                # Dashboard configuration
├── lib/                            # Utility functions
│   ├── api/                        # API client functions
│   │   ├── auth.ts                 # Authentication API
│   │   ├── appointments.ts         # Appointments API
│   │   ├── doctors.ts              # Doctors API
│   │   ├── prescriptions.ts        # Prescriptions API
│   │   ├── symptoms.ts             # Symptoms API
│   │   └── types.ts                # API types
│   ├── db/                         # Database utilities
│   │   ├── mongodb.ts              # MongoDB connection
│   │   └── schema.ts               # Database schema
│   ├── auth/                       # Authentication utilities
│   │   ├── jwt.ts                  # JWT utilities
│   │   └── middleware.ts           # Auth middleware
│   ├── utils/                      # General utilities
│   │   ├── date.ts                 # Date utilities
│   │   └── validation.ts           # Validation utilities
│   └── constants.ts                # Constants
├── ml-service/                     # Python ML service
│   ├── app/                        # Flask application
│   │   ├── __init__.py             # Flask app initialization
│   │   ├── routes/                 # API routes
│   │   │   ├── __init__.py         # Routes initialization
│   │   │   ├── analyze.py          # Symptom analysis routes
│   │   │   └── recommend.py        # Doctor recommendation routes
│   │   ├── models/                 # ML models
│   │   │   ├── __init__.py         # Models initialization
│   │   │   ├── symptom_analyzer.py # Symptom analysis model
│   │   │   └── doctor_recommender.py # Doctor recommendation model
│   │   ├── utils/                  # Utility functions
│   │   │   ├── __init__.py         # Utils initialization
│   │   │   ├── text_processor.py   # Text processing utilities
│   │   │   └── translator.py       # Translation utilities
│   │   └── config.py               # Configuration
│   ├── tests/                      # Tests
│   │   ├── __init__.py             # Tests initialization
│   │   ├── test_analyze.py         # Symptom analysis tests
│   │   └── test_recommend.py       # Doctor recommendation tests
│   ├── .env.example                # Example environment variables
│   ├── Dockerfile                  # Docker configuration
│   ├── requirements.txt            # Python dependencies
│   ├── requirements-dev.txt        # Development dependencies
│   └── wsgi.py                     # WSGI entry point
├── public/                         # Static assets
│   ├── fonts/                      # Font files
│   ├── images/                     # Image files
│   └── locales/                    # Localization files
├── scripts/                        # Utility scripts
│   ├── seed-db.js                  # Database seeding
│   └── generate-types.js           # Type generation
├── styles/                         # Global styles
│   └── globals.css                 # Global CSS
├── tests/                          # Frontend tests
│   ├── components/                 # Component tests
│   ├── pages/                      # Page tests
│   └── utils/                      # Utility tests
├── types/                          # TypeScript type definitions
│   ├── api.ts                      # API types
│   ├── auth.ts                     # Authentication types
│   └── index.ts                    # Common types
├── .env.example                    # Example environment variables
├── .eslintrc.js                    # ESLint configuration
├── .gitignore                      # Git ignore file
├── .prettierrc                     # Prettier configuration
├── docker-compose.yml              # Docker Compose configuration
├── jest.config.js                  # Jest configuration
├── next.config.js                  # Next.js configuration
├── package.json                    # Node.js dependencies
├── postcss.config.js               # PostCSS configuration
├── tailwind.config.js              # Tailwind CSS configuration
└── tsconfig.json                   # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.8+ (for ML components)
- MongoDB or PostgreSQL
- Git

### Installation

#### Frontend Setup

1. Clone the repository

   ```bash
   git clone https://github.com/rashed9810/healthcare-ai-booking-system.git
   cd healthcare-ai-booking-system
   ```

2. Install dependencies

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

3. Set up environment variables

   Create a `.env.local` file in the root directory with the following variables:

   ```bash
   JWT_SECRET=your_jwt_secret_key
   MONGODB_URI=your_mongodb_connection_string
   ML_API_URL=http://127.0.0.1:5000
   ```

4. Run the development server

   ```bash
   npm run dev
   ```

   or

   ```bash
   yarn dev
   ```

### Backend ML Service Setup

1. Navigate to the ML service directory

   ```bash
   cd ml-service
   ```

2. Create a Python virtual environment

   ```bash
   python -m venv venv
   source venv/bin/activate # On Windows: venv\Scripts\activate
   ```

3. Install Python dependencies

   ```bash
   pip install -r requirements.txt
   ```

4. Run the Flask API

   ```bash
   python wsgi.py
   ```

## Backend Development Guide

### API Endpoints

The following API endpoints need to be implemented:

#### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout a user

#### Doctors

- `GET /api/doctors` - Get all doctors (with filters)
- `GET /api/doctors/:id` - Get a specific doctor
- `POST /api/doctors/recommend` - Get doctor recommendations based on symptoms

#### Appointments

- `GET /api/appointments` - Get user appointments
- `GET /api/appointments/:id` - Get a specific appointment
- `POST /api/appointments` - Book a new appointment
- `POST /api/appointments/:id/cancel` - Cancel an appointment
- `POST /api/appointments/:id/reschedule` - Reschedule an appointment

#### Symptoms

- `POST /api/symptoms/analyze` - Analyze symptoms and get urgency assessment

#### Prescriptions

- `POST /api/prescriptions/upload` - Upload and process a prescription image
- `GET /api/prescriptions/:appointmentId` - Get prescription for an appointment

### Database Schema

#### Users Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String, // Hashed with bcrypt
  phone: String,
  role: String, // "patient", "doctor", or "admin"
  language: String, // "en" or "bn"
  createdAt: Date
}
```

#### Doctors Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to Users collection
  specialty: String,
  qualifications: [String],
  experience: Number,
  languages: [String],
  availableSlots: [
    {
      day: String,
      startTime: String,
      endTime: String,
      available: Boolean
    }
  ],
  location: {
    address: String,
    city: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  rating: Number,
  reviewCount: Number,
  consultationFee: Number,
  bio: String
}
```

#### Appointments Collection

```javascript
{
  _id: ObjectId,
  patientId: String, // Reference to Users collection
  doctorId: String, // Reference to Doctors collection
  date: String,
  time: String,
  type: String, // "video" or "in-person"
  status: String, // "scheduled", "completed", "cancelled", or "no-show"
  symptoms: String,
  urgencyScore: Number,
  prescription: String,
  followUp: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Medical Records Collection

```javascript
{
  _id: ObjectId,
  patientId: String,
  doctorId: String,
  date: String,
  diagnosis: String,
  prescription: String,
  notes: String,
  createdAt: Date
}
```

## ML Service Architecture

The ML service is a Flask API that provides the following endpoints:

### Symptom Analysis

- `POST /analyze` - Analyze symptoms and return urgency assessment
  - Input: `{ "symptoms": "text", "duration": "days", "severity": "moderate", "language": "en" }`
  - Output: `{ "urgencyScore": 7, "possibleConditions": ["Upper Respiratory Infection"], "recommendedSpecialty": "General Physician", "recommendedTimeframe": "Within 24 hours" }`

### Doctor Recommendation

- `POST /recommend-doctors` - Recommend doctors based on symptoms
  - Input: `{ "symptoms": "text", "userId": "id" }`
  - Output: `[{ "doctorId": "id", "matchScore": 85, "reason": "Recommended based on your symptoms" }]`

## WebRTC Signaling Server

For the video consultation feature, you'll need to implement a signaling server to facilitate WebRTC connections. This can be done using:

1. A dedicated WebSocket server
2. Firebase Realtime Database
3. PeerJS server

The signaling server should handle:

- Peer discovery
- Session establishment
- ICE candidate exchange
- Connection state management

## Deployment

### Frontend Deployment

- Deploy the Next.js application to Vercel or similar platforms
- Set up environment variables in the deployment platform

### Backend Deployment

- Deploy the Flask API to a cloud provider (AWS, GCP, Azure)
- Set up a MongoDB Atlas cluster or PostgreSQL database
- Configure CORS to allow requests from the frontend domain
- Set up proper authentication and security measures

### WebRTC TURN/STUN Servers

- Set up TURN/STUN servers for reliable WebRTC connections
- Consider using services like Twilio's Network Traversal Service or coturn

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
