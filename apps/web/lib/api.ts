import axios, { AxiosError, AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * API Client singleton
 */
class ApiClient {
  private static instance: AxiosInstance;

  static getInstance(): AxiosInstance {
    if (!ApiClient.instance) {
      ApiClient.instance = axios.create({
        baseURL: API_URL,
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Request interceptor
      ApiClient.instance.interceptors.request.use(
        (config) => {
          // Token will be added by Clerk middleware
          return config;
        },
        (error) => Promise.reject(error)
      );

      // Response interceptor
      ApiClient.instance.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
          if (error.response?.status === 401) {
            // Handle unauthorized
            window.location.href = '/sign-in';
          }
          return Promise.reject(error);
        }
      );
    }
    return ApiClient.instance;
  }
}

export const api = ApiClient.getInstance();

// ============================================
// Analysis API
// ============================================

export interface AnalysisRequest {
  type: 'url' | 'csv' | 'text';
  content: string;
  metadata?: Record<string, unknown>;
}

export interface SentimentResult {
  text: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
  score: number;
  keywords: string[];
}

export interface AnalysisResponse {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  results: SentimentResult[];
  summary: {
    total: number;
    positive: number;
    neutral: number;
    negative: number;
    averageScore: number;
    topKeywords: { word: string; count: number }[];
  };
  createdAt: string;
  completedAt?: string;
}

export const analysisApi = {
  /**
   * Create new analysis
   */
  create: async (data: AnalysisRequest): Promise<AnalysisResponse> => {
    const response = await api.post<AnalysisResponse>('/api/analysis', data);
    return response.data;
  },

  /**
   * Get analysis by ID
   */
  getById: async (id: string): Promise<AnalysisResponse> => {
    const response = await api.get<AnalysisResponse>(`/api/analysis/${id}`);
    return response.data;
  },

  /**
   * List user analyses
   */
  list: async (params?: { page?: number; limit?: number }): Promise<{
    data: AnalysisResponse[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const response = await api.get('/api/analysis', { params });
    return response.data;
  },

  /**
   * Delete analysis
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/analysis/${id}`);
  },

  /**
   * Upload CSV file
   */
  uploadCsv: async (file: File): Promise<AnalysisResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post<AnalysisResponse>('/api/analysis/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// ============================================
// User API
// ============================================

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  imageUrl?: string;
  plan: 'free' | 'pro' | 'enterprise';
  analysisCount: number;
  analysisLimit: number;
  createdAt: string;
}

export interface UsageStats {
  currentMonth: {
    analyses: number;
    limit: number;
    percentage: number;
  };
  history: {
    month: string;
    analyses: number;
  }[];
}

export const userApi = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>('/api/user/profile');
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await api.patch<UserProfile>('/api/user/profile', data);
    return response.data;
  },

  /**
   * Get usage statistics
   */
  getUsage: async (): Promise<UsageStats> => {
    const response = await api.get<UsageStats>('/api/user/usage');
    return response.data;
  },
};

// ============================================
// Billing API
// ============================================

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  analysisLimit: number;
  popular?: boolean;
}

export const billingApi = {
  /**
   * Get available plans
   */
  getPlans: async (): Promise<PricingPlan[]> => {
    const response = await api.get<PricingPlan[]>('/api/billing/plans');
    return response.data;
  },

  /**
   * Create checkout session
   */
  createCheckout: async (priceId: string): Promise<{ url: string }> => {
    const response = await api.post<{ url: string }>('/api/billing/checkout', { priceId });
    return response.data;
  },

  /**
   * Create customer portal session
   */
  createPortalSession: async (): Promise<{ url: string }> => {
    const response = await api.post<{ url: string }>('/api/billing/portal');
    return response.data;
  },

  /**
   * Get billing history
   */
  getHistory: async (): Promise<{
    invoices: {
      id: string;
      amount: number;
      status: string;
      date: string;
      pdfUrl: string;
    }[];
  }> => {
    const response = await api.get('/api/billing/history');
    return response.data;
  },
};

// ============================================
// Dashboard API
// ============================================

export interface DashboardStats {
  totalAnalyses: number;
  totalFeedbacks: number;
  averageSentiment: number;
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  recentAnalyses: AnalysisResponse[];
  trendData: {
    date: string;
    positive: number;
    neutral: number;
    negative: number;
  }[];
}

export const dashboardApi = {
  /**
   * Get dashboard statistics
   */
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>('/api/dashboard/stats');
    return response.data;
  },
};
