"""
NLP Service for sentiment analysis.
Combines NLTK, spaCy, and TextBlob for robust sentiment detection.
"""

import asyncio
from concurrent.futures import ThreadPoolExecutor
from typing import List, Dict, Any, Optional
import re

import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from textblob import TextBlob
import spacy
from loguru import logger

from config import settings


class NLPService:
    """
    Service for natural language processing and sentiment analysis.
    """
    
    def __init__(self):
        self.vader: Optional[SentimentIntensityAnalyzer] = None
        self.nlp_pt: Optional[spacy.Language] = None
        self.nlp_en: Optional[spacy.Language] = None
        self.stopwords_pt: set = set()
        self.stopwords_en: set = set()
        self.executor = ThreadPoolExecutor(max_workers=4)
        self.models_loaded = False
    
    async def initialize(self):
        """Initialize NLP models and resources."""
        logger.info("Initializing NLP models...")
        
        # Download NLTK data
        nltk_packages = [
            'vader_lexicon',
            'punkt',
            'stopwords',
            'averaged_perceptron_tagger',
        ]
        
        for package in nltk_packages:
            try:
                nltk.download(package, quiet=True)
            except Exception as e:
                logger.warning(f"Failed to download {package}: {e}")
        
        # Initialize VADER
        self.vader = SentimentIntensityAnalyzer()
        
        # Load stopwords
        try:
            self.stopwords_pt = set(stopwords.words('portuguese'))
            self.stopwords_en = set(stopwords.words('english'))
        except Exception as e:
            logger.warning(f"Failed to load stopwords: {e}")
            self.stopwords_pt = set()
            self.stopwords_en = set()
        
        # Load spaCy models
        try:
            self.nlp_pt = spacy.load(settings.SPACY_MODEL_PT)
            logger.info(f"Loaded spaCy model: {settings.SPACY_MODEL_PT}")
        except OSError:
            logger.warning(f"spaCy model {settings.SPACY_MODEL_PT} not found. Using blank model.")
            self.nlp_pt = spacy.blank("pt")
        
        try:
            self.nlp_en = spacy.load(settings.SPACY_MODEL_EN)
            logger.info(f"Loaded spaCy model: {settings.SPACY_MODEL_EN}")
        except OSError:
            logger.warning(f"spaCy model {settings.SPACY_MODEL_EN} not found. Using blank model.")
            self.nlp_en = spacy.blank("en")
        
        self.models_loaded = True
        logger.info("NLP models initialized successfully")
    
    def _detect_language(self, text: str) -> str:
        """Detect the language of the text."""
        try:
            blob = TextBlob(text)
            detected = blob.detect_language()
            if detected in ['pt', 'en', 'es']:
                return detected
        except Exception:
            pass
        
        # Simple heuristic for Portuguese
        pt_indicators = ['não', 'muito', 'bom', 'ótimo', 'ruim', 'produto', 'entrega', 'comprei']
        text_lower = text.lower()
        
        for indicator in pt_indicators:
            if indicator in text_lower:
                return 'pt'
        
        return settings.DEFAULT_LANGUAGE
    
    def _clean_text(self, text: str) -> str:
        """Clean and preprocess text."""
        # Remove URLs
        text = re.sub(r'http\S+|www\S+', '', text)
        # Remove email addresses
        text = re.sub(r'\S+@\S+', '', text)
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        return text
    
    def _extract_keywords(self, text: str, language: str) -> List[str]:
        """Extract relevant keywords from text."""
        nlp = self.nlp_pt if language == 'pt' else self.nlp_en
        stopwords_set = self.stopwords_pt if language == 'pt' else self.stopwords_en
        
        try:
            doc = nlp(text.lower())
            
            # Extract nouns and adjectives
            keywords = []
            for token in doc:
                if (
                    token.pos_ in ['NOUN', 'ADJ'] and
                    token.text not in stopwords_set and
                    len(token.text) > 2 and
                    token.is_alpha
                ):
                    keywords.append(token.lemma_)
            
            # Deduplicate while preserving order
            seen = set()
            unique_keywords = []
            for kw in keywords:
                if kw not in seen:
                    seen.add(kw)
                    unique_keywords.append(kw)
            
            return unique_keywords[:10]  # Top 10 keywords
            
        except Exception as e:
            logger.warning(f"Keyword extraction failed: {e}")
            return []
    
    def _analyze_sentiment_vader(self, text: str) -> Dict[str, float]:
        """Analyze sentiment using VADER."""
        if not self.vader:
            return {"compound": 0, "pos": 0, "neu": 1, "neg": 0}
        
        return self.vader.polarity_scores(text)
    
    def _analyze_sentiment_textblob(self, text: str) -> Dict[str, float]:
        """Analyze sentiment using TextBlob."""
        try:
            blob = TextBlob(text)
            return {
                "polarity": blob.sentiment.polarity,  # -1 to 1
                "subjectivity": blob.sentiment.subjectivity,  # 0 to 1
            }
        except Exception:
            return {"polarity": 0, "subjectivity": 0.5}
    
    def _combine_sentiments(
        self,
        vader_scores: Dict[str, float],
        textblob_scores: Dict[str, float],
    ) -> Dict[str, Any]:
        """Combine sentiment scores from multiple analyzers."""
        # Weight: VADER 60%, TextBlob 40%
        vader_weight = 0.6
        textblob_weight = 0.4
        
        combined_score = (
            vader_scores["compound"] * vader_weight +
            textblob_scores["polarity"] * textblob_weight
        )
        
        # Determine sentiment label
        if combined_score >= 0.05:
            sentiment = "positive"
        elif combined_score <= -0.05:
            sentiment = "negative"
        else:
            sentiment = "neutral"
        
        # Calculate confidence (0 to 1)
        confidence = min(abs(combined_score) + 0.5, 1.0)
        
        return {
            "sentiment": sentiment,
            "score": round(combined_score, 4),
            "confidence": round(confidence, 4),
        }
    
    def _analyze_single_sync(self, text: str, language: Optional[str] = None) -> Dict[str, Any]:
        """Synchronously analyze a single text."""
        # Clean text
        cleaned_text = self._clean_text(text)
        
        if not cleaned_text:
            return {
                "text": text[:500],
                "sentiment": "neutral",
                "confidence": 0.5,
                "score": 0.0,
                "keywords": [],
            }
        
        # Detect language if not provided
        if not language:
            language = self._detect_language(cleaned_text)
        
        # Get sentiment scores
        vader_scores = self._analyze_sentiment_vader(cleaned_text)
        textblob_scores = self._analyze_sentiment_textblob(cleaned_text)
        
        # Combine scores
        combined = self._combine_sentiments(vader_scores, textblob_scores)
        
        # Extract keywords
        keywords = self._extract_keywords(cleaned_text, language)
        
        return {
            "text": text[:500],  # Truncate long texts
            "sentiment": combined["sentiment"],
            "confidence": combined["confidence"],
            "score": combined["score"],
            "keywords": keywords,
        }
    
    async def analyze_single(
        self,
        text: str,
        language: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Analyze sentiment for a single text."""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            self.executor,
            self._analyze_single_sync,
            text,
            language,
        )
    
    async def analyze_batch(
        self,
        texts: List[str],
        language: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Analyze sentiment for a batch of texts."""
        tasks = [
            self.analyze_single(text, language)
            for text in texts
        ]
        
        results = await asyncio.gather(*tasks)
        return list(results)
