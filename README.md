# HealthConnect Bangladesh - Healthcare AI Appointment Booking System

An AI-powered healthcare appointment booking platform designed to improve healthcare access in Bangladesh through intelligent doctor matching, multilingual support, and mobile payment integration.

![HealthConnect Screenshot](public/images/healthconnect-screenshot.png)

## Project Overview

HealthConnect Bangladesh is a comprehensive healthcare platform that connects patients with healthcare professionals through an intelligent matching system. The platform features advanced symptom analysis, AI-driven doctor recommendations, smart appointment scheduling, and integrated mobile payment options tailored for the Bangladeshi healthcare ecosystem.

## Current Status

The project has successfully implemented several key features:

- ✅ **User Authentication System**: Secure login and registration with role-based access control
- ✅ **Multilingual Interface**: Complete support for Bengali and English throughout the application
- ✅ **Doctor Listing & Filtering**: Comprehensive doctor search with specialty and location filters
- ✅ **Appointment Management**: Booking, rescheduling, and cancellation of appointments
- ✅ **AI Scheduling System**: Smart appointment recommendations based on various factors
- ✅ **Advanced Symptom Checker**: AI-powered symptom analysis with condition prediction
- ✅ **Mobile Payment Integration**: Support for bKash, Nagad, and other local payment methods
- ✅ **Responsive UI**: Clean, accessible interface that works across all device sizes

### Key Features

- **AI-Driven Doctor Matching**: Intelligent system that matches patients with the right specialists based on symptoms and medical history
- **Multilingual Interface**: Full support for Bengali and English with proper localization for medical terms
- **Advanced Symptom Analysis**: AI-powered symptom checker that provides condition predictions and urgency assessment
- **Smart Appointment Scheduling**: AI scheduling system that considers doctor availability, patient preferences, and symptom urgency
- **Mobile Payment Integration**: Seamless integration with popular mobile payment methods in Bangladesh (bKash, Nagad)
- **Geolocation-Based Recommendations**: Find doctors near you with real-time availability

## Tech Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **UI**: React, Tailwind CSS, shadcn/ui components
- **State Management**: React Context API, React Hooks
- **Form Handling**: React Hook Form with Zod validation
- **Internationalization**: Custom i18n implementation with context API
- **Animations**: Framer Motion for micro-interactions

### Backend

- **API**: Next.js API Routes with server actions
- **Authentication**: JWT with secure HTTP-only cookies + bcrypt for password hashing
- **Database**: MongoDB for flexible schema and rapid development
- **Payment Processing**: Integration with bKash, Nagad payment gateways
- **Geolocation**: Browser Geolocation API with custom distance calculation

### AI/ML Components

- **Symptom Analysis**: Rule-based expert system with severity scoring
- **Doctor Matching**: Recommendation engine with multi-factor scoring
- **Smart Scheduling**: AI algorithm considering multiple scheduling factors
- **Multilingual Support**: Custom translation system with medical terminology

### Data Visualization

- **Charts**: Recharts for responsive, interactive data visualization
- **Maps**: Leaflet.js for doctor location mapping
- **Analytics**: Custom analytics dashboard for administrators

## Project Structure

The project follows a well-organized structure that separates concerns and promotes maintainability:

