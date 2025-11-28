import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import * as Speech from 'expo-speech';
import AvatarPreview from '../components/AvatarPreview';
import ChatBox from '../components/ChatBox';
import { loadProfile } from '../utils/avatarManager';
import { sendChatMessage } from '../utils/api';
import type { AvatarProfile } from '../types/profile';
import type { ChatMessage } from '../types/api';

const { width, height } = Dimensions.get('window');

export default function ChatScreen() {
  const [profile, setProfile] = useState<AvatarProfile | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const avatarRef = useRef<any>(null);

  useEffect(() => {
    loadProfile()
      .then(setProfile)
      .catch(console.error);
  }, []);

  const handleSendMessage = async (text: string) => {
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const response = await sendChatMessage(text);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response },
      ]);

      if (avatarRef.current) {
        avatarRef.current.speak(response);
      }

      setIsSpeaking(true);
      await Speech.speak(response, { language: 'en' });
      setIsSpeaking(false);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.avatarContainer}>
        {profile && (
          <AvatarPreview ref={avatarRef} profile={profile} height={250} />
        )}
      </View>

      <View style={styles.chatContainer}>
        <ChatBox
          messages={messages}
          onSendMessage={handleSendMessage}
          loading={loading}
          isSpeaking={isSpeaking}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  avatarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
