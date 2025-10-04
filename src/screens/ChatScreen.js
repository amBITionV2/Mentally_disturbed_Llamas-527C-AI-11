import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, useColorScheme, Alert, Animated } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
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
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    // Pulse animation for avatar container
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage = {
      id: messages.length + 1,
      sender: 'You',
      text: inputText,
      avatar: messages.find(m => m.sender === 'You')?.avatar || 'https://your-user-avatar.jpg',
    };
    const ranchoResponse = {
      id: messages.length + 2,
      sender: 'Rancho',
      text: "Thanks for sharing! I'm here to help. What's next?",
      avatar: messages.find(m => m.sender === 'Rancho')?.avatar || 'https://your-rancho-avatar.jpg',
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
      avatar: messages.find(m => m.sender === 'You')?.avatar || 'https://your-user-avatar.jpg',
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      {/* Custom Header with Gradient */}
      <View style={[styles.header, isDarkMode && styles.headerDark]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Svg width={24} height={24} fill="#ffffff">
            <Path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
          </Svg>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, isDarkMode && styles.headerTitleDark]}>Rancho</Text>
          <Text style={styles.headerSubtitle}>Your AI Companion</Text>
        </View>
        <TouchableOpacity style={styles.menuButton} onPress={() => setShowDropdown(true)}>
          <Svg width={24} height={24} fill="#ffffff">
            <Path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content with Avatar and Messages */}
      <ScrollView
        style={styles.main}
        contentContainerStyle={styles.mainContent}
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
      >
        {/* Embedded Avatar WebView with Animation */}
        <Animated.View 
          style={[
            styles.avatarContainer,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <View style={styles.glowBorder}>
            <WebView
              source={{ uri: 'http://192.168.137.61:5173/' }}
              style={styles.webView}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              mediaPlaybackRequiresUserAction={false}
              allowsInlineMediaPlayback={true}
              allowsFullscreenVideo={true}
              mixedContentMode="always"
              // IMPORTANT: These props enable audio
              allowsProtectedMedia={true}
              mediaCapturePermissionGrantType="grantIfSameHostElsePrompt"
            />
          </View>
        </Animated.View>

        {/* Welcome Text with Icon */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeIcon}>👋</Text>
          <Text style={[styles.welcomeText, isDarkMode && styles.welcomeTextDark]}>
            Hi, I'm Rancho. How are you feeling today?
          </Text>
        </View>

        {/* Chat Messages */}
        {messages.map(message => (
          <ChatBubble
            key={message.id}
            sender={message.sender}
            text={message.text}
            avatar={message.avatar}
            isUser={message.sender === 'You'}
          />
        ))}
      </ScrollView>

      {/* Fixed Bottom Input and Quick Replies */}
      <View style={[styles.fixedInputContainer, isDarkMode && styles.fixedInputContainerDark]}>
        <View style={styles.quickReplies}>
          <TouchableOpacity
            style={[styles.quickReplyButton, isDarkMode && styles.quickReplyButtonDark]}
            onPress={() => handleQuickReply('I feel anxious')}
          >
            <Text style={styles.quickReplyIcon}>😰</Text>
            <Text style={[styles.quickReplyText, isDarkMode && styles.quickReplyTextDark]}>I feel anxious</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickReplyButton, isDarkMode && styles.quickReplyButtonDark]}
            onPress={() => handleQuickReply('Help me calm down')}
          >
            <Text style={styles.quickReplyIcon}>🧘</Text>
            <Text style={[styles.quickReplyText, isDarkMode && styles.quickReplyTextDark]}>Help me calm down</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton} onPress={handleCamera}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="#6b9aff">
              <Path d="M23,19a2,2,0,0,1-2,2H3a2,2,0,0,1-2-2V8A2,2,0,0,1,3,6H7a1,1,0,0,0,1-1,3,3,0,0,1,3-3h2a3,3,0,0,1,3,3,1,1,0,0,0,1,1h4a2,2,0,0,1,2,2ZM12,18a5,5,0,1,0-5-5A5,5,0,0,0,12,18Zm0-8a3,3,0,1,0,3,3A3,3,0,0,0,12,10Z" />
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
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="#6b9aff">
              <Path d="M12,15a4,4,0,0,0,4-4V5A4,4,0,0,0,8,5v6A4,4,0,0,0,12,15ZM10,5a2,2,0,0,1,4,0v6a2,2,0,0,1-4,0Zm10,6a1,1,0,0,0-2,0A6,6,0,0,1,6,11a1,1,0,0,0-2,0,8,8,0,0,0,7,7.93V21H9a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2H13V18.93A8,8,0,0,0,20,11Z" />
            </Svg>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="#ffffff">
              <Path d="M21.426,11.095l-17-8A1,1,0,0,0,3.03,4.242L4.969,12,3.03,19.758a1,1,0,0,0,1.4,1.147l17-8a1,1,0,0,0,0-1.81ZM5.481,18.197l.877-3.509L12,12,6.358,9.312l-.877-3.509L18.651,12Z" />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>
      <DropdownMenu isVisible={showDropdown} onClose={() => setShowDropdown(false)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1e',
  },
  containerDark: {
    backgroundColor: '#0a0f1e',
  },
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#111521',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(42,96,234,0.15)',
  },
  headerDark: {
    backgroundColor: '#111521',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(42,96,234,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'SpaceGrotesk',
    letterSpacing: 0.5,
  },
  headerTitleDark: {
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6b9aff',
    fontFamily: 'SpaceGrotesk',
    marginTop: 2,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(42,96,234,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Main Content
  main: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#0a0f1e',
  },
  mainContent: {
    alignItems: 'center',
    gap: 20,
    paddingBottom: 200,
    paddingTop: 16,
  },
  avatarContainer: {
    width: '100%',
    height: 360,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  glowBorder: {
    flex: 1,
    borderRadius: 16,
    padding: 2,
    background: 'linear-gradient(135deg, #2a60ea, #6b9aff)',
  },
  webView: {
    flex: 1,
    borderRadius: 14,
  },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  welcomeIcon: {
    fontSize: 24,
  },
  welcomeText: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    fontFamily: 'SpaceGrotesk',
    lineHeight: 24,
  },
  welcomeTextDark: {
    color: '#ffffff',
  },
  inputContainer: {
    width: '100%',
    backgroundColor: 'rgba(17, 21, 33, 0.8)',
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(42,96,234,0.4)',
    shadowColor: '#2a60ea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
    fontFamily: 'SpaceGrotesk',
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxHeight: 100,
  },
  inputDark: {
    color: '#ffffff',
  },
  attachButton: {
    padding: 10,
    borderRadius: 22,
    backgroundColor: 'rgba(42,96,234,0.2)',
    marginRight: 4,
  },
  voiceButton: {
    padding: 10,
    borderRadius: 22,
    backgroundColor: 'rgba(42,96,234,0.2)',
    marginLeft: 4,
    marginRight: 4,
  },
  sendButton: {
    padding: 12,
    borderRadius: 24,
    backgroundColor: '#2a60ea',
    shadowColor: '#2a60ea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  quickReplies: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  quickReplyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: 'rgba(42,96,234,0.2)',
    borderWidth: 1.5,
    borderColor: 'rgba(42,96,234,0.5)',
  },
  quickReplyButtonDark: {
    backgroundColor: 'rgba(42,96,234,0.25)',
    borderColor: 'rgba(42,96,234,0.6)',
  },
  quickReplyIcon: {
    fontSize: 16,
  },
  quickReplyText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b9aff',
    fontFamily: 'SpaceGrotesk',
  },
  quickReplyTextDark: {
    color: '#6b9aff',
  },
  fixedInputContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(17, 21, 33, 0.98)',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(42,96,234,0.3)',
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  fixedInputContainerDark: {
    backgroundColor: 'rgba(17, 21, 33, 0.98)',
  },
});

export default ChatScreen;