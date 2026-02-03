"""
API routes for the NLP Engine.
"""

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field
from typing import List, Optional
from loguru import logger
import time

from services.nlp_service import NLPService
from config import settings

router = APIRouter()


class AnalyzeRequest(BaseModel):
    """Request model for sentiment analysis."""
    texts: List[str] = Field(..., min_length=1, max_length=settings.MAX_BATCH_SIZE)
    language: Optional[str] = Field(default=None, description="Language code (pt, en, es)")


class SentimentResult(BaseModel):
    """Result model for a single text analysis."""
    text: str
    sentiment: str  # positive, neutral, negative
    confidence: float
    score: float  # -1 to 1
    keywords: List[str]


class AnalyzeResponse(BaseModel):
    """Response model for sentiment analysis."""
    results: List[SentimentResult]
    processingTime: float
    totalProcessed: int


class SingleAnalyzeRequest(BaseModel):
    """Request model for single text analysis."""
    text: str = Field(..., min_length=1, max_length=10000)
    language: Optional[str] = None


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_batch(request: AnalyzeRequest, req: Request):
    """
    Analyze sentiment for a batch of texts.
    
    Args:
        request: AnalyzeRequest containing texts and optional language
        
    Returns:
        AnalyzeResponse with sentiment results for each text
    """
    start_time = time.time()
    
    try:
        nlp_service: NLPService = req.app.state.nlp_service
        
        results = await nlp_service.analyze_batch(
            texts=request.texts,
            language=request.language,
        )
        
        processing_time = time.time() - start_time
        
        logger.info(f"Batch analysis completed: {len(request.texts)} texts in {processing_time:.2f}s")
        
        return AnalyzeResponse(
            results=[
                SentimentResult(
                    text=r["text"],
                    sentiment=r["sentiment"],
                    confidence=r["confidence"],
                    score=r["score"],
                    keywords=r["keywords"],
                )
                for r in results
            ],
            processingTime=processing_time,
            totalProcessed=len(results),
        )
        
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze/single", response_model=SentimentResult)
async def analyze_single(request: SingleAnalyzeRequest, req: Request):
    """
    Analyze sentiment for a single text.
    
    Args:
        request: SingleAnalyzeRequest containing text and optional language
        
    Returns:
        SentimentResult with sentiment analysis
    """
    try:
        nlp_service: NLPService = req.app.state.nlp_service
        
        result = await nlp_service.analyze_single(
            text=request.text,
            language=request.language,
        )
        
        return SentimentResult(
            text=result["text"],
            sentiment=result["sentiment"],
            confidence=result["confidence"],
            score=result["score"],
            keywords=result["keywords"],
        )
        
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/languages")
async def get_supported_languages():
    """Get list of supported languages."""
    return {
        "languages": [
            {"code": "pt", "name": "Português"},
            {"code": "en", "name": "English"},
            {"code": "es", "name": "Español"},
        ]
    }


@router.get("/stats")
async def get_stats(req: Request):
    """Get NLP engine statistics."""
    nlp_service: NLPService = req.app.state.nlp_service
    
    return {
        "modelsLoaded": nlp_service.models_loaded,
        "supportedLanguages": ["pt", "en", "es"],
        "maxBatchSize": settings.MAX_BATCH_SIZE,
    }
