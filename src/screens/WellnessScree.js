import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, useColorScheme, TouchableOpacity } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import BottomNav from '../components/BottomNav';

const WellnessScreen = () => {
  const navigation = useNavigation();
  const isDarkMode = useColorScheme() === 'dark';

  const cards = [
    {
      title: 'Calm Anxiety',
      color: 'Cool Blue',
      duration: '10 min',
      image: 'https://your-image-url-calm-anxiety.jpg', // Replace with your asset
    },
    {
      title: 'Boost Positivity',
      color: 'Sunset Orange',
      duration: '15 min',
      image: 'https://your-image-url-boost-positivity.jpg', // Replace with your asset
    },
    {
      title: 'Exam Stress Relief',
      color: 'Turquoise/Teal',
      duration: '20 min',
      image: 'https://your-image-url-exam-stress.jpg', // Replace with your asset
    },
    {
      title: 'Sleep Reset',
      color: 'Deep Purple',
      duration: '25 min',
      image: 'https://your-image-url-sleep-reset.jpg', // Replace with your asset
    },
  ];

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      {/* Custom Header */}
      <View style={[styles.header, isDarkMode && styles.headerDark]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Svg width={24} height={24} fill={isDarkMode ? '#ffffff' : '#4b5563'}>
            <Path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
          </Svg>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkMode && styles.headerTitleDark]}>Wellness</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.main}>
        <Text style={[styles.title, isDarkMode && styles.titleDark]}>
          How are you feeling today?
        </Text>
        <View style={styles.cardContainer}>
          {cards.map((card, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.wellnessCard, isDarkMode && styles.wellnessCardDark]}
              onPress={() => console.log(`Tapped ${card.title}`)}
            >
              <View style={styles.cardImageContainer}>
                <View style={[styles.cardGlow, isDarkMode && styles.cardGlowDark]} />
                <View style={styles.cardImagePlaceholder} />
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, isDarkMode && styles.cardTitleDark]}>{card.title}</Text>
                <Text style={[styles.cardDuration, isDarkMode && styles.cardDurationDark]}>{card.duration}</Text>
                <Text style={[styles.cardColor, isDarkMode && styles.cardColorDark]}>{card.color}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <BottomNav activeTab="Tools" />
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
    paddingHorizontal: 16,
    paddingBottom: 20, // Reduced padding since no duplicate nav
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingBottom: 24,
    textAlign: 'center',
    fontFamily: 'SpaceGrotesk',
  },
  titleDark: {
    color: '#ffffff',
  },
  cardContainer: {
    gap: 16,
  },
  wellnessCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(19, 236, 236, 0.2)',
  },
  wellnessCardDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(19, 236, 236, 0.3)',
  },
  cardImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'relative',
    marginRight: 16,
  },
  cardGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(19, 236, 236, 0.2)',
    borderRadius: 30,
    shadowColor: '#13ecec',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },
  cardGlowDark: {
    backgroundColor: 'rgba(19, 236, 236, 0.2)',
  },
  cardImagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(19, 236, 236, 0.3)',
    borderRadius: 30,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    fontFamily: 'SpaceGrotesk',
  },
  cardTitleDark: {
    color: '#ffffff',
  },
  cardDuration: {
    fontSize: 14,
    color: '#13ecec',
    marginBottom: 2,
    fontFamily: 'SpaceGrotesk',
  },
  cardDurationDark: {
    color: '#13ecec',
  },
  cardColor: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'SpaceGrotesk',
  },
  cardColorDark: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
});

export default WellnessScreen;