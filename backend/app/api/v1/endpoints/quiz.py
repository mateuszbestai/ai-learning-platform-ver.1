from fastapi import APIRouter, HTTPException
from typing import Dict, Any

router = APIRouter()

@router.get("/{quiz_id}")
async def get_quiz(quiz_id: str) -> Dict[str, Any]:
    """Get quiz by ID"""
    return {
        "id": quiz_id,
        "title": "Sample Quiz",
        "questions": [],
        "time_limit_minutes": 30
    }

@router.post("/{quiz_id}/submit")
async def submit_quiz(quiz_id: str, submission: Dict[str, Any]) -> Dict[str, Any]:
    """Submit quiz answers"""
    return {
        "quiz_id": quiz_id,
        "score": 85,
        "passed": True,
        "feedback": "Great job!"
    }