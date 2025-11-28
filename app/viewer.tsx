import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { loadProfile } from '../utils/avatarManager';
import type { AvatarProfile } from '../types/profile';

const { width, height } = Dimensions.get('window');

export default function ViewerScreen() {
  const [profile, setProfile] = useState<AvatarProfile | null>(null);
  const webViewRef = React.useRef<WebView>(null);

  useEffect(() => {
    initViewer();
  }, []);

  const initViewer = async () => {
    try {
      const prof = await loadProfile();
      setProfile(prof);
    } catch (err) {
      console.error('Viewer init failed:', err);
    }
  };

  const generateViewerHtml = (prof: AvatarProfile) => {
    const profileJson = JSON.stringify(prof);
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { margin: 0; overflow: hidden; background: #000; }
          #canvas { display: block; }
        </style>
      </head>
      <body>
        <canvas id="canvas"></canvas>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r166/three.min.js"><\/script>
        <script>
          const profile = ${profileJson};
          // Include full viewer code from viewer.html artifact
          console.log('Viewer initialized with profile:', profile);
        <\/script>
      </body>
      </html>
    `;
  };

  return (
    <View style={styles.container}>
      {profile && (
        <WebView
          ref={webViewRef}
          source={{ html: generateViewerHtml(profile) }}
          style={styles.webview}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
  },
});
