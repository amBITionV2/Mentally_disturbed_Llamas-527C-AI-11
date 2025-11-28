import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AvatarProfile } from '../types/profile';

const PROFILE_KEY = 'avatar_profile';

const DEFAULT_PROFILE: AvatarProfile = {
  baseModel: 'model.glb',
  materials: {
    skinColor: '#E7C7A4',
    hairColor: '#2b1b0f',
    outfitPreset: 'jacket_blue',
  },
};

export async function loadProfile(): Promise<AvatarProfile> {
  try {
    const stored = await AsyncStorage.getItem(PROFILE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_PROFILE;
  } catch (err) {
    console.error('Load profile error:', err);
    return DEFAULT_PROFILE;
  }
}

export async function saveProfile(profile: AvatarProfile): Promise<boolean> {
  try {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    return true;
  } catch (err) {
    console.error('Save profile error:', err);
    return false;
  }
}

export function encodeProfile(profile: AvatarProfile): string {
  return JSON.stringify(profile);
}

export function decodeProfile(encoded: string): AvatarProfile {
  try {
    return JSON.parse(encoded);
  } catch {
    return DEFAULT_PROFILE;
  }
}