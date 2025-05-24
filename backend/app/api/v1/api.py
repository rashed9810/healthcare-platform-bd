"""
Main API router for HealthConnect Backend
"""

from fastapi import APIRouter
from .endpoints import (
    auth,
    users,
    doctors,
    appointments,
    symptoms,
    prescriptions,
    analytics,
    ai_analysis,
    payments,
    medical_records,
    notifications,
    video_consultation,
    messaging
)

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"]
)

api_router.include_router(
    users.router,
    prefix="/users",
    tags=["Users"]
)

api_router.include_router(
    doctors.router,
    prefix="/doctors",
    tags=["Doctors"]
)

api_router.include_router(
    appointments.router,
    prefix="/appointments",
    tags=["Appointments"]
)

api_router.include_router(
    symptoms.router,
    prefix="/symptoms",
    tags=["Symptoms"]
)

api_router.include_router(
    prescriptions.router,
    prefix="/prescriptions",
    tags=["Prescriptions"]
)

api_router.include_router(
    analytics.router,
    prefix="/analytics",
    tags=["Analytics"]
)

api_router.include_router(
    ai_analysis.router,
    prefix="/ai",
    tags=["AI Analysis"]
)

api_router.include_router(
    payments.router,
    prefix="/payments",
    tags=["Payments"]
)

api_router.include_router(
    medical_records.router,
    prefix="/medical-records",
    tags=["Medical Records"]
)

api_router.include_router(
    notifications.router,
    prefix="/notifications",
    tags=["Notifications"]
)

api_router.include_router(
    video_consultation.router,
    prefix="/video-consultation",
    tags=["Video Consultation"]
)

api_router.include_router(
    messaging.router,
    prefix="/messaging",
    tags=["Messaging"]
)
