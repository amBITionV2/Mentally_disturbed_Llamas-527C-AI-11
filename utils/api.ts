import type { ChatResponse } from '../types/api';

const API_BASE = 'https://api.example.com';

export async function sendChatMessage(text: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    });

    if (!response.ok) throw new Error('API error');
    const data: ChatResponse = await response.json();
    return data.reply || 'No response';
  } catch (err) {
    console.error('Chat API error:', err);
    return getMockResponse(text);
  }
}

export function getMockResponse(text: string): string {
  const responses: Record<string, string> = {
    hello: "Hi there! I'm your AI avatar.",
    hi: "Hey! What can I help you with?",
    how: "I'm doing great, thanks for asking!",
    default: "That's interesting! Tell me more.",
  };

  const lower = text.toLowerCase();
  for (const [key, value] of Object.entries(responses)) {
    if (lower.includes(key)) return value;
  }
  return responses.default;
}