// CharacterCorner.js
// Small 3D character widget for bottom-left corner
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import Character3DView from './Character3DView';

const CharacterCorner = ({ 
  characterUrl, 
  isSpeaking = false,
  isListening = false,
  emotion = 'neutral',
  onPress,
  statusText = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    // Pulse animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (onPress) {
      onPress();
    }
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ scale: scaleAnim }] }
      ]}
    >
      <TouchableOpacity 
        style={styles.touchable}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <BlurView intensity={40} style={styles.blurContainer}>
          {/* 3D Character */}
          <View style={styles.characterContainer}>
            <Character3DView
              characterUrl={characterUrl}
              isSpeaking={isSpeaking}
              isListening={isListening}
              emotion={emotion}
              compact={true}
              style={styles.character}
            />
          </View>

          {/* Status Indicator */}
          {(isSpeaking || isListening || statusText) && (
            <View style={styles.statusContainer}>
              <View style={[
                styles.statusDot,
                isSpeaking && styles.speakingDot,
                isListening && styles.listeningDot,
              ]} />
              {statusText && (
                <Text style={styles.statusText} numberOfLines={1}>
                  {statusText}
                </Text>
              )}
            </View>
          )}

          {/* Tap indicator */}
          <View style={styles.tapIndicator}>
            <Text style={styles.tapText}>Tap to chat</Text>
          </View>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 120,
    height: 140,
    zIndex: 1000,
  },
  touchable: {
    flex: 1,
  },
  blurContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(108, 99, 255, 0.3)',
    backgroundColor: 'rgba(15, 15, 30, 0.5)',
  },
  characterContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  character: {
    flex: 1,
  },
  statusContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
    backgroundColor: '#888',
  },
  speakingDot: {
    backgroundColor: '#4CAF50',
  },
  listeningDot: {
    backgroundColor: '#6C63FF',
  },
  statusText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  tapIndicator: {
    position: 'absolute',
    bottom: 4,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  tapText: {
    color: '#6C63FF',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default CharacterCorner;