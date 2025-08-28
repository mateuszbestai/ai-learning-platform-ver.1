from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Security scheme for future authentication
security = HTTPBearer(auto_error=False)

def get_db() -> Generator:
    """
    Database dependency - for future use when DB is implemented
    """
    # When database is implemented:
    # try:
    #     db = SessionLocal()
    #     yield db
    # finally:
    #     db.close()
    pass

def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[dict]:
    """
    Get current user from JWT token - for future use
    """
    # For now, return a mock user
    # In production, decode JWT and get user from database
    if credentials:
        # Validate token and return user
        return {"id": "user_123", "email": "user@example.com"}
    return None

def require_user(
    current_user: Optional[dict] = Depends(get_current_user)
) -> dict:
    """
    Require authenticated user
    """
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    return current_user