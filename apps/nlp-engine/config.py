"""
Configuration settings for the NLP Engine.
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Server
    PORT: int = 8000
    DEBUG: bool = False
    WORKERS: int = 4
    LOG_LEVEL: str = "INFO"
    
    # Security
    API_KEY: str = ""
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:4000"]
    
    # Redis (optional, for caching)
    REDIS_URL: str = ""
    
    # NLP Settings
    DEFAULT_LANGUAGE: str = "pt"
    MAX_BATCH_SIZE: int = 1000
    
    # Model paths
    SPACY_MODEL_PT: str = "pt_core_news_lg"
    SPACY_MODEL_EN: str = "en_core_web_lg"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
