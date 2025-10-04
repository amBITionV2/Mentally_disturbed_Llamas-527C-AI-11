import React from 'react';
import { View, Text, Image, StyleSheet, useColorScheme } from 'react-native';

const ChatBubble = ({ sender, text, avatar, isUser }) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.ranchoContainer]}>
      {!isUser && (
        <Image
          source={{ uri: avatar }}
          style={styles.avatar}
        />
      )}
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.ranchoBubble, isDarkMode && styles.bubbleDark]}>
        <Text style={[styles.sender, isDarkMode && styles.senderDark]}>{sender}</Text>
        <Text style={[styles.text, isDarkMode && styles.textDark]}>{text}</Text>
      </View>
      {isUser && (
        <Image
          source={{ uri: avatar }}
          style={styles.avatar}
        />
      )}
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  bubble: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(19, 236, 236, 0.1)', // primary/10
  },
  userBubble: {
    backgroundColor: 'rgba(19, 236, 236, 0.2)', // primary/20
  },
  ranchoBubble: {
    backgroundColor: 'rgba(16, 34, 34, 0.5)', // bg-background-dark/50
  },
  bubbleDark: {
    backgroundColor: 'rgba(246, 248, 248, 0.1)', // bg-background-light/10
  },
  sender: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
    fontFamily: 'SpaceGrotesk',
  },
  senderDark: {
    color: '#ffffff',
  },
  text: {
    fontSize: 16,
    color: '#111827',
    fontFamily: 'SpaceGrotesk',
  },
  textDark: {
    color: '#ffffff',
  },
});

export default ChatBubble;