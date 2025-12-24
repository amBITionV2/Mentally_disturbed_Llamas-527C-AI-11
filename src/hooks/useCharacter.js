// hooks/useCharacter.js
// Character state management hook
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import axios from 'axios';

const STORAGE_KEY = 'user_character';
const API_BASE_URL = 'https://your-api.com'; // Replace with your API

export const useCharacter = () => {
  const [character, setCharacter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState({
    isListening: false,
    isSpeaking: false,
    emotion: 'neutral',
  });

  // Load character from storage on mount
  useEffect(() => {
    loadCharacter();
  }, []);

  const loadCharacter = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const characterData = JSON.parse(stored);
        setCharacter(characterData);
      }
    } catch (error) {
      console.error('Error loading character:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCharacter = async (characterData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(characterData));
      setCharacter(characterData);
    } catch (error) {
      console.error('Error saving character:', error);
    }
  };

useEffect(() => {
  if (!character) {
    // Set a default test character
    saveCharacter({
      name: 'Rancho',
      gender: 'male',
      personality: 'friendly',
      modelUrl: 'https://models.readyplayer.me/64bfa15f0e72c63d7c3934a6.glb',
    });
  }
}, []);

  const updateCharacter = async (updates) => {
    const updated = { ...character, ...updates };
    await saveCharacter(updated);
  };

  const deleteCharacter = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setCharacter(null);
    } catch (error) {
      console.error('Error deleting character:', error);
    }
  };

  // Set listening state
  const setListening = useCallback((listening) => {
    setState((prev) => ({ ...prev, isListening: listening }));
  }, []);

  // Speak text with TTS
  const speak = useCallback(async (text, emotion = 'neutral') => {
    setState((prev) => ({ ...prev, isSpeaking: true, emotion }));

    try {
      await Speech.speak(text, {
        language: 'en-US',
        pitch: character?.gender === 'male' ? 0.9 : 1.1,
        rate: 0.95,
        onDone: () => {
          setState((prev) => ({ ...prev, isSpeaking: false }));
        },
        onError: () => {
          setState((prev) => ({ ...prev, isSpeaking: false }));
        },
      });
    } catch (error) {
      console.error('TTS error:', error);
      setState((prev) => ({ ...prev, isSpeaking: false }));
    }
  }, [character]);

  // Stop speaking
  const stopSpeaking = useCallback(async () => {
    try {
      await Speech.stop();
      setState((prev) => ({ ...prev, isSpeaking: false }));
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  }, []);

  // Send message to API
  const sendMessage = useCallback(async (message, apiEndpoint = null) => {
    const endpoint = apiEndpoint || `${API_BASE_URL}/friend`;

    try {
      const response = await axios.post(
        endpoint,
        {
          message,
          characterContext: {
            name: character?.name,
            gender: character?.gender,
            personality: character?.personality,
          },
        },
        {
          timeout: 15000,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const reply = response.data.reply || response.data.message;
      const emotion = response.data.emotion || 'neutral';

      // Update emotion state
      setState((prev) => ({ ...prev, emotion }));

      // Speak the response
      if (reply) {
        await speak(reply, emotion);
      }

      return reply;
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  }, [character, speak]);

  return {
    character,
    isLoading,
    state,
    saveCharacter,
    updateCharacter,
    deleteCharacter,
    setListening,
    speak,
    stopSpeaking,
    sendMessage,
  };
};