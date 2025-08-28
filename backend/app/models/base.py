from datetime import datetime
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, DateTime, String
from uuid import uuid4

# SQLAlchemy Base - for future database implementation
Base = declarative_base()

class BaseDBModel(Base):
    """Base database model with common fields"""
    __abstract__ = True
    
    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class BaseSchema(BaseModel):
    """Base Pydantic schema with common configuration"""
    class Config:
        from_attributes = True
        populate_by_name = True
        use_enum_values = True
        validate_assignment = True
        arbitrary_types_allowed = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }