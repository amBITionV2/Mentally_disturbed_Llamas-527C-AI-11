// components/ImmersiveAvatarView.tsx - UPDATED VERSION
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AvatarSessionManager from '../utils/AvatarSessionManager';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MINIMIZED_SIZE = 120;
const DRAG_PADDING = 20;

interface ImmersiveAvatarViewProps {
  avatarId: number;
  modelUrl: string;
  profile: any;
  onClose?: () => void;
}

export default function ImmersiveAvatarView({
  avatarId,
  modelUrl,
  profile,
  onClose,
}: ImmersiveAvatarViewProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  
  const pan = useRef(
    new Animated.ValueXY({
      x: SCREEN_WIDTH - MINIMIZED_SIZE - DRAG_PADDING,
      y: SCREEN_HEIGHT - MINIMIZED_SIZE - 100,
    })
  ).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const webViewRef = useRef<WebView>(null);

  // Save session and preload HTML on mount
  useEffect(() => {
    const initializeSession = async () => {
      await AvatarSessionManager.initialize();
      
      // Generate HTML for both states
      const fullscreenHtml = generateViewerHtml(false);
      const minimizedHtml = generateViewerHtml(true);
      
      // Cache both versions
      AvatarSessionManager.cacheHtml(avatarId, minimizedHtml);
      
      // Save session with preloaded HTML
      await AvatarSessionManager.saveSession(
        avatarId,
        modelUrl,
        profile,
        minimizedHtml
      );
      
      setHtmlContent(fullscreenHtml);
    };

    initializeSession();
  }, [avatarId, modelUrl, profile]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isMinimized,
      onMoveShouldSetPanResponder: () => isMinimized,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 });

        Animated.spring(scaleAnim, {
          toValue: 1.1,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();

        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }).start();

        let finalX = pan.x._value;
        let finalY = pan.y._value;

        finalX = Math.max(
          DRAG_PADDING,
          Math.min(finalX, SCREEN_WIDTH - MINIMIZED_SIZE - DRAG_PADDING)
        );
        finalY = Math.max(
          DRAG_PADDING,
          Math.min(finalY, SCREEN_HEIGHT - MINIMIZED_SIZE - DRAG_PADDING)
        );

        Animated.spring(pan, {
          toValue: { x: finalX, y: finalY },
          useNativeDriver: false,
          tension: 80,
          friction: 8,
        }).start();
      },
    })
  ).current;

  const handleMinimize = () => {
    setIsMinimized(true);
    // Load cached minimized HTML
    const cachedHtml = AvatarSessionManager.getCachedHtml(avatarId);
    if (cachedHtml) {
      setHtmlContent(cachedHtml);
    } else {
      setHtmlContent(generateViewerHtml(true));
    }
    
    Animated.spring(pan, {
      toValue: {
        x: SCREEN_WIDTH - MINIMIZED_SIZE - DRAG_PADDING,
        y: SCREEN_HEIGHT - MINIMIZED_SIZE - 100,
      },
      useNativeDriver: false,
    }).start();
  };

  const handleMaximize = () => {
    setIsMinimized(false);
    setHtmlContent(generateViewerHtml(false));
    
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const generateViewerHtml = (minimized: boolean) => {
    const particleCount = minimized ? 8 : 25;
    const pixelRatio = minimized ? 1.5 : 2;
    const shadowsEnabled = !minimized;
    const autoRotate = minimized;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            margin: 0; 
            overflow: hidden; 
            background: linear-gradient(135deg, ${profile.theme?.primary?.[0] || '#75798aff'} 0%, ${profile.theme?.primary?.[1] || '#c6b3d8ff'} 100%);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        canvas { 
            display: block; 
            width: 100vw; 
            height: 100vh;
        }
        .particles {
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
            top: 0;
            left: 0;
        }
        .particle {
            position: absolute;
            background: radial-gradient(circle, rgba(255,255,255,${minimized ? '0.3' : '0.4'}) 0%, rgba(255,255,255,0) 70%);
            border-radius: 50%;
            animation: float ${minimized ? '15s' : '20s'} infinite ease-in-out;
        }
        @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: ${minimized ? '0.2' : '0.3'}; }
            ${minimized ? '50%' : '25%'} { transform: translate(${minimized ? '20px' : '30px'}, ${minimized ? '-40px' : '-50px'}) scale(${minimized ? '1' : '1.1'}); opacity: ${minimized ? '0.4' : '0.6'}; }
            ${!minimized ? '50% { transform: translate(-20px, -100px) scale(0.9); opacity: 0.4; }' : ''}
            ${!minimized ? '75% { transform: translate(40px, -70px) scale(1.05); opacity: 0.5; }' : ''}
        }
        .loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: ${minimized ? '14px' : '18px'};
            font-weight: 600;
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
            z-index: 10;
            text-align: center;
            display: ${minimized ? 'none' : 'block'};
        }
        .loading-spinner {
            width: ${minimized ? '30px' : '50px'};
            height: ${minimized ? '30px' : '50px'};
            border: 4px solid rgba(255,255,255,0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 15px;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="loading" id="loading">
        <div class="loading-spinner"></div>
        <div>Loading ${profile.name}...</div>
    </div>
    <div class="particles" id="particles"></div>
    <script type="importmap">
        {
            "imports": {
                "three": "https://cdn.jsdelivr.net/npm/three@0.157.0/build/three.module.js",
                "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.157.0/examples/jsm/"
            }
        }
    </script>
    <script type="module">
        import * as THREE from 'three';
        import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

        const isMinimized = ${minimized};
        const modelUrl = '${modelUrl}';

        // Create particles
        const particlesContainer = document.getElementById('particles');
        for (let i = 0; i < ${particleCount}; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * ${minimized ? '4' : '6'} + ${minimized ? '2' : '3'};
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * ${minimized ? '15' : '20'} + 's';
            particle.style.animationDuration = (Math.random() * ${minimized ? '10' : '15'} + ${minimized ? '10' : '10'}) + 's';
            particlesContainer.appendChild(particle);
        }

        // Setup Three.js
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('${profile.theme?.accent || '#667eea'}');
        if (!isMinimized) {
            scene.fog = new THREE.Fog(0x764ba2, 8, 20);
        }

        const camera = new THREE.PerspectiveCamera(
            isMinimized ? 40 : 50, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: false,
            powerPreference: isMinimized ? 'low-power' : 'high-performance'
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, ${pixelRatio}));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.shadowMap.enabled = ${shadowsEnabled};
        if (${shadowsEnabled}) {
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }
        document.body.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, isMinimized ? 0.8 : 0.6);
        scene.add(ambientLight);
        
        const mainLight = isMinimized 
            ? new THREE.DirectionalLight(0xffffff, 1.2)
            : new THREE.SpotLight(0xffffff, 1000);
            
        mainLight.position.set(5, isMinimized ? 8 : 10, 5);
        if (!isMinimized) {
            mainLight.castShadow = true;
            mainLight.shadow.mapSize.width = 2048;
            mainLight.shadow.mapSize.height = 2048;
            mainLight.angle = Math.PI / 5;
            mainLight.penumbra = 0.4;
            mainLight.decay = 2;
        }
        scene.add(mainLight);
        
        if (!isMinimized) {
            const fillLight = new THREE.SpotLight(0x667eea, 1.8);
            fillLight.position.set(-5, 6, -3);
            fillLight.angle = Math.PI / 4;
            fillLight.penumbra = 0.5;
            scene.add(fillLight);

            const rimLight = new THREE.DirectionalLight(0x764ba2, 12);
            rimLight.position.set(0, 4, -8);
            scene.add(rimLight);
        }

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.06;
        controls.enableZoom = !isMinimized;
        controls.enablePan = false;
        controls.autoRotate = ${autoRotate};
        controls.autoRotateSpeed = 0.5;
        controls.minDistance = 1.5;
        controls.maxDistance = 12;
        controls.maxPolarAngle = Math.PI / 1.8;
        controls.minPolarAngle = Math.PI / 6;

        // Load Model
        const loader = new GLTFLoader();
        loader.setCrossOrigin('anonymous');
        let model = null;
        let mixer = null;

        loader.load(
            modelUrl,
            (gltf) => {
                model = gltf.scene;
                scene.add(model);

                const loadingEl = document.getElementById('loading');
                if (loadingEl) loadingEl.style.display = 'none';

                model.traverse((node) => {
                    if (node.isMesh) {
                        if (${shadowsEnabled}) {
                            node.castShadow = true;
                            node.receiveShadow = true;
                        }
                        
                        if (node.material) {
                            node.material.needsUpdate = true;
                            if (!Array.isArray(node.material)) {
                                node.material.metalness = Math.min(node.material.metalness || 0, 0.3);
                                node.material.roughness = Math.max(node.material.roughness || 0.5, 0.4);
                            }
                        }
                    }
                });

                if (gltf.animations && gltf.animations.length) {
                    mixer = new THREE.AnimationMixer(model);
                    const action = mixer.clipAction(gltf.animations[0]);
                    action.play();
                }

                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);

                if (isMinimized) {
                    const headCenter = new THREE.Vector3(
                        center.x,
                        center.y + size.y * 0.35,
                        center.z
                    );
                    
                    const distance = maxDim * 1.4;
                    camera.position.set(
                        headCenter.x + distance * 0.3,
                        headCenter.y + distance * 0.1,
                        headCenter.z + distance * 0.9
                    );
                    camera.lookAt(headCenter);
                    controls.target.copy(headCenter);
                } else {
                    const fov = camera.fov * (Math.PI / 180);
                    const distance = Math.abs(maxDim / Math.sin(fov / 2)) * 1.3;
                    
                    camera.position.set(
                        center.x + distance * 0.4,
                        center.y + distance * 0.25,
                        center.z + distance * 0.85
                    );
                    camera.lookAt(center);
                    controls.target.copy(center);
                }

                controls.update();
                
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({ 
                        type: 'modelLoaded', 
                        avatarId: ${avatarId},
                        cached: true
                    }));
                }
            },
            (xhr) => {
                const percent = xhr.lengthComputable 
                    ? Math.round((xhr.loaded / xhr.total) * 100)
                    : '...';
                const loadingEl = document.getElementById('loading');
                if (loadingEl && !isMinimized) {
                    const textEl = loadingEl.querySelector('div:last-child');
                    if (textEl) textEl.textContent = 'Loading ${profile.name}... ' + percent + '%';
                }
            },
            (error) => {
                console.error('Error loading model:', error);
                const loadingEl = document.getElementById('loading');
                if (loadingEl) {
                    loadingEl.innerHTML = '<div style="color: #ff6b6b;">Failed to load</div>';
                }
            }
        );

        // Animation loop
        let time = 0;
        const clock = new THREE.Clock();
        let frameCount = 0;
        
        function animate() {
            requestAnimationFrame(animate);
            
            // Reduce frame rate in minimized mode
            if (isMinimized) {
                frameCount++;
                if (frameCount % 2 !== 0) return;
            }
            
            const delta = clock.getDelta();
            time += delta;
            
            if (mixer) {
                mixer.update(delta);
            }

            controls.update();
            renderer.render(scene, camera);
        }
        animate();

        if (!isMinimized) {
            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        }
    </script>
