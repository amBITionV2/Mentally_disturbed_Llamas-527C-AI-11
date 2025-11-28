
// // components/MinimizedAvatar.tsx
// import React, { useState, useRef, useEffect, useMemo } from 'react';
// import {
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   Animated,
//   PanResponder,
//   Dimensions,
//   ActivityIndicator,
// } from 'react-native';
// import { WebView } from 'react-native-webview';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Ionicons } from '@expo/vector-icons';
// import AvatarSessionManager from '../utils/AvatarSessionManager';
// import AvatarSpeechManager from '../utils/AvatarSpeechManager';

// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// const MINIMIZED_SIZE = 240;
// const DRAG_PADDING = 20;

// interface MinimizedAvatarProps {
//   initialPosition?: { x: number; y: number };
//   onExpand?: () => void;
//   onClose?: () => void;
//   size?: number;
//   textToSpeak?: string; // New prop for speech
//   autoSpeak?: boolean; // Auto-speak on mount
// }

// export default function MinimizedAvatar({
//   initialPosition,
//   onExpand,
//   onClose,
//   size = MINIMIZED_SIZE,
//   textToSpeak,
//   autoSpeak = false,
// }: MinimizedAvatarProps) {
//   const [isLoading, setIsLoading] = useState(true);
//   const [session, setSession] = useState(AvatarSessionManager.getSession());
//   const [isSpeaking, setIsSpeaking] = useState(false);

//   const pan = useRef(
//     new Animated.ValueXY(
//       initialPosition || {
//         x: SCREEN_WIDTH - size - DRAG_PADDING,
//         y: SCREEN_HEIGHT - size - 100,
//       }
//     )
//   ).current;

//   const scaleAnim = useRef(new Animated.Value(1)).current;
//   const webViewRef = useRef<WebView>(null);

//   useEffect(() => {
//     const initSession = async () => {
//       await AvatarSessionManager.initialize();
//       setSession(AvatarSessionManager.getSession());
//       setIsLoading(false);
//     };
//     initSession();

//     // Setup speech callbacks
//     AvatarSpeechManager.setOnViseme((viseme) => {
//       // Send viseme to WebView for lip-sync
//       if (webViewRef.current) {
//         webViewRef.current.injectJavaScript(`
//           if (window.updateViseme) {
//             window.updateViseme('${viseme}');
//           }
//         `);
//       }
//     });

//     AvatarSpeechManager.setOnSpeechEnd(() => {
//       setIsSpeaking(false);
//     });

//     return () => {
//       AvatarSpeechManager.stop();
//     };
//   }, []);

//   // Auto-speak on mount or when textToSpeak changes
//   useEffect(() => {
//     if (textToSpeak && autoSpeak && !isLoading) {
//       handleSpeak(textToSpeak);
//     }
//   }, [textToSpeak, autoSpeak, isLoading]);

//   const avatarHtml = useMemo(() => {
//     if (!session) return '';
    
//     // FORCE REGENERATE - Don't use cache for now to apply fixes
//     const html = generateMinimizedViewerHtml(
//       session.modelUrl,
//       session.profile,
//       session.avatarId
//     );

//     // Cache the new version
//     AvatarSessionManager.cacheHtml(session.avatarId, html);
//     return html;
//   }, [session?.avatarId, session?.modelUrl]);

//   const handleSpeak = async (text: string) => {
//     if (!text || isSpeaking) return;
    
//     setIsSpeaking(true);
    
//     try {
//       await AvatarSpeechManager.speak(text, {
//         language: 'en-IN',
//         pitch: 1.0,
//         rate: 0.95,
//       });
//     } catch (error) {
//       console.error('Speech error:', error);
//       setIsSpeaking(false);
//     }
//   };

//   const handleStopSpeaking = () => {
//     AvatarSpeechManager.stop();
//     setIsSpeaking(false);
//   };

//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: () => true,
//       onPanResponderGrant: () => {
//         pan.setOffset({ x: pan.x._value, y: pan.y._value });
//         pan.setValue({ x: 0, y: 0 });

//         Animated.spring(scaleAnim, {
//           toValue: 1.1,
//           useNativeDriver: false,
//         }).start();
//       },
//       onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
//         useNativeDriver: false,
//       }),
//       onPanResponderRelease: () => {
//         pan.flattenOffset();
//         Animated.spring(scaleAnim, {
//           toValue: 1,
//           useNativeDriver: false,
//         }).start();

