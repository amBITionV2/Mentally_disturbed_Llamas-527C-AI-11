import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import AvatarPreview from './AvatarPreview';
import type { AvatarProfile } from '../types/profile';

interface TestAvatarComponentProps {
  profile: AvatarProfile;
}

export default function TestAvatarComponent({
  profile,
}: TestAvatarComponentProps) {
  const avatarRef = useRef<any>(null);
  const [currentGesture, setCurrentGesture] = useState('idle');
  const [lastSpeak, setLastSpeak] = useState('');

  const gestures = [
    { id: 'wave', label: '👋 Wave', icon: 'wave' },
    { id: 'nod', label: '🤝 Nod', icon: 'nod' },
    { id: 'thumbsup', label: '👍 Thumbs Up', icon: 'thumbsup' },
    { id: 'idle', label: '😌 Idle', icon: 'idle' },
  ];

  const testPhrases = [
    'Hello! Nice to meet you.',
    'I can animate and speak!',
    'Try clicking different gestures.',
    'This avatar system is awesome!',
  ];

  const handleGesture = (gestureId: string) => {
    setCurrentGesture(gestureId);
    if (avatarRef.current) {
      avatarRef.current.gesture(gestureId);
    }
  };

  const handleSpeak = (text: string) => {
    setLastSpeak(text);
    if (avatarRef.current) {
      avatarRef.current.speak(text);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.avatarContainer}>
        <Text style={styles.title}>Test Avatar Viewer</Text>
        {profile && <AvatarPreview ref={avatarRef} profile={profile} height={280} />}
        <Text style={styles.gestureLabel}>Current: {currentGesture}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎭 Gestures</Text>
        <View style={styles.gestureGrid}>
          {gestures.map((gesture) => (
            <TouchableOpacity
              key={gesture.id}
              style={[
                styles.gestureButton,
                currentGesture === gesture.id && styles.gestureButtonActive,
              ]}
              onPress={() => handleGesture(gesture.id)}
            >
              <Text style={styles.gestureButtonText}>{gesture.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔊 Test Speech</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.phraseScroll}
        >
          {testPhrases.map((phrase, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.phraseButton}
              onPress={() => handleSpeak(phrase)}
            >
              <Text style={styles.phraseButtonText} numberOfLines={2}>
                {phrase}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {lastSpeak && (
          <View style={styles.lastSpeakBox}>
            <Text style={styles.lastSpeakLabel}>Last spoken:</Text>
            <Text style={styles.lastSpeakText}>{lastSpeak}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 Profile Info</Text>
        <View style={styles.profileInfo}>
          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Skin:</Text>
            <View style={styles.profileValue}>
              <View
                style={[
                  styles.colorSwatch,
                  { backgroundColor: profile.materials.skinColor },
                ]}
              />
              <Text style={styles.profileValueText}>
                {profile.materials.skinColor}
              </Text>
            </View>
          </View>
          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Hair:</Text>
            <View style={styles.profileValue}>
              <View
                style={[
                  styles.colorSwatch,
                  { backgroundColor: profile.materials.hairColor },
                ]}
              />
              <Text style={styles.profileValueText}>
                {profile.materials.hairColor}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  avatarContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 15,
  },
  gestureLabel: {
    marginTop: 10,
    fontSize: 13,
    color: '#aaa',
  },
  section: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
    marginBottom: 12,
  },
  gestureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gestureButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  gestureButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  gestureButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  phraseScroll: {
    marginBottom: 15,
  },
  phraseButton: {
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#1a5490',
    borderRadius: 8,
    minWidth: 150,
    justifyContent: 'center',
  },
  phraseButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  lastSpeakBox: {
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4ade80',
  },
  lastSpeakLabel: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 5,
  },
  lastSpeakText: {
    color: '#fff',
    fontSize: 13,
    fontStyle: 'italic',
  },
  profileInfo: {
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 8,
    gap: 10,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileLabel: {
    color: '#aaa',
    fontSize: 12,
  },
  profileValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorSwatch: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#555',
  },
  profileValueText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  spacer: {
    height: 40,
  },
});