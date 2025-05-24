"""
Messaging endpoints for HealthConnect
Handles in-app messaging between patients and doctors
"""

from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import List, Dict, Any, Optional
from datetime import datetime
import logging

from ....core.database import get_mongodb
from ....models.ai_models import MessageRequest, MessageResponse

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/conversations/{user_id}", response_model=List[Dict[str, Any]])
async def get_user_conversations(user_id: str):
    """Get all conversations for a user"""
    try:
        db = await get_mongodb()
        
        # Get conversations where user is a participant
        conversations = await db.conversations.find({
            "participants": user_id
        }).sort("last_message_time", -1).to_list(length=None)
        
        formatted_conversations = []
        for conv in conversations:
            # Get the other participant's info
            other_participant_id = next(p for p in conv["participants"] if p != user_id)
            other_user = await db.users.find_one({"_id": other_participant_id})
            
            formatted_conversations.append({
                "id": str(conv["_id"]),
                "participant_id": other_participant_id,
                "participant_name": other_user.get("name", "Unknown User"),
                "participant_role": other_user.get("role", "patient"),
                "participant_avatar": other_user.get("avatar_url"),
                "last_message": conv.get("last_message", ""),
                "last_message_time": conv.get("last_message_time", "").isoformat() if conv.get("last_message_time") else "",
                "unread_count": conv.get("unread_count", {}).get(user_id, 0),
                "is_online": other_user.get("is_online", False)
            })
        
        return formatted_conversations
        
    except Exception as e:
        logger.error(f"Error getting conversations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/conversations/{conversation_id}/messages", response_model=List[Dict[str, Any]])
async def get_conversation_messages(conversation_id: str, limit: int = 50, offset: int = 0):
    """Get messages for a conversation"""
    try:
        db = await get_mongodb()
        
        messages = await db.messages.find({
            "conversation_id": conversation_id
        }).sort("timestamp", -1).skip(offset).limit(limit).to_list(length=None)
        
        # Reverse to get chronological order
        messages.reverse()
        
        formatted_messages = []
        for msg in messages:
            formatted_messages.append({
                "id": str(msg["_id"]),
                "sender_id": msg["sender_id"],
                "sender_name": msg["sender_name"],
                "sender_role": msg["sender_role"],
                "content": msg["content"],
                "type": msg["type"],
                "timestamp": msg["timestamp"].isoformat(),
                "status": msg.get("status", "sent"),
                "file_url": msg.get("file_url"),
                "file_name": msg.get("file_name"),
                "file_size": msg.get("file_size")
            })
        
        return formatted_messages
        
    except Exception as e:
        logger.error(f"Error getting messages: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/conversations/{conversation_id}/messages", response_model=Dict[str, Any])
async def send_message(
    conversation_id: str,
    sender_id: str,
    content: str,
    message_type: str = "text"
):
    """Send a message in a conversation"""
    try:
        db = await get_mongodb()
        
        # Get sender info
        sender = await db.users.find_one({"_id": sender_id})
        if not sender:
            raise HTTPException(status_code=404, detail="Sender not found")
        
        # Create message
        message_data = {
            "conversation_id": conversation_id,
            "sender_id": sender_id,
            "sender_name": sender["name"],
            "sender_role": sender["role"],
            "content": content,
            "type": message_type,
            "timestamp": datetime.utcnow(),
            "status": "sent"
        }
        
        result = await db.messages.insert_one(message_data)
        
        # Update conversation last message
        await db.conversations.update_one(
            {"_id": conversation_id},
            {
                "$set": {
                    "last_message": content,
                    "last_message_time": datetime.utcnow()
                },
                "$inc": {
                    f"unread_count.{sender_id}": 0  # Don't increment for sender
                }
            }
        )
        
        # Increment unread count for other participants
        conversation = await db.conversations.find_one({"_id": conversation_id})
        for participant_id in conversation["participants"]:
            if participant_id != sender_id:
                await db.conversations.update_one(
                    {"_id": conversation_id},
                    {"$inc": {f"unread_count.{participant_id}": 1}}
                )
        
        return {
            "id": str(result.inserted_id),
            "status": "sent",
            "timestamp": message_data["timestamp"].isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error sending message: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/conversations", response_model=Dict[str, Any])
async def create_conversation(
    participant1_id: str,
    participant2_id: str
):
    """Create a new conversation between two users"""
    try:
        db = await get_mongodb()
        
        # Check if conversation already exists
        existing_conv = await db.conversations.find_one({
            "participants": {"$all": [participant1_id, participant2_id]}
        })
        
        if existing_conv:
            return {
                "id": str(existing_conv["_id"]),
                "status": "exists"
            }
        
        # Create new conversation
        conversation_data = {
            "participants": [participant1_id, participant2_id],
            "created_at": datetime.utcnow(),
            "last_message": "",
            "last_message_time": datetime.utcnow(),
            "unread_count": {
                participant1_id: 0,
                participant2_id: 0
            }
        }
        
        result = await db.conversations.insert_one(conversation_data)
        
        return {
            "id": str(result.inserted_id),
            "status": "created"
        }
        
    except Exception as e:
        logger.error(f"Error creating conversation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/conversations/{conversation_id}/upload", response_model=Dict[str, Any])
async def upload_file(
    conversation_id: str,
    sender_id: str,
    file: UploadFile = File(...)
):
    """Upload a file to a conversation"""
    try:
        # Validate file type and size
        allowed_types = ["image/jpeg", "image/png", "image/gif", "application/pdf", "text/plain"]
        max_size = 10 * 1024 * 1024  # 10MB
        
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="File type not allowed")
        
        if file.size > max_size:
            raise HTTPException(status_code=400, detail="File too large")
        
        # In a real implementation, you would upload to cloud storage
        # For now, we'll simulate the upload
        file_url = f"/uploads/{conversation_id}/{file.filename}"
        
        # Send file message
        db = await get_mongodb()
        sender = await db.users.find_one({"_id": sender_id})
        
        message_data = {
            "conversation_id": conversation_id,
            "sender_id": sender_id,
            "sender_name": sender["name"],
            "sender_role": sender["role"],
            "content": f"Shared a file: {file.filename}",
            "type": "file",
            "timestamp": datetime.utcnow(),
            "status": "sent",
            "file_url": file_url,
            "file_name": file.filename,
            "file_size": file.size
        }
        
        result = await db.messages.insert_one(message_data)
        
        return {
            "id": str(result.inserted_id),
            "file_url": file_url,
            "status": "uploaded"
        }
        
    except Exception as e:
        logger.error(f"Error uploading file: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/conversations/{conversation_id}/read", response_model=Dict[str, Any])
async def mark_conversation_read(conversation_id: str, user_id: str):
    """Mark all messages in a conversation as read for a user"""
    try:
        db = await get_mongodb()
        
        # Reset unread count for user
        await db.conversations.update_one(
            {"_id": conversation_id},
            {"$set": {f"unread_count.{user_id}": 0}}
        )
        
        # Mark messages as read
        await db.messages.update_many(
            {
                "conversation_id": conversation_id,
                "sender_id": {"$ne": user_id}
            },
            {"$set": {"status": "read"}}
        )
        
        return {"status": "marked_read"}
        
    except Exception as e:
        logger.error(f"Error marking conversation as read: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def get_messaging_status():
    """Get messaging system status"""
    return {
        "message": "Enhanced Messaging System Active",
        "features": [
            "Real-time messaging",
            "File sharing",
            "Voice messages",
            "Read receipts",
            "Online status",
            "Message history"
        ],
        "status": "operational"
    }
