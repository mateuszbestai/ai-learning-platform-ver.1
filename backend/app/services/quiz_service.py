import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
import random
from app.schemas.quiz import QuizSubmission, QuizResult, QuizResponse
from app.core.exceptions import NotFoundException, BadRequestException

logger = logging.getLogger(__name__)

class QuizService:
    """Service for managing quizzes"""
    
    def get_quiz(self, quiz_id: str) -> QuizResponse:
        """Get quiz by ID"""
        try:
            # In production, fetch from database
            # For now, return mock data
            return self._get_mock_quiz(quiz_id)
        except Exception as e:
            logger.error(f"Error getting quiz {quiz_id}: {str(e)}")
            raise NotFoundException(f"Quiz {quiz_id} not found")
    
    def submit_quiz(self, quiz_id: str, submission: QuizSubmission) -> QuizResult:
        """Submit and evaluate quiz"""
        try:
            # Get quiz data
            quiz = self._get_mock_quiz_data(quiz_id)
            
            # Evaluate answers
            correct_answers = 0
            total_questions = len(quiz["questions"])
            feedback = {}
            
            for question in quiz["questions"]:
                user_answer = submission.answers.get(question["id"])
                correct = self._check_answer(question, user_answer)
                
                if correct:
                    correct_answers += 1
                    feedback[question["id"]] = "Correct!"
                else:
                    feedback[question["id"]] = question.get("explanation", "Incorrect. Review this topic.")
            
            # Calculate score
            score = (correct_answers / total_questions) * 100 if total_questions > 0 else 0
            passed = score >= quiz.get("passing_score", 70)
            
            # Calculate points
            points_earned = 0
            if passed:
                points_earned = sum(q.get("points", 10) for q in quiz["questions"])
            
            return QuizResult(
                quiz_id=quiz_id,
                score=score,
                passed=passed,
                correct_answers=correct_answers,
                total_questions=total_questions,
                feedback=feedback,
                points_earned=points_earned,
                submitted_at=datetime.utcnow()
            )
            
        except Exception as e:
            logger.error(f"Error submitting quiz {quiz_id}: {str(e)}")
            raise BadRequestException(f"Failed to submit quiz: {str(e)}")
    
    def validate_answer(self, quiz_id: str, question_id: str, answer: Any) -> bool:
        """Validate a single answer"""
        try:
            quiz = self._get_mock_quiz_data(quiz_id)
            question = next((q for q in quiz["questions"] if q["id"] == question_id), None)
            
            if not question:
                raise NotFoundException(f"Question {question_id} not found")
            
            return self._check_answer(question, answer)
            
        except Exception as e:
            logger.error(f"Error validating answer: {str(e)}")
            return False
    
    def get_hints(self, quiz_id: str, question_id: str, level: int = 1) -> List[str]:
        """Get hints for a question"""
        # Mock hints
        hints = [
            "Think about the fundamental concepts",
            "Consider the best practices",
            "Review the documentation"
        ]
        return hints[:level]
    
    def _check_answer(self, question: Dict[str, Any], user_answer: Any) -> bool:
        """Check if answer is correct"""
        question_type = question.get("type", "multiple_choice")
        
        if question_type == "multiple_choice":
            return user_answer == question.get("correct_answer")
        elif question_type == "multiple_select":
            correct = set(question.get("correct_answers", []))
            user = set(user_answer) if isinstance(user_answer, list) else set()
            return correct == user
        elif question_type == "true_false":
            return user_answer == question.get("correct_answer")
        
        return False
    
    def _get_mock_quiz(self, quiz_id: str) -> QuizResponse:
        """Get mock quiz for testing"""
        questions = self._generate_mock_questions()
        
        return QuizResponse(
            id=quiz_id,
            title="Cloud Computing Fundamentals",
            description="Test your knowledge of cloud computing basics",
            questions=questions,
            time_limit_minutes=30,
            passing_score=70,
            max_attempts=3,
            attempts_remaining=3
        )
    
    def _get_mock_quiz_data(self, quiz_id: str) -> Dict[str, Any]:
        """Get mock quiz data with answers"""
        return {
            "id": quiz_id,
            "passing_score": 70,
            "questions": [
                {
                    "id": "q1",
                    "type": "multiple_choice",
                    "question": "What is the primary benefit of cloud computing?",
                    "correct_answer": 0,
                    "explanation": "Cloud computing primarily reduces capital expenditure.",
                    "points": 10
                },
                {
                    "id": "q2",
                    "type": "multiple_select",
                    "question": "Which are cloud service models?",
                    "correct_answers": [0, 1, 2],
                    "explanation": "IaaS, PaaS, and SaaS are the main cloud service models.",
                    "points": 15
                },
                {
                    "id": "q3",
                    "type": "true_false",
                    "question": "Cloud computing always requires internet connection.",
                    "correct_answer": True,
                    "explanation": "Public cloud services require internet connectivity.",
                    "points": 5
                }
            ]
        }
    
    def _generate_mock_questions(self) -> List[Dict[str, Any]]:
        """Generate mock questions without answers for client"""
        return [
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
                "points": 10
            },
            {
                "id": "q2",
                "question": "Which of the following are cloud service models?",
                "type": "multiple_select",
                "options": ["IaaS", "PaaS", "SaaS", "XaaS"],
                "points": 15
            },
            {
                "id": "q3",
                "question": "Cloud computing always requires internet connection.",
                "type": "true_false",
                "points": 5
            }
        ]