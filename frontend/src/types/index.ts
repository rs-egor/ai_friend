// Типы для API ответов

export interface User {
  id: number;
  email: string;
  created_at: string;
  is_active: boolean;
}

export interface Friend {
  id: number;
  name: string;
  personality: string | null;
  tone: string | null;
  gender: string | null;
  age: string | null;
  interests: string[] | null;
  scenario: string | null;
  user_id: number;
  created_at: string;
}

export interface Message {
  id: number;
  content: string;
  role: 'user' | 'assistant';
  user_id: number;
  friend_id: number;
  created_at: string;
}

export interface Memory {
  id: number;
  content: string;
  type: string;
  importance: number;
  created_at: string;
  access_count: number;
}

export interface ChatResponse {
  user_message: Message;
  ai_response: Message;
}

export interface ChatHistoryResponse {
  messages: Message[];
}

export interface MemoriesResponse {
  memories: Memory[];
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CreateFriendData {
  name: string;
  personality?: string;
  tone?: string;
  gender?: string;
  age?: string;
  interests?: string[];
  scenario?: string;
}

export interface SendMessageData {
  message: string;
  friend_id: number;
}