//         let finalX = pan.x._value;
//         let finalY = pan.y._value;

//         finalX = Math.max(DRAG_PADDING, Math.min(finalX, SCREEN_WIDTH - size - DRAG_PADDING));
//         finalY = Math.max(DRAG_PADDING, Math.min(finalY, SCREEN_HEIGHT - size - DRAG_PADDING));

//         Animated.spring(pan, {
//           toValue: { x: finalX, y: finalY },
//           useNativeDriver: false,
//           tension: 80,
//           friction: 8,
//         }).start();
//       },
//     })
//   ).current;

//   if (isLoading) {
//     return (
//       <View style={[styles.loadingContainer, { width: size, height: size }]}>
//         <ActivityIndicator size="small" color="#667eea" />
//       </View>
//     );
//   }

//   if (!session) return null;

//   return (
//     <Animated.View
//       {...panResponder.panHandlers}
//       style={[
//         styles.container,
//         {
//           width: size,
//           height: size,
//           transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale: scaleAnim }],
//         },
//       ]}
//     >
//       <View style={styles.touchable}>
//         <TouchableOpacity style={styles.expandTouchable} onPress={onExpand}>
//           <View
//             style={[
//               styles.content,
//               { borderColor: session.profile?.theme?.accent || '#667eea' },
//             ]}
//           >
//             <WebView
//               ref={webViewRef}
//               source={{ html: avatarHtml }}
//               style={styles.webView}
//               javaScriptEnabled={true}
//               scrollEnabled={false}
//               pointerEvents="none"
//               cacheEnabled={true}
//             />

//             <LinearGradient
//               colors={session.profile?.theme?.primary || ['#667eea', '#764ba2']}
//               style={styles.expandIndicator}
//             >
//               <Ionicons name="expand" size={16} color="#fff" />
//             </LinearGradient>

//             {/* Speaking indicator */}
//             {isSpeaking && (
//               <View style={styles.speakingIndicator}>
//                 <View style={[styles.soundWave, styles.wave1]} />
//                 <View style={[styles.soundWave, styles.wave2]} />
//                 <View style={[styles.soundWave, styles.wave3]} />
//               </View>
//             )}
//           </View>

//           <View style={styles.dragIndicator}>
//             <View style={styles.dragDot} />
//             <View style={styles.dragDot} />
//             <View style={styles.dragDot} />
//           </View>
//         </TouchableOpacity>

//         {onClose && (
//           <TouchableOpacity style={styles.closeButton} onPress={onClose}>
//             <Ionicons name="close-circle" size={24} color="#fff" />
//           </TouchableOpacity>
//         )}
//       </View>
//     </Animated.View>
//   );
// }

// /* ------------------------------------------------------------------------- */
// /*  HTML WITH LIP-SYNC AND EXPRESSIONS                                      */
// /* ------------------------------------------------------------------------- */

// function generateMinimizedViewerHtml(modelUrl: string, profile: any) {
//   return `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta name="viewport" content="width=device-width, initial-scale=1">
//   <style>
//     body { margin: 0; overflow: hidden; }
//     canvas { width: 100vw; height: 100vh; }
//   </style>
// </head>
// <body>
//   <script type="importmap">
//     {
//       "imports": {
//         "three": "https://cdn.jsdelivr.net/npm/three@0.157.0/build/three.module.js",
//         "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.157.0/examples/jsm/"
//       }
//     }
//   </script>

//   <script type="module">
//     import * as THREE from 'three';
//     import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color('${profile.theme?.accent || '#222'}');

//     const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setPixelRatio(1.2);
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     document.body.appendChild(renderer.domElement);

//     const ambient = new THREE.AmbientLight(0xffffff, 1.9);
//     scene.add(ambient);

//     const loader = new GLTFLoader();
//     let mixer = null;
//     let model = null;
//     let morphTargets = {};

//     // Viseme to morph target mapping
//     const visemeMap = {
//       'aa': ['mouthOpen', 'jawOpen'],
//       'ee': ['mouthSmile'],
//       'ih': ['mouthOpen'],
//       'oh': ['mouthOpen', 'mouthFunnel'],
//       'ou': ['mouthFunnel'],
//       'pp': ['mouthClose', 'mouthPucker'],
//       'ff': ['mouthUpperUp'],
//       'th': ['mouthOpen'],
//       'ss': ['mouthSmile'],
//       'll': ['mouthOpen'],
//       'rr': ['mouthOpen'],
//       'ww': ['mouthFunnel'],
//       'neutral': []
//     };

