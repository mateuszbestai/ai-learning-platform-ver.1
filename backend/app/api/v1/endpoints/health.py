from fastapi import APIRouter
from typing import Dict, Any
from datetime import datetime
from app.core.config import settings

router = APIRouter()

@router.get("/")
async def health_check() -> Dict[str, Any]:
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }

@router.get("/ready")
async def readiness_check() -> Dict[str, Any]:
    """Readiness check endpoint"""
    # Add checks for external dependencies
    checks = {
        "api": True,
        "azure_openai": bool(settings.AZURE_OPENAI_API_KEY),
        "database": False,  # Would check DB connection
        "redis": False,  # Would check Redis connection
    }
    
    all_ready = all(checks.values())
    
    return {
        "ready": all_ready,
        "checks": checks,
        "timestamp": datetime.utcnow().isoformat()
    }