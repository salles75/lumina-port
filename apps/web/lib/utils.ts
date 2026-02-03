import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number to locale string
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('pt-BR').format(num);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format currency
 */
export function formatCurrency(value: number, currency = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Format date
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

/**
 * Format relative time
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d atrás`;
  if (hours > 0) return `${hours}h atrás`;
  if (minutes > 0) return `${minutes}min atrás`;
  return 'agora';
}

/**
 * Truncate text
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return `${text.slice(0, length)}...`;
}

/**
 * Delay utility
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get sentiment color
 */
export function getSentimentColor(sentiment: 'positive' | 'neutral' | 'negative'): string {
  const colors = {
    positive: '#22c55e',
    neutral: '#f59e0b',
    negative: '#ef4444',
  };
  return colors[sentiment];
}

/**
 * Get sentiment label
 */
export function getSentimentLabel(sentiment: 'positive' | 'neutral' | 'negative'): string {
  const labels = {
    positive: 'Positivo',
    neutral: 'Neutro',
    negative: 'Negativo',
  };
  return labels[sentiment];
}

/**
 * Calculate sentiment score percentage
 */
export function calculateSentimentPercentage(
  positive: number,
  neutral: number,
  negative: number
): { positive: number; neutral: number; negative: number } {
  const total = positive + neutral + negative;
  if (total === 0) return { positive: 0, neutral: 0, negative: 0 };
  
  return {
    positive: (positive / total) * 100,
    neutral: (neutral / total) * 100,
    negative: (negative / total) * 100,
  };
}

/**
 * Validate URL
 */
export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
