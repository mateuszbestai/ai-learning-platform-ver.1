from fastapi import HTTPException
from typing import Any, Optional

class CustomException(HTTPException):
    """Base custom exception"""
    
    def __init__(
        self,
        status_code: int,
        detail: str,
        headers: Optional[dict] = None
    ):
        super().__init__(status_code=status_code, detail=detail, headers=headers)

class BadRequestException(CustomException):
    """400 Bad Request"""
    
    def __init__(self, detail: str = "Bad request"):
        super().__init__(status_code=400, detail=detail)

class UnauthorizedException(CustomException):
    """401 Unauthorized"""
    
    def __init__(self, detail: str = "Unauthorized"):
        super().__init__(status_code=401, detail=detail)

class ForbiddenException(CustomException):
    """403 Forbidden"""
    
    def __init__(self, detail: str = "Forbidden"):
        super().__init__(status_code=403, detail=detail)

class NotFoundException(CustomException):
    """404 Not Found"""
    
    def __init__(self, detail: str = "Resource not found"):
        super().__init__(status_code=404, detail=detail)

class ConflictException(CustomException):
    """409 Conflict"""
    
    def __init__(self, detail: str = "Resource conflict"):
        super().__init__(status_code=409, detail=detail)

class ValidationException(CustomException):
    """422 Validation Error"""
    
    def __init__(self, detail: str = "Validation error"):
        super().__init__(status_code=422, detail=detail)

class InternalServerException(CustomException):
    """500 Internal Server Error"""
    
    def __init__(self, detail: str = "Internal server error"):
        super().__init__(status_code=500, detail=detail)

class ServiceUnavailableException(CustomException):
    """503 Service Unavailable"""
    
    def __init__(self, detail: str = "Service temporarily unavailable"):
        super().__init__(status_code=503, detail=detail)