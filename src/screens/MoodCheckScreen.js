import React from 'react';
import { View, Text, ImageBackground, StyleSheet, SafeAreaView, TouchableOpacity, useColorScheme } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import BottomNav from '../components/BottomNav';

const MoodCheckScreen = () => {
  const navigation = useNavigation();
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      {/* Custom Header */}
      <View style={[styles.header, isDarkMode && styles.headerDark]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Svg width={24} height={24} fill={isDarkMode ? '#ffffff' : '#4b5563'}>
            <Path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
          </Svg>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkMode && styles.headerTitleDark]}>Mood Check</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.main}>
        <Text style={[styles.title, isDarkMode && styles.titleDark]}>How are you feeling?</Text>
        <View style={styles.imageContainer}>
          <View style={[styles.glowingIndicator, isDarkMode && styles.glowingIndicatorDark]} />
          <ImageBackground
            source={{ uri: 'https://your-image-url-here' }} // Replace with your image asset
            style={styles.image}
            imageStyle={styles.imageStyle}
          />
        </View>
        <Text style={[styles.description, isDarkMode && styles.descriptionDark]}>
          You look tense, want to try a 2-minute breathing exercise?
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, isDarkMode && styles.primaryButtonDark]}
            onPress={() => navigation.navigate('Wellness')}
          >
            <Text style={[styles.buttonText, isDarkMode && styles.buttonTextDark]}>
              Yes, please
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.secondaryButton, isDarkMode && styles.secondaryButtonDark]}
            onPress={() => navigation.navigate('Tabs')}
          >
            <Text style={[styles.buttonTextSecondary, isDarkMode && styles.buttonTextSecondaryDark]}>
              Not now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <BottomNav activeTab="Home" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111521', // Match app theme
  },
  containerDark: {
    backgroundColor: '#111521',
  },
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#111521',
  },
  headerDark: {
    backgroundColor: '#111521',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(19, 236, 236, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'SpaceGrotesk',
  },
  headerTitleDark: {
    color: '#ffffff',
  },
  headerSpacer: {
    width: 40,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'SpaceGrotesk',
  },
  titleDark: {
    color: '#ffffff',
  },
  imageContainer: {
    width: '100%',
    maxWidth: 300,
    aspectRatio: 1,
    position: 'relative',
    marginBottom: 24,
  },
  glowingIndicator: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 9999,
    shadowColor: '#13ecec',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    opacity: 0.5,
  },
  glowingIndicatorDark: {
    shadowColor: '#13ecec',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 9999,
  },
  imageStyle: {
    borderRadius: 9999,
  },
  description: {
    fontSize: 18,
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    maxWidth: 300,
    marginBottom: 24,
    fontFamily: 'SpaceGrotesk',
  },
  descriptionDark: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#2a60ea',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#2a60ea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonDark: {
    backgroundColor: '#2a60ea',
  },
  secondaryButton: {
    backgroundColor: 'rgba(19, 236, 236, 0.1)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(19, 236, 236, 0.3)',
  },
  secondaryButtonDark: {
    backgroundColor: 'rgba(19, 236, 236, 0.15)',
    borderColor: 'rgba(19, 236, 236, 0.4)',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'SpaceGrotesk',
  },
  buttonTextDark: {
    color: '#ffffff',
  },
  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: '500',
    color: '#13ecec',
    fontFamily: 'SpaceGrotesk',
  },
  buttonTextSecondaryDark: {
    color: '#13ecec',
  },
});

export default MoodCheckScreen;