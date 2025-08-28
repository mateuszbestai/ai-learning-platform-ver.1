from sqlalchemy import Column, String, Integer, Text, JSON, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import BaseDBModel

class Quiz(BaseDBModel):
    """Quiz database model"""
    __tablename__ = "quizzes"
    
    node_id = Column(String, ForeignKey("path_nodes.id"))
    title = Column(String(255), nullable=False)
    description = Column(Text)
    passing_score = Column(Integer, default=70)
    time_limit_minutes = Column(Integer)
    max_attempts = Column(Integer, default=3)
    
    # Relationships
    node = relationship("PathNode", back_populates="quiz")
    questions = relationship("QuizQuestion", back_populates="quiz", cascade="all, delete-orphan")
    attempts = relationship("QuizAttempt", back_populates="quiz")

class QuizQuestion(BaseDBModel):
    """Quiz Question database model"""
    __tablename__ = "quiz_questions"
    
    quiz_id = Column(String, ForeignKey("quizzes.id"))
    question = Column(Text, nullable=False)
    type = Column(String(50))  # multiple_choice, multiple_select, true_false
    options = Column(JSON)
    correct_answer = Column(Integer)  # For single choice
    correct_answers = Column(JSON)  # For multiple select
    explanation = Column(Text)
    points = Column(Integer, default=10)
    order = Column(Integer)
    
    # Relationships
    quiz = relationship("Quiz", back_populates="questions")

class QuizAttempt(BaseDBModel):
    """Quiz Attempt database model"""
    __tablename__ = "quiz_attempts"
    
    quiz_id = Column(String, ForeignKey("quizzes.id"))
    user_id = Column(String, ForeignKey("users.id"))
    score = Column(Integer)
    passed = Column(Boolean, default=False)
    answers = Column(JSON)
    time_taken_minutes = Column(Integer)
    attempt_number = Column(Integer)
    
    # Relationships
    quiz = relationship("Quiz", back_populates="attempts")
