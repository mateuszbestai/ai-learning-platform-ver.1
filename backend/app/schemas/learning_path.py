from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any, Literal
from datetime import datetime

class Resource(BaseModel):
    """Learning resource model"""
    title: str
    type: Literal["video", "article", "documentation", "pdf", "external"]
    url: str
    duration_minutes: int
    is_required: bool = True

class QuizQuestion(BaseModel):
    """Quiz question model"""
    id: str
    question: str
    type: Literal["multiple_choice", "multiple_select", "true_false"]
    options: List[str]
    correct_answer: Optional[int] = None  # For single choice
    correct_answers: Optional[List[int]] = None  # For multiple select
    explanation: str
    points: int = 10

class Quiz(BaseModel):
    """Quiz model"""
    id: str
    title: str
    description: str
    questions: List[QuizQuestion]
    passing_score: int = 70
    time_limit_minutes: int
    max_attempts: int = 3

class Exercise(BaseModel):
    """Exercise model"""
    id: str
    title: str
    description: str
    type: Literal["hands-on", "project", "code", "capstone"]
    difficulty: Literal["beginner", "intermediate", "advanced"]
    estimated_time_minutes: int
    points: int
    instructions: List[str]
    sandbox_url: Optional[str] = None
    starter_code: Optional[str] = None
    test_cases: Optional[List[Dict[str, Any]]] = None
    hints: Optional[List[str]] = None

class PathNode(BaseModel):
    """Learning path node model"""
    id: str
    title: str
    description: str
    order: int
    duration_hours: int
    type: Literal["module", "project", "assessment", "milestone"]
    status: Literal["not_started", "in_progress", "completed", "locked"] = "not_started"
    prerequisites: Optional[List[str]] = None
    topics: Optional[List[str]] = None
    resources: Optional[List[Resource]] = None
    exercises: Optional[List[Exercise]] = None
    quiz: Optional[Quiz] = None
    completion_criteria: Optional[Dict[str, Any]] = None

class LearningPathProgress(BaseModel):
    """Progress tracking model"""
    completed_nodes: List[str] = []
    current_node_id: Optional[str] = None
    overall_progress: float = 0.0
    total_points_earned: int = 0
    badges_earned: List[str] = []
    last_activity: str
    time_spent_hours: float = 0.0

class LearningPathRequest(BaseModel):
    """Request model for generating learning path"""
    prompt: str = Field(..., min_length=10, max_length=500)
    user_level: Literal["beginner", "intermediate", "advanced"] = "beginner"
    time_commitment: str = "2 hours per day"
    preferences: Optional[Dict[str, Any]] = None
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "prompt": "I want to prepare for Azure AI Engineer certification in 3 months",
                "user_level": "intermediate",
                "time_commitment": "2 hours per day",
                "preferences": {
                    "learning_style": "hands-on",
                    "include_labs": True,
                    "include_quizzes": True
                }
            }
        }
    )

class LearningPathCreate(BaseModel):
    """Model for creating a learning path"""
    title: str
    description: str
    total_duration_hours: int
    difficulty_level: str
    certification_target: Optional[str] = None
    tags: Optional[List[str]] = None

class LearningPathResponse(BaseModel):
    """Response model for learning path"""
    id: str
    title: str
    description: str
    total_duration_hours: int
    nodes: List[PathNode]
    metadata: Optional[Dict[str, Any]] = None
    progress: Optional[LearningPathProgress] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)