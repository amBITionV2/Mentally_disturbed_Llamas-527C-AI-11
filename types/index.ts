export interface AvatarProfile {
  baseModel: string;
  materials: {
    skinColor: string;
    hairColor: string;
    outfitPreset: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

export interface GestureConfig {
  animation: string;
  duration: number;
  cooldown: number;
  description: string;
  emote: string;
}