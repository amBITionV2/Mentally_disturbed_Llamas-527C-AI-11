import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Svg, Path } from 'react-native-svg';

const Header = ({ navigation, title }) => {
  const isDarkMode = useColorScheme() === 'dark';
  
  return (
    <View style={[styles.header, isDarkMode && styles.headerDark]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Svg width={24} height={24} fill={isDarkMode ? '#ffffff' : '#4b5563'}>
          <Path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
        </Svg>
      </TouchableOpacity>
      <Text style={[styles.title, isDarkMode && styles.titleDark]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f6f8f8', // background-light
  },
  headerDark: {
    backgroundColor: '#102222', // background-dark
  },
  backButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827', // text-gray-900
    paddingRight: 48, // Offset for back button
    fontFamily: 'SpaceGrotesk',
  },
  titleDark: {
    color: '#ffffff', // text-white
  },
});

export default Header;