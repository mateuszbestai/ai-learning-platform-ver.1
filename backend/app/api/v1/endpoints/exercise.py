from fastapi import APIRouter, HTTPException
from typing import Dict, Any

router = APIRouter()

@router.get("/{exercise_id}")
async def get_exercise(exercise_id: str) -> Dict[str, Any]:
    """Get exercise by ID"""
    return {
        "id": exercise_id,
        "title": "Sample Exercise",
        "instructions": [],
        "estimated_time_minutes": 45
    }

@router.post("/{exercise_id}/submit")
async def submit_exercise(exercise_id: str, submission: Dict[str, Any]) -> Dict[str, Any]:
    """Submit exercise solution"""
    return {
        "exercise_id": exercise_id,
        "passed": True,
        "points_earned": 100,
        "feedback": "Excellent work!"
    }