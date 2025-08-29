# backend/app/api/v1/endpoints/exercise.py
from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any
import logging

from app.services.ai_service import AIService
from app.schemas.exercise import ExerciseSubmission

router = APIRouter()
logger = logging.getLogger(__name__)
ai_service = AIService()

# Helper function to get exercise by ID
async def get_exercise_by_id(exercise_id: str) -> Dict[str, Any]:
    """Get exercise by ID - mock implementation"""
    # In production, fetch from database
    # For now, return mock data
    return {
        "id": exercise_id,
        "title": "Sample Exercise",
        "description": "A practice exercise",
        "type": "coding",
        "difficulty": "intermediate",
        "points": 100,
        "problem_statement": "Solve this problem",
        "test_cases": [
            {"input": "test1", "expected_output": "result1"}
        ],
        "starter_code": "# Write your solution here\ndef solution():\n    pass",
        "hints": [
            "Think about the problem step by step",
            "Consider edge cases",
            "Optimize your solution"
        ]
    }

@router.get("/{exercise_id}")
async def get_exercise(exercise_id: str):
    """Get exercise by ID"""
    try:
        exercise = await get_exercise_by_id(exercise_id)
        return exercise
    except Exception as e:
        logger.error(f"Error getting exercise {exercise_id}: {str(e)}")
        raise HTTPException(status_code=404, detail="Exercise not found")

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

@router.post("/{exercise_id}/submit")
async def submit_exercise(
    exercise_id: str,
    submission: ExerciseSubmission
):
    """Submit exercise for evaluation"""
    try:
        # Get exercise details
        exercise = await get_exercise_by_id(exercise_id)
        
        # For now, return mock evaluation
        # In production, this would run actual tests
        return {
            "exercise_id": exercise_id,
            "passed": True,
            "test_results": [
                {
                    "name": "Test 1",
                    "passed": True,
                    "feedback": "Correct solution"
                }
            ],
            "feedback": "Great work! All tests passed.",
            "points_earned": exercise.get("points", 100)
        }
        
    except Exception as e:
        logger.error(f"Error submitting exercise: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{exercise_id}/test")
async def run_tests(
    exercise_id: str,
    code: str = Body(...)
):
    """Run tests on submitted code"""
    try:
        exercise = await get_exercise_by_id(exercise_id)
        
        # Mock test results
        # In production, this would run actual tests in a sandboxed environment
        return {
            "test_results": [
                {
                    "name": "Test 1",
                    "passed": True,
                    "input": "test input",
                    "expected": "expected output",
                    "actual": "actual output"
                }
            ],
            "all_passed": True,
            "passed_count": 1,
            "total_count": 1
        }
        
    except Exception as e:
        logger.error(f"Error running tests: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))