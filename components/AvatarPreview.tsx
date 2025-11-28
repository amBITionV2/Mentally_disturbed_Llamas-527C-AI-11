import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { encodeProfile } from '../utils/avatarManager';
import { MODEL_URL } from '../utils/constants';
import type { AvatarProfile } from '../types/profile';

interface AvatarPreviewProps {
  profile: AvatarProfile;
  height?: number;
}

const generatePreviewHtml = (profileJson: string, modelUrl: string): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Avatar Preview</title>
    <style>
        body { margin: 0; overflow: hidden; background-color: #333; }
        canvas { display: block; width: 100vw; height: 100vh; }
        #debug-console {
            position: absolute;
            top: 10px;
            left: 10px;
            color: #0f0;
            background: rgba(0,0,0,0.8);
            padding: 5px;
            font-family: monospace;
            font-size: 12px;
            pointer-events: none;
            user-select: none;
            max-width: 90vw;
            word-wrap: break-word;
        }
    </style>
</head>
<body>
    <div id="debug-console">Initializing...</div>
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

        const debugConsole = document.getElementById('debug-console');
        function log(message) {
            debugConsole.innerHTML = message;
            // Also send to React Native console
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'log', message }));
            }
        }

        log("Setting up scene...");

        const CONFIG = { modelUrl: '${modelUrl}' };
        // We'll use this later for customizing colors
        const profile = ${profileJson};

        // 1. Setup Scene, Camera, Renderer
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x333333); // Dark grey background

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        document.body.appendChild(renderer.domElement);

        // 2. Add Lights - Enhanced lighting for better visibility
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        scene.add(ambientLight);
        
        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight1.position.set(5, 5, 5);
        scene.add(directionalLight1);
        
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight2.position.set(-5, 3, -5);
        scene.add(directionalLight2);
        
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
        fillLight.position.set(0, -5, 0);
        scene.add(fillLight);

        // 3. Add Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        // 4. Load Model
        const loader = new GLTFLoader();
        log("Loading model from: " + CONFIG.modelUrl);

        loader.load(
            CONFIG.modelUrl,
            (gltf) => {
                log("Model loaded successfully!");
                const model = gltf.scene;
                scene.add(model);

                // Calculate bounding box
                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());

                // Get the max dimension to calculate proper camera distance
                const maxDim = Math.max(size.x, size.y, size.z);
                const fov = camera.fov * (Math.PI / 180);
                const cameraDistance = Math.abs(maxDim / Math.sin(fov / 2)) * 0.75;
                
                // Position camera to look at the model
                camera.position.set(
                    center.x + cameraDistance * 0.5,
                    center.y + cameraDistance * 0.3,
                    center.z + cameraDistance
                );
                camera.lookAt(center);
                
                // Set controls target to model center
                controls.target.copy(center);
                controls.minDistance = maxDim * 0.5;
                controls.maxDistance = maxDim * 5;
                controls.update();

                // Apply profile colors after loading
                applyProfileColors(model);
                
                log("Camera positioned. Model should be visible!");
            },
            (xhr) => {
                // Progress callback
                if (xhr.lengthComputable) {
                    const percent = (xhr.loaded / xhr.total * 100).toFixed(0);
                    log(\`Loading model: \${percent}%\`);
                } else {
                    const loadedMB = (xhr.loaded / 1024 / 1024).toFixed(2);
                    log(\`Loading model: \${loadedMB} MB\`);
                }
            },
            (error) => {
                log(\`Error loading model: \${error.message}\`);
                console.error('An error happened', error);
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'log', level: 'error', message: error.message }));
                }
            }
        );

        // Function to apply colors from the profile to the model
        function applyProfileColors(model) {
            if (!model) return;
            model.traverse((o) => {
                if (o.isMesh) {
                    // Ensure material exists and is editable
                    if (o.material) {
                        // Clone material to avoid affecting other meshes
                        if (Array.isArray(o.material)) {
                            o.material = o.material.map(m => m.clone());
                        } else {
                            o.material = o.material.clone();
                        }
                        
                        // Apply colors based on mesh name
                        const meshName = o.name.toLowerCase();
                        const materials = Array.isArray(o.material) ? o.material : [o.material];
                        
                        materials.forEach(mat => {
                            if (meshName.includes('skin') || meshName.includes('body') || meshName.includes('head')) {
                                mat.color.setStyle(profile.materials.skinColor || '#ffdbac');
                            }
                            if (meshName.includes('hair')) {
                                mat.color.setStyle(profile.materials.hairColor || '#8b4513');
                            }
                            if (meshName.includes('outfit') || meshName.includes('cloth') || meshName.includes('shirt')) {
                                mat.color.setStyle(profile.materials.outfitColor || '#ff0000');
                            }
                            // Ensure material is visible
                            mat.needsUpdate = true;
                        });
                    }
                }
            });
        }

        // Set initial camera position before model loads (fallback)
        camera.position.set(0, 1.5, 3);
        camera.lookAt(0, 1, 0);
        controls.target.set(0, 1, 0);

        // 5. Animation Loop
        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();

        // 6. Handle Resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    </script>
</body>
</html>
  `;
};

const AvatarPreview = forwardRef<any, AvatarPreviewProps>(
  ({ profile, height = 300 }, ref) => {
    const webViewRef = useRef<WebView>(null);
    const iframeRef = useRef<any>(null);
    const isWeb = Platform.OS === 'web';
    
    // Important: Ensure profile values have defaults if they are undefined
    const safeProfile = {
        ...profile,
        materials: {
            // Spread actual values first, then provide defaults for missing ones
            skinColor: '#ffdbac',
            hairColor: '#8b4513',
            outfitColor: '#FF0000',
            ...profile.materials, // This will override defaults with actual values
        }
    };
    
    // Ensure MODEL_URL is a valid string, fallback to a test model
    const modelUrl = MODEL_URL || 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/RobotExpressive/glTF/RobotExpressive.gltf';
    
    const profileJson = encodeProfile(safeProfile);
    const viewerHtml = generatePreviewHtml(profileJson, modelUrl);

    useImperativeHandle(ref, () => ({
      // You can re-implement send functions here if needed later
      // send: (data: any) => { ... }
    }));

    if (isWeb) {
      return (
        <View style={[styles.container, { height }]}>
          <iframe
            ref={iframeRef}
            srcDoc={viewerHtml}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allow="autoplay"
            // Removed allow-same-origin to prevent warnings in some browsers
            sandbox="allow-scripts" 
          />
        </View>
      );
    }

    return (
      <View style={[styles.container, { height }]}>
        <WebView
          ref={webViewRef}
          source={{ html: viewerHtml }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          originWhitelist={['*']}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          mixedContentMode="always"
          renderLoading={() => (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#2563eb" />
              <Text style={styles.loaderText}>Initializing...</Text>
            </View>
          )}
          startInLoadingState={true}
          onMessage={(event) => {
            try {
              // Parse the message data
              const data = JSON.parse(event.nativeEvent.data);
              
              if (data.type === 'log') {
                 const prefix = data.level === 'error' ? '❌ ' : '🔹 ';
                 console.log(`WebView ${prefix}`, data.message);
              }
            } catch (e) {
              // Fallback for simple string messages
              console.log('WebView Raw:', event.nativeEvent.data);
            }
          }}
        />
      </View>
    );
  }
);

AvatarPreview.displayName = 'AvatarPreview';

export default AvatarPreview;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
  },
  webview: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e2e',
  },
  loaderText: {
    color: '#2563eb',
    marginTop: 10,
    fontSize: 14,
  },
});