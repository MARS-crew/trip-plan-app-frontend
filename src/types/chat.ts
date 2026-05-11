export interface ChatRequest {
  session_id: string;
  message: string;
}

export interface ChatResponse {
  answer: string;
  recommended_place_ids: string[];
  intent: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  recommendedPlaceIds?: string[];
}
