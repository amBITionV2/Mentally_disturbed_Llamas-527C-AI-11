import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';

const WellnessCard = ({ title, color, duration, image, onPress }) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <TouchableOpacity
      style={[styles.card, isDarkMode && styles.cardDark]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <ImageBackground
          source={{ uri: image }} // Replace with your asset
          style={styles.image}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.gradient} />
        </ImageBackground>
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, isDarkMode && styles.titleDark]}>{title}</Text>
        <Text style={[styles.text, isDarkMode && styles.textDark]}>{color}</Text>
        <Text style={[styles.text, isDarkMode && styles.textDark]}>{duration}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // bg-white/5
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cardDark: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // bg-black/10
  },
  imageContainer: {
    width: '100%',
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageStyle: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(16, 28, 34, 0.5)', // from-background-dark/50
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827', // text-gray-900
  },
  titleDark: {
    color: '#ffffff', // text-white
  },
  text: {
    fontSize: 14,
    color: '#4b5563', // text-gray-600
  },
  textDark: {
    color: '#9ca3af', // text-gray-400
  },
});

export default WellnessCard;