// Character3DView.js
// Main 3D Character Display Component
import React, { useRef, useEffect, useState, Suspense } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { useGLTF } from '@react-three/drei/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
} from 'react-native-reanimated';

// Character Model Component
const CharacterModel = ({ url, isListening, isSpeaking, emotion, onLoad }) => {
  const modelRef = useRef();
  const mixerRef = useRef(null);
  const blinkTimerRef = useRef(0);
  
  // Load the GLTF model
  const { scene, animations } = useGLTF(url);

  useEffect(() => {
    if (scene) {
      // Setup animations if available
      if (animations && animations.length > 0) {
        const THREE = require('three');
        mixerRef.current = new THREE.AnimationMixer(scene);
        
        animations.forEach((clip) => {
          const action = mixerRef.current.clipAction(clip);
          action.play();
        });
      }

      onLoad();
    }
  }, [scene, animations, onLoad]);

  // Animation loop
  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }

    if (modelRef.current) {
      // Idle breathing animation
      if (!isSpeaking) {
        modelRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.01;
      }

      // Blinking animation
      blinkTimerRef.current += delta;
      if (blinkTimerRef.current > 3) {
        blinkTimerRef.current = 0;
        // Blink logic here
      }

      // Speaking animation - subtle head bob
      if (isSpeaking) {
        modelRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 8) * 0.02;
      }

      // Listening animation - subtle head tilt
      if (isListening) {
        modelRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
        modelRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.3) * 0.05;
      }
    }
  });

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={1.5}
      position={[0, -0.8, 0]}
    />
  );
};

// Main Character View Component
const Character3DView = ({
  characterUrl,
  isListening = false,
  isSpeaking = false,
  emotion = 'neutral',
  onLoad,
  style,
  compact = false, // New prop for corner view
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    if (isListening) {
      pulseAnim.value = withRepeat(
        withSpring(1.05, { damping: 2 }),
        -1,
        true
      );
    } else {
      pulseAnim.value = withTiming(1);
    }
  }, [isListening]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  return (
    <Animated.View style={[styles.container, style, animatedStyle]}>
      {!isLoaded && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C63FF" />
        </View>
      )}
      <Canvas
        camera={{ 
          position: compact ? [0, 0, 2.5] : [0, 0, 3], 
          fov: compact ? 45 : 50 
        }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, 5, 5]} intensity={0.4} />
        
        <Suspense fallback={null}>
          <CharacterModel
            url={characterUrl}
            isListening={isListening}
            isSpeaking={isSpeaking}
            emotion={emotion}
            onLoad={handleLoad}
          />
        </Suspense>
      </Canvas>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});

export default Character3DView;