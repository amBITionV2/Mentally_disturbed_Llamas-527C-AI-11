import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const GlowButton = ({ title, onPress, primary = false }) => {
  return (
    <TouchableOpacity
      style={[styles.button, primary ? styles.primary : styles.secondary]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Text
        style={[
          styles.buttonText,
          primary ? styles.primaryText : styles.secondaryText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#13ecec', // primary
  },
  secondary: {
    backgroundColor: 'rgba(19, 236, 236, 0.2)', // primary/20
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryText: {
    color: '#102222', // background-dark
  },
  secondaryText: {
    color: '#13ecec', // primary
  },
});

export default GlowButton;