# backend/app/main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
import uvicorn
from typing import Dict, Any

from app.api.v1.api import api_router
from app.core.config import settings
from app.core.logging import setup_logging
from app.core.exceptions import CustomException

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manage application lifecycle events
    """
    # Startup
    logger.info("🚀 Starting AI Learning Platform API...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"API Version: {settings.API_V1_STR}")
    logger.info(f"Debug Mode: {settings.DEBUG}")
    
    yield
    
    # Shutdown
    logger.info("🔌 Shutting down AI Learning Platform API...")

# Create FastAPI app instance
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-powered learning platform for cloud certifications",
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan,
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom exception handler
@app.exception_handler(CustomException)
async def custom_exception_handler(request: Request, exc: CustomException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "status_code": exc.status_code,
            "type": exc.__class__.__name__,
        },
    )

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An unexpected error occurred",
            "status_code": 500,
            "type": "InternalServerError",
        },
    )

# Health check endpoint
@app.get("/", tags=["Health"])
async def root() -> Dict[str, Any]:
    """
    Root endpoint - Health check
    """
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
    }

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """
    Log all incoming requests and responses
    """
    import time
    from uuid import uuid4
    
    request_id = str(uuid4())
    start_time = time.time()
    
    # Log request
    logger.info(
        f"Request {request_id}: {request.method} {request.url.path}"
    )
    
    # Process request
    response = await call_next(request)
    
    # Calculate request duration
    process_time = time.time() - start_time
    
    # Log response
    logger.info(
        f"Response {request_id}: status={response.status_code} time={process_time:.3f}s"
    )
    
    # Add custom headers
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Process-Time"] = str(process_time)
    
    return response

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower(),
    )