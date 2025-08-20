export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  agentType?: 'General Support' | 'Product Specialist' | 'Technical Support';
}

export interface ChatResponse {
  response: string;
  agent_type: string;
}