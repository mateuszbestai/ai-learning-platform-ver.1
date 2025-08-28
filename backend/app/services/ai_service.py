# backend/app/services/ai_service.py
import os
import json
import logging
from typing import Dict, Any, List, Optional
from openai import AzureOpenAI
from tenacity import retry, stop_after_attempt, wait_exponential
from app.core.config import settings
from app.core.exceptions import CustomException
import uuid
from datetime import datetime

logger = logging.getLogger(__name__)

class AIService:
    """Service for AI-powered content generation and evaluation"""
    
    def __init__(self):
        """Initialize Azure OpenAI client"""
        self.client = AzureOpenAI(
            api_key=os.getenv("AZURE_OPENAI_API_KEY"),
            api_version=os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview"),
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
        )
        self.deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-4.1")
        
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def generate_learning_path(
        self,
        prompt: str,
        user_level: str = "beginner",
        time_commitment: str = "2 hours per day",
        preferences: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Generate a personalized learning path with AI-created content"""
        
        system_prompt = """You are an expert educational AI that creates comprehensive, personalized learning paths.
        Generate a complete learning curriculum with:
        1. Detailed module breakdown with learning objectives
        2. Custom content for each topic (not external links)
        3. Progressive difficulty curve
        4. Practical exercises and projects
        5. Assessment quizzes
        
        Return as JSON with this structure:
        {
            "title": "Learning Path Title",
            "description": "Comprehensive description",
            "total_duration_hours": 120,
            "difficulty_level": "intermediate",
            "nodes": [
                {
                    "id": "unique_id",
                    "title": "Module Title",
                    "description": "What learner will achieve",
                    "order": 1,
                    "duration_hours": 10,
                    "type": "module|project|assessment",
                    "topics": ["topic1", "topic2"],
                    "learning_objectives": ["objective1", "objective2"],
                    "content": {
                        "introduction": "Module introduction text",
                        "sections": [
                            {
                                "title": "Section Title",
                                "content": "Detailed educational content here",
                                "key_points": ["point1", "point2"],
                                "examples": ["example1", "example2"]
                            }
                        ],
                        "summary": "Module summary"
                    },
                    "exercises": [
                        {
                            "id": "ex_id",
                            "title": "Exercise Title",
                            "description": "What to build/solve",
                            "type": "coding|problem-solving|design",
                            "difficulty": "beginner|intermediate|advanced",
                            "problem_statement": "Detailed problem",
                            "requirements": ["req1", "req2"],
                            "hints": ["hint1", "hint2"],
                            "solution_approach": "How to approach this",
                            "evaluation_criteria": ["criteria1", "criteria2"],
                            "estimated_time_minutes": 45,
                            "points": 100
                        }
                    ],
                    "quiz": {
                        "id": "quiz_id",
                        "title": "Knowledge Check",
                        "questions": [
                            {
                                "id": "q_id",
                                "question": "Question text",
                                "type": "multiple_choice",
                                "options": ["option1", "option2", "option3", "option4"],
                                "correct_answer": 0,
                                "explanation": "Why this is correct",
                                "points": 10
                            }
                        ],
                        "passing_score": 70,
                        "time_limit_minutes": 30
                    }
                }
            ]
        }"""
        
        user_prompt = f"""Create a comprehensive learning path for:
        Goal: {prompt}
        Level: {user_level}
        Time Commitment: {time_commitment}
        Preferences: {json.dumps(preferences or {})}
        
        Important:
        - Generate ALL content yourself, don't reference external resources
        - Create detailed explanations and examples
        - Design practical exercises that build real skills
        - Include code examples where relevant
        - Make quizzes that test understanding, not memorization"""
        
        try:
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
            
            # Add IDs and metadata
            result["id"] = f"path_{uuid.uuid4().hex[:8]}"
            result["created_at"] = datetime.utcnow().isoformat()
            result["metadata"] = {
                "generated_for": prompt,
                "user_level": user_level,
                "ai_generated": True
            }
            
            # Ensure all nodes have proper IDs
            for i, node in enumerate(result.get("nodes", [])):
                if not node.get("id"):
                    node["id"] = f"node_{uuid.uuid4().hex[:8]}"
                node["status"] = "not_started"
                node["order"] = i + 1
                
                # Add IDs to exercises
                for j, exercise in enumerate(node.get("exercises", [])):
                    if not exercise.get("id"):
                        exercise["id"] = f"ex_{uuid.uuid4().hex[:8]}"
                        
                # Add ID to quiz
                if node.get("quiz") and not node["quiz"].get("id"):
                    node["quiz"]["id"] = f"quiz_{uuid.uuid4().hex[:8]}"
                    for k, question in enumerate(node["quiz"].get("questions", [])):
                        if not question.get("id"):
                            question["id"] = f"q_{uuid.uuid4().hex[:8]}"
            
            logger.info(f"Successfully generated AI learning path: {result['id']}")
            return result
            
        except Exception as e:
            logger.error(f"Error generating learning path: {str(e)}", exc_info=True)
            raise CustomException(500, f"Failed to generate learning path: {str(e)}")
    
    async def generate_exercise_content(
        self,
        topic: str,
        exercise_type: str,
        difficulty: str,
        context: Optional[str] = None
    ) -> Dict[str, Any]:
        """Generate detailed exercise content"""
        
        system_prompt = """You are an expert instructor creating practical programming exercises.
        Generate complete exercise specifications with:
        1. Clear problem statement
        2. Step-by-step requirements
        3. Test cases with inputs and expected outputs
        4. Starter code template
        5. Solution approach guidance
        6. Evaluation criteria"""
        
        user_prompt = f"""Create a {exercise_type} exercise for:
        Topic: {topic}
        Difficulty: {difficulty}
        Context: {context or 'General learning'}
        
        Include:
        - Realistic problem that applies the concepts
        - Clear acceptance criteria
        - At least 5 test cases
        - Starter code in Python/JavaScript
        - Progressive hints
        - Common pitfalls to avoid"""
        
        try:
            response = self.client.chat.completions.create(
                model=self.deployment,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            content = response.choices[0].message.content
            
            # Parse and structure the response
            exercise = {
                "id": f"ex_{uuid.uuid4().hex[:8]}",
                "title": f"{topic} - {exercise_type.title()} Exercise",
                "topic": topic,
                "type": exercise_type,
                "difficulty": difficulty,
                "generated_content": content,
                "created_at": datetime.utcnow().isoformat()
            }
            
            return exercise
            
        except Exception as e:
            logger.error(f"Error generating exercise: {str(e)}", exc_info=True)
            raise CustomException(500, f"Failed to generate exercise: {str(e)}")
    
    async def evaluate_exercise_submission(
        self,
        exercise: Dict[str, Any],
        submission: str,
        language: str = "python"
    ) -> Dict[str, Any]:
        """AI-powered evaluation of exercise submission"""
        
        system_prompt = """You are an expert code reviewer and instructor.
        Evaluate the submitted solution for correctness, efficiency, and best practices.
        Provide constructive feedback and identify areas for improvement.
        
        Return evaluation as JSON:
        {
            "passed": true/false,
            "score": 0-100,
            "test_results": [
                {
                    "test_name": "Test 1",
                    "passed": true/false,
                    "feedback": "Specific feedback"
                }
            ],
            "overall_feedback": "Comprehensive review",
            "strengths": ["strength1", "strength2"],
            "improvements": ["improvement1", "improvement2"],
            "code_quality": {
                "readability": 0-10,
                "efficiency": 0-10,
                "best_practices": 0-10
            }
        }"""
        
        user_prompt = f"""Evaluate this solution:
        
        Exercise: {json.dumps(exercise)}
        
        Submitted Code:
        ```{language}
        {submission}
        ```
        
        Check if the solution:
        1. Solves the problem correctly
        2. Handles edge cases
        3. Follows best practices
        4. Is efficient
        5. Is readable and well-structured"""
        
        try:
            response = self.client.chat.completions.create(
                model=self.deployment,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.3,
                max_tokens=1500,
                response_format={"type": "json_object"}
            )
            
            evaluation = json.loads(response.choices[0].message.content)
            evaluation["evaluated_at"] = datetime.utcnow().isoformat()
            evaluation["exercise_id"] = exercise.get("id")
            
            return evaluation
            
        except Exception as e:
            logger.error(f"Error evaluating submission: {str(e)}", exc_info=True)
            raise CustomException(500, f"Failed to evaluate submission: {str(e)}")
    
    async def generate_quiz_questions(
        self,
        topic: str,
        num_questions: int = 10,
        difficulty: str = "intermediate",
        concepts: List[str] = None
    ) -> Dict[str, Any]:
        """Generate quiz questions dynamically"""
        
        system_prompt = """You are an expert educator creating assessment questions.
        Generate quiz questions that:
        1. Test understanding, not memorization
        2. Include practical scenarios
        3. Have clear, unambiguous answers
        4. Provide educational explanations
        
        Mix question types: multiple choice, true/false, and scenario-based."""
        
        user_prompt = f"""Generate {num_questions} quiz questions for:
        Topic: {topic}
        Difficulty: {difficulty}
        Key Concepts: {', '.join(concepts) if concepts else 'Cover all major concepts'}
        
        For each question include:
        - Clear question text
        - 4 options for multiple choice
        - Correct answer(s)
        - Detailed explanation
        - Point value based on difficulty"""
        
        try:
            response = self.client.chat.completions.create(
                model=self.deployment,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.8,
                max_tokens=2500,
                response_format={"type": "json_object"}
            )
            
            quiz_data = json.loads(response.choices[0].message.content)
            
            # Structure the quiz
            quiz = {
                "id": f"quiz_{uuid.uuid4().hex[:8]}",
                "title": f"{topic} Assessment",
                "topic": topic,
                "difficulty": difficulty,
                "questions": quiz_data.get("questions", []),
                "passing_score": 70,
                "time_limit_minutes": max(15, num_questions * 3),
                "created_at": datetime.utcnow().isoformat()
            }
            
            # Ensure all questions have IDs
            for i, question in enumerate(quiz["questions"]):
                if not question.get("id"):
                    question["id"] = f"q_{uuid.uuid4().hex[:8]}"
            
            return quiz
            
        except Exception as e:
            logger.error(f"Error generating quiz: {str(e)}", exc_info=True)
            raise CustomException(500, f"Failed to generate quiz: {str(e)}")
    
    async def provide_hint(
        self,
        exercise: Dict[str, Any],
        current_code: str,
        hint_level: int = 1
    ) -> str:
        """Generate contextual hints based on current progress"""
        
        prompt = f"""Given this exercise:
        {json.dumps(exercise)}
        
        Current attempt:
        ```
        {current_code}
        ```
        
        Provide hint level {hint_level} (1=subtle, 2=moderate, 3=detailed).
        Don't give away the solution, but guide toward it."""
        
        try:
            response = self.client.chat.completions.create(
                model=self.deployment,
                messages=[
                    {"role": "system", "content": "You are a helpful programming tutor providing hints."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.5,
                max_tokens=300
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            logger.error(f"Error generating hint: {str(e)}", exc_info=True)
            return "Think about the problem step by step. What's the first thing you need to check?"
    
    async def explain_concept(
        self,
        concept: str,
        context: str = None,
        user_level: str = "intermediate"
    ) -> Dict[str, Any]:
        """Generate detailed explanation of a concept"""
        
        system_prompt = """You are an expert teacher explaining technical concepts.
        Provide clear, comprehensive explanations with:
        1. Simple introduction
        2. Core concepts
        3. Practical examples
        4. Common use cases
        5. Best practices
        6. Common mistakes to avoid"""
        
        user_prompt = f"""Explain {concept} for a {user_level} learner.
        Context: {context or 'General learning'}
        
        Include:
        - Analogies to make it relatable
        - Code examples
        - Visual descriptions
        - Real-world applications"""
        
        try:
            response = self.client.chat.completions.create(
                model=self.deployment,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.6,
                max_tokens=1500
            )
            
            return {
                "concept": concept,
                "explanation": response.choices[0].message.content,
                "user_level": user_level,
                "generated_at": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error explaining concept: {str(e)}", exc_info=True)
            raise CustomException(500, f"Failed to explain concept: {str(e)}")