```bash
healthcare-platform-bd/
├── app/                            # Next.js App Router
│   ├── api/                        # API routes
│   │   ├── auth/                   # Authentication endpoints
│   │   ├── appointments/           # Appointment endpoints
│   │   ├── doctors/                # Doctor endpoints
│   │   └── payments/               # Payment processing endpoints
│   ├── (auth)/                     # Authentication pages
│   │   ├── login/                  # Login page
│   │   └── register/               # Registration page
│   ├── admin/                      # Admin section
│   │   ├── dashboard/              # Admin dashboard
│   │   └── doctors/                # Doctor management
│   ├── book-appointment/           # Appointment booking
│   │   ├── [doctorId]/             # Doctor-specific booking
│   │   ├── confirmation/           # Booking confirmation
│   │   └── smart/                  # AI-powered scheduling
│   ├── find-doctor/                # Doctor search and filtering
│   ├── symptom-checker/            # Symptom analysis
│   └── layout.tsx                  # Root layout
├── components/                     # React components
│   ├── ai/                         # AI-related components
│   │   └── smart-scheduler.tsx     # AI scheduling component
│   ├── auth/                       # Authentication components
│   ├── dashboard/                  # Dashboard components
│   ├── doctors/                    # Doctor-related components
│   ├── layout/                     # Layout components
│   │   ├── header.tsx              # Application header
│   │   ├── footer.tsx              # Application footer
│   │   └── sidebar.tsx             # Dashboard sidebar
│   ├── map/                        # Map and location components
│   ├── payment/                    # Payment components
│   │   ├── payment-method-selector.tsx # Payment method selection
│   │   └── payment-processor.tsx   # Payment processing
│   ├── symptom-checker/            # Symptom checker components
│   │   ├── symptom-input.tsx       # Symptom input form
│   │   └── analysis-results.tsx    # Analysis results display
│   └── ui/                         # UI components (shadcn)
├── lib/                            # Utility functions
│   ├── ai/                         # AI and ML utilities
│   │   ├── recommendation-engine.ts # Doctor recommendation engine
│   │   └── symptom-analyzer.ts     # Symptom analysis engine
│   ├── api/                        # API client functions
│   │   ├── auth.ts                 # Authentication API
│   │   ├── appointments.ts         # Appointments API
│   │   ├── doctors.ts              # Doctors API
│   │   ├── payments.ts             # Payments API
│   │   └── types.ts                # API types
│   ├── i18n/                       # Internationalization
│   │   ├── i18n-context.tsx        # i18n context provider
│   │   ├── i18n-server.ts          # Server-side i18n utilities
│   │   └── translations/           # Translation files
│   │       ├── en.json             # English translations
│   │       └── bn.json             # Bengali translations
│   └── utils/                      # General utilities
│       ├── date.ts                 # Date utilities
│       ├── geolocation.ts          # Geolocation utilities
│       └── validation.ts           # Validation utilities
├── public/                         # Static assets
│   ├── fonts/                      # Font files
│   ├── images/                     # Image files
│   └── icons/                      # Icon files
├── styles/                         # Global styles
│   └── globals.css                 # Global CSS
├── .env.example                    # Example environment variables
├── .eslintrc.js                    # ESLint configuration
├── .gitignore                      # Git ignore file
├── next.config.js                  # Next.js configuration
├── package.json                    # Node.js dependencies
├── postcss.config.js               # PostCSS configuration
├── tailwind.config.js              # Tailwind CSS configuration
└── tsconfig.json                   # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB (optional for full functionality)
- Git

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/rashed9810/healthcare-platform-bd.git
   cd healthcare-platform-bd
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
   # Authentication
   JWT_SECRET=your_jwt_secret_key

   # Database (optional)
   MONGODB_URI=your_mongodb_connection_string

   # Payment Gateway (optional)
   BKASH_API_KEY=your_bkash_api_key
   NAGAD_API_KEY=your_nagad_api_key
   ```

