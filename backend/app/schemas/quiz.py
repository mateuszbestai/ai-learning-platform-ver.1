from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class QuizSubmission(BaseModel):
    """Quiz submission model"""
    quiz_id: str
    answers: Dict[str, Any]  # question_id -> answer
    time_taken_minutes: int

class QuizResult(BaseModel):
    """Quiz result model"""
    quiz_id: str
    score: float
    passed: bool
    correct_answers: int
    total_questions: int
    feedback: Dict[str, str]  # question_id -> feedback
    points_earned: int
    submitted_at: datetime

class QuizResponse(BaseModel):
    """Quiz response model"""
    id: str
    title: str
    description: str
    questions: List[Dict[str, Any]]
    time_limit_minutes: int
    passing_score: int
    max_attempts: int
    attempts_remaining: int