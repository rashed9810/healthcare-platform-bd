"""
Medical Records endpoints for HealthConnect
Handles patient medical records, file management, and health history
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import List, Dict, Any, Optional
from datetime import datetime
import logging
import uuid

from ....core.database import get_mongodb

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/create", response_model=Dict[str, Any])
async def create_medical_record(
    patient_id: str,
    doctor_id: str,
    title: str,
    record_type: str,
    description: str,
    diagnosis: Optional[str] = None,
    treatment: Optional[str] = None,
    notes: Optional[str] = None,
    tags: List[str] = [],
    priority: str = "medium"
):
    """Create a new medical record"""
    try:
        db = await get_mongodb()

        # Verify patient and doctor exist
        patient = await db.users.find_one({"_id": patient_id, "role": "patient"})
        doctor = await db.users.find_one({"_id": doctor_id, "role": "doctor"})

        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found")

        # Create medical record
        record_data = {
            "_id": str(uuid.uuid4()),
            "patient_id": patient_id,
            "patient_name": patient["name"],
            "doctor_id": doctor_id,
            "doctor_name": doctor["name"],
            "hospital_name": doctor.get("hospital", "HealthConnect"),
            "title": title,
            "type": record_type,
            "description": description,
            "diagnosis": diagnosis,
            "treatment": treatment,
            "notes": notes,
            "tags": tags,
            "priority": priority,
            "date": datetime.utcnow(),
            "status": "active",
            "is_shared": False,
            "shared_with": [],
            "files": [],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        await db.medical_records.insert_one(record_data)

        return {
            "record_id": record_data["_id"],
            "status": "created",
            "created_at": record_data["created_at"].isoformat()
        }

    except Exception as e:
        logger.error(f"Error creating medical record: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/patient/{patient_id}", response_model=List[Dict[str, Any]])
async def get_patient_records(
    patient_id: str,
    record_type: str = "all",
    status: str = "all",
    limit: int = 50,
    offset: int = 0
):
    """Get medical records for a patient"""
    try:
        db = await get_mongodb()

        query = {"patient_id": patient_id}

        if record_type != "all":
            query["type"] = record_type

        if status != "all":
            query["status"] = status

        records = await db.medical_records.find(query)\
            .sort("date", -1)\
            .skip(offset)\
            .limit(limit)\
            .to_list(length=None)

        # Format records
        formatted_records = []
        for record in records:
            if record.get("date"):
                record["date"] = record["date"].isoformat()
            if record.get("created_at"):
                record["created_at"] = record["created_at"].isoformat()
            if record.get("updated_at"):
                record["updated_at"] = record["updated_at"].isoformat()

            # Format file upload dates
            for file_info in record.get("files", []):
                if file_info.get("uploaded_at"):
                    file_info["uploaded_at"] = file_info["uploaded_at"].isoformat()

            formatted_records.append(record)

        return formatted_records

    except Exception as e:
        logger.error(f"Error getting patient records: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/record/{record_id}", response_model=Dict[str, Any])
async def get_medical_record(record_id: str):
    """Get specific medical record details"""
    try:
        db = await get_mongodb()

        record = await db.medical_records.find_one({"_id": record_id})
        if not record:
            raise HTTPException(status_code=404, detail="Medical record not found")

        # Format dates
        if record.get("date"):
            record["date"] = record["date"].isoformat()
        if record.get("created_at"):
            record["created_at"] = record["created_at"].isoformat()
        if record.get("updated_at"):
            record["updated_at"] = record["updated_at"].isoformat()

        # Format file upload dates
        for file_info in record.get("files", []):
            if file_info.get("uploaded_at"):
                file_info["uploaded_at"] = file_info["uploaded_at"].isoformat()

        return record

    except Exception as e:
        logger.error(f"Error getting medical record: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload", response_model=Dict[str, Any])
async def upload_medical_file(
    patient_id: str = Form(...),
    record_id: Optional[str] = Form(None),
    title: str = Form(...),
    record_type: str = Form(...),
    description: str = Form(...),
    file: UploadFile = File(...)
):
    """Upload a medical file and create/update record"""
    try:
        db = await get_mongodb()

        # Validate file
        if file.size > 10 * 1024 * 1024:  # 10MB limit
            raise HTTPException(status_code=400, detail="File too large")

        allowed_types = [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/gif",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ]

        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="File type not allowed")

        # Read file content
        content = await file.read()

        # In production, upload to cloud storage (AWS S3, Google Cloud, etc.)
        # For now, simulate file storage
        file_url = f"/uploads/medical/{patient_id}/{file.filename}"

        file_data = {
            "file_id": str(uuid.uuid4()),
            "filename": file.filename,
            "file_url": file_url,
            "file_type": file.content_type,
            "file_size": f"{file.size / 1024 / 1024:.1f} MB",
            "uploaded_at": datetime.utcnow()
        }

        if record_id:
            # Update existing record
            await db.medical_records.update_one(
                {"_id": record_id, "patient_id": patient_id},
                {
                    "$push": {"files": file_data},
                    "$set": {"updated_at": datetime.utcnow()}
                }
            )

            return {
                "status": "file_added",
                "record_id": record_id,
                "file_id": file_data["file_id"],
                "file_url": file_url
            }
        else:
            # Create new record with file
            record_data = {
                "_id": str(uuid.uuid4()),
                "patient_id": patient_id,
                "patient_name": "",  # Will be filled from patient data
                "doctor_id": "",
                "doctor_name": "Uploaded Document",
                "hospital_name": "Patient Upload",
                "title": title,
                "type": record_type,
                "description": description,
                "diagnosis": None,
                "treatment": None,
                "notes": "",
                "tags": ["uploaded"],
                "priority": "medium",
                "date": datetime.utcnow(),
                "status": "active",
                "is_shared": False,
                "shared_with": [],
                "files": [file_data],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }

            # Get patient name
            patient = await db.users.find_one({"_id": patient_id})
            if patient:
                record_data["patient_name"] = patient["name"]

            await db.medical_records.insert_one(record_data)

            return {
                "status": "record_created",
                "record_id": record_data["_id"],
                "file_id": file_data["file_id"],
                "file_url": file_url
            }

    except Exception as e:
        logger.error(f"Error uploading medical file: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def get_medical_records():
    """Get medical records system status"""
    return {
        "message": "Medical Records System Active",
        "features": [
            "Digital Medical Records",
            "File Upload & Storage",
            "Record Sharing",
            "Medical History Tracking",
            "Analytics & Insights",
            "Secure Access Control"
        ],
        "status": "operational"
    }
