"""
Authentication endpoints
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int

@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    """Login endpoint - integrates with Next.js auth"""
    # This will integrate with your Next.js authentication
    return TokenResponse(
        access_token="mock_token",
        expires_in=3600
    )

@router.post("/verify")
async def verify_token(token: str):
    """Verify JWT token from Next.js"""
    # Verify token logic here
    return {"valid": True, "user_id": "mock_user"}
