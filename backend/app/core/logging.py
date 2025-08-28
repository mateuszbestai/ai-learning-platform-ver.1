# backend/app/core/logging.py
import logging
import sys
from pathlib import Path

def setup_logging(log_level: str = "INFO"):
    """Configure standard logging"""
    
    # Configure standard logging with a simple format
    logging.basicConfig(
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        stream=sys.stdout,
        level=getattr(logging, log_level.upper()),
    )
    
    # Suppress noisy loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)
    
    # Get logger
    logger = logging.getLogger(__name__)
    logger.info(f"Logging configured with level: {log_level}")
    
    return logger