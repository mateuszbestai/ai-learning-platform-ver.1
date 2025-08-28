from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class ExerciseSubmission(BaseModel):
    """Exercise submission model"""
    exercise_id: str
    solution: str
    language: Optional[str] = "python"
    time_taken_minutes: int

class ExerciseResult(BaseModel):
    """Exercise result model"""
    exercise_id: str
    passed: bool
    test_results: List[Dict[str, Any]]
    feedback: str
    points_earned: int
    submitted_at: datetime

class ExerciseResponse(BaseModel):
    """Exercise response model"""
    id: str
    title: str
    description: str
    type: str
    difficulty: str
    instructions: List[str]
    starter_code: Optional[str] = None
    test_cases: Optional[List[Dict[str, Any]]] = None
    hints: Optional[List[str]] = None
    estimated_time_minutes: int
    points: int
    sandbox_url: Optional[str] = None