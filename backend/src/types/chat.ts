/**
 * Chat Types & Data Contracts for Neo AI Service
 */

export type Role = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  id?: string;
  role: Role;
  content: string;
}

export interface ChatStreamRequest {
  messages: ChatMessage[];
  enableWebSearch?: boolean;
}

export interface TavilySearchResultItem {
  title: string;
  url: string;
  content: string;
  score?: number;
}

export interface TavilySearchResponse {
  results?: TavilySearchResultItem[];
  query?: string;
}

export interface ModelFailoverConfig {
  primaryModel: string;
  fallbackModels: string[];
  maxTokens: number;
  temperature: number;
}
