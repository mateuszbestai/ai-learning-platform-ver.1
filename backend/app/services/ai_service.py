# backend/app/services/ai_service.py
import os
import json
import logging
from typing import Dict, Any, List, Optional
from openai import AzureOpenAI
from tenacity import retry, stop_after_attempt, wait_exponential
from app.core.config import settings
from app.core.exceptions import CustomException
from app.utils.ai_prompts import (
    LEARNING_PATH_SYSTEM_PROMPT,
    QUIZ_GENERATION_PROMPT,
    EXERCISE_GENERATION_PROMPT
)

logger = logging.getLogger(__name__)

class AIService:
    """Service for interacting with Azure OpenAI API"""
    
    def __init__(self):
        """Initialize Azure OpenAI client"""
        self.client = AzureOpenAI(
            api_key=os.getenv("AZURE_OPENAI_API_KEY", "dummy-key-for-testing"),
            api_version=os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview"),
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT", "https://dummy.openai.azure.com/")
        )
        self.deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-4.5")
        
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10)
    )
    async def generate_learning_path(
        self,
        prompt: str,
        user_level: str = "beginner",
        time_commitment: str = "2 hours per day",
        preferences: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Generate a personalized learning path using AI
        
        Args:
            prompt: User's learning goal description
            user_level: Current skill level (beginner/intermediate/advanced)
            time_commitment: Daily time available for learning
            preferences: Additional user preferences
            
        Returns:
            Generated learning path structure
        """
        try:
            # For MVP, return structured mock data
            # In production, this would make actual API call
            if os.getenv("AZURE_OPENAI_API_KEY") == "dummy-key-for-testing":
                return self._get_mock_learning_path(prompt, user_level)
            
            # Construct the prompt
            system_prompt = LEARNING_PATH_SYSTEM_PROMPT
            user_prompt = f"""
            Create a comprehensive learning path for the following goal:
            Goal: {prompt}
            User Level: {user_level}
            Time Commitment: {time_commitment}
            Preferences: {json.dumps(preferences or {})}
            
            Generate a structured learning path with:
            1. Clear modules/milestones
            2. Hands-on exercises for each module
            3. Quizzes to validate knowledge
            4. Resource recommendations
            5. Time estimates
            6. Prerequisites and dependencies
            """
            
            response = self.client.chat.completions.create(
                model=self.deployment,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=4000,
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            logger.info(f"Successfully generated learning path for: {prompt}")
            return result
            
        except Exception as e:
            logger.error(f"Error generating learning path: {str(e)}", exc_info=True)
            # Fallback to mock data on error
            return self._get_mock_learning_path(prompt, user_level)
    
    async def generate_quiz(
        self,
        topic: str,
        difficulty: str = "intermediate",
        num_questions: int = 10
    ) -> Dict[str, Any]:
        """Generate quiz questions for a topic"""
        try:
            if os.getenv("AZURE_OPENAI_API_KEY") == "dummy-key-for-testing":
                return self._get_mock_quiz(topic, difficulty, num_questions)
            
            prompt = QUIZ_GENERATION_PROMPT.format(
                topic=topic,
                difficulty=difficulty,
                num_questions=num_questions
            )
            
            response = self.client.chat.completions.create(
                model=self.deployment,
                messages=[
                    {"role": "system", "content": "You are an expert educator creating assessment questions."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.8,
                max_tokens=2000,
                response_format={"type": "json_object"}
            )
            
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            logger.error(f"Error generating quiz: {str(e)}", exc_info=True)
            return self._get_mock_quiz(topic, difficulty, num_questions)
    
    async def generate_exercise(
        self,
        topic: str,
        exercise_type: str = "hands-on",
        difficulty: str = "intermediate"
    ) -> Dict[str, Any]:
        """Generate exercise for a topic"""
        try:
            if os.getenv("AZURE_OPENAI_API_KEY") == "dummy-key-for-testing":
                return self._get_mock_exercise(topic, exercise_type, difficulty)
            
            prompt = EXERCISE_GENERATION_PROMPT.format(
                topic=topic,
                exercise_type=exercise_type,
                difficulty=difficulty
            )
            
            response = self.client.chat.completions.create(
                model=self.deployment,
                messages=[
                    {"role": "system", "content": "You are an expert instructor creating practical exercises."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1500
            )
            
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            logger.error(f"Error generating exercise: {str(e)}", exc_info=True)
            return self._get_mock_exercise(topic, exercise_type, difficulty)
    
    def _get_mock_learning_path(self, prompt: str, user_level: str) -> Dict[str, Any]:
        """Return mock learning path for testing"""
        certification = self._extract_certification_from_prompt(prompt)
        
        return {
            "title": f"Complete {certification} Certification Path",
            "description": f"Master {certification} with this comprehensive learning path",
            "total_duration_hours": 120,
            "difficulty_level": user_level,
            "nodes": [
                {
                    "id": "node_001",
                    "title": "Foundation: Cloud Computing Fundamentals",
                    "description": "Build a strong foundation in cloud computing concepts",
                    "order": 1,
                    "duration_hours": 20,
                    "type": "module",
                    "topics": [
                        "Cloud service models (IaaS, PaaS, SaaS)",
                        "Cloud deployment models",
                        "Core cloud services",
                        "Security and compliance basics"
                    ],
                    "resources": [
                        {
                            "title": "Cloud Computing Fundamentals",
                            "type": "video",
                            "url": "https://docs.microsoft.com/learn",
                            "duration_minutes": 60
                        }
                    ],
                    "exercises": [
                        {
                            "title": "Deploy Your First Cloud Resource",
                            "type": "hands-on",
                            "difficulty": "beginner",
                            "estimated_time_minutes": 45
                        }
                    ],
                    "quiz": {
                        "title": "Cloud Fundamentals Assessment",
                        "num_questions": 10,
                        "passing_score": 70
                    }
                },
                {
                    "id": "node_002", 
                    "title": "Core Services Deep Dive",
                    "description": "Master the essential cloud services",
                    "order": 2,
                    "duration_hours": 40,
                    "type": "module",
                    "prerequisites": ["node_001"],
                    "topics": [
                        "Compute services",
                        "Storage solutions",
                        "Networking fundamentals",
                        "Database services"
                    ]
                },
                {
                    "id": "node_003",
                    "title": "Advanced Topics & Specialization",
                    "description": "Dive deep into specialized topics",
                    "order": 3,
                    "duration_hours": 30,
                    "type": "module",
                    "prerequisites": ["node_002"]
                },
                {
                    "id": "node_004",
                    "title": "Hands-on Projects",
                    "description": "Apply your knowledge with real-world projects",
                    "order": 4,
                    "duration_hours": 20,
                    "type": "project",
                    "prerequisites": ["node_003"]
                },
                {
                    "id": "node_005",
                    "title": "Certification Preparation",
                    "description": "Final preparation and practice exams",
                    "order": 5,
                    "duration_hours": 10,
                    "type": "assessment",
                    "prerequisites": ["node_004"]
                }
            ]
        }
    
    def _get_mock_quiz(self, topic: str, difficulty: str, num_questions: int) -> Dict[str, Any]:
        """Return mock quiz for testing"""
        return {
            "title": f"{topic} Assessment",
            "description": f"Test your knowledge of {topic}",
            "questions": [
                {
                    "id": f"q_{i}",
                    "question": f"Sample question {i} about {topic}?",
                    "type": "multiple_choice",
                    "options": [
                        f"Option A for question {i}",
                        f"Option B for question {i}",
                        f"Option C for question {i}",
                        f"Option D for question {i}"
                    ],
                    "correct_answer": 0,
                    "explanation": f"Explanation for question {i}",
                    "points": 10
                }
                for i in range(1, min(num_questions + 1, 6))
            ],
            "passing_score": 70,
            "time_limit_minutes": num_questions * 3
        }
    
    def _get_mock_exercise(self, topic: str, exercise_type: str, difficulty: str) -> Dict[str, Any]:
        """Return mock exercise for testing"""
        return {
            "title": f"{topic} {exercise_type.title()} Exercise",
            "description": f"Practice {topic} with this {exercise_type} exercise",
            "type": exercise_type,
            "difficulty": difficulty,
            "estimated_time_minutes": 60,
            "instructions": [
                f"Step 1: Set up your environment",
                f"Step 2: Implement the {topic} solution",
                f"Step 3: Test your implementation",
                f"Step 4: Optimize and refine",
                f"Step 5: Document your solution"
            ],
            "starter_code": "// Your code here",
            "test_cases": [
                {"input": "test1", "expected_output": "result1"},
                {"input": "test2", "expected_output": "result2"}
            ],
            "hints": [
                f"Consider the {topic} best practices",
                "Think about edge cases",
                "Review the documentation"
            ]
        }
    
    def _extract_certification_from_prompt(self, prompt: str) -> str:
        """Extract certification name from prompt"""
        prompt_lower = prompt.lower()
        
        certifications = {
            "azure ai": "Azure AI Engineer",
            "azure architect": "Azure Solutions Architect",
            "aws architect": "AWS Solutions Architect",
            "aws developer": "AWS Developer",
            "gcp": "Google Cloud Professional",
            "kubernetes": "Kubernetes Administrator",
            "devops": "DevOps Engineer"
        }
        
        for key, value in certifications.items():
            if key in prompt_lower:
                return value
        
        return "Cloud Certification"

# backend/app/utils/ai_prompts.py
LEARNING_PATH_SYSTEM_PROMPT = """
You are an expert educational AI that creates personalized learning paths for cloud certifications.
Your learning paths should be:
1. Structured and progressive
2. Include hands-on exercises
3. Have clear milestones
4. Include time estimates
5. Provide resource recommendations
6. Include assessments and quizzes

Return your response as a JSON object with a clear structure.
"""

QUIZ_GENERATION_PROMPT = """
Generate {num_questions} quiz questions about {topic} at {difficulty} difficulty level.
Include multiple choice, true/false, and multiple select questions.
Each question should have:
- Clear question text
- Multiple options
- Correct answer(s)
- Explanation
- Point value

Return as JSON.
"""

EXERCISE_GENERATION_PROMPT = """
Create a {exercise_type} exercise for {topic} at {difficulty} difficulty level.
Include:
- Clear objectives
- Step-by-step instructions
- Starter code or templates if applicable
- Test cases or validation criteria
- Hints or tips
- Estimated completion time

Return as structured JSON.
"""