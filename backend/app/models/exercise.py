from sqlalchemy import Column, String, Integer, Text, JSON, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import BaseDBModel

class Exercise(BaseDBModel):
    """Exercise database model"""
    __tablename__ = "exercises"
    
    node_id = Column(String, ForeignKey("path_nodes.id"))
    title = Column(String(255), nullable=False)
    description = Column(Text)
    type = Column(String(50))  # hands-on, project, code, capstone
    difficulty = Column(String(50))  # beginner, intermediate, advanced
    estimated_time_minutes = Column(Integer)
    points = Column(Integer)
    instructions = Column(JSON)
    sandbox_url = Column(Text)
    starter_code = Column(Text)
    test_cases = Column(JSON)
    hints = Column(JSON)
    
    # Relationships
    node = relationship("PathNode", back_populates="exercises")
    submissions = relationship("ExerciseSubmission", back_populates="exercise")

class ExerciseSubmission(BaseDBModel):
    """Exercise Submission database model"""
    __tablename__ = "exercise_submissions"
    
    exercise_id = Column(String, ForeignKey("exercises.id"))
    user_id = Column(String, ForeignKey("users.id"))
    solution = Column(Text)
    language = Column(String(50))
    passed = Column(Boolean, default=False)
    test_results = Column(JSON)
    points_earned = Column(Integer, default=0)
    time_taken_minutes = Column(Integer)
    feedback = Column(Text)
    
    # Relationships
    exercise = relationship("Exercise", back_populates="submissions")