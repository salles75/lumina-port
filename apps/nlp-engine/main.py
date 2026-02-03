"""
Lumina NLP Engine
========================
FastAPI service for sentiment analysis using NLTK, spaCy, and TextBlob.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
import sys

from api.routes import router as api_router
from services.nlp_service import NLPService
from config import settings

# Configure logging
logger.remove()
logger.add(
    sys.stdout,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
    level=settings.LOG_LEVEL,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler.
    Initialize NLP models on startup.
    """
    logger.info("🚀 Starting NLP Engine...")
    
    # Initialize NLP service (downloads models if needed)
    nlp_service = NLPService()
    await nlp_service.initialize()
    app.state.nlp_service = nlp_service
    
    logger.info("✅ NLP Engine ready!")
    
    yield
    
    # Cleanup
    logger.info("👋 Shutting down NLP Engine...")


# Create FastAPI application
app = FastAPI(
    title="Lumina NLP Engine",
    description="Sentiment analysis API powered by NLTK, spaCy, and TextBlob",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": "nlp-engine",
        "version": "1.0.0",
    }


# API Key verification dependency
async def verify_api_key(x_api_key: str = Header(None)):
    """Verify API key for internal service communication"""
    if settings.API_KEY and x_api_key != settings.API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return x_api_key


# Include API routes
app.include_router(
    api_router,
    prefix="/api",
    dependencies=[Depends(verify_api_key)] if settings.API_KEY else [],
)


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.DEBUG,
        workers=1 if settings.DEBUG else settings.WORKERS,
    )
