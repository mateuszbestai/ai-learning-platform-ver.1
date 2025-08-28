import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
from app.schemas.exercise import ExerciseSubmission, ExerciseResult, ExerciseResponse
from app.core.exceptions import NotFoundException, BadRequestException

logger = logging.getLogger(__name__)

class ExerciseService:
    """Service for managing exercises"""
    
    def get_exercise(self, exercise_id: str) -> ExerciseResponse:
        """Get exercise by ID"""
        try:
            # In production, fetch from database
            # For now, return mock data
            return self._get_mock_exercise(exercise_id)
        except Exception as e:
            logger.error(f"Error getting exercise {exercise_id}: {str(e)}")
            raise NotFoundException(f"Exercise {exercise_id} not found")
    
    def submit_exercise(self, exercise_id: str, submission: ExerciseSubmission) -> ExerciseResult:
        """Submit and evaluate exercise"""
        try:
            # Get exercise data
            exercise = self._get_mock_exercise_data(exercise_id)
            
            # Run tests (mock evaluation)
            test_results = self._run_tests(exercise, submission.solution)
            
            # Check if all tests passed
            passed = all(test["passed"] for test in test_results)
            
            # Calculate points
            points_earned = exercise["points"] if passed else 0
            
            # Generate feedback
            feedback = self._generate_feedback(test_results, passed)
            
            return ExerciseResult(
                exercise_id=exercise_id,
                passed=passed,
                test_results=test_results,
                feedback=feedback,
                points_earned=points_earned,
                submitted_at=datetime.utcnow()
            )
            
        except Exception as e:
            logger.error(f"Error submitting exercise {exercise_id}: {str(e)}")
            raise BadRequestException(f"Failed to submit exercise: {str(e)}")
    
    def run_tests(self, exercise_id: str, code: str, language: str = "python") -> Dict[str, Any]:
        """Run tests on submitted code"""
        try:
            exercise = self._get_mock_exercise_data(exercise_id)
            test_results = self._run_tests(exercise, code)
            
            return {
                "test_results": test_results,
                "all_passed": all(test["passed"] for test in test_results),
                "passed_count": sum(1 for test in test_results if test["passed"]),
                "total_count": len(test_results)
            }
            
        except Exception as e:
            logger.error(f"Error running tests: {str(e)}")
            raise BadRequestException(f"Failed to run tests: {str(e)}")
    
    def get_hints(self, exercise_id: str, level: int = 1) -> List[str]:
        """Get hints for exercise"""
        exercise = self._get_mock_exercise_data(exercise_id)
        hints = exercise.get("hints", [])
        return hints[:level]
    
    def save_progress(self, exercise_id: str, user_id: str, code: str) -> None:
        """Save exercise progress"""
        # In production, save to database
        logger.info(f"Saving progress for exercise {exercise_id}, user {user_id}")
    
    def _run_tests(self, exercise: Dict[str, Any], code: str) -> List[Dict[str, Any]]:
        """Run test cases on submitted code"""
        # Mock test execution
        # In production, use a sandboxed code execution environment
        test_cases = exercise.get("test_cases", [])
        results = []
        
        for i, test in enumerate(test_cases):
            # Mock test result
            passed = len(code) > 50  # Simple mock condition
            results.append({
                "name": f"Test {i + 1}",
                "input": test.get("input"),
                "expected": test.get("expected_output"),
                "actual": test.get("expected_output") if passed else "Error",
                "passed": passed,
                "error": None if passed else "Output mismatch"
            })
        
        return results
    
    def _generate_feedback(self, test_results: List[Dict[str, Any]], passed: bool) -> str:
        """Generate feedback based on test results"""
        if passed:
            return "Excellent work! All tests passed. You've mastered this concept!"
        else:
            failed_count = sum(1 for test in test_results if not test["passed"])
            return f"{failed_count} test(s) failed. Review your solution and try again."
    
    def _get_mock_exercise(self, exercise_id: str) -> ExerciseResponse:
        """Get mock exercise for testing"""
        return ExerciseResponse(
            id=exercise_id,
            title="Deploy a Virtual Machine",
            description="Learn to deploy and configure a VM in the cloud",
            type="hands-on",
            difficulty="beginner",
            instructions=[
                "Access the cloud portal",
                "Navigate to Virtual Machines",
                "Create a new VM with specified configurations",
                "Configure networking settings",
                "Deploy and verify the VM is running"
            ],
            starter_code="# Your code here\ndef deploy_vm():\n    pass",
            test_cases=[
                {"input": "vm_config", "expected_output": "VM deployed successfully"}
            ],
            hints=["Check the documentation", "Use the portal wizard", "Verify network settings"],
            estimated_time_minutes=45,
            points=100,
            sandbox_url="https://portal.azure.com/sandbox"
        )
    
    def _get_mock_exercise_data(self, exercise_id: str) -> Dict[str, Any]:
        """Get mock exercise data with test cases"""
        return {
            "id": exercise_id,
            "points": 100,
            "test_cases": [
                {"input": "test1", "expected_output": "result1"},
                {"input": "test2", "expected_output": "result2"},
                {"input": "test3", "expected_output": "result3"}
            ],
            "hints": [
                "Start with the basic setup",
                "Consider edge cases",
                "Review the documentation for best practices"
            ]
        }