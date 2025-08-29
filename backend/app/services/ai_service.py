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
            api_version=os.getenv("AZURE_OPENAI_API_VERSION", "2024-06-01"),
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
        )
        self.deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-4")
        
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
        
        IMPORTANT: Return ONLY valid JSON, no additional text or formatting.
        
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
                    "type": "module",
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
                            "type": "hands-on",
                            "difficulty": "beginner",
                            "instructions": ["Step 1", "Step 2", "Step 3"],
                            "estimated_time_minutes": 45,
                            "points": 100
                        }
                    ],
                    "quiz": {
                        "id": "quiz_id",
                        "title": "Knowledge Check",
                        "description": "Test your understanding of the module",
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
        }
        
        CRITICAL: 
        - Exercise type MUST be one of: "hands-on", "project", "code", or "capstone" (NOT "lab" or "coding")
        - Exercises MUST have "instructions" field as an array of strings
        - Quiz MUST have "description" field"""
        
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
        - Make quizzes that test understanding, not memorization
        - Keep the response concise but complete
        - Limit to 3-5 nodes to ensure complete response"""
        
        try:
            logger.info(f"Generating learning path for prompt: {prompt[:100]}...")
            
            response = self.client.chat.completions.create(
                model=self.deployment,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=8000,  # Increased from 4000
                response_format={"type": "json_object"}
            )
            
            # Get the response content
            content = response.choices[0].message.content
            
            # Log the first part of the response for debugging
            logger.debug(f"Response preview: {content[:500]}...")
            
            # Try to parse the JSON
            try:
                result = json.loads(content)
            except json.JSONDecodeError as e:
                logger.error(f"JSON parsing error: {str(e)}")
                logger.error(f"Raw response: {content}")
                
                # Try to fix common JSON issues
                content_fixed = self._fix_json_response(content)
                try:
                    result = json.loads(content_fixed)
                    logger.info("Successfully parsed JSON after fixing")
                except:
                    # If still failing, return a simplified mock response
                    logger.error("Failed to parse even after fixing, using fallback response")
                    result = self._get_fallback_learning_path(prompt, user_level)
            
            # Clean and transform the data to match schema
            result = self._transform_ai_response(result)

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
            # Return a fallback response instead of raising an exception
            return self._get_fallback_learning_path(prompt, user_level)
    
    def _fix_json_response(self, content: str) -> str:
        """Try to fix common JSON issues in the response"""
        # Remove any text before the first {
        start_idx = content.find('{')
        if start_idx > 0:
            content = content[start_idx:]
        
        # Remove any text after the last }
        end_idx = content.rfind('}')
        if end_idx > 0 and end_idx < len(content) - 1:
            content = content[:end_idx + 1]
        
        # Fix common issues
        content = content.replace('\n', ' ')  # Remove newlines in strings
        content = content.replace('\\', '\\\\')  # Escape backslashes
        
        # Try to complete truncated JSON
        if not content.strip().endswith('}'):
            # Count opening and closing braces
            open_braces = content.count('{')
            close_braces = content.count('}')
            missing_braces = open_braces - close_braces
            
            # Add missing closing braces
            content += '}' * missing_braces
        
        return content
    
    def _transform_ai_response(self, response: Dict[str, Any]) -> Dict[str, Any]:
        """Transform AI response to match the schema requirements"""
        # Fix exercise types and ensure required fields
        for node in response.get("nodes", []):
            # Fix exercises
            for exercise in node.get("exercises", []):
                # Map invalid types to valid ones
                if exercise.get("type") == "lab":
                    exercise["type"] = "hands-on"
                elif exercise.get("type") == "coding":
                    exercise["type"] = "code"
                elif exercise.get("type") not in ["hands-on", "project", "code", "capstone"]:
                    exercise["type"] = "hands-on"
                
                # Ensure instructions field exists
                if "instructions" not in exercise:
                    # Try to convert other fields to instructions
                    instructions = []
                    if "problem_statement" in exercise:
                        instructions.append(exercise["problem_statement"])
                    if "requirements" in exercise:
                        instructions.extend(exercise.get("requirements", []))
                    if "solution_approach" in exercise:
                        instructions.append(exercise["solution_approach"])
                    
                    # If still empty, add default instructions
                    if not instructions:
                        instructions = [
                            "Complete this exercise",
                            "Follow the requirements",
                            "Submit your solution"
                        ]
                    
                    exercise["instructions"] = instructions
                
                # Clean up extra fields that aren't in schema (optional)
                extra_fields = ["problem_statement", "requirements", "solution_approach", "evaluation_criteria"]
                for field in extra_fields:
                    exercise.pop(field, None)
            
            # Fix quiz
            if node.get("quiz"):
                quiz = node["quiz"]
                # Ensure description field exists
                if "description" not in quiz:
                    quiz["description"] = quiz.get("title", "Knowledge check") + " - Test your understanding"
        
        return response
    
    def _get_fallback_learning_path(self, prompt: str, user_level: str) -> Dict[str, Any]:
        """Return a basic fallback learning path when AI generation fails"""
        return {
            "id": f"path_{uuid.uuid4().hex[:8]}",
            "title": f"Learning Path: {prompt[:50]}",
            "description": "A personalized learning path created for your goals",
            "total_duration_hours": 60,
            "difficulty_level": user_level,
            "nodes": [
                {
                    "id": f"node_{uuid.uuid4().hex[:8]}",
                    "title": "Introduction & Fundamentals",
                    "description": "Get started with the basics and core concepts",
                    "order": 1,
                    "duration_hours": 20,
                    "type": "module",
                    "status": "not_started",
                    "topics": ["Core Concepts", "Basic Principles", "Getting Started"],
                    "learning_objectives": [
                        "Understand fundamental concepts",
                        "Learn basic terminology",
                        "Set up your environment"
                    ],
                    "content": {
                        "introduction": "Welcome to your learning journey. This module covers the essential foundations.",
                        "sections": [
                            {
                                "title": "Getting Started",
                                "content": "Begin with understanding the basic concepts and setting up your learning environment.",
                                "key_points": ["Foundation knowledge", "Environment setup", "Basic tools"],
                                "examples": ["Example 1: Basic setup", "Example 2: First steps"]
                            }
                        ],
                        "summary": "You've completed the foundational concepts. Ready to move forward!"
                    },
                    "exercises": [
                        {
                            "id": f"ex_{uuid.uuid4().hex[:8]}",
                            "title": "Practice Exercise",
                            "description": "Apply what you've learned",
                            "type": "hands-on",
                            "difficulty": "beginner",
                            "problem_statement": "Complete this hands-on exercise to practice the concepts",
                            "requirements": ["Complete the setup", "Follow the instructions"],
                            "hints": ["Start with the basics", "Take it step by step"],
                            "solution_approach": "Follow the structured approach",
                            "evaluation_criteria": ["Correctness", "Completeness"],
                            "estimated_time_minutes": 30,
                            "points": 50
                        }
                    ],
                    "quiz": {
                        "id": f"quiz_{uuid.uuid4().hex[:8]}",
                        "title": "Knowledge Check",
                        "questions": [
                            {
                                "id": f"q_{uuid.uuid4().hex[:8]}",
                                "question": "What is the main concept covered in this module?",
                                "type": "multiple_choice",
                                "options": ["Option A", "Option B", "Option C", "Option D"],
                                "correct_answer": 0,
                                "explanation": "Option A is correct because it represents the core concept.",
                                "points": 10
                            }
                        ],
                        "passing_score": 70,
                        "time_limit_minutes": 15
                    }
                },
                {
                    "id": f"node_{uuid.uuid4().hex[:8]}",
                    "title": "Intermediate Concepts",
                    "description": "Build on your foundation with more advanced topics",
                    "order": 2,
                    "duration_hours": 20,
                    "type": "module",
                    "status": "not_started",
                    "topics": ["Advanced Topics", "Best Practices", "Real-world Applications"],
                    "learning_objectives": [
                        "Master intermediate concepts",
                        "Apply best practices",
                        "Work on real-world scenarios"
                    ]
                },
                {
                    "id": f"node_{uuid.uuid4().hex[:8]}",
                    "title": "Final Project",
                    "description": "Apply everything you've learned in a comprehensive project",
                    "order": 3,
                    "duration_hours": 20,
                    "type": "project",
                    "status": "not_started",
                    "topics": ["Project Planning", "Implementation", "Testing"],
                    "learning_objectives": [
                        "Complete a full project",
                        "Demonstrate your skills",
                        "Prepare for certification"
                    ]
                }
            ],
            "created_at": datetime.utcnow().isoformat(),
            "metadata": {
                "generated_for": prompt,
                "user_level": user_level,
                "ai_generated": False,
                "fallback_response": True
            }
        }
    
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
        
        Mix question types: multiple choice, true/false, and scenario-based.
        Return as valid JSON only."""
        
        user_prompt = f"""Generate {num_questions} quiz questions for:
        Topic: {topic}
        Difficulty: {difficulty}
        Key Concepts: {', '.join(concepts) if concepts else 'Cover all major concepts'}
        
        Return as JSON:
        {{
            "questions": [
                {{
                    "id": "q1",
                    "question": "Question text",
                    "type": "multiple_choice",
                    "options": ["option1", "option2", "option3", "option4"],
                    "correct_answer": 0,
                    "explanation": "Explanation text",
                    "points": 10
                }}
            ]
        }}"""
        
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