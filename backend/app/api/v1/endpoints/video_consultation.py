"""
Video Consultation endpoints for HealthConnect
Handles video call sessions, recording, and consultation management
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import logging
import uuid

from ....core.database import get_mongodb
from ....models.ai_models import VideoConsultationRequest, VideoConsultationResponse

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/session/create", response_model=Dict[str, Any])
async def create_video_session(
    appointment_id: str,
    doctor_id: str,
    patient_id: str,
    session_type: str = "consultation"
):
    """Create a new video consultation session"""
    try:
        db = await get_mongodb()
        
        # Verify appointment exists
        appointment = await db.appointments.find_one({"_id": appointment_id})
        if not appointment:
            raise HTTPException(status_code=404, detail="Appointment not found")
        
        # Create session
        session_data = {
            "_id": str(uuid.uuid4()),
            "appointment_id": appointment_id,
            "doctor_id": doctor_id,
            "patient_id": patient_id,
            "session_type": session_type,
            "status": "waiting",
            "created_at": datetime.utcnow(),
            "started_at": None,
            "ended_at": None,
            "duration": 0,
            "recording_enabled": False,
            "recording_url": None,
            "chat_messages": [],
            "consultation_notes": "",
            "prescription_data": None,
            "connection_quality": "good",
            "participants": {
                "doctor": {
                    "peer_id": f"doctor-{appointment_id}",
                    "joined_at": None,
                    "left_at": None,
                    "connection_status": "disconnected"
                },
                "patient": {
                    "peer_id": f"patient-{appointment_id}",
                    "joined_at": None,
                    "left_at": None,
                    "connection_status": "disconnected"
                }
            }
        }
        
        await db.video_sessions.insert_one(session_data)
        
        return {
            "session_id": session_data["_id"],
            "doctor_peer_id": session_data["participants"]["doctor"]["peer_id"],
            "patient_peer_id": session_data["participants"]["patient"]["peer_id"],
            "status": "created"
        }
        
    except Exception as e:
        logger.error(f"Error creating video session: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/session/{session_id}/join", response_model=Dict[str, Any])
async def join_video_session(
    session_id: str,
    user_id: str,
    user_role: str,
    peer_id: str
):
    """Join a video consultation session"""
    try:
        db = await get_mongodb()
        
        session = await db.video_sessions.find_one({"_id": session_id})
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Update participant status
        participant_key = f"participants.{user_role}"
        update_data = {
            f"{participant_key}.joined_at": datetime.utcnow(),
            f"{participant_key}.connection_status": "connected",
            f"{participant_key}.peer_id": peer_id
        }
        
        # If this is the first participant, start the session
        if session["status"] == "waiting":
            update_data["status"] = "active"
            update_data["started_at"] = datetime.utcnow()
        
        await db.video_sessions.update_one(
            {"_id": session_id},
            {"$set": update_data}
        )
        
        # Get updated session
        updated_session = await db.video_sessions.find_one({"_id": session_id})
        
        return {
            "status": "joined",
            "session_status": updated_session["status"],
            "participants": updated_session["participants"],
            "started_at": updated_session.get("started_at")
        }
        
    except Exception as e:
        logger.error(f"Error joining video session: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/session/{session_id}/leave", response_model=Dict[str, Any])
async def leave_video_session(
    session_id: str,
    user_id: str,
    user_role: str
):
    """Leave a video consultation session"""
    try:
        db = await get_mongodb()
        
        session = await db.video_sessions.find_one({"_id": session_id})
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Update participant status
        participant_key = f"participants.{user_role}"
        update_data = {
            f"{participant_key}.left_at": datetime.utcnow(),
            f"{participant_key}.connection_status": "disconnected"
        }
        
        # Calculate session duration if ending
        if session["started_at"]:
            duration = (datetime.utcnow() - session["started_at"]).total_seconds()
            update_data["duration"] = duration
            update_data["ended_at"] = datetime.utcnow()
            update_data["status"] = "completed"
        
        await db.video_sessions.update_one(
            {"_id": session_id},
            {"$set": update_data}
        )
        
        return {
            "status": "left",
            "session_ended": session["started_at"] is not None,
            "duration": update_data.get("duration", 0)
        }
        
    except Exception as e:
        logger.error(f"Error leaving video session: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/session/{session_id}/chat", response_model=Dict[str, Any])
async def send_chat_message(
    session_id: str,
    sender_id: str,
    sender_role: str,
    message: str,
    message_type: str = "text"
):
    """Send a chat message during video consultation"""
    try:
        db = await get_mongodb()
        
        chat_message = {
            "id": str(uuid.uuid4()),
            "sender_id": sender_id,
            "sender_role": sender_role,
            "message": message,
            "type": message_type,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        await db.video_sessions.update_one(
            {"_id": session_id},
            {"$push": {"chat_messages": chat_message}}
        )
        
        return {
            "status": "sent",
            "message_id": chat_message["id"],
            "timestamp": chat_message["timestamp"]
        }
        
    except Exception as e:
        logger.error(f"Error sending chat message: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/session/{session_id}/chat", response_model=List[Dict[str, Any]])
async def get_chat_messages(session_id: str):
    """Get chat messages for a video session"""
    try:
        db = await get_mongodb()
        
        session = await db.video_sessions.find_one({"_id": session_id})
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        return session.get("chat_messages", [])
        
    except Exception as e:
        logger.error(f"Error getting chat messages: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/session/{session_id}/notes", response_model=Dict[str, Any])
async def save_consultation_notes(
    session_id: str,
    doctor_id: str,
    notes: str,
    prescription_data: Optional[Dict[str, Any]] = None
):
    """Save consultation notes and prescription"""
    try:
        db = await get_mongodb()
        
        update_data = {
            "consultation_notes": notes,
            "updated_at": datetime.utcnow()
        }
        
        if prescription_data:
            update_data["prescription_data"] = prescription_data
        
        await db.video_sessions.update_one(
            {"_id": session_id, "doctor_id": doctor_id},
            {"$set": update_data}
        )
        
        return {
            "status": "saved",
            "updated_at": update_data["updated_at"].isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error saving consultation notes: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/session/{session_id}/recording/start", response_model=Dict[str, Any])
async def start_recording(
    session_id: str,
    doctor_id: str
):
    """Start recording the video session"""
    try:
        db = await get_mongodb()
        
        # Verify doctor permission
        session = await db.video_sessions.find_one({
            "_id": session_id,
            "doctor_id": doctor_id
        })
        if not session:
            raise HTTPException(status_code=404, detail="Session not found or unauthorized")
        
        await db.video_sessions.update_one(
            {"_id": session_id},
            {
                "$set": {
                    "recording_enabled": True,
                    "recording_started_at": datetime.utcnow()
                }
            }
        )
        
        return {
            "status": "recording_started",
            "started_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error starting recording: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/session/{session_id}/recording/stop", response_model=Dict[str, Any])
async def stop_recording(
    session_id: str,
    doctor_id: str,
    recording_url: Optional[str] = None
):
    """Stop recording the video session"""
    try:
        db = await get_mongodb()
        
        update_data = {
            "recording_enabled": False,
            "recording_stopped_at": datetime.utcnow()
        }
        
        if recording_url:
            update_data["recording_url"] = recording_url
        
        await db.video_sessions.update_one(
            {"_id": session_id, "doctor_id": doctor_id},
            {"$set": update_data}
        )
        
        return {
            "status": "recording_stopped",
            "stopped_at": update_data["recording_stopped_at"].isoformat(),
            "recording_url": recording_url
        }
        
    except Exception as e:
        logger.error(f"Error stopping recording: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/session/{session_id}", response_model=Dict[str, Any])
async def get_session_details(session_id: str):
    """Get video session details"""
    try:
        db = await get_mongodb()
        
        session = await db.video_sessions.find_one({"_id": session_id})
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Convert datetime objects to ISO strings
        if session.get("created_at"):
            session["created_at"] = session["created_at"].isoformat()
        if session.get("started_at"):
            session["started_at"] = session["started_at"].isoformat()
        if session.get("ended_at"):
            session["ended_at"] = session["ended_at"].isoformat()
        
        return session
        
    except Exception as e:
        logger.error(f"Error getting session details: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sessions/user/{user_id}", response_model=List[Dict[str, Any]])
async def get_user_sessions(
    user_id: str,
    user_role: str,
    limit: int = 20,
    offset: int = 0
):
    """Get video sessions for a user"""
    try:
        db = await get_mongodb()
        
        query = {f"{user_role}_id": user_id}
        
        sessions = await db.video_sessions.find(query)\
            .sort("created_at", -1)\
            .skip(offset)\
            .limit(limit)\
            .to_list(length=None)
        
        # Format sessions
        formatted_sessions = []
        for session in sessions:
            if session.get("created_at"):
                session["created_at"] = session["created_at"].isoformat()
            if session.get("started_at"):
                session["started_at"] = session["started_at"].isoformat()
            if session.get("ended_at"):
                session["ended_at"] = session["ended_at"].isoformat()
            
            formatted_sessions.append(session)
        
        return formatted_sessions
        
    except Exception as e:
        logger.error(f"Error getting user sessions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def get_video_consultation_status():
    """Get video consultation system status"""
    return {
        "message": "Video Consultation System Active",
        "features": [
            "WebRTC Video Calls",
            "Real-time Chat",
            "Screen Sharing",
            "Session Recording",
            "Consultation Notes",
            "Connection Quality Monitoring"
        ],
        "status": "operational"
    }
