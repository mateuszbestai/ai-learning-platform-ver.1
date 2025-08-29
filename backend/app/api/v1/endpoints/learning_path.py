# backend/app/api/v1/endpoints/learning_path.py
from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any
import logging

from app.services.ai_service import AIService
from app.services.learning_path_service import LearningPathService
from app.schemas.learning_path import LearningPathRequest

router = APIRouter()
logger = logging.getLogger(__name__)

ai_service = AIService()
learning_service = LearningPathService()

@router.post("/generate")
async def generate_learning_path(request: LearningPathRequest):
    """Generate AI-powered personalized learning path"""
    try:
        # Generate complete learning path with AI
        learning_path = await ai_service.generate_learning_path(
            prompt=request.prompt,
            user_level=request.user_level,
            time_commitment=request.time_commitment,
            preferences=request.preferences
        )
        
        # Save to database (when implemented)
        saved_path = await learning_service.save_learning_path(learning_path)
        
        # Return the raw dictionary response (not validated by Pydantic)
        return saved_path
        
    except Exception as e:
        logger.error(f"Error generating learning path: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/mock")
async def get_mock_learning_path():
    """Get a mock learning path for testing"""
    try:
        return await learning_service.get_by_id("mock")
    except Exception as e:
        logger.error(f"Error getting mock learning path: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{path_id}")
async def get_learning_path(path_id: str):
    """Get learning path by ID"""
    try:
        learning_path = await learning_service.get_by_id(path_id)
        return learning_path
    except Exception as e:
        logger.error(f"Error fetching learning path {path_id}: {str(e)}")
        raise HTTPException(status_code=404, detail="Learning path not found")

@router.get("/{path_id}/content/{node_id}")
async def get_node_content(path_id: str, node_id: str):
    """Get AI-generated content for a specific node"""
    try:
        # Fetch the learning path
        learning_path = await learning_service.get_by_id(path_id)
        
        # Find the specific node
        node = next((n for n in learning_path["nodes"] if n["id"] == node_id), None)
        if not node:
            raise HTTPException(status_code=404, detail="Node not found")
        
        # Return the AI-generated content
        return {
            "node_id": node_id,
            "content": node.get("content", {}),
            "exercises": node.get("exercises", []),
            "quiz": node.get("quiz")
        }
        
    except Exception as e:
        logger.error(f"Error fetching node content: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{path_id}/explain")
async def explain_concept(
    path_id: str,
    concept: str = Body(...),
    context: str = Body(None)
):
    """Get AI explanation for a concept within the learning path"""
    try:
        explanation = await ai_service.explain_concept(
            concept=concept,
            context=context
        )
        return explanation
        
    except Exception as e:
        logger.error(f"Error explaining concept: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{path_id}/progress")
async def update_progress(
    path_id: str,
    node_id: str = Body(...),
    status: str = Body(...),
    points_earned: int = Body(0)
):
    """Update learning path progress"""
    try:
        # In production, this would update the database
        # For now, return success
        return {
            "success": True,
            "path_id": path_id,
            "node_id": node_id,
            "status": status,
            "points_earned": points_earned
        }
    except Exception as e:
        logger.error(f"Error updating progress: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))