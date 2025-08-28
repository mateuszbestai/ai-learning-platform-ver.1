from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any
import logging

from app.services.ai_service import AIService
from app.schemas.exercise import ExerciseSubmission

router = APIRouter()
logger = logging.getLogger(__name__)
ai_service = AIService()

@router.post("/generate")
async def generate_exercise(
    topic: str = Body(...),
    exercise_type: str = Body("coding"),
    difficulty: str = Body("intermediate")
):
    """Generate a new exercise with AI"""
    try:
        exercise = await ai_service.generate_exercise_content(
            topic=topic,
            exercise_type=exercise_type,
            difficulty=difficulty
        )
        return exercise
        
    except Exception as e:
        logger.error(f"Error generating exercise: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{exercise_id}/evaluate")
async def evaluate_submission(
    exercise_id: str,
    submission: ExerciseSubmission
):
    """AI evaluation of exercise submission"""
    try:
        # Get exercise details
        exercise = await get_exercise_by_id(exercise_id)
        
        # AI evaluation
        evaluation = await ai_service.evaluate_exercise_submission(
            exercise=exercise,
            submission=submission.solution,
            language=submission.language
        )
        
        return evaluation
        
    except Exception as e:
        logger.error(f"Error evaluating submission: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{exercise_id}/hint")
async def get_hint(
    exercise_id: str,
    current_code: str = Body(...),
    hint_level: int = Body(1)
):
    """Get AI-generated hint for exercise"""
    try:
        exercise = await get_exercise_by_id(exercise_id)
        
        hint = await ai_service.provide_hint(
            exercise=exercise,
            current_code=current_code,
            hint_level=hint_level
        )
        
        return {"hint": hint, "level": hint_level}
        
    except Exception as e:
        logger.error(f"Error generating hint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))