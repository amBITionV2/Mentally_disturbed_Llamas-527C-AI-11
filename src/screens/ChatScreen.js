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
  ]);
  const [inputText, setInputText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordedText, setRecordedText] = useState('');
  const scrollViewRef = useRef();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const micPulseAnim = useRef(new Animated.Value(1)).current;
  const convertAnim = useRef(new Animated.Value(0)).current;
  const avatarWebViewRef = useRef(null);
  const voiceWebViewRef = useRef(null);

  // Default API parameters
  const defaultParams = {
    stress: 0.5,
    mood: 0.5,
    fatigue: 0.5,
    recovery: 0.5,
    fer_mood: 'neutral'
  };

  // Voice recognition HTML
  const voiceRecognitionHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
        <script>
            let recognition = null;
            let isRecording = false;
            let isInitialized = false;
            
            function postMessage(data) {
                try {
                    window.ReactNativeWebView.postMessage(JSON.stringify(data));
                } catch (err) {
                    console.error('Failed to post message:', err);
                }
            }
            
            function initializeRecognition() {
                if (isInitialized) return true;
                
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                
                if (!SpeechRecognition) {
                    postMessage({ type: 'error', error: 'not_supported' });
                    return false;
                }
                
                try {
                    recognition = new SpeechRecognition();
                    recognition.continuous = true;
                    recognition.interimResults = true;
                    recognition.lang = 'en-US';
                    recognition.maxAlternatives = 1;
                    
                    recognition.onstart = () => {
                        isRecording = true;
                        postMessage({ type: 'started' });
                    };
                    
                    recognition.onresult = (event) => {
                        let interimTranscript = '';
                        let finalTranscript = '';
                        
                        for (let i = event.resultIndex; i < event.results.length; i++) {
                            const transcript = event.results[i][0].transcript;
                            if (event.results[i].isFinal) {
                                finalTranscript += transcript + ' ';
                            } else {
                                interimTranscript += transcript;
                            }
                        }
                        
                        if (interimTranscript || finalTranscript) {
                            postMessage({ 
                                type: 'interim', 
                                transcript: interimTranscript || finalTranscript 
                            });
                        }
                    };
                    
                    recognition.onerror = (event) => {
                        if (event.error !== 'no-speech' && event.error !== 'aborted') {
                            postMessage({ type: 'error', error: event.error });
                        }
                    };
                    
                    recognition.onend = () => {
                        isRecording = false;
                        postMessage({ type: 'end' });
                    };
                    
                    isInitialized = true;
                    return true;
                } catch (err) {
                    postMessage({ type: 'error', error: 'init_failed' });
                    return false;
                }
            }
            
            window.startRecording = () => {
                if (isRecording) {
                    postMessage({ type: 'info', message: 'already_recording' });
                    return;
                }
                
                if (!initializeRecognition()) return;
                
                try {
                    recognition.start();
                } catch (err) {
                    isRecording = false;
                    postMessage({ type: 'error', error: 'start_failed' });
                }
            };
            
            window.stopRecording = () => {
                if (!recognition || !isRecording) {
                    postMessage({ type: 'stopped' });
                    return;
                }
                
                try {
                    recognition.stop();
                } catch (err) {
                    isRecording = false;
                    postMessage({ type: 'error', error: 'stop_failed' });
                }
            };
            
            initializeRecognition();
        </script>
    </body>
    </html>
  `;

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    // Pulse animation for avatar
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

  useEffect(() => {
    // Mic button pulse when recording
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(micPulseAnim, {
            toValue: 1.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(micPulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      micPulseAnim.setValue(1);
    }
  }, [isRecording]);

  useEffect(() => {
    // Converting animation
    if (isConverting) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(convertAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(convertAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      convertAnim.setValue(0);
    }
  }, [isConverting]);

  const handleVoiceMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      switch (data.type) {
        case 'started':
          setIsRecording(true);
          setRecordedText('');
          break;
          
        case 'interim':
          if (data.transcript) {
            setRecordedText(data.transcript);
          }
          break;
          
        case 'stopped':
        case 'end':
          setIsRecording(false);
          break;
          
        case 'error':
          setIsRecording(false);
          
          const errorMessages = {
            'not_supported': 'Speech recognition is not supported on this device.',
            'audio-capture': 'No microphone detected.',
            'not-allowed': 'Microphone permission denied.',
            'network': 'Network error occurred.',
          };
          
          const errorMsg = errorMessages[data.error] || 'Please try again.';
          
          if (data.error !== 'no-speech' && data.error !== 'aborted') {
            Alert.alert('Voice Recognition', errorMsg);
          }
          break;
      }
    } catch (err) {
      console.error('Voice message parsing error:', err);
      setIsRecording(false);
    }
  };

  const startRecording = () => {
    if (voiceWebViewRef.current && !isRecording && !isConverting && !isProcessing) {
      voiceWebViewRef.current.injectJavaScript('window.startRecording(); true;');
    }
  };

  const stopRecordingAndConvert = () => {
    if (voiceWebViewRef.current && isRecording) {
      voiceWebViewRef.current.injectJavaScript('window.stopRecording(); true;');
      
      // Show converting state
      setIsConverting(true);
      
      // After a brief moment, show the recorded text and auto-send
      setTimeout(() => {
        setIsConverting(false);
        
        if (recordedText && recordedText.trim()) {
          // Show the converted text in input for 2 seconds
          setInputText(recordedText.trim());
          
          setTimeout(() => {
            handleVoiceInput(recordedText.trim());
            setInputText('');
            setRecordedText('');
          }, 2000);
        } else {
          Alert.alert('No Speech', 'Please try speaking again.');
          setRecordedText('');
        }
      }, 500);
    }
  };

  const handleVoiceInput = async (text) => {
    if (!text || !text.trim()) return;

    setIsProcessing(true);

    const userMessage = {
      id: Date.now(),
      sender: 'You',
      text: text.trim(),
      avatar: 'https://your-user-avatar.jpg',
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('https://fbbc8b08f380.ngrok-free.app/therapist', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: text.trim(),
          ...defaultParams
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const ranchoResponse = data.response || "I'm here to help you. Can you tell me more?";

      const ranchoMessage = {
        id: Date.now() + 1,
        sender: 'Rancho',
        text: ranchoResponse,
        avatar: 'https://your-rancho-avatar.jpg',
      };
      setMessages(prev => [...prev, ranchoMessage]);

      sendToAvatar(ranchoResponse);

    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Connection Error', 'Failed to get response. Please check your connection.');
      
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'Rancho',
        text: "I'm having trouble connecting right now. Please try again.",
        avatar: 'https://your-rancho-avatar.jpg',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const sendToAvatar = (text) => {
  try {
    const message = JSON.stringify({
      type: 'speak',
      text: text
    });
    
    console.log('📤 Attempting to send to avatar:', message);
    
    if (avatarWebViewRef.current) {
      avatarWebViewRef.current.postMessage(message);
      console.log('✅ Message sent to WebView');
    } else {
      console.error('❌ WebView ref is null');
    }
  } catch (err) {
    console.error('❌ Avatar message error:', err);
  }
};

  const handleSend = async () => {
    if (!inputText.trim() || isProcessing || isConverting) return;
    
    const textToSend = inputText;
    setInputText('');
    await handleVoiceInput(textToSend);
  };

  const handleCamera = () => {
    Alert.alert('Camera', 'Open image picker');
  };

  const handleMicButton = () => {
    if (!isRecording && !isConverting && !isProcessing) {
      startRecording();
    }
  };

  const handleSendButton = () => {
    if (isRecording) {
      // Stop recording and convert
      stopRecordingAndConvert();
    } else if (inputText.trim()) {
      // Send text message
      handleSend();
    }
  };

  const handleQuickReply = async (text) => {
    if (!isRecording && !isConverting && !isProcessing) {
      await handleVoiceInput(text);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      {/* Hidden WebView for Voice Recognition */}
      <View style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}>
        <WebView
          ref={voiceWebViewRef}
          source={{ html: voiceRecognitionHTML }}
          style={{ width: 1, height: 1 }}
          javaScriptEnabled={true}
          onMessage={handleVoiceMessage}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error:', nativeEvent);
          }}
        />
      </View>

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

      {/* Fixed Avatar WebView with Animation */}
      <Animated.View 
        style={[
          styles.avatarContainer,
          { transform: [{ scale: pulseAnim }] }
        ]}
      >
        <View style={styles.glowBorder}>
          <WebView
            ref={avatarWebViewRef}
            source={{ uri: 'http://192.168.1.41:5173/' }}
            style={styles.webView}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            mediaPlaybackRequiresUserAction={false}
            allowsInlineMediaPlayback={true}
            allowsFullscreenVideo={true}
            mixedContentMode="always"
            allowsProtectedMedia={true}
            mediaCapturePermissionGrantType="grantIfSameHostElsePrompt"
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('Avatar WebView error:', nativeEvent);
            }}
          />
        </View>
      </Animated.View>

      {/* Scrollable Chat Messages Section */}
      <ScrollView
        style={styles.chatScrollView}
        contentContainerStyle={styles.chatContent}
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Text with Icon */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeIcon}>👋</Text>
          <Text style={[styles.welcomeText, isDarkMode && styles.welcomeTextDark]}>
            Hi, I'm Rancho. How are you feeling today?
          </Text>
        </View>

        {/* Recording Indicator with Pulsing Red Dot */}
        {isRecording && (
          <View style={styles.statusContainer}>
            <Animated.View 
              style={[
                styles.recordingDot,
                { transform: [{ scale: micPulseAnim }] }
              ]} 
            />
            <Text style={styles.recordingText}>🎤 Mic is on - Speak now</Text>
          </View>
        )}

        {/* Converting Indicator with Animation */}
        {isConverting && (
          <Animated.View style={[styles.statusContainer, { opacity: convertAnim }]}>
            <Text style={styles.statusText}>⚡ Converting to text...</Text>
          </Animated.View>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>💭 Processing...</Text>
          </View>
        )}

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
            style={[
              styles.quickReplyButton, 
              isDarkMode && styles.quickReplyButtonDark,
              (isProcessing || isRecording || isConverting) && styles.quickReplyButtonDisabled
            ]}
            onPress={() => handleQuickReply('I feel anxious')}
            disabled={isProcessing || isRecording || isConverting}
          >
            <Text style={styles.quickReplyIcon}>😰</Text>
            <Text style={[styles.quickReplyText, isDarkMode && styles.quickReplyTextDark]}>I feel anxious</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.quickReplyButton, 
              isDarkMode && styles.quickReplyButtonDark,
              (isProcessing || isRecording || isConverting) && styles.quickReplyButtonDisabled
            ]}
            onPress={() => handleQuickReply('Help me calm down')}
            disabled={isProcessing || isRecording || isConverting}
          >
            <Text style={styles.quickReplyIcon}>🧘</Text>
            <Text style={[styles.quickReplyText, isDarkMode && styles.quickReplyTextDark]}>Help me calm down</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <TouchableOpacity 
            style={styles.attachButton} 
            onPress={handleCamera}
            disabled={isRecording || isConverting || isProcessing}
          >
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="#6b9aff">
              <Path d="M23,19a2,2,0,0,1-2,2H3a2,2,0,0,1-2-2V8A2,2,0,0,1,3,6H7a1,1,0,0,0,1-1,3,3,0,0,1,3-3h2a3,3,0,0,1,3,3,1,1,0,0,0,1,1h4a2,2,0,0,1,2,2ZM12,18a5,5,0,1,0-5-5A5,5,0,0,0,12,18Zm0-8a3,3,0,1,0,3,3A3,3,0,0,0,12,10Z" />
            </Svg>
          </TouchableOpacity>
          <TextInput
            style={[styles.input, isDarkMode && styles.inputDark]}
            placeholder={isRecording ? "Listening..." : "Type your message..."}
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            multiline
            editable={!isProcessing && !isRecording && !isConverting}
          />
          <Animated.View style={{ transform: [{ scale: isRecording ? micPulseAnim : 1 }] }}>
            <TouchableOpacity 
              style={[
                styles.voiceButton,
                isRecording && styles.voiceButtonActive
              ]} 
              onPress={handleMicButton}
              disabled={isProcessing || isConverting}
            >
              <Svg width={20} height={20} viewBox="0 0 24 24" fill={isRecording ? "#ff4444" : "#6b9aff"}>
                <Path d="M12,15a4,4,0,0,0,4-4V5A4,4,0,0,0,8,5v6A4,4,0,0,0,12,15ZM10,5a2,2,0,0,1,4,0v6a2,2,0,0,1-4,0Zm10,6a1,1,0,0,0-2,0A6,6,0,0,1,6,11a1,1,0,0,0-2,0,8,8,0,0,0,7,7.93V21H9a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2H13V18.93A8,8,0,0,0,20,11Z" />
              </Svg>
            </TouchableOpacity>
          </Animated.View>
          <TouchableOpacity 
            style={[
              styles.sendButton,
              (isProcessing || isConverting || (!isRecording && !inputText.trim())) && styles.sendButtonDisabled
            ]} 
            onPress={handleSendButton}
            disabled={isProcessing || isConverting || (!isRecording && !inputText.trim())}
          >
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
  avatarContainer: {
    width: '100%',
    height: 360,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#0a0f1e',
  },
  glowBorder: {
    flex: 1,
    borderRadius: 16,
    padding: 2,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  webView: {
    flex: 1,
    borderRadius: 14,
  },
  chatScrollView: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#0a0f1e',
  },
  chatContent: {
    paddingTop: 20,
    paddingBottom: 180,
    gap: 20,
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(42,96,234,0.25)',
    borderRadius: 25,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(107,154,255,0.3)',
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff4444',
  },
  recordingText: {
    color: '#ff4444',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'SpaceGrotesk',
  },
  statusText: {
    color: '#6b9aff',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'SpaceGrotesk',
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
  voiceButtonActive: {
    backgroundColor: 'rgba(255,68,68,0.3)',
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
  sendButtonDisabled: {
    opacity: 0.5,
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
  quickReplyButtonDisabled: {
    opacity: 0.4,
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