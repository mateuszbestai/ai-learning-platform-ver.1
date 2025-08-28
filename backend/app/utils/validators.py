from typing import Any, Dict, List, Optional
import re
from app.core.exceptions import ValidationException

def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def validate_prompt(prompt: str) -> Dict[str, Any]:
    """Validate learning prompt"""
    if not prompt or len(prompt.strip()) == 0:
        raise ValidationException("Prompt cannot be empty")
    
    if len(prompt) < 10:
        raise ValidationException("Prompt must be at least 10 characters long")
    
    if len(prompt) > 500:
        raise ValidationException("Prompt must be less than 500 characters")
    
    return {"valid": True, "prompt": prompt.strip()}

def validate_difficulty_level(level: str) -> bool:
    """Validate difficulty level"""
    valid_levels = ["beginner", "intermediate", "advanced"]
    return level.lower() in valid_levels

def validate_time_commitment(time_str: str) -> bool:
    """Validate time commitment format"""
    # Check for patterns like "2 hours per day", "1 hour daily", etc.
    pattern = r'^\d+\s*(hour|hours|hr|hrs)\s*(per day|daily|per week|weekly)?$'
    return bool(re.match(pattern, time_str, re.IGNORECASE))

def validate_quiz_answers(answers: Dict[str, Any], questions: List[Dict]) -> bool:
    """Validate quiz answer format"""
    for question in questions:
        q_id = question.get("id")
        if q_id not in answers:
            raise ValidationException(f"Missing answer for question {q_id}")
        
        answer = answers[q_id]
        q_type = question.get("type")
        
        if q_type == "multiple_choice":
            if not isinstance(answer, int):
                raise ValidationException(f"Invalid answer type for question {q_id}")
        elif q_type == "multiple_select":
            if not isinstance(answer, list):
                raise ValidationException(f"Answer for question {q_id} must be a list")
        elif q_type == "true_false":
            if not isinstance(answer, bool):
                raise ValidationException(f"Answer for question {q_id} must be boolean")
    
    return True

def validate_code_submission(code: str, language: str) -> bool:
    """Validate code submission"""
    if not code or len(code.strip()) == 0:
        raise ValidationException("Code cannot be empty")
    
    valid_languages = ["python", "javascript", "typescript", "java", "csharp", "go"]
    if language.lower() not in valid_languages:
        raise ValidationException(f"Unsupported language: {language}")
    
    # Check for potential security issues (basic)
    dangerous_patterns = ["__import__", "eval", "exec", "compile", "open(", "file("]
    for pattern in dangerous_patterns:
        if pattern in code:
            raise ValidationException(f"Code contains potentially dangerous pattern: {pattern}")
    
    return True

def sanitize_input(text: str) -> str:
    """Sanitize user input"""
    # Remove any HTML/script tags
    text = re.sub(r'<[^>]+>', '', text)
    # Remove any potential SQL injection attempts
    text = re.sub(r'(;|--|\*|union|select|drop|insert|update|delete)', '', text, flags=re.IGNORECASE)
    return text.strip()