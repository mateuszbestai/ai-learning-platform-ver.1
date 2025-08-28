from pydantic_settings import BaseSettings
from pydantic import Field, validator
from typing import List, Optional, Union, Dict, Any
import os
from functools import lru_cache

class Settings(BaseSettings):
    """Application settings"""
    
    # Application
    PROJECT_NAME: str = "AI Learning Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = Field("development", env="ENVIRONMENT")
    DEBUG: bool = Field(True, env="DEBUG")
    
    # Server
    HOST: str = Field("0.0.0.0", env="HOST")
    PORT: int = Field(8000, env="PORT")
    LOG_LEVEL: str = Field("INFO", env="LOG_LEVEL")
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = Field(
        ["http://localhost:3000", "http://localhost:5173"],
        env="BACKEND_CORS_ORIGINS"
    )
    
    # Azure OpenAI
    AZURE_OPENAI_API_KEY: str = Field("", env="AZURE_OPENAI_API_KEY")
    AZURE_OPENAI_ENDPOINT: str = Field("", env="AZURE_OPENAI_ENDPOINT")
    AZURE_OPENAI_DEPLOYMENT: str = Field("gpt-4.1", env="AZURE_OPENAI_DEPLOYMENT")
    AZURE_OPENAI_API_VERSION: str = Field(
        "2024-02-15-preview",
        env="AZURE_OPENAI_API_VERSION"
    )
    
    # Database (optional for now)
    DATABASE_URL: Optional[str] = Field(None, env="DATABASE_URL")
    
    # Redis (optional for now)
    REDIS_URL: Optional[str] = Field(None, env="REDIS_URL")
    REDIS_TTL: int = Field(3600, env="REDIS_TTL")  # 1 hour default
    
    # Security (for future use)
    SECRET_KEY: str = Field(
        "your-secret-key-here-change-in-production",
        env="SECRET_KEY"
    )
    ALGORITHM: str = Field("HS256", env="ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(30, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    
    # Rate limiting
    RATE_LIMIT_ENABLED: bool = Field(True, env="RATE_LIMIT_ENABLED")
    RATE_LIMIT_REQUESTS: int = Field(100, env="RATE_LIMIT_REQUESTS")
    RATE_LIMIT_PERIOD: int = Field(60, env="RATE_LIMIT_PERIOD")  # seconds
    
    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()

settings = get_settings()