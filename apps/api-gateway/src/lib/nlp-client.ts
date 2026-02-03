import axios, { AxiosInstance } from 'axios';
import { logger } from './logger.js';

interface SentimentResult {
  text: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
  score: number;
  keywords: string[];
}

interface AnalyzeRequest {
  texts: string[];
  language?: string;
}

interface AnalyzeResponse {
  results: SentimentResult[];
  processingTime: number;
}

class NlpClient {
  private client: AxiosInstance;

  constructor() {
    const baseURL = process.env.NLP_ENGINE_URL || 'http://localhost:8000';
    
    this.client = axios.create({
      baseURL,
      timeout: 60000, // 60 seconds for batch processing
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.NLP_ENGINE_API_KEY || '',
      },
    });
  }

  async analyze(texts: string[], language?: string): Promise<AnalyzeResponse> {
    try {
      const response = await this.client.post<AnalyzeResponse>('/api/analyze', {
        texts,
        language,
      });
      return response.data;
    } catch (error) {
      logger.error('NLP Engine error:', error);
      throw new Error('Failed to analyze sentiments');
    }
  }

  async analyzeSingle(text: string, language?: string): Promise<SentimentResult> {
    const response = await this.analyze([text], language);
    return response.results[0];
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      return response.data.status === 'ok';
    } catch {
      return false;
    }
  }
}

export const nlpClient = new NlpClient();