//     loader.load('${modelUrl}', (gltf) => {
//       model = gltf.scene;
//       scene.add(model);

//       // Find mesh with morph targets
//       model.traverse((child) => {
//         if (child.isMesh && child.morphTargetDictionary) {
//           morphTargets = child.morphTargetDictionary;
//           child.morphTargetInfluences = child.morphTargetInfluences || [];
//         }
//       });

//       /* STOP ALL ANIMATIONS */
//       if (gltf.animations && gltf.animations.length > 0) {
//         mixer = new THREE.AnimationMixer(model);
//         gltf.animations.forEach(clip => {
//           const action = mixer.clipAction(clip);
//           action.stop();
//         });
//       }

//       const box = new THREE.Box3().setFromObject(model);
//       const center = box.getCenter(new THREE.Vector3());
//       const size = box.getSize(new THREE.Vector3());

//       /* CENTER MODEL AT ORIGIN */
//       model.position.sub(center);

//       /* VERY CLOSE FACE CAMERA - HEAD/FACE FOCUS */
//       const faceHeight = size.y * 0.35;
//       const faceDistance = size.y * 0.45;

//       camera.position.set(0, faceHeight, faceDistance);
//       camera.lookAt(0, faceHeight, 0);
//     });

//     // Global function for React Native to call
//     window.updateViseme = (viseme) => {
//       if (!model) return;

//       // Reset all morph targets
//       model.traverse((child) => {
//         if (child.isMesh && child.morphTargetInfluences) {
//           child.morphTargetInfluences.fill(0);
//         }
//       });

//       // Apply viseme morph targets
//       const targets = visemeMap[viseme] || [];
//       model.traverse((child) => {
//         if (child.isMesh && child.morphTargetDictionary) {
//           targets.forEach(targetName => {
//             const index = child.morphTargetDictionary[targetName];
//             if (index !== undefined) {
//               // Smooth transition
//               const current = child.morphTargetInfluences[index] || 0;
//               child.morphTargetInfluences[index] = THREE.MathUtils.lerp(current, 0.7, 0.3);
//             }
//           });

//           // Add subtle blink during speech
//           if (viseme !== 'neutral' && Math.random() < 0.05) {
//             const blinkIndex = child.morphTargetDictionary['eyeBlinkLeft'];
//             if (blinkIndex !== undefined) {
//               child.morphTargetInfluences[blinkIndex] = 1.0;
//               setTimeout(() => {
//                 child.morphTargetInfluences[blinkIndex] = 0;
//               }, 150);
//             }
//           }
//         }
//       });
//     };

//     const clock = new THREE.Clock();
    
//     function animate() {
//       requestAnimationFrame(animate);
      
//       /* NO mixer updates - model stays still unless speaking */
      
//       renderer.render(scene, camera);
//     }
//     animate();
//   </script>
// </body>
// </html>
// `;
// }

// /* ------------------------------------------------------------------------- */
// /*                             STYLES                                       */
// /* ------------------------------------------------------------------------- */

