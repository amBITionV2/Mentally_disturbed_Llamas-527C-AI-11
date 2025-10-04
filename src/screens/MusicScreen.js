import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, useColorScheme, ImageBackground } from 'react-native';
import { Svg, Path, LinearGradient, Defs, Stop, Rect } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import sleep from '../../assets/sleep.png';
import meditation from '../../assets/meditation.png';
import relax from '../../assets/relax.png';
import headphone from '../../assets/headphone.png';

const MusicThemesScreen = () => {
  const navigation = useNavigation();
  const isDarkMode = useColorScheme() === 'dark';

  const musicThemes = [
    {
      id: 1,
      title: 'Sleep',
      description: 'Peaceful sounds for deep rest',
      gradient: ['#2a60ea', '#6b9aff'],
      image: sleep,
      category: 'sleep',
    },
    {
      id: 2,
      title: 'Meditation',
      description: 'Calm your mind and find peace',
      gradient: ['#8b5cf6', '#c084fc'],
      image: meditation,
      category: 'meditation',
    },
    {
      id: 3,
      title: 'Relax',
      description: 'Unwind and let go of stress',
      gradient: ['#10b981', '#34d399'],
      image: relax,
      category: 'relax',
    },
    {
      id: 4,
      title: 'Focus',
      description: 'Enhance concentration and productivity',
      gradient: ['#f59e0b', '#fbbf24'],
      image: headphone,
      category: 'focus',
    },
    {
      id: 5,
      title: 'Work',
      description: 'Stay motivated and energized',
      gradient: ['#ef4444', '#fb7185'],
      image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400',
      category: 'work',
    },
    {
      id: 6,
      title: 'Nature',
      description: 'Connect with natural sounds',
      gradient: ['#06b6d4', '#22d3ee'],
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400',
      category: 'nature',
    },
    {
      id: 7,
      title: 'Yoga',
      description: 'Harmonize body and mind',
      gradient: ['#ec4899', '#f472b6'],
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
      category: 'yoga',
    },
    {
      id: 8,
      title: 'Study',
      description: 'Boost learning and retention',
      gradient: ['#6366f1', '#818cf8'],
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400',
      category: 'study',
    },
  ];

  const handleThemePress = (theme) => {
    // Navigate to Song page with theme data
    navigation.navigate('Song', { theme });
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      {/* Header */}
      <View style={[styles.header, isDarkMode && styles.headerDark]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Svg width={24} height={24} fill="#ffffff">
            <Path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
          </Svg>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkMode && styles.headerTitleDark]}>Music Themes</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.main}
        contentContainerStyle={styles.mainContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.subtitle, isDarkMode && styles.subtitleDark]}>
          Choose a theme to enhance your experience
        </Text>

        {musicThemes.map((theme) => (
          <TouchableOpacity
            key={theme.id}
            style={styles.themeCardWrapper}
            onPress={() => handleThemePress(theme)}
            activeOpacity={0.8}
          >
            {/* Gradient Border Effect */}
            <View style={styles.gradientBorder}>
              <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                <Defs>
                  <LinearGradient id={`gradient-${theme.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor={theme.gradient[0]} stopOpacity="1" />
                    <Stop offset="100%" stopColor={theme.gradient[1]} stopOpacity="1" />
                  </LinearGradient>
                </Defs>
                <Rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="none"
                  stroke={`url(#gradient-${theme.id})`}
                  strokeWidth="2"
                  rx="16"
                />
              </Svg>
            </View>

            {/* Card Content */}
            <View style={[styles.themeCard, isDarkMode && styles.themeCardDark]}>
              <View style={styles.themeTextContainer}>
                <Text style={[styles.themeTitle, isDarkMode && styles.themeTitleDark]}>
                  {theme.title}
                </Text>
                <Text style={[styles.themeDescription, isDarkMode && styles.themeDescriptionDark]}>
                  {theme.description}
                </Text>
                
                {/* Play Icon */}
                <TouchableOpacity
                  style={[styles.playIconContainer, { backgroundColor: theme.gradient[0] }]}
                  onPress={() => handleThemePress(theme)}
                  activeOpacity={0.7}
                >
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="#ffffff">
                    <Path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                  </Svg>
                </TouchableOpacity>
              </View>

              {/* Image Section */}
              <View style={styles.themeImageContainer}>
                <ImageBackground
                  source={theme.image}
                  style={styles.themeImage}
                  imageStyle={styles.themeImageStyle}
                >
                  <View style={[styles.imageOverlay, { backgroundColor: theme.gradient[0] }]} />
                </ImageBackground>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111521',
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
    zIndex: 30,
  },
  headerDark: {
    backgroundColor: '#111521',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(42,96,234,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 31,
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
  // Main Content
  main: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#111521',
  },
  mainContent: {
    paddingTop: 24,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: 'SpaceGrotesk',
  },
  subtitleDark: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  // Theme Card Styles
  themeCardWrapper: {
    marginBottom: 20,
    position: 'relative',
    width: '100%',
    height: 150,
    padding: 2,
    overflow: 'hidden',
    borderRadius: 16,
  },
  gradientBorder: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: 16,
    zIndex: 1, 
  },
  themeCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(17, 21, 33, 0.95)',
    borderRadius: 14,
    padding: 16,
    height: '100%',
    width: '100%',
    zIndex: 2, 
  },
  themeCardDark: {
    backgroundColor: 'rgba(17, 21, 33, 0.95)',
  },
  themeTextContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingRight: 12,
  },
  themeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'SpaceGrotesk',
    marginBottom: 6,
  },
  themeTitleDark: {
    color: '#ffffff',
  },
  themeDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'SpaceGrotesk',
    lineHeight: 20,
  },
  themeDescriptionDark: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  playIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#2a60ea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  themeImageContainer: {
    width: '25%',
    minWidth: 90,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeImage: {
    width: '100%',
    height: '100%',
    minHeight: 90,
  },
  themeImageStyle: {
    borderRadius: 12,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    opacity: 0.3,
  },
});

export default MusicThemesScreen;