</body>
</html>`;
  };

  if (!isMinimized) {
    return (
      <View style={styles.fullscreenContainer}>
        <WebView
          ref={webViewRef}
          source={{ html: htmlContent }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          originWhitelist={['*']}
          allowFileAccess={true}
          cacheEnabled={true}
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === 'modelLoaded') {
                console.log('Model loaded (cached:', data.cached, ')');
              }
            } catch (e) {
              console.log('WebView message:', event.nativeEvent.data);
            }
          }}
        />

        <View style={styles.controlsOverlay}>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: profile.theme.accent }]}
            onPress={handleMinimize}
            activeOpacity={0.8}
          >
            <Ionicons name="contract-outline" size={24} color="#fff" />
          </TouchableOpacity>

          {onClose && (
            <TouchableOpacity
              style={styles.controlButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        <LinearGradient
          colors={profile.theme.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.infoBadge}
        >
          <Text style={styles.infoBadgeEmoji}>🎭</Text>
          <Text style={styles.infoBadgeText}>{profile.name}</Text>
        </LinearGradient>

        <View style={styles.hintBadge}>
          <Text style={styles.hintText}>🖱️ Drag to rotate • Pinch to zoom</Text>
        </View>
      </View>
    );
  }

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.minimizedContainer,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.minimizedTouchable}
        onPress={handleMaximize}
        activeOpacity={0.9}
      >
        <View
          style={[
            styles.minimizedContent,
            { borderColor: profile.theme.accent },
          ]}
        >
          <WebView
            source={{ html: htmlContent }}
            style={styles.minimizedWebView}
            javaScriptEnabled={true}
            scrollEnabled={false}
            pointerEvents="none"
            cacheEnabled={true}
          />

          <LinearGradient
            colors={profile.theme.primary}
            style={styles.expandIndicator}
          >
            <Ionicons name="expand" size={16} color="#fff" />
          </LinearGradient>
        </View>

        <View style={styles.dragIndicator}>
          <View style={styles.dragDot} />
          <View style={styles.dragDot} />
          <View style={styles.dragDot} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fullscreenContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
  },
  controlsOverlay: {
    position: 'absolute',
    top: 50,
    right: 20,
    gap: 12,
    zIndex: 1000,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  infoBadge: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  infoBadgeEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  infoBadgeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  hintBadge: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  hintText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontWeight: '500',
  },
  minimizedContainer: {
    position: 'absolute',
    width: MINIMIZED_SIZE,
    height: MINIMIZED_SIZE,
    zIndex: 9999,
  },
  minimizedTouchable: {
    width: '100%',
    height: '100%',
  },
  minimizedContent: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1a1a2e',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 16,
    borderWidth: 3,
  },
  minimizedWebView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  expandIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  dragIndicator: {
    position: 'absolute',
    bottom: 8,
    left: '50%',
    marginLeft: -15,
    flexDirection: 'row',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dragDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fff',
    opacity: 0.7,
  },
});