4. Run the development server

   ```bash
   npm run dev
   ```

   or

   ```bash
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

### Features Guide

#### Multilingual Interface

The application supports both English and Bengali languages. You can switch between languages using the language selector in the header.

#### AI Symptom Checker

1. Navigate to the Symptom Checker page
2. Enter your symptoms using the form or voice input
3. View the AI analysis results with possible conditions and recommendations
4. Book an appointment with a recommended specialist directly from the results

#### Smart Appointment Scheduling

1. Navigate to the Find a Doctor page
2. Use the AI Scheduler option to get personalized appointment recommendations
3. Set your preferences for date, time, urgency, and location
4. View and select from AI-recommended doctors and time slots

#### Mobile Payment Integration

1. Book an appointment with a doctor
2. Select your preferred payment method (bKash, Nagad, etc.)
3. Complete the payment process through the selected gateway
4. Receive confirmation of your appointment

## API Reference

The application uses the following API endpoints:

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout a user

### Doctors

- `GET /api/doctors` - Get all doctors (with filters)
- `GET /api/doctors/:id` - Get a specific doctor
- `POST /api/doctors/recommend` - Get doctor recommendations based on symptoms

### Appointments

- `GET /api/appointments` - Get user appointments
- `GET /api/appointments/:id` - Get a specific appointment
- `POST /api/appointments` - Book a new appointment
- `PUT /api/appointments/:id/cancel` - Cancel an appointment
- `PUT /api/appointments/:id/reschedule` - Reschedule an appointment

### Payments

- `POST /api/payments/initiate` - Initiate a payment transaction
- `POST /api/payments/verify` - Verify a payment transaction
- `GET /api/payments/methods` - Get available payment methods

### Notifications

- `POST /api/notifications/medication-reminder` - Create medication reminder
- `POST /api/notifications/appointment-reminder` - Create appointment reminder
- `POST /api/notifications/health-checkup-reminder` - Create health checkup reminder
- `POST /api/notifications/send` - Send notification through multiple channels
- `GET /api/notifications/user/:id` - Get user reminders
- `PUT /api/notifications/reminder/:id` - Update reminder
- `DELETE /api/notifications/reminder/:id` - Delete reminder

### Messaging

- `GET /api/messaging/conversations/:userId` - Get user conversations
- `GET /api/messaging/conversations/:id/messages` - Get conversation messages
- `POST /api/messaging/conversations/:id/messages` - Send message
- `POST /api/messaging/conversations` - Create new conversation
- `POST /api/messaging/conversations/:id/upload` - Upload file to conversation
- `PUT /api/messaging/conversations/:id/read` - Mark conversation as read

## 🎯 **PROJECT STATUS: ~90% COMPLETE**

### ✅ **COMPLETED CORE FEATURES**

- ✅ **User Authentication System** - Complete JWT-based auth with role management
- ✅ **Multilingual Interface (English & Bengali)** - Full i18n support with context-aware translations
- ✅ **Doctor Listing & Filtering** - Advanced search with specialty, location, rating filters
- ✅ **Appointment Management** - Complete booking, rescheduling, cancellation system
- ✅ **AI Scheduling System** - Smart appointment recommendations with conflict resolution
- ✅ **Advanced Symptom Checker** - AI-powered symptom analysis with doctor recommendations
- ✅ **Mobile Payment Integration** - bKash, Nagad, and card payment support
- ✅ **Geolocation Features** - GPS-based doctor search with distance calculation

### ✅ **NEWLY COMPLETED ADVANCED FEATURES**

- ✅ **Health Reminders & Notifications** - Medication, appointment, and health check-up reminders
- ✅ **Health Analytics Dashboard** - Personal health metrics, trends, and predictive insights
- ✅ **Complete Admin Dashboard** - User management, doctor verification, platform analytics
- ✅ **Enhanced Communication System** - In-app messaging, file sharing, voice messages
- ✅ **Advanced Payment Features** - Insurance integration, subscriptions, refund management

### 🔄 **IN PROGRESS**

- 🔄 **Video Consultation System** - WebRTC integration (60% complete)
- 🔄 **Prescription Management** - Digital prescriptions (40% complete)
- 🔄 **Medical Records** - Patient health records (30% complete)

### 📅 **PLANNED FEATURES**

- 📅 **Patient Community & Support Groups** - Social features for patient support
- 📅 **Integration with Wearable Devices** - Fitness tracker and smartwatch sync
- 📅 **Telemedicine Expansion to Rural Areas** - Offline-capable rural healthcare
- 📅 **Emergency Services Integration** - Ambulance booking and emergency alerts
- 📅 **AI Health Assistant** - 24/7 AI-powered health guidance

## Data Models

The application uses the following data models:

### User

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Hashed with bcrypt
  phone: string;
  role: "patient" | "doctor" | "admin";
  language: "en" | "bn";
  createdAt: string;
}
```

### Doctor

```typescript
interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "doctor";
  language: string;
  createdAt: string;
  specialty: string;
  qualifications: string[];
  experience: number;
  languages: string[];
  availableSlots: {
    date: string;
    time: string;
    available: boolean;
  }[];
  location: {
    address: string;
    city: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  rating: number;
  reviewCount: number;
  consultationFee: number;
  bio: string;
  availableForVideo: boolean;
}
```

### Appointment

```typescript
interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  type: "video" | "in-person";
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  symptoms: string[];
  notes: string;
  paymentStatus: "pending" | "completed" | "failed";
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}
```

### Payment

```typescript
interface Payment {
  id: string;
  appointmentId: string;
  patientId: string;
  amount: number;
  currency: string;
  method: "bkash" | "nagad" | "rocket" | "card" | "cash";
  status: "pending" | "completed" | "failed" | "refunded";
  transactionId: string;
  createdAt: string;
  updatedAt: string;
}
```

## Contributing

Contributions are welcome! Here's how you can contribute to the project:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure to update tests as appropriate and follow the code style of the project.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [MongoDB](https://www.mongodb.com/)
- [Vercel](https://vercel.com/)

## Deployment

The application can be deployed using the following methods:

### Vercel Deployment (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure environment variables
4. Deploy

### Manual Deployment

1. Build the application:

   ```bash
   npm run build
   ```

2. Start the production server:

   ```bash
   npm start
   ```

### Environment Variables for Production

Make sure to set the following environment variables in your production environment:

```bash
NODE_ENV=production
JWT_SECRET=your_secure_jwt_secret
MONGODB_URI=your_production_mongodb_uri
NEXT_PUBLIC_API_URL=your_api_url
```
