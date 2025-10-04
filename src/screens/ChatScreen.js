import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ImageBackground, SafeAreaView, useColorScheme, Alert } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import ChatBubble from '../components/ChatBubble';
import DropdownMenu from '../components/DropdownMenu';

const ChatScreen = () => {
  const navigation = useNavigation();
  const isDarkMode = useColorScheme() === 'dark';
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Rancho',
      text: "Hey there, I'm Rancho! How are you feeling today?",
      avatar: 'https://your-rancho-avatar.jpg',
    },
    {
      id: 2,
      sender: 'You',
      text: "I'm feeling a bit overwhelmed.",
      avatar: 'https://your-user-avatar.jpg',
    },
    {
      id: 3,
      sender: 'Rancho',
      text: "I understand. Let's work through this together. What's been going on?",
      avatar: 'https://your-rancho-avatar.jpg',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const scrollViewRef = useRef();

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage = {
      id: messages.length + 1,
      sender: 'You',
      text: inputText,
      avatar: messages.find(m => m.sender === 'You').avatar,
    };
    const ranchoResponse = {
      id: messages.length + 2,
      sender: 'Rancho',
      text: "Thanks for sharing! I'm here to help. What's next?",
      avatar: messages.find(m => m.sender === 'Rancho').avatar,
    };
    setMessages([...messages, newMessage, ranchoResponse]);
    setInputText('');
  };

  const handleCamera = () => {
    Alert.alert('Camera', 'Open image picker (implement with react-native-image-picker)');
  };

  const handleQuickReply = (text) => {
    const newMessage = {
      id: messages.length + 1,
      sender: 'You',
      text,
      avatar: messages.find(m => m.sender === 'You').avatar,
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      {/* Custom Header */}
      <View style={[styles.header, isDarkMode && styles.headerDark]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Svg width={24} height={24} fill="#ffffff">
            <Path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
          </Svg>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkMode && styles.headerTitleDark]}>Rancho</Text>
        <TouchableOpacity style={styles.menuButton} onPress={() => setShowDropdown(true)}>
          <Svg width={24} height={24} fill="#ffffff">
            <Path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
          </Svg>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.main}
        contentContainerStyle={styles.mainContent}
        ref={scrollViewRef}
      >
        <View style={styles.imageContainer}>
          <View style={[styles.glow, isDarkMode && styles.glowDark]} />
          <ImageBackground
            source={{ uri: 'https://your-rancho-image.jpg' }} // Replace with your asset
            style={styles.image}
            imageStyle={styles.imageStyle}
          />
        </View>
        <Text style={[styles.welcomeText, isDarkMode && styles.welcomeTextDark]}>
          Hi, I'm Rancho. How are you feeling today?
        </Text>
        {messages.map(message => (
          <ChatBubble
            key={message.id}
            sender={message.sender}
            text={message.text}
            avatar={message.avatar}
            isUser={message.sender === 'You'}
          />
        ))}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton} onPress={handleCamera}>
            <Svg width={24} height={24} fill="#13ecec">
              <Path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm24,32a12,12,0,1,1-12-12A12,12,0,0,1,144,164Z" />
            </Svg>
          </TouchableOpacity>
          <TextInput
            style={[styles.input, isDarkMode && styles.inputDark]}
            placeholder="Type your message..."
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            multiline
          />
          <TouchableOpacity style={styles.voiceButton} onPress={() => Alert.alert('Voice', 'Voice recording feature')}>
            <Svg width={20} height={20} fill="#13ecec">
              <Path d="M12,2A10,10,0,0,0,2,12a10,10,0,0,0,10,10,10,10,0,0,0,10-10A10,10,0,0,0,12,2Zm0,18a8,8,0,0,1-8-8,8,8,0,0,1,8-8,8,8,0,0,1,8,8A8,8,0,0,1,12,20ZM12,6a6,6,0,0,0-6,6H8a4,4,0,0,1,8,0h2A6,6,0,0,0,12,6Z" />
            </Svg>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Svg width={20} height={20} fill="#ffffff">
              <Path d="M232,96a16,16,0,0,0-16-16H184V48a16,16,0,0,0-16-16H40A16,16,0,0,0,24,48V176a8,8,0,0,0,13,6.22L72,154V184a16,16,0,0,0,16,16h93.59L219,230.22a8,8,0,0,0,5,1.78,8,8,0,0,0,8-8Zm-42.55,89.78a8,8,0,0,0-5-1.78H88V152h80a16,16,0,0,0,16-16V96h32V207.25Z" />
            </Svg>
          </TouchableOpacity>
        </View>
        <View style={styles.quickReplies}>
          <TouchableOpacity
            style={[styles.quickReplyButton, isDarkMode && styles.quickReplyButtonDark]}
            onPress={() => handleQuickReply('I feel anxious')}
          >
            <Text style={[styles.quickReplyText, isDarkMode && styles.quickReplyTextDark]}>I feel anxious</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickReplyButton, isDarkMode && styles.quickReplyButtonDark]}
            onPress={() => handleQuickReply('Help me calm down')}
          >
            <Text style={[styles.quickReplyText, isDarkMode && styles.quickReplyTextDark]}>Help me calm down</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <DropdownMenu isVisible={showDropdown} onClose={() => setShowDropdown(false)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111521', // Match home screen dark background
  },
  containerDark: {
    backgroundColor: '#111521', // Consistent dark theme
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
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(19, 236, 236, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Main Content
  main: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#111521', // Match app theme
  },
  mainContent: {
    alignItems: 'center',
    gap: 24,
    paddingBottom: 20, // Reduced padding since no duplicate nav
  },
  imageContainer: {
    width: '100%',
    maxWidth: 384, // max-w-sm
    position: 'relative',
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(19, 236, 236, 0.2)', // primary/20
    shadowColor: '#13ecec',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  glowDark: {
    backgroundColor: 'rgba(19, 236, 236, 0.2)',
  },
  image: {
    width: '100%',
    height: 256, // h-64
  },
  imageStyle: {
    borderRadius: 12, // rounded-xl
  },
  welcomeText: {
    fontSize: 16,
    color: '#ffffff', // White text for dark theme
    textAlign: 'center',
    fontFamily: 'SpaceGrotesk',
  },
  welcomeTextDark: {
    color: '#ffffff',
  },
  inputContainer: {
    width: '100%',
    maxWidth: 384,
    backgroundColor: 'rgba(16, 34, 34, 0.5)',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(19, 236, 236, 0.2)',
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'SpaceGrotesk',
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxHeight: 100,
  },
  inputDark: {
    color: '#ffffff',
  },
  attachButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(19, 236, 236, 0.1)',
    marginRight: 8,
  },
  voiceButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(19, 236, 236, 0.1)',
    marginRight: 8,
  },
  sendButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#2a60ea',
    shadowColor: '#2a60ea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  quickReplies: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
  },
  quickReplyButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(19, 236, 236, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(19, 236, 236, 0.3)',
  },
  quickReplyButtonDark: {
    backgroundColor: 'rgba(19, 236, 236, 0.15)',
    borderColor: 'rgba(19, 236, 236, 0.4)',
  },
  quickReplyText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#13ecec',
    fontFamily: 'SpaceGrotesk',
  },
  quickReplyTextDark: {
    color: '#13ecec',
  },
});

export default ChatScreen;