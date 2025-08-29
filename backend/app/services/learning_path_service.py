# backend/app/services/learning_path_service.py
import logging
from typing import Dict, Any
from datetime import datetime
import json

logger = logging.getLogger(__name__)

class LearningPathService:
    """Service for managing learning paths"""
    
    def __init__(self):
        """Initialize the service"""
        # In production, this would connect to a database
        self.storage = {}
    
    async def save_learning_path(self, learning_path: Dict[str, Any]) -> Dict[str, Any]:
        """Save learning path to storage"""
        try:
            # In production, save to database
            # For now, store in memory
            path_id = learning_path.get('id')
            if path_id:
                self.storage[path_id] = learning_path
                logger.info(f"Saved learning path: {path_id}")
            
            return learning_path
        except Exception as e:
            logger.error(f"Error saving learning path: {str(e)}")
            return learning_path
    
    async def get_by_id(self, path_id: str) -> Dict[str, Any]:
        """Get learning path by ID"""
        try:
            # In production, fetch from database
            # For now, return from memory or mock
            if path_id in self.storage:
                return self.storage[path_id]
            
            # Return mock data if not found
            return self._get_mock_learning_path(path_id)
        except Exception as e:
            logger.error(f"Error getting learning path {path_id}: {str(e)}")
            return self._get_mock_learning_path(path_id)
    
    def process_ai_response(self, ai_response: Dict[str, Any]) -> Dict[str, Any]:
        """Process and structure AI response"""
        # Add any processing logic here
        # Ensure proper structure
        if 'nodes' not in ai_response:
            ai_response['nodes'] = []
        
        if 'metadata' not in ai_response:
            ai_response['metadata'] = {}
            
        return ai_response
    
    def calculate_duration(self, learning_path: Dict[str, Any]) -> str:
        """Calculate total duration of learning path"""
        total_hours = learning_path.get('total_duration_hours', 0)
        
        if total_hours < 40:
            return f"{total_hours} hours"
        
        weeks = total_hours // 40
        remaining_hours = total_hours % 40
        
        if remaining_hours > 0:
            return f"{weeks} weeks, {remaining_hours} hours"
        return f"{weeks} weeks"
    
    def extract_certification(self, prompt: str) -> str:
        """Extract certification name from prompt"""
        # Simple extraction logic
        certifications = [
            'Azure AI Engineer',
            'Azure Solutions Architect',
            'AWS Solutions Architect',
            'AWS Developer',
            'Google Cloud Professional',
            'Kubernetes Administrator',
            'DevOps Engineer'
        ]
        
        prompt_lower = prompt.lower()
        for cert in certifications:
            if cert.lower() in prompt_lower:
                return cert
        
        return "Cloud Professional"
    
    def _get_mock_learning_path(self, path_id: str) -> Dict[str, Any]:
        """Return mock learning path data"""
        return {
            "id": path_id,
            "title": "Azure AI Engineer Learning Path",
            "description": "Master Azure AI services and machine learning to become a certified Azure AI Engineer",
            "total_duration_hours": 120,
            "difficulty_level": "intermediate",
            "certification_target": "Azure AI Engineer",
            "nodes": [
                {
                    "id": "node_001",
                    "title": "Cloud Computing Fundamentals",
                    "description": "Understand core cloud computing concepts and Azure basics",
                    "order": 1,
                    "duration_hours": 20,
                    "type": "module",
                    "status": "not_started",
                    "topics": [
                        "Cloud Computing Models",
                        "Azure Architecture",
                        "Core Azure Services"
                    ],
                    "learning_objectives": [
                        "Understand IaaS, PaaS, and SaaS",
                        "Navigate Azure Portal",
                        "Deploy basic resources"
                    ],
                    "resources": [],
                    "exercises": [
                        {
                            "id": "ex_001",
                            "title": "Deploy Your First VM",
                            "description": "Create and configure a virtual machine in Azure",
                            "type": "hands-on",
                            "difficulty": "beginner",
                            "estimated_time_minutes": 45,
                            "points": 100
                        }
                    ],
                    "quiz": {
                        "id": "quiz_001",
                        "title": "Cloud Fundamentals Assessment",
                        "description": "Test your understanding of cloud computing basics",
                        "questions": [],
                        "passing_score": 70,
                        "time_limit_minutes": 30
                    }
                },
                {
                    "id": "node_002",
                    "title": "Azure AI Services",
                    "description": "Explore Azure Cognitive Services and AI capabilities",
                    "order": 2,
                    "duration_hours": 30,
                    "type": "module",
                    "status": "not_started",
                    "topics": [
                        "Computer Vision",
                        "Natural Language Processing",
                        "Speech Services"
                    ]
                },
                {
                    "id": "node_003",
                    "title": "Machine Learning on Azure",
                    "description": "Build and deploy ML models using Azure Machine Learning",
                    "order": 3,
                    "duration_hours": 40,
                    "type": "module",
                    "status": "not_started",
                    "topics": [
                        "Azure ML Studio",
                        "Model Training",
                        "MLOps"
                    ]
                }
            ],
            "progress": {
                "completed_nodes": [],
                "current_node_id": "node_001",
                "overall_progress": 0,
                "total_points_earned": 0,
                "badges_earned": [],
                "last_activity": datetime.utcnow().isoformat(),
                "time_spent_hours": 0
            },
            "metadata": {
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat(),
                "ai_generated": False,
                "is_mock": True
            }
        }