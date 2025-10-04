import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const handleGetStarted = () => {
    navigation.navigate('Login');
  };

  return (
    <LinearGradient
      colors={['#111521', '#111521', '#1a1f36']}  // Gradient from HTML
      style={styles.container}
    >
      <View style={styles.topSection}>
        <View style={styles.logoContainer}>
          <Svg width="64" height="64" viewBox="0 0 256 256" fill="#2a60ea">  {/* Primary color */}
            <Path d="M246,98.73l-56-64A8,8,0,0,0,184,32H72a8,8,0,0,0-6,2.73l-56,64a8,8,0,0,0,.17,10.73l112,120a8,8,0,0,0,11.7,0l112-120A8,8,0,0,0,246,98.73ZM222.37,96H180L144,48h36.37ZM74.58,112l30.13,75.33L34.41,112Zm89.6,0L128,202.46,91.82,112ZM96,96l32-42.67L160,96Zm85.42,16h40.17l-70.3,75.33ZM75.63,48H112L76,96H33.63Z" />
          </Svg>
        </View>
      </View>
      <View style={styles.middleSection}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Your private space for emotional wellness</Text>
          <Text style={styles.subtitle}>Chat with Rancho, your AI guide, and track your feelings with smart insights.</Text>
        </View>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarBorder}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAzJ613uGV_KM7gi7p52oZWHkA0rtuZ_p9k59sEUDt8PBkREhDVd8CncHIYEh5cMxJrgw-fGs_xVrS386yjm700gBUhh7o6VRAd6h1Kmv69ftVo4389b7F8vnHASYoUft0FsMgiYlUZ8oRTNvpHJyzHVS9Rht9ZE-mFg9MxjKvg9XGWlKdXLNJBOKAuBGzSgWdf98tfFXjVsKt9pHI9znEqOn6VXLmqfnaD1OAz4RTJmPE4xdXKK5uJHHF1_-EFXz3LHfY2qFOrsU' }}
              style={styles.avatarImage}
            />
          </View>
          <Text style={styles.avatarText}>Rancho, your AI guide</Text>
        </View>
      </View>
      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,  // p-6
    minHeight: Math.max(884, height),
  },
  topSection: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 32,  // pt-8
  },
  logoContainer: {
    width: 64,  // w-16
    height: 64,  // h-16
    marginBottom: 16,  // mb-4
    shadowColor: '#2a60ea',  // gem-logo filter
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,  // For Android shadow
  },
  middleSection: {
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    paddingHorizontal: 16,  // px-4
    gap: 32,  // space-y-8
  },
  textContainer: {
    gap: 16,  // space-y-4
  },
  title: {
    fontSize: 30,  // text-3xl
    fontWeight: 'bold',
    letterSpacing: -0.5,  // tracking-tight
    color: '#ffffff',
    textAlign: 'center',
    // fontFamily: 'SpaceGrotesk-Bold',  // Uncomment after font setup
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',  // text-white/70
    textAlign: 'center',
    // fontFamily: 'SpaceGrotesk-Regular',
  },
  avatarContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,  // space-y-2
  },
  avatarBorder: {
    width: 80,  // w-20
    height: 80,  // h-20
    borderRadius: 9999,  // rounded-full
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: 'rgba(42,96,234,0.3)',  // border-4 border-primary/30
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarText: {
    fontSize: 14,  // text-sm
    fontWeight: '500',  // font-medium
    color: 'rgba(255,255,255,0.8)',  // text-white/80
  },
  bottomSection: {
    width: '100%',
    paddingHorizontal: 16,  // px-4
    paddingBottom: 32,  // pb-8
  },
  button: {
    width: '100%',
    height: 56,  // h-14
    borderRadius: 9999,  // rounded-full
    backgroundColor: '#2a60ea',  // bg-primary
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2a60ea',  // glow effect
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,  // text-lg
    fontWeight: 'bold',
    letterSpacing: 0.5,  // tracking-wide
    // fontFamily: 'SpaceGrotesk-Bold',
  },
});

export default OnboardingScreen;