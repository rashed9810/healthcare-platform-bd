"""
Prescription Management endpoints for HealthConnect
Handles digital prescriptions, medication management, and pharmacy integration
"""

from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import logging
import uuid
import base64

from ....core.database import get_mongodb
from ....models.ai_models import PrescriptionRequest, PrescriptionResponse

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/create", response_model=Dict[str, Any])
async def create_prescription(
    doctor_id: str,
    patient_id: str,
    appointment_id: str,
    diagnosis: str,
    medications: List[Dict[str, Any]],
    notes: str = "",
    follow_up_date: Optional[str] = None
):
    """Create a new digital prescription"""
    try:
        db = await get_mongodb()

        # Verify doctor and patient exist
        doctor = await db.users.find_one({"_id": doctor_id, "role": "doctor"})
        patient = await db.users.find_one({"_id": patient_id, "role": "patient"})

        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found")
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")

        # Create prescription
        prescription_data = {
            "_id": str(uuid.uuid4()),
            "doctor_id": doctor_id,
            "doctor_name": doctor["name"],
            "doctor_license": doctor.get("license_number", ""),
            "patient_id": patient_id,
            "patient_name": patient["name"],
            "patient_age": patient.get("age", ""),
            "patient_gender": patient.get("gender", ""),
            "appointment_id": appointment_id,
            "prescription_number": f"RX-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}",
            "date": datetime.utcnow(),
            "diagnosis": diagnosis,
            "medications": medications,
            "notes": notes,
            "follow_up_date": follow_up_date,
            "status": "active",
            "digital_signature": f"Dr. {doctor['name']} - {datetime.utcnow().isoformat()}",
            "qr_code": None,  # Will be generated
            "pharmacy_dispensed": False,
            "dispensed_at": None,
            "dispensed_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        # Generate QR code data (simplified)
        qr_data = {
            "prescription_id": prescription_data["_id"],
            "prescription_number": prescription_data["prescription_number"],
            "doctor_id": doctor_id,
            "patient_id": patient_id,
            "verification_hash": base64.b64encode(
                f"{prescription_data['_id']}{doctor_id}{patient_id}".encode()
            ).decode()
        }
        prescription_data["qr_code"] = qr_data

        await db.prescriptions.insert_one(prescription_data)

        # Create medication reminders
        for medication in medications:
            if medication.get("frequency") and medication.get("duration"):
                await create_medication_reminder(
                    patient_id,
                    medication["name"],
                    medication["dosage"],
                    medication["frequency"],
                    medication.get("instructions", ""),
                    prescription_data["_id"]
                )

        return {
            "prescription_id": prescription_data["_id"],
            "prescription_number": prescription_data["prescription_number"],
            "status": "created",
            "qr_code": qr_data
        }

    except Exception as e:
        logger.error(f"Error creating prescription: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def create_medication_reminder(
    patient_id: str,
    medication_name: str,
    dosage: str,
    frequency: str,
    instructions: str,
    prescription_id: str
):
    """Create medication reminders for a prescription"""
    try:
        db = await get_mongodb()

        # Parse frequency to create reminders
        reminder_times = []
        if "3 times" in frequency.lower():
            reminder_times = ["08:00", "14:00", "20:00"]
        elif "2 times" in frequency.lower() or "twice" in frequency.lower():
            reminder_times = ["08:00", "20:00"]
        elif "once" in frequency.lower() or "1 time" in frequency.lower():
            reminder_times = ["08:00"]
        elif "4 times" in frequency.lower():
            reminder_times = ["06:00", "12:00", "18:00", "22:00"]

        for time in reminder_times:
            reminder_data = {
                "_id": str(uuid.uuid4()),
                "user_id": patient_id,
                "type": "medication",
                "title": f"Take {medication_name}",
                "message": f"Time to take {dosage} of {medication_name}. {instructions}",
                "medication_name": medication_name,
                "dosage": dosage,
                "time": time,
                "frequency": frequency,
                "prescription_id": prescription_id,
                "is_active": True,
                "created_at": datetime.utcnow()
            }

            await db.reminders.insert_one(reminder_data)

    except Exception as e:
        logger.error(f"Error creating medication reminder: {e}")

@router.get("/prescription/{prescription_id}", response_model=Dict[str, Any])
async def get_prescription(prescription_id: str):
    """Get prescription details"""
    try:
        db = await get_mongodb()

        prescription = await db.prescriptions.find_one({"_id": prescription_id})
        if not prescription:
            raise HTTPException(status_code=404, detail="Prescription not found")

        # Format dates
        if prescription.get("date"):
            prescription["date"] = prescription["date"].isoformat()
        if prescription.get("created_at"):
            prescription["created_at"] = prescription["created_at"].isoformat()
        if prescription.get("updated_at"):
            prescription["updated_at"] = prescription["updated_at"].isoformat()

        return prescription

    except Exception as e:
        logger.error(f"Error getting prescription: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/patient/{patient_id}", response_model=List[Dict[str, Any]])
async def get_patient_prescriptions(
    patient_id: str,
    status: str = "all",
    limit: int = 20,
    offset: int = 0
):
    """Get prescriptions for a patient"""
    try:
        db = await get_mongodb()

        query = {"patient_id": patient_id}
        if status != "all":
            query["status"] = status

        prescriptions = await db.prescriptions.find(query)\
            .sort("date", -1)\
            .skip(offset)\
            .limit(limit)\
            .to_list(length=None)

        # Format prescriptions
        formatted_prescriptions = []
        for prescription in prescriptions:
            if prescription.get("date"):
                prescription["date"] = prescription["date"].isoformat()
            if prescription.get("created_at"):
                prescription["created_at"] = prescription["created_at"].isoformat()
            if prescription.get("updated_at"):
                prescription["updated_at"] = prescription["updated_at"].isoformat()

            formatted_prescriptions.append(prescription)

        return formatted_prescriptions

    except Exception as e:
        logger.error(f"Error getting patient prescriptions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def get_prescriptions():
    """Get prescription management system status"""
    return {
        "message": "Prescription Management System Active",
        "features": [
            "Digital Prescription Creation",
            "QR Code Verification",
            "Pharmacy Integration",
            "Medication Reminders",
            "OCR Processing",
            "Prescription History"
        ],
        "status": "operational"
    }
