import React from 'react';
import { View, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Svg, Path } from 'react-native-svg';

const SimpleHeader = ({ navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => console.log('Menu pressed')} // Add menu logic or navigation
      >
        <Svg width={24} height={24} fill={isDarkMode ? '#ffffff' : '#111827'}>
          <Path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
        </Svg>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => console.log('Action pressed')} // Add action logic
      >
        <Svg width={24} height={24} fill={isDarkMode ? '#ffffff' : '#111827'}>
          <Path d="M216.49,128.88,198.85,114a8,8,0,0,0-9.67,1.26,71.51,71.51,0,0,1-4.66,5.32l-1.46,1.46a72.58,72.58,0,0,1-5.32,4.66,8,8,0,0,0-1.26,9.67l14.88,17.64a8,8,0,0,0,6.67,3.15,103.52,103.52,0,0,0,24.62-10.15,8,8,0,0,0,4-5.78l2.5-22.3a8,8,0,0,0-.82-5.78ZM128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm104.78-55.84-14.92-18.64a8,8,0,0,0-8.54-2.74,72.48,72.48,0,0,1-11.75,2.44,8,8,0,0,0-7.25,6.48l-4.48,22.4a8,8,0,0,0,2.15,7.77,8,8,0,0,0,5.6,2.35l22.4-4.48a8,8,0,0,0,6.48-7.25,72.48,72.48,0,0,1,2.44-11.75A8,8,0,0,0,232.78,130.16Zm-69.5-68.52L145.64,44a8,8,0,0,0-5.78-4A103.52,103.52,0,0,0,115.24,30a8,8,0,0,0-6.67,3.15L90.93,50.8a8,8,0,0,0,1.26,9.67,71.51,71.51,0,0,1,5.32,4.66l1.46,1.46a72.58,72.58,0,0,1,4.66,5.32,8,8,0,0,0,9.67,1.26l17.64-14.88A8,8,0,0,0,163.28,61.64ZM90.93,205.2l-17.64,14.88a8,8,0,0,1-9.67-1.26,71.51,71.51,0,0,1-5.32-4.66l-1.46-1.46a72.58,72.58,0,0,1-4.66-5.32,8,8,0,0,1,1.26-9.67L71.07,180a8,8,0,0,1,3.15-6.67,103.52,103.52,0,0,1,10.15-24.62,8,8,0,0,1,5.78-4l22.3-2.5a8,8,0,0,1,5.78.82A8,8,0,0,1,117.41,144Zm-54.65-81.5a8,8,0,0,0-2.74,8.54,72.48,72.48,0,0,1,2.44,11.75,8,8,0,0,0,6.48,7.25l22.4,4.48a8,8,0,0,0,7.77-2.15,8,8,0,0,0,2.35-5.6L80,125.42a8,8,0,0,0-7.25-6.48,72.48,72.48,0,0,1-11.75-2.44A8,8,0,0,0,36.28,123.7Z" />
        </Svg>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  button: {
    padding: 8,
  },
});

export default SimpleHeader;