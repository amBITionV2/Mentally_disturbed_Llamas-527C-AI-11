// app/_layout.tsx - UPDATED WITH SESSION INITIALIZATION
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AvatarSessionManager from '../utils/AvatarSessionManager';

export default function RootLayout() {
  useEffect(() => {
    // Initialize avatar session manager on app startup
    const initSessionManager = async () => {
      try {
        await AvatarSessionManager.initialize();
        console.log('✅ AvatarSessionManager initialized');
        
        // Log session status (debug)
        if (AvatarSessionManager.hasSession()) {
          const session = AvatarSessionManager.getSession();
          console.log('📦 Restored session:', session?.profile?.name);
          console.log('⏰ Session age:', Math.round(AvatarSessionManager.getSessionAge() / 1000 / 60), 'minutes');
        }
      } catch (error) {
        console.error('❌ Failed to initialize AvatarSessionManager:', error);
      }
    };

    initSessionManager();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a1a1a',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#0a0a0a',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Avatar Studio',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="avatar-selector"
          options={{
            title: 'Choose Avatar',
            headerShown: true,
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="immersive-avatar"
          options={{
            title: 'Avatar View',
            headerShown: false,
            presentation: 'fullScreenModal',
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="chat"
          options={{
            title: 'Chat with Avatar',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="viewer"
          options={{
            title: 'Full Screen Viewer',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="test"
          options={{
            title: 'Test Avatar',
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}