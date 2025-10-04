import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';

const ChatBubble = ({ sender, text, isUser }) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.ranchoContainer]}>
      <View style={[
        styles.bubble,
        isUser ? styles.userBubble : styles.ranchoBubble,
        isDarkMode && styles.bubbleDark,
        isUser ? styles.userTailRight : styles.ranchoTailLeft
      ]}>
        <Text style={[styles.sender, isDarkMode && styles.senderDark]}>{sender}</Text>
        <Text style={[styles.text, isDarkMode && styles.textDark]}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 8,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  ranchoContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    padding: 12,
    borderRadius: 12,
    position: 'relative',
  },
  userBubble: {
    backgroundColor: 'rgba(194, 200, 245, 0.2)',
  },
  ranchoBubble: {
    backgroundColor: 'rgba(36, 40, 240, 0.5)',
  },
  bubbleDark: {
    backgroundColor: 'rgba(246, 248, 248, 0.1)',
  },
  // Tail styled using rotated borders to form a triangle shape
  userTailRight: {
    borderTopRightRadius: 0,
    marginRight: 10,
  },
  ranchoTailLeft: {
    borderTopLeftRadius: 0,
    marginLeft: 10,
  },
  sender: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(250, 252, 255, 0.7)',
    marginBottom: 4,
    fontFamily: 'SpaceGrotesk',
  },
  senderDark: {
    color: '#ffffff',
  },
  text: {
    fontSize: 16,
    color: 'rgba(250, 252, 255, 0.9)',
    fontFamily: 'SpaceGrotesk',
  },
  textDark: {
    color: '#ffffff',
  },
});

export default ChatBubble;