// const styles = StyleSheet.create({
//   container: {
//     position: 'absolute',
//     zIndex: 9999,
//   },
//   loadingContainer: {
//     position: 'absolute',
//     zIndex: 9999,
//     backgroundColor: 'rgba(102, 126, 234, 0.2)',
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   touchable: {
//     width: '100%',
//     height: '100%',
//   },
//   expandTouchable: {
//     width: '100%',
//     height: '100%',
//   },
//   content: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 20,
//     overflow: 'hidden',
//     backgroundColor: '#1a1a2e',
//     borderWidth: 3,
//   },
//   webView: { flex: 1, backgroundColor: 'transparent' },
//   expandIndicator: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
//     width: 20,
//     height: 20,
//     borderRadius: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 8,
//     left: 8,
//     width: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   dragIndicator: {
//     position: 'absolute',
//     bottom: 8,
//     left: '50%',
//     marginLeft: -15,
//     flexDirection: 'row',
//     gap: 4,
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   dragDot: {
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: '#fff',
//     opacity: 0.7,
//   },
//   speakingIndicator: {
//     position: 'absolute',
//     bottom: 8,
//     right: 8,
//     flexDirection: 'row',
//     gap: 3,
//     backgroundColor: 'rgba(102, 126, 234, 0.9)',
//     paddingHorizontal: 8,
//     paddingVertical: 6,
//     borderRadius: 12,
//   },
//   soundWave: {
//     width: 3,
//     backgroundColor: '#fff',
//     borderRadius: 2,
//   },
//   wave1: {
//     height: 12,
//     animation: 'wave 0.6s ease-in-out infinite',
//   },
//   wave2: {
//     height: 16,
//     animation: 'wave 0.6s ease-in-out 0.2s infinite',
//   },
//   wave3: {
//     height: 12,
//     animation: 'wave 0.6s ease-in-out 0.4s infinite',
//   },
// });
// components/MinimizedAvatar.tsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AvatarSessionManager from '../utils/AvatarSessionManager';
import AvatarSpeechManager from '../utils/AvatarSpeechManager';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MINIMIZED_SIZE = 240;
const DRAG_PADDING = 20;

interface MinimizedAvatarProps {
  initialPosition?: { x: number; y: number };
  onExpand?: () => void;
  onClose?: () => void;
  size?: number;
  textToSpeak?: string;
  autoSpeak?: boolean;
}

export default function MinimizedAvatar({
  initialPosition,
  onExpand,
  onClose,
  size = MINIMIZED_SIZE,
  textToSpeak,
  autoSpeak = false,
}: MinimizedAvatarProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(AvatarSessionManager.getSession());
  const [isSpeaking, setIsSpeaking] = useState(false);

  const pan = useRef(
    new Animated.ValueXY(
      initialPosition || {
        x: SCREEN_WIDTH - size - DRAG_PADDING,
        y: SCREEN_HEIGHT - size - 100,
      }
    )
  ).current;

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    const initSession = async () => {
      await AvatarSessionManager.initialize();
      setSession(AvatarSessionManager.getSession());
      setIsLoading(false);
    };
    initSession();

    // VISIME CALLBACK -> WebView
    AvatarSpeechManager.setOnViseme((viseme) => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          if (window.updateViseme) window.updateViseme("${viseme}");
        `);
      }
    });

    AvatarSpeechManager.setOnSpeechEnd(() => {
      setIsSpeaking(false);
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`window.setEmotion("neutral");`);
      }
    });

    return () => AvatarSpeechManager.stop();
  }, []);

  useEffect(() => {
    if (textToSpeak && autoSpeak && !isLoading) {
      handleSpeak(textToSpeak);
    }
  }, [textToSpeak, autoSpeak, isLoading]);

  const avatarHtml = useMemo(() => {
    if (!session) return '';
    const html = generateMinimizedViewerHtml(
      session.modelUrl,
      session.profile,
      session.avatarId
    );
    AvatarSessionManager.cacheHtml(session.avatarId, html);
    return html;
  }, [session?.avatarId, session?.modelUrl]);

  const handleSpeak = async (text: string) => {
    if (!text || isSpeaking) return;
    setIsSpeaking(true);

    // Smile when speaking
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`window.setEmotion("speaking");`);
    }

    try {
      await AvatarSpeechManager.speak(text, {
        language: 'en-IN',
        pitch: 1.0,
        rate: 0.95,
      });
    } catch {
      setIsSpeaking(false);
    }
  };

  const handleStopSpeaking = () => {
    AvatarSpeechManager.stop();
    setIsSpeaking(false);
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`window.setEmotion("neutral");`);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
        pan.setValue({ x: 0, y: 0 });
        Animated.spring(scaleAnim, { toValue: 1.1, useNativeDriver: false }).start();
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: false }).start();

        let finalX = Math.max(DRAG_PADDING, Math.min(pan.x._value, SCREEN_WIDTH - size - DRAG_PADDING));
        let finalY = Math.max(DRAG_PADDING, Math.min(pan.y._value, SCREEN_HEIGHT - size - DRAG_PADDING));

        Animated.spring(pan, {
          toValue: { x: finalX, y: finalY },
          useNativeDriver: false,
          tension: 80,
          friction: 8,
        }).start();
      },
    })
  ).current;

  if (isLoading)
    return (
      <View style={[styles.loadingContainer, { width: size, height: size }]}>
        <ActivityIndicator size="small" color="#667eea" />
      </View>
    );

  if (!session) return null;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          width: size,
          height: size,
          transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.touchable}>
        <TouchableOpacity style={styles.expandTouchable} onPress={onExpand}>
          <View
            style={[
              styles.content,
              { borderColor: session.profile?.theme?.accent || '#667eea' },
            ]}
          >
            <WebView
              ref={webViewRef}
              source={{ html: avatarHtml }}
              style={styles.webView}
              javaScriptEnabled={true}
              scrollEnabled={false}
              pointerEvents="none"
              cacheEnabled={true}
            />

            <LinearGradient
              colors={session.profile?.theme?.primary || ['#667eea', '#764ba2']}
              style={styles.expandIndicator}
            >
              <Ionicons name="expand" size={16} color="#fff" />
            </LinearGradient>

            {isSpeaking && (
              <View style={styles.speakingIndicator}>
                <View style={[styles.soundWave, styles.wave1]} />
                <View style={[styles.soundWave, styles.wave2]} />
                <View style={[styles.soundWave, styles.wave3]} />
              </View>
            )}
          </View>

          <View style={styles.dragIndicator}>
            <View style={styles.dragDot} />
            <View style={styles.dragDot} />
            <View style={styles.dragDot} />
          </View>
        </TouchableOpacity>

        {onClose && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close-circle" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

/* =====================================================================================
   COMPLETE HTML VIEWER WITH HEAD DETECTION + BLINK + WINK + SMILE + LIP SYNC
===================================================================================== */
function generateMinimizedViewerHtml(modelUrl: string, profile: any) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    body { margin: 0; overflow: hidden; background: #000; }
    canvas { width: 100vw; height: 100vh; display:block; }
  </style>
</head>

<body>
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

const scene = new THREE.Scene();
scene.background = new THREE.Color('${profile.theme?.accent || "#222"}');

const camera = new THREE.PerspectiveCamera(35, 1, 0.05, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha:true });
renderer.setPixelRatio(1.4);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff,1.6));

let model=null;
let faceMesh=null;

let blinkTimer=0;
let winkTimer=0;
let emotionInfluence=0;
let currentEmotion="neutral";
let smileTimer=0;
let randomSmileDelay=5+Math.random()*10;
let randomWinkDelay=15+Math.random()*20;
let isSpeaking=false;
let lastViseme="neutral";
let visemeIntensity=1.0;

// Store blink morph indices for quick access
let leftBlinkIdx=null;
let rightBlinkIdx=null;

const loader=new GLTFLoader();

/************ ENHANCED VISEMES FOR YOUR MODEL ************/
const visemeMap={
  'aa':['A'],
  'ae':['A'],
  'ah':['A'],
  'ao':['O'],
  'aw':['O'],
  'ay':['E-I'],
  'b':['B,M,P'],
  'ch':['C,D,N,Z,T,X,Y,Z'],
  'd':['C,D,N,Z,T,X,Y,Z'],
  'dh':['TH'],
  'ee':['E-I'],
  'eh':['E-I'],
  'er':['O'],
  'ey':['E-I'],
  'f':['F,V'],
  'g':['G_L'],
  'hh':['C,D,N,Z,T,X,Y,Z'],
  'ih':['E-I'],
  'iy':['E-I'],
  'jh':['C,D,N,Z,T,X,Y,Z'],
  'k':['G_L'],
  'l':['G_L'],
  'm':['B,M,P'],
  'n':['C,D,N,Z,T,X,Y,Z'],
  'ng':['G_L'],
  'oh':['O'],
  'ow':['O'],
  'oy':['O'],
  'p':['B,M,P'],
  'r':['O'],
  's':['C,D,N,Z,T,X,Y,Z'],
  'sh':['C,D,N,Z,T,X,Y,Z'],
  't':['C,D,N,Z,T,X,Y,Z'],
  'th':['TH'],
  'uh':['U'],
  'uw':['U'],
  'v':['F,V'],
  'w':['U'],
  'y':['E-I'],
  'z':['C,D,N,Z,T,X,Y,Z'],
  'zh':['C,D,N,Z,T,X,Y,Z'],
  'pp':['B,M,P'],
  'ff':['F,V'],
  'ss':['C,D,N,Z,T,X,Y,Z'],
  'll':['G_L'],
  'rr':['O'],
  'ww':['U'],
  'ou':['U'],
  'neutral':[]
};

loader.load("${modelUrl}", gltf=>{
  model=gltf.scene;
  scene.add(model);

  /** FIND HEAD MESH BY HIGHEST Y **/
  let highestY=-Infinity;
  model.traverse(c=>{
    if(c.isMesh){
      const b=new THREE.Box3().setFromObject(c);
      const center=b.getCenter(new THREE.Vector3());
      if(center.y>highestY){ highestY=center.y; faceMesh=c; }
    }
  });

  if(faceMesh){
    const b=new THREE.Box3().setFromObject(faceMesh);
    const center=b.getCenter(new THREE.Vector3());
    const size=b.getSize(new THREE.Vector3());

    model.position.sub(center);

    // CAMERA CLOSER ON Z
    const dist=Math.max(size.x,size.y)*1.8;
    const yOffset=size.y*3.3;

    camera.position.set(0,yOffset,dist);
    camera.lookAt(0,yOffset,0);

    // Find and cache blink morph indices
    if(faceMesh.morphTargetDictionary){
      const d=faceMesh.morphTargetDictionary;
      Object.keys(d).forEach(k=>{
        const lower=k.toLowerCase();
        if(lower.includes("blink")){
          if(lower.includes("left") || lower.includes("l")){
            leftBlinkIdx=d[k];
          } else if(lower.includes("right") || lower.includes("r")){
            rightBlinkIdx=d[k];
          }
        }
      });
    }
  }
});

/************** BLINK BOTH EYES **************/
function blinkNow(){
  if(!faceMesh?.morphTargetDictionary) return;
  const d=faceMesh.morphTargetDictionary;
  
  const candidates=Object.keys(d).filter(k=>
    k.toLowerCase().includes("blink")
  );
  
  candidates.forEach(k=>{
    const idx=d[k];
    faceMesh.morphTargetInfluences[idx]=1;
    setTimeout(()=>{
      faceMesh.morphTargetInfluences[idx]=0;
    },120);
  });
}

/************** WINK (LEFT OR RIGHT EYE) **************/
function winkNow(){
  if(!faceMesh?.morphTargetDictionary) return;
  const d=faceMesh.morphTargetDictionary;
  
  // Choose random eye to wink
  const winkLeft = Math.random() > 0.5;
  
  Object.keys(d).forEach(k=>{
    const lower=k.toLowerCase();
    if(lower.includes("blink")){
      const isLeft = lower.includes("left") || lower.includes("l");
      const isRight = lower.includes("right") || lower.includes("r");
      
      if((winkLeft && isLeft) || (!winkLeft && isRight)){
        const idx=d[k];
        // Wink is longer than blink
        faceMesh.morphTargetInfluences[idx]=1;
        setTimeout(()=>{
          faceMesh.morphTargetInfluences[idx]=0;
        },250);
      }
    }
  });
}

/************** AUTO BLINK **************/
function autoBlink(dt){
  blinkTimer+=dt;
  if(blinkTimer>2+Math.random()*1.5){
    blinkNow();
    blinkTimer=0;
  }
}

/************** AUTO WINK **************/
function autoWink(dt){
  if(isSpeaking) return; // Don't wink while speaking
  
  winkTimer+=dt;
  if(winkTimer>randomWinkDelay){
    winkNow();
    winkTimer=0;
    randomWinkDelay=20+Math.random()*30; // Next wink in 20-50 seconds
  }
}

/************** EMOTIONS **************/
window.setEmotion=(emotionName)=>{
  currentEmotion = emotionName;
  if(emotionName==="smile" || emotionName==="speaking"){
    isSpeaking=true;
  } else {
    isSpeaking=false;
  }
};

/************** RANDOM SMILES DURING CONVERSATION **************/
function randomSmile(dt){
  if(isSpeaking) return; // Don't override speaking expressions
  
  smileTimer+=dt;
  if(smileTimer>randomSmileDelay){
    // Trigger a brief smile
    currentEmotion="smile";
    emotionInfluence=0;
    
    setTimeout(()=>{
      if(!isSpeaking){
        currentEmotion="neutral";
      }
    }, 1500+Math.random()*1000); // Smile for 1.5-2.5 seconds
    
    smileTimer=0;
    randomSmileDelay=8+Math.random()*15; // Next smile in 8-23 seconds
  }
}

/**************** APPLY EMOTIONS ****************/
function applyEmotion(){
  if(!faceMesh?.morphTargetDictionary) return;

  const d=faceMesh.morphTargetDictionary;

  if(currentEmotion==="neutral"){
    emotionInfluence = THREE.MathUtils.lerp(emotionInfluence,0,0.15);
    
    // Gradually reset smile morphs
    const smileKeys=['C,D,N,Z,T,X,Y,Z','Up L','Up R'];
    smileKeys.forEach(name=>{
      const idx=d[name];
      if(idx!==undefined && lastViseme==="neutral"){
        faceMesh.morphTargetInfluences[idx]=THREE.MathUtils.lerp(
          faceMesh.morphTargetInfluences[idx],0,0.15
        );
      }
    });
  } else if(currentEmotion==="smile" || currentEmotion==="speaking"){
    emotionInfluence = THREE.MathUtils.lerp(emotionInfluence,1,0.12);

    // SMILE morphs with natural intensity
    const smileKeys=[
      'C,D,N,Z,T,X,Y,Z',  // mouth curve smile-ish
      'Up L','Up R'      // eyebrows up (happy expression)
    ];

    smileKeys.forEach(name=>{
      const idx=d[name];
      if(idx!==undefined && lastViseme==="neutral"){
        const targetValue = currentEmotion==="speaking" ? 0.5 : 0.7;
        faceMesh.morphTargetInfluences[idx]=emotionInfluence*targetValue;
      }
    });
  }
}

/************** ENHANCED LIP SYNC **************/
window.updateViseme=(viseme)=>{
  if(!faceMesh) return;

  const d=faceMesh.morphTargetDictionary;
  if(!d) return;

  lastViseme=viseme;

  // Reset only mouth-related morphs, preserve emotion morphs
  const mouthMorphs=['A','E-I','O','U','B,M,P','F,V','TH','C,D,N,Z,T,X,Y,Z','G_L'];
  mouthMorphs.forEach(name=>{
    const idx=d[name];
    if(idx!==undefined){
      faceMesh.morphTargetInfluences[idx]=0;
    }
  });

  // Apply emotion first (for smile/neutral state)
  applyEmotion();

  // Then overlay viseme with smooth blending
  const targets=visemeMap[viseme]||[];
  
  if(viseme!=="neutral"){
    // Dynamic intensity based on speech patterns
    visemeIntensity = THREE.MathUtils.lerp(visemeIntensity, 0.9, 0.3);
    
    targets.forEach(name=>{
      const idx=d[name];
      if(idx!==undefined){
        // Blend viseme with existing influence
        const currentVal = faceMesh.morphTargetInfluences[idx];
        const targetVal = visemeIntensity;
        faceMesh.morphTargetInfluences[idx]=Math.max(currentVal, targetVal);
      }
    });

    // Occasional blinks during speech for realism
    if(Math.random()<0.03) blinkNow();
  } else {
    visemeIntensity = THREE.MathUtils.lerp(visemeIntensity, 0, 0.2);
  }
};

/************** IDLE MOTION **************/
let t=0;
function idle(){
  if(!model) return;
  t+=0.01;
  model.rotation.y=Math.sin(t*0.5)*0.03;
}

/************** MAIN LOOP **************/
const clock=new THREE.Clock();

function animate(){
  requestAnimationFrame(animate);
  const dt=clock.getDelta();

  autoBlink(dt);
  autoWink(dt);
  randomSmile(dt);
  applyEmotion();
  idle();

  renderer.render(scene,camera);
}

animate();
</script>
</body>
</html>
`;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 9999,
  },
  loadingContainer: {
    position: 'absolute',
    zIndex: 9999,
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchable: {
    width: '100%',
    height: '100%',
  },
  expandTouchable: {
    width: '100%',
    height: '100%',
  },
  content: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1a1a2e',
    borderWidth: 3,
  },
  webView: { flex: 1, backgroundColor: 'transparent' },
  expandIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  speakingIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    gap: 3,
    backgroundColor: 'rgba(102, 126, 234, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
  },
  soundWave: {
    width: 3,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  wave1: {
    height: 12,
    animation: 'wave 0.6s ease-in-out infinite',
  },
  wave2: {
    height: 16,
    animation: 'wave 0.6s ease-in-out 0.2s infinite',
  },
  wave3: {
    height: 12,
    animation: 'wave 0.6s ease-in-out 0.4s infinite',
  },
});