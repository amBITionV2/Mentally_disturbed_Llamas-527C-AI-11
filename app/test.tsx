import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
// In your screen where you show MinimizedAvatar
import MinimizedAvatar from '../components/MinimizedAvatar';
import AvatarTestButton from '../components/AvatarTestButton';

export default function YourScreen() {
  return (
    <View style={{ flex: 1 }}>
      {/* Your existing content */}
      
      {/* Minimized Avatar */}
      <MinimizedAvatar />
      
      {/* TEST BUTTON - Click this to make avatar speak! */}
      <AvatarTestButton />
    </View>
  );
}