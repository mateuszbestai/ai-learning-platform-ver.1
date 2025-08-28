from sqlalchemy import Column, String, Integer, Text, JSON, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import BaseDBModel
from typing import List, Optional
from datetime import datetime

class LearningPath(BaseDBModel):
    """Learning Path database model"""
    __tablename__ = "learning_paths"
    
    title = Column(String(255), nullable=False)
    description = Column(Text)
    total_duration_hours = Column(Integer)
    difficulty_level = Column(String(50))
    certification_target = Column(String(255))
    user_id = Column(String, ForeignKey("users.id"))
    metadata = Column(JSON)
    
    # Relationships
    nodes = relationship("PathNode", back_populates="learning_path", cascade="all, delete-orphan")
    progress = relationship("LearningProgress", back_populates="learning_path", uselist=False)

class PathNode(BaseDBModel):
    """Path Node database model"""
    __tablename__ = "path_nodes"
    
    learning_path_id = Column(String, ForeignKey("learning_paths.id"))
    title = Column(String(255), nullable=False)
    description = Column(Text)
    order = Column(Integer)
    duration_hours = Column(Integer)
    type = Column(String(50))
    status = Column(String(50), default="not_started")
    prerequisites = Column(JSON)
    topics = Column(JSON)
    resources = Column(JSON)
    
    # Relationships
    learning_path = relationship("LearningPath", back_populates="nodes")
    exercises = relationship("Exercise", back_populates="node", cascade="all, delete-orphan")
    quiz = relationship("Quiz", back_populates="node", uselist=False)

class LearningProgress(BaseDBModel):
    """Learning Progress database model"""
    __tablename__ = "learning_progress"
    
    learning_path_id = Column(String, ForeignKey("learning_paths.id"))
    user_id = Column(String, ForeignKey("users.id"))
    completed_nodes = Column(JSON, default=list)
    current_node_id = Column(String)
    overall_progress = Column(Float, default=0.0)
    total_points_earned = Column(Integer, default=0)
    badges_earned = Column(JSON, default=list)
    last_activity = Column(DateTime, default=datetime.utcnow)
    time_spent_hours = Column(Float, default=0.0)
    
    # Relationships
    learning_path = relationship("LearningPath", back_populates="progress")