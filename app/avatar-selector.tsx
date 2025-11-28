// app/avatar-selector.tsx

//Since I am using Expo Router (file-based routing), the avatar-selector.tsx file in the app/ directory serves as both:

// The route (/avatar-selector)
// The component (the screen itself)



import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  StatusBar,
  Platform,
  SafeAreaView,
} from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { getModelUrlById } from '../utils/AvatarModel';
import AvatarSessionManager from '../utils/AvatarSessionManager';


const avatarData = [
  {
    id: 1,
    name: 'EMY',
    fullBody: require('../assets/avatars/emy.png'),
    face: require('../assets/avatars/face/emy_face.png'),
    description: "Hi this is Emy.\nI would be very happy to\nspend my time with you",
    character: 'Friend',
    mode: 'Funny',
    tone: 'Supportive',
    theme: {
      primary: ['#667eea', '#764ba2'],
      secondary: ['#5C8BF5', '#8B5CF5'],
      accent: '#667eea',
      border: '#764ba2',
    },
  },
  {
    id: 2,
    name: 'ALEX',
    fullBody: require('../assets/avatars/alex.png'),
    face: require('../assets/avatars/face/alex_face.png'),
    description: "Hey there! Alex here.\nReady to learn something\namazing together?",
    character: 'Mentor',
    mode: 'Wise',
    tone: 'Encouraging',
    theme: {
      primary: ['#f093fb', '#f5576c'],
      secondary: ['#d663caff', '#FF6B9D'],
      accent: '#f093fb',
      border: '#f5576c',
    },
  },
  {
    id: 3,
    name: 'MAYA',
    fullBody: require('../assets/avatars/maya.png'),
    face: require('../assets/avatars/face/maya_face.png'),
    description: "Hello! Maya here.\nLet's make today\nabsolutely awesome!",
    character: 'Companion',
    mode: 'Cheerful',
    tone: 'Energetic',
    theme: {
      primary: ['#a8edea', '#fed6e3'],
      secondary: ['#429E65', '#6DD5A5'],
      accent: '#a8edea',
      border: '#fed6e3',
    },
  },
  {
    id: 4,
    name: 'KAI',
    fullBody: require('../assets/avatars/kai.png'),
    face: require('../assets/avatars/face/kai_face.png'),
    description: "Hi! I'm Kai.\nLet's explore new\nideas together!",
    character: 'Explorer',
    mode: 'Creative',
    tone: 'Inspiring',
    theme: {
      primary: ['#fdcb6e', '#e17055'],
      secondary: ['#f39c12', '#e74c3c'],
      accent: '#fdcb6e',
      border: '#e17055',
    },
  },
  {
    id: 5,
    name: 'LUNA',
    fullBody: require('../assets/avatars/luna.png'),
    face: require('../assets/avatars/face/luna_face.png'),
    description: "Hi this is Luna.\nI would be very happy to\nspend my time with you",
    character: 'Friend',
    mode: 'Funny',
    tone: 'Supportive',
    theme: {
      primary: ['#667eea', '#764ba2'],
      secondary: ['#5C8BF5', '#8B5CF5'],
      accent: '#667eea',
      border: '#764ba2',
    },
  },
  {
    id: 6,
    name: 'HARRY',
    fullBody: require('../assets/avatars/Harry.png'),
    face: require('../assets/avatars/face/Harry_face.png'),
    description: "Hi this is Harry.\nI would be very happy to\nspend my time with you",
    character: 'Friend',
    mode: 'Funny',
    tone: 'Supportive',
    theme: {
      primary: ['#667eea', '#764ba2'],
      secondary: ['#5C8BF5', '#8B5CF5'],
      accent: '#667eea',
      border: '#764ba2',
    },
  },
  {
    id: 7,
    name: 'EMMA',
    fullBody: require('../assets/avatars/Harry.png'),
    face: require('../assets/avatars/face/Harry_face.png'),
    description: "Hi this is Harry.\nI would be very happy to\nspend my time with you",
    character: 'Friend',
    mode: 'Funny',
    tone: 'Supportive',
    theme: {
      primary: ['#757ea7ff', '#7d7089ff'],
      secondary: ['#20e134ff', '#3a3a39ff'],
      accent: '#757ea7ff',
      border: '#b4acbcff',
    },
  },
];



const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const GradientView = ({ colors, style, children }) => {
  return (
    <View style={[style, { backgroundColor: colors[0] }]}>
      {children}
    </View>
  );
};

export default function AvatarSelector() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  const currentAvatar = avatarData[currentIndex];

  const handleAvatarChange = (index) => {
    if (index === currentIndex) return;

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 20,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentIndex(index);
      slideAnim.setValue(-20);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleChooseAvatar = async () => {
    const modelUrl = getModelUrlById(currentAvatar.id);
    
    try {
      // Save to session manager for persistence
      await AvatarSessionManager.saveSession(
        currentAvatar.id,
        modelUrl,
        {
          id: currentAvatar.id,
          name: currentAvatar.name,
          character: currentAvatar.character,
          mode: currentAvatar.mode,
          tone: currentAvatar.tone,
          description: currentAvatar.description,
          theme: currentAvatar.theme,
        }
      );
      
      console.log('✅ Avatar session saved:', currentAvatar.name);
      
      // Navigate to immersive view
      router.push({
        pathname: '/immersive-avatar',
        params: {
          avatarId: currentAvatar.id.toString(),
          modelUrl: modelUrl,
          profileData: JSON.stringify(currentAvatar),
        },
      });
    } catch (error) {
      console.error('❌ Failed to save avatar session:', error);
      // Still navigate even if save fails
      router.push({
        pathname: '/immersive-avatar',
        params: {
          avatarId: currentAvatar.id.toString(),
          modelUrl: modelUrl,
          profileData: JSON.stringify(currentAvatar),
        },
      });
    }
  };

  const getCarouselPosition = (index) => {
    const diff = index - currentIndex;
    const totalAvatars = avatarData.length;
    
    let normalizedDiff = diff;
    if (Math.abs(diff) > totalAvatars / 2) {
      normalizedDiff = diff > 0 ? diff - totalAvatars : diff + totalAvatars;
    }
    
    return normalizedDiff;
  };

  const nextAvatar = () => {
    handleAvatarChange((currentIndex + 1) % avatarData.length);
  };

  const prevAvatar = () => {
    handleAvatarChange((currentIndex - 1 + avatarData.length) % avatarData.length);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <GradientView 
          colors={[currentAvatar.theme.accent, currentAvatar.theme.border]}
          style={styles.headerPill}
        >
          <Text style={styles.headerText}>Choose your friend's avatar</Text>
        </GradientView>
      </View>

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        {/* Accent Background Card */}
        <Animated.View 
          style={[
            styles.accentCard,
            { 
              backgroundColor: currentAvatar.theme.secondary[0],
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.7, 0.9],
              }),
            }
          ]} 
        />

        {/* Main Card */}
        <View style={styles.mainCard}>
          <Animated.View 
            style={[
              styles.contentContainer, 
              { 
                opacity: fadeAnim, 
                transform: [{ translateY: slideAnim }] 
              }
            ]}
          >
            {/* Top Info Box */}
            <GradientView 
              colors={currentAvatar.theme.primary}
              style={[styles.infoBox, styles.topBox]}
            >
              <Text style={styles.nameTitle}>{currentAvatar.name}</Text>
              <Text style={styles.descriptionText}>{currentAvatar.description}</Text>
            </GradientView>

            {/* Bottom Traits Box */}
            <GradientView 
              colors={currentAvatar.theme.primary}
              style={[styles.infoBox, styles.bottomBox]}
            >
              <Text style={styles.traitsTitle}>TRAITS</Text>
              <View style={styles.traitsList}>
                <Text style={styles.traitText}>Character: {currentAvatar.character}</Text>
                <Text style={styles.traitText}>Mode: {currentAvatar.mode}</Text>
                <Text style={styles.traitText}>Tone: {currentAvatar.tone}</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.chooseButton}
                onPress={handleChooseAvatar}
                activeOpacity={0.8}
              >
                <Text style={styles.chooseButtonText}>Choose me</Text>
              </TouchableOpacity>
            </GradientView>
          </Animated.View>

          {/* Character Image */}
          <Animated.Image 
            source={currentAvatar.fullBody}
            style={[styles.characterImage, { opacity: fadeAnim }]}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Footer - 3D Carousel */}
      <View style={styles.footerContainer}>
        <GradientView
          colors={[currentAvatar.theme.accent, currentAvatar.theme.border]}
          style={styles.footerBackgroundStrip}
        />
        
        <View style={styles.carouselContainer}>
          {avatarData.map((avatar, index) => {
            const position = getCarouselPosition(index);
            const isActive = index === currentIndex;
            const isAdjacent = Math.abs(position) === 1;
            const isVisible = Math.abs(position) <= 1;

            const scale = isActive ? 1.1 : isAdjacent ? 0.8 : 0.6;
            const translateX = position * 100;
            const opacity = isVisible ? (isActive ? 1 : 0.6) : 0;

            return (
              <TouchableOpacity
                key={avatar.id}
                onPress={() => handleAvatarChange(index)}
                activeOpacity={0.9}
                style={[
                  styles.avatarBadge,
                  {
                    transform: [
                      { translateX },
                      { scale },
                    ],
                    opacity,
                    zIndex: isActive ? 30 : isAdjacent ? 20 : 10,
                  }
                ]}
              >
                <View style={styles.badgeContainer}>
                  <GradientView
                    colors={[avatar.theme.accent, avatar.theme.border]}
                    style={[
                      styles.badgeBorder,
                      isActive && styles.badgeBorderActive,
                    ]}
                  >
                    <View 
                      style={[
                        styles.badgeInner,
                        { backgroundColor: isActive ? '#f5f5f5' : '#444' }
                      ]}
                    />
                  </GradientView>

                  <Image
                    source={avatar.face}
                    style={[
                      styles.faceImage,
                      { opacity: isActive ? 1 : 0.7 }
                    ]}
                    resizeMode="cover"
                  />

                  {isActive && (
                    <View 
                      style={[
                        styles.glowEffect,
                        { backgroundColor: avatar.theme.accent }
                      ]}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Navigation Arrows */}
      <TouchableOpacity
        onPress={prevAvatar}
        style={[styles.navButton, styles.navButtonLeft]}
        activeOpacity={0.7}
      >
        <ChevronLeft size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={nextAvatar}
        style={[styles.navButton, styles.navButtonRight]}
        activeOpacity={0.7}
      >
        <ChevronRight size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000ff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  
  headerContainer: {
    paddingHorizontal: 0,
    marginTop: 10,
    zIndex: 10,
  },
  headerPill: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    alignSelf: 'flex-start',
    width: '85%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },

  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  
  accentCard: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.82,
    height: SCREEN_HEIGHT * 0.62,
    top: 50,
    right: 15,
    borderRadius: 30,
  },

  mainCard: {
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT * 0.6,
    backgroundColor: '#1f1d1dff',
    borderRadius: 30,
    padding: 15,
    position: 'relative',
  },

  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 5,
  },

  infoBox: {
    borderRadius: 20,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  topBox: {
    height: '42%',
    alignItems: 'flex-end',
    paddingTop: 25,
  },
  nameTitle: {
    color: '#FFF',
    fontSize: 40,
    fontWeight: '300',
    letterSpacing: 8,
    position: 'absolute',
    top: 0,
    left: 20,
    textShadowColor: 'black', 
    textShadowRadius: 5,
    textShadowOffset: { 
      width: 1, 
      height: 1 
    },
    borderColor: 'rgba(0,0,0,0.2)',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  descriptionText: {
    color: '#FFF',
    fontSize: 16,
    left: 20,
    lineHeight: 18,
    marginTop: 35,
    width: '55%',
  },

  bottomBox: {
    height: '45%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  traitsTitle: {
    color: 'black',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 3,
    textTransform: 'uppercase',
    top: -30,
    textShadowColor: 'white', 
    textShadowRadius: 3,
    textShadowOffset: { 
      width: 1, 
      height: 1 
    },
  },
  traitsList: {
    marginBottom: 15,
    alignItems: 'flex-end',
  },
  traitText: {
    color: '#FFF',
    fontSize: 16,
    marginVertical: 2,
    textAlign: 'right',
  },
  chooseButton: {
    backgroundColor: '#d6d4d4ff',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#333',
  },
  chooseButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 13,
    letterSpacing: 1,
  },

  characterImage: {
    position: 'absolute',
    height: '105%',
    width: '75%',
    left: -20,
    bottom: 0,
    zIndex: 20,
  },

  footerContainer: {
    height: 120,
    justifyContent: 'flex-end',
    position: 'relative',
    marginBottom: 10,
  },
  footerBackgroundStrip: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    height: 60,
    zIndex: 0,
  },
  carouselContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 10,
  },
  
  avatarBadge: {
    position: 'absolute',
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  badgeContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  
  badgeBorder: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  badgeBorderActive: {
    padding: 3,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  
  badgeInner: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  
  faceImage: {
    position: 'absolute',
    width: '90%',
    height: '90%',
    borderRadius: 18,
  },
  
  glowEffect: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    borderRadius: 24,
    opacity: 0.3,
    zIndex: -1,
  },

  navButton: {
    position: 'absolute',
    top: '45%',
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 100,
  },
  navButtonLeft: {
    left: 15,
  },
  navButtonRight: {
    right: 15,
  },
});