from fastapi import APIRouter
from app.api.v1.endpoints import learning_path, quiz, exercise, health

api_router = APIRouter()

# Include routers
api_router.include_router(
    learning_path.router,
    prefix="/learning-path",
    tags=["Learning Path"]
)

api_router.include_router(
    quiz.router,
    prefix="/quiz",
    tags=["Quiz"]
)

api_router.include_router(
    exercise.router,
    prefix="/exercise",
    tags=["Exercise"]
)

api_router.include_router(
    health.router,
    prefix="/health",
    tags=["Health"]
)