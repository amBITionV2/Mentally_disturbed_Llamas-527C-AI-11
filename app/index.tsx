// app/index.tsx - FIXED VERSION
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import AvatarPreview from '../components/AvatarPreview';
import AvatarCustomizer from '../components/AvatarCustomizer';
import MinimizedAvatar from '../components/MinimizedAvatar';
import { loadProfile, saveProfile } from '../utils/avatarManager';
import AvatarSessionManager from '../utils/AvatarSessionManager';
import type { AvatarProfile } from '../types/profile';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<AvatarProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMinimizedAvatar, setShowMinimizedAvatar] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // REMOVED: Duplicate initialization (already done in _layout.tsx)
      // await AvatarSessionManager.initialize();
      
      // Check if there's a saved session
      if (AvatarSessionManager.hasSession()) {
        setShowMinimizedAvatar(true);
      }

      // Load profile
      const stored = await loadProfile();
      setProfile(stored);
    } catch (err) {
      console.error('Failed to initialize app:', err);
      setProfile(getDefaultProfile());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultProfile = (): AvatarProfile => ({
    baseModel: 'model.glb',
    materials: {
      skinColor: '#E7C7A4',
      hairColor: '#2b1b0f',
      outfitPreset: 'jacket_blue',
    },
  });

  const handleProfileUpdate = async (updates: Partial<AvatarProfile>) => {
    if (!profile) return;
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    try {
      await saveProfile(newProfile);
    } catch (err) {
      console.error('Failed to save profile:', err);
    }
  };

  const handleExpandAvatar = () => {
    const session = AvatarSessionManager.getSession();
    if (session) {
      router.push({
        pathname: '/immersive-avatar',
        params: {
          avatarId: session.avatarId.toString(),
          modelUrl: session.modelUrl,
          profileData: JSON.stringify(session.profile),
        },
      });
    }
  };

  const handleCloseAvatar = async () => {
    setShowMinimizedAvatar(false);
    // Optionally clear the session
    // await AvatarSessionManager.clearSession();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading Avatar...</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Avatar Preview */}
        <View style={styles.previewContainer}>
          <Text style={styles.sectionTitle}>Avatar Preview</Text>
          {profile && <AvatarPreview profile={profile} height={300} />}
        </View>

        {/* Customizer */}
        <View style={styles.customizeContainer}>
          {profile && (
            <AvatarCustomizer
              profile={profile}
              onUpdate={handleProfileUpdate}
            />
          )}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          {/* Avatar Selector Button - Main Feature */}
          <TouchableOpacity
            style={[styles.button, styles.selectorButton]}
            onPress={() => router.push('/avatar-selector')}
          >
            <Text style={styles.buttonText}>👥 Choose Avatar Friend</Text>
            <Text style={styles.buttonSubtext}>Select & view 3D avatars</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.chatButton]}
            onPress={() => router.push('/chat')}
          >
            <Text style={styles.buttonText}>💬 Chat with Avatar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.viewerButton]}
            onPress={() => router.push('/viewer')}
          >
            <Text style={styles.buttonText}>🎬 Full Screen Viewer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.testButton]}
            onPress={() => router.push('/test')}
          >
            <Text style={styles.buttonText}>🧪 Test Gestures</Text>
          </TouchableOpacity>

          {/* Toggle Minimized Avatar Button */}
          {AvatarSessionManager.hasSession() && (
            <TouchableOpacity
              style={[styles.button, styles.toggleButton]}
              onPress={() => setShowMinimizedAvatar(!showMinimizedAvatar)}
            >
              <Text style={styles.buttonText}>
                {showMinimizedAvatar ? '👁️ Hide Avatar' : '👁️‍🗨️ Show Avatar'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>ℹ️ Quick Start</Text>
          <Text style={styles.infoText}>
            1. Tap "Choose Avatar Friend" to select from 6 unique avatars
          </Text>
          <Text style={styles.infoText}>
            2. Browse the carousel and tap "Choose me" to view in 3D
          </Text>
          <Text style={styles.infoText}>
            3. Drag to rotate, pinch to zoom, and minimize to float
          </Text>
          <Text style={styles.infoText}>
            4. Your chosen avatar appears as a floating mini companion
          </Text>
        </View>

        {/* Session Info (Debug) */}
        {__DEV__ && AvatarSessionManager.hasSession() && (
          <View style={styles.debugSection}>
            <Text style={styles.debugTitle}>🔧 Session Info</Text>
            <Text style={styles.debugText}>
              Active Avatar: {AvatarSessionManager.getSession()?.profile.name}
            </Text>
            <Text style={styles.debugText}>
              Session Age: {Math.round(AvatarSessionManager.getSessionAge() / 1000 / 60)}m
            </Text>
            <Text style={styles.debugText}>
              Fresh: {AvatarSessionManager.isSessionFresh() ? '✅' : '❌'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Minimized Avatar */}
      {showMinimizedAvatar && AvatarSessionManager.hasSession() && (
        <MinimizedAvatar
          onExpand={handleExpandAvatar}
          onClose={handleCloseAvatar}
          size={160}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 140, // Extra space for floating avatar
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  customizeContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  buttonContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  selectorButton: {
    backgroundColor: '#667eea',
    borderWidth: 2,
    borderColor: '#764ba2',
  },
  chatButton: {
    backgroundColor: '#2563eb',
  },
  viewerButton: {
    backgroundColor: '#7c3aed',
  },
  testButton: {
    backgroundColor: '#059669',
  },
  toggleButton: {
    backgroundColor: '#f59e0b',
    borderWidth: 2,
    borderColor: '#d97706',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  infoSection: {
    marginHorizontal: 15,
    marginTop: 10,
    padding: 20,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  infoTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  infoText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  debugSection: {
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  debugTitle: {
    color: '#f59e0b',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  debugText: {
    color: '#fbbf24',
    fontSize: 12,
    marginBottom: 4,
    fontFamily: 'monospace',
  },
});