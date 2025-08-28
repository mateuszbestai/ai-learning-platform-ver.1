# backend/app/api/v1/endpoints/learning_path.py
from fastapi import APIRouter, HTTPException, Depends, Query, Body
from typing import List, Optional, Dict, Any
from datetime import datetime
import logging

from app.schemas.learning_path import (
    LearningPathRequest,
    LearningPathResponse,
    LearningPathCreate,
    LearningPathProgress,
    PathNode,
    Exercise,
    Quiz,
)
from app.services.learning_path_service import LearningPathService
from app.services.ai_service import AIService
from app.core.exceptions import CustomException

router = APIRouter()
logger = logging.getLogger(__name__)

# Initialize services
learning_path_service = LearningPathService()
ai_service = AIService()

@router.post("/generate", response_model=LearningPathResponse)
async def generate_learning_path(
    request: LearningPathRequest = Body(..., example={
        "prompt": "I want to prepare for Azure AI Engineer certification in 3 months",
        "user_level": "intermediate",
        "time_commitment": "2 hours per day",
        "preferences": {
            "learning_style": "hands-on",
            "include_labs": True,
            "include_quizzes": True
        }
    })
) -> LearningPathResponse:
    """
    Generate a personalized learning path based on user input.
    
    This endpoint uses AI to create a comprehensive learning plan including:
    - Structured modules and topics
    - Exercises and hands-on labs
    - Quizzes for knowledge validation
    - Resource recommendations
    - Time estimates
    """
    try:
        logger.info(f"Generating learning path for prompt: {request.prompt}")
        
        # Generate learning path using AI service
        ai_response = await ai_service.generate_learning_path(
            prompt=request.prompt,
            user_level=request.user_level,
            time_commitment=request.time_commitment,
            preferences=request.preferences,
        )
        
        # Process and structure the response
        learning_path = learning_path_service.process_ai_response(ai_response)
        
        # Add metadata
        learning_path.metadata = {
            "generated_at": datetime.utcnow().isoformat(),
            "estimated_duration": learning_path_service.calculate_duration(learning_path),
            "difficulty_level": request.user_level,
            "certification": learning_path_service.extract_certification(request.prompt),
        }
        
        logger.info(f"Successfully generated learning path with {len(learning_path.nodes)} nodes")
        
        return learning_path
        
    except CustomException as e:
        logger.error(f"Custom error generating learning path: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"Unexpected error generating learning path: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate learning path: {str(e)}"
        )

@router.get("/mock", response_model=LearningPathResponse)
async def get_mock_learning_path(
    certification: str = Query(
        "azure-ai-engineer",
        description="Certification type",
        example="azure-ai-engineer"
    )
) -> LearningPathResponse:
    """
    Get a mock learning path for testing purposes.
    This endpoint returns a pre-defined learning path without AI generation.
    """
    try:
        # Return mock data for testing
        mock_path = LearningPathResponse(
            id="path_123456",
            title=f"Complete {certification.replace('-', ' ').title()} Learning Path",
            description="A comprehensive learning path to master cloud certification",
            total_duration_hours=120,
            nodes=[
                PathNode(
                    id="node_1",
                    title="Foundation: Cloud Computing Basics",
                    description="Understanding core cloud concepts and services",
                    order=1,
                    duration_hours=20,
                    type="module",
                    status="not_started",
                    resources=[
                        {
                            "title": "Introduction to Cloud Computing",
                            "type": "video",
                            "url": "https://learn.microsoft.com/azure-fundamentals",
                            "duration_minutes": 45
                        },
                        {
                            "title": "Cloud Service Models",
                            "type": "article",
                            "url": "https://docs.microsoft.com/cloud-models",
                            "duration_minutes": 30
                        }
                    ],
                    exercises=[
                        Exercise(
                            id="ex_1",
                            title="Deploy Your First Virtual Machine",
                            description="Learn to deploy and configure a VM in the cloud",
                            type="hands-on",
                            difficulty="beginner",
                            estimated_time_minutes=60,
                            points=100,
                            instructions=[
                                "Access the Azure Portal",
                                "Navigate to Virtual Machines",
                                "Create a new VM with specified configurations",
                                "Connect to the VM via SSH/RDP",
                                "Install a web server"
                            ],
                            sandbox_url="https://portal.azure.com/sandbox"
                        )
                    ],
                    quiz=Quiz(
                        id="quiz_1",
                        title="Cloud Fundamentals Assessment",
                        description="Test your understanding of cloud basics",
                        questions=[
                            {
                                "id": "q1",
                                "question": "What is the primary benefit of cloud computing?",
                                "type": "multiple_choice",
                                "options": [
                                    "Reduced capital expenditure",
                                    "Unlimited storage",
                                    "No maintenance required",
                                    "Free services"
                                ],
                                "correct_answer": 0,
                                "explanation": "Cloud computing primarily reduces capital expenditure by converting it to operational expenditure.",
                                "points": 10
                            },
                            {
                                "id": "q2",
                                "question": "Which of the following are cloud service models? (Select all that apply)",
                                "type": "multiple_select",
                                "options": [
                                    "IaaS",
                                    "PaaS",
                                    "SaaS",
                                    "XaaS"
                                ],
                                "correct_answers": [0, 1, 2],
                                "explanation": "IaaS, PaaS, and SaaS are the three main cloud service models.",
                                "points": 15
                            }
                        ],
                        passing_score=70,
                        time_limit_minutes=30
                    )
                ),
                PathNode(
                    id="node_2",
                    title="Azure AI Services Deep Dive",
                    description="Master Azure AI and Machine Learning services",
                    order=2,
                    duration_hours=40,
                    type="module",
                    status="not_started",
                    prerequisites=["node_1"],
                    resources=[
                        {
                            "title": "Azure Cognitive Services Overview",
                            "type": "documentation",
                            "url": "https://docs.microsoft.com/azure/cognitive-services",
                            "duration_minutes": 60
                        }
                    ],
                    exercises=[
                        Exercise(
                            id="ex_2",
                            title="Build a Text Analytics Solution",
                            description="Implement sentiment analysis using Azure Cognitive Services",
                            type="project",
                            difficulty="intermediate",
                            estimated_time_minutes=120,
                            points=200,
                            instructions=[
                                "Set up Azure Cognitive Services",
                                "Create a Text Analytics resource",
                                "Implement sentiment analysis API",
                                "Build a simple web interface",
                                "Test with sample data"
                            ]
                        )
                    ]
                ),
                PathNode(
                    id="node_3",
                    title="Hands-on Projects & Real-world Scenarios",
                    description="Apply your knowledge with practical projects",
                    order=3,
                    duration_hours=30,
                    type="project",
                    status="not_started",
                    prerequisites=["node_1", "node_2"],
                    exercises=[
                        Exercise(
                            id="ex_3",
                            title="End-to-End AI Solution",
                            description="Build a complete AI-powered application",
                            type="capstone",
                            difficulty="advanced",
                            estimated_time_minutes=480,
                            points=500,
                            instructions=[
                                "Design the solution architecture",
                                "Implement data ingestion pipeline",
                                "Train and deploy ML models",
                                "Create API endpoints",
                                "Build user interface",
                                "Deploy to production"
                            ]
                        )
                    ]
                ),
                PathNode(
                    id="node_4",
                    title="Certification Preparation",
                    description="Final preparation and practice exams",
                    order=4,
                    duration_hours=30,
                    type="assessment",
                    status="not_started",
                    prerequisites=["node_3"],
                    resources=[
                        {
                            "title": "Exam Guide and Requirements",
                            "type": "pdf",
                            "url": "https://learn.microsoft.com/certifications/exam-guide",
                            "duration_minutes": 30
                        },
                        {
                            "title": "Practice Exam Platform",
                            "type": "external",
                            "url": "https://measureup.com/microsoft-practice-tests",
                            "duration_minutes": 180
                        }
                    ],
                    quiz=Quiz(
                        id="quiz_final",
                        title="Certification Practice Exam",
                        description="Full-length practice exam simulating the real certification",
                        questions=[],  # Would contain many more questions
                        passing_score=700,
                        time_limit_minutes=180
                    )
                )
            ],
            metadata={
                "generated_at": datetime.utcnow().isoformat(),
                "estimated_duration": "3 months",
                "difficulty_level": "intermediate",
                "certification": certification,
                "tags": ["azure", "ai", "machine-learning", "cloud", "certification"],
                "recommended_pace": "2 hours per day, 5 days a week"
            },
            progress=LearningPathProgress(
                completed_nodes=[],
                current_node_id="node_1",
                overall_progress=0,
                total_points_earned=0,
                badges_earned=[],
                last_activity=datetime.utcnow().isoformat()
            )
        )
        
        return mock_path
        
    except Exception as e:
        logger.error(f"Error getting mock learning path: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get mock learning path: {str(e)}"
        )

@router.get("/{path_id}", response_model=LearningPathResponse)
async def get_learning_path(path_id: str) -> LearningPathResponse:
    """
    Retrieve a specific learning path by ID.
    """
    try:
        # For now, return mock data
        # In production, this would fetch from database
        return await get_mock_learning_path()
        
    except Exception as e:
        logger.error(f"Error retrieving learning path {path_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=404,
            detail=f"Learning path {path_id} not found"
        )

@router.post("/{path_id}/progress")
async def update_progress(
    path_id: str,
    node_id: str = Body(..., embed=True),
    status: str = Body(..., embed=True),
    points_earned: Optional[int] = Body(0, embed=True)
) -> Dict[str, Any]:
    """
    Update progress for a specific node in the learning path.
    """
    try:
        # In production, this would update the database
        return {
            "path_id": path_id,
            "node_id": node_id,
            "status": status,
            "points_earned": points_earned,
            "updated_at": datetime.utcnow().isoformat(),
            "message": "Progress updated successfully"
        }
        
    except Exception as e:
        logger.error(f"Error updating progress: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update progress: {str(e)}"
        )