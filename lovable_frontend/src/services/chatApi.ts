import axios from 'axios';
// Response is now Dict<string, any> from backend

const API_BASE_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Accept optional conversationId for chat history
export const sendMessage = async (
  query: string,
  conversationId?: string
): Promise<Record<string, any>> => {
  try {
    const payload: Record<string, any> = { query };
    if (conversationId) {
      payload.conversation_id = conversationId;
    }
    const response = await api.post<Record<string, any>>('/chat', payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        throw new Error('Unable to connect to chat service. Please ensure the backend server is running on http://127.0.0.1:8000');
      }
      if (error.response?.status === 500) {
        throw new Error('Server error occurred. Please try again.');
      }
      if (error.response?.status === 404) {
        throw new Error('Chat endpoint not found. Please check the API configuration.');
      }
    }
    throw new Error('Failed to send message. Please try again.');
  }
};