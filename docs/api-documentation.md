# HealthConnect Bangladesh API Documentation

## Authentication

### Register a new user
**POST /api/auth/register**

Request body:
\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "phone": "01712345678",
  "language": "en"
}
\`\`\`

Response:
\`\`\`json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "01712345678",
    "role": "patient",
    "language": "en",
    "createdAt": "2025-05-17T14:30:00Z"
  },
  "token": "jwt_token"
}
\`\`\`

### Login
**POST /api/auth/login**

Request body:
\`\`\`json
{
  "email": "john@example.com",
  "password": "securepassword"
}
\`\`\`

Response:
\`\`\`json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "01712345678",
    "role": "patient",
    "language": "en",
    "createdAt": "2025-05-17T14:30:00Z"
  },
  "token": "jwt_token"
}
\`\`\`

### Logout
**POST /api/auth/logout**

Response:
\`\`\`json
{
  "success": true,
  "message": "Logged out successfully"
}
\`\`\`

## Doctors

### Get all doctors
**GET /api/doctors**

Query parameters:
- specialty (optional): Filter by specialty
- location (optional): Filter by location
- language (optional): Filter by language
- availability (optional): Filter by availability
- rating (optional): Filter by minimum rating

Response:
\`\`\`json
[
  {
    "id": "doctor_id",
    "name": "Dr. Anika Rahman",
    "email": "anika@example.com",
    "phone": "01712345678",
    "role": "doctor",
    "specialty": "General Physician",
    "qualifications": ["MBBS", "FCPS"],
    "experience": 10,
    "languages": ["Bengali", "English"],
    "availableSlots": [
      {
        "day": "Monday",
        "startTime": "09:00",
        "endTime": "17:00",
        "available": true
      }
    ],
    "location": {
      "address": "Dhaka Medical College Hospital",
      "city": "Dhaka",
      "coordinates": {
        "latitude": 23.7276,
        "longitude": 90.3973
      }
    },
    "rating": 4.8,
    "reviewCount": 124,
    "consultationFee": 800,
    "bio": "Dr. Anika Rahman is a highly experienced general physician..."
  }
]
\`\`\`

### Get a specific doctor
**GET /api/doctors/:id**

Response:
\`\`\`json
{
  "id": "doctor_id",
  "name": "Dr. Anika Rahman",
  "email": "anika@example.com",
  "phone": "01712345678",
  "role": "doctor",
  "specialty": "General Physician",
  "qualifications": ["MBBS", "FCPS"],
  "experience": 10,
  "languages": ["Bengali", "English"],
  "availableSlots": [
    {
      "day": "Monday",
      "startTime": "09:00",
      "endTime": "17:00",
      "available": true
    }
  ],
  "location": {
    "address": "Dhaka Medical College Hospital",
    "city": "Dhaka",
    "coordinates": {
      "latitude": 23.7276,
      "longitude": 90.3973
    }
  },
  "rating": 4.8,
  "reviewCount": 124,
  "consultationFee": 800,
  "bio": "Dr. Anika Rahman is a highly experienced general physician..."
}
\`\`\`

### Get doctor recommendations
**POST /api/doctors/recommend**

Request body:
\`\`\`json
{
  "symptoms": "I have a headache and fever for the last two days"
}
\`\`\`

Response:
\`\`\`json
[
  {
    "doctorId": "doctor_id",
    "matchScore": 85,
    "reason": "Recommended based on your symptoms of headache and fever"
  }
]
\`\`\`

## Appointments

### Get user appointments
**GET /api/appointments**

Query parameters:
- status (optional): Filter by status (scheduled, completed, cancelled, no-show)

Response:
\`\`\`json
[
  {
    "id": "appointment_id",
    "patientId": "patient_id",
    "doctorId": "doctor_id",
    "date": "2025-05-18",
    "time": "10:00 AM",
    "type": "video",
    "status": "scheduled",
    "symptoms": "Headache and fever",
    "urgencyScore": 7,
    "prescription": null,
    "followUp": false
  }
]
\`\`\`

### Get a specific appointment
**GET /api/appointments/:id**

Response:
\`\`\`json
{
  "id": "appointment_id",
  "patientId": "patient_id",
  "doctorId": "doctor_id",
  "date": "2025-05-18",
  "time": "10:00 AM",
  "type": "video",
  "status": "scheduled",
  "symptoms": "Headache and fever",
  "urgencyScore": 7,
  "prescription": null,
  "followUp": false
}
\`\`\`

### Book a new appointment
**POST /api/appointments**

Request body:
\`\`\`json
{
  "doctorId": "doctor_id",
  "date": "2025-05-18",
  "time": "10:00 AM",
  "type": "video",
  "symptoms": "Headache and fever"
}
\`\`\`

Response:
\`\`\`json
{
  "id": "appointment_id",
  "patientId": "patient_id",
  "doctorId": "doctor_id",
  "date": "2025-05-18",
  "time": "10:00 AM",
  "type": "video",
  "status": "scheduled",
  "symptoms": "Headache and fever",
  "urgencyScore": null,
  "prescription": null,
  "followUp": false
}
\`\`\`

### Cancel an appointment
**POST /api/appointments/:id/cancel**

Response:
\`\`\`json
{
  "success": true,
  "message": "Appointment cancelled successfully"
}
\`\`\`

### Reschedule an appointment
**POST /api/appointments/:id/reschedule**

Request body:
\`\`\`json
{
  "date": "2025-05-20",
  "time": "11:00 AM"
}
\`\`\`

Response:
\`\`\`json
{
  "id": "appointment_id",
  "patientId": "patient_id",
  "doctorId": "doctor_id",
  "date": "2025-05-20",
  "time": "11:00 AM",
  "type": "video",
  "status": "scheduled",
  "symptoms": "Headache and fever",
  "urgencyScore": null,
  "prescription": null,
  "followUp": false
}
\`\`\`

## Symptoms

### Analyze symptoms
**POST /api/symptoms/analyze**

Request body:
\`\`\`json
{
  "symptoms": "I have a headache and fever for the last two days",
  "duration": "days",
  "severity": "moderate",
  "language": "en"
}
\`\`\`

Response:
\`\`\`json
{
  "urgencyScore": 7,
  "possibleConditions": ["Upper Respiratory Infection", "Seasonal Allergies", "Common Cold"],
  "recommendedSpecialty": "General Physician",
  "recommendedTimeframe": "Within 24 hours"
}
\`\`\`

## Prescriptions

### Upload prescription
**POST /api/prescriptions/upload**

Request body (multipart/form-data):
- appointmentId: string
- prescriptionImage: file

Response:
\`\`\`json
{
  "success": true,
  "prescriptionId": "prescription_id",
  "url": "https://example.com/prescriptions/prescription_id.pdf"
}
\`\`\`

### Get prescription for an appointment
**GET /api/prescriptions/:appointmentId**

Response:
\`\`\`json
{
  "id": "prescription_id",
  "appointmentId": "appointment_id",
  "doctorId": "doctor_id",
  "patientId": "patient_id",
  "date": "2025-05-18",
  "medications": [
    {
      "name": "Paracetamol",
      "dosage": "500mg",
      "frequency": "3 times a day",
      "duration": "5 days"
    }
  ],
  "instructions": "Take with food. Drink plenty of water.",
  "followUpRecommended": true,
  "followUpDate": "2025-05-25"
}
