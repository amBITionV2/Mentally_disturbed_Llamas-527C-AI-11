// app/immersive-avatar.tsx
import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import ImmersiveAvatarView from '../components/ImmersiveAvatarView';
import { getModelUrlById } from '../utils/AvatarModel';

type RootStackParamList = {
  index: undefined;
  'avatar-selector': undefined;
  'immersive-avatar': {
    avatarId?: string;
    modelUrl?: string;
    profile?: any;
    profileData?: string;
  };
};

type ImmersiveAvatarScreenRouteProp = RouteProp<RootStackParamList, 'immersive-avatar'>;
type ImmersiveAvatarScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'immersive-avatar'>;

// Default profile fallback
const getDefaultProfile = () => ({
  id: 1,
  name: 'EMY',
  character: 'Friend',
  mode: 'Funny',
  tone: 'Supportive',
  theme: {
    primary: ['#667eea', '#764ba2'],
    secondary: ['#5C8BF5', '#8B5CF5'],
    accent: '#667eea',
    border: '#764ba2',
  },
});

export default function ImmersiveAvatarScreen() {
  const navigation = useNavigation<ImmersiveAvatarScreenNavigationProp>();
  const route = useRoute<ImmersiveAvatarScreenRouteProp>();

  if (!route || !route.params) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Navigation error</Text>
        <Text style={styles.errorSubtext}>
          Please select an avatar from the Avatar Selector
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('avatar-selector')}
        >
          <Text style={styles.backButtonText}>Go to Avatar Selector</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const params = route?.params || {};
  const avatarId = params?.avatarId ? parseInt(params.avatarId as string) : 1;
  const modelUrl = params?.modelUrl || getModelUrlById(avatarId);
  
  let profile = params.profile;
  if (typeof params.profileData === 'string') {
    try {
      profile = JSON.parse(params.profileData);
    } catch (e) {
      console.error('Failed to parse profile data:', e);
      profile = getDefaultProfile();
    }
  }
  
  if (!profile) {
    profile = getDefaultProfile();
  }

  if (!profile || !profile.name || !profile.theme) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Avatar data is missing</Text>
        <Text style={styles.errorSubtext}>
          Please select an avatar from the Avatar Selector
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('avatar-selector')}
        >
          <Text style={styles.backButtonText}>Go to Avatar Selector</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleClose = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('index');
    }
  };

  return (
    <View style={styles.container}>
      <ImmersiveAvatarView
        avatarId={avatarId}
        modelUrl={modelUrl}
        profile={profile}
        onClose={handleClose}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorSubtext: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});