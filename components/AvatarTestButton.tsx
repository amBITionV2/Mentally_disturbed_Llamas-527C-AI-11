// components/AvatarTestButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AvatarSpeechManager from '../utils/AvatarSpeechManager';

export default function AvatarTestButton() {
  const testParagraph = `Hello! I'm your virtual assistant. I can speak and move my lips naturally. 
    This is a demonstration of the text to speech system with lip synchronization. 
    As I speak, you'll notice my mouth moves to match the words I'm saying. 
    I can also blink and show subtle facial expressions. 
    This works with any 3D model that has facial morph targets. 
    Pretty cool, right? Let me know if you'd like me to say something else!`;

  const handleTestSpeak = () => {
    AvatarSpeechManager.speak(testParagraph, {
      language: 'en-US',
      pitch: 1.1,
      rate: 0.92,
    });
  };

  const handleStopSpeak = () => {
    AvatarSpeechManager.stop();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.speakButton} onPress={handleTestSpeak}>
        <Ionicons name="volume-high" size={24} color="#fff" />
        <Text style={styles.buttonText}>Test Avatar Speech</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.stopButton} onPress={handleStopSpeak}>
        <Ionicons name="stop-circle" size={24} color="#fff" />
        <Text style={styles.buttonText}>Stop Speaking</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10000,
    gap: 10,
  },
  speakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
