import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { Svg, Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import musicData from '../../mindfm_music_list.json';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const TimerSliderScreen = ({ route, navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const { theme } = route?.params || {};
  
  const [selectedTime, setSelectedTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [musicPosition, setMusicPosition] = useState(0);
  const [musicDuration, setMusicDuration] = useState(0);
  const intervalRef = useRef(null);
  
  // Animation values
  const glowAnimation = useRef(new Animated.Value(0)).current;
  const flowAnimation1 = useRef(new Animated.Value(0)).current;
  const flowAnimation2 = useRef(new Animated.Value(0)).current;
  const flowAnimation3 = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  // Theme colors based on category
  const themeColors = {
    focus: { primary: '#f59e0b', secondary: '#fbbf24', glow: '#fbbf24' },
    meditation: { primary: '#8b5cf6', secondary: '#c084fc', glow: '#a78bfa' },
    sleep: { primary: '#2a60ea', secondary: '#6b9aff', glow: '#60a5fa' },
    relax: { primary: '#10b981', secondary: '#34d399', glow: '#34d399' },
    work: { primary: '#ef4444', secondary: '#fb7185', glow: '#f87171' },
    nature: { primary: '#06b6d4', secondary: '#22d3ee', glow: '#22d3ee' },
    yoga: { primary: '#ec4899', secondary: '#f472b6', glow: '#f472b6' },
    study: { primary: '#6366f1', secondary: '#818cf8', glow: '#818cf8' },
  };

  const categoryKey = theme?.title?.toLowerCase() || 'focus';
  const colors = themeColors[categoryKey] || themeColors.focus;
  
  const availableSongs = musicData.filter(
    song => song.category.toLowerCase() === categoryKey
  );

  // Set first song as default
  useEffect(() => {
    if (availableSongs.length > 0 && !currentSong) {
      setCurrentSong(availableSongs[0]);
    }
  }, [availableSongs]);

  // Start animations when playing
  useEffect(() => {
    if (isPlaying) {
      // Main glow pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnimation, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnimation, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Flow animations - Siri-like organic movement
      Animated.loop(
        Animated.sequence([
          Animated.timing(flowAnimation1, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: false,
          }),
          Animated.timing(flowAnimation1, {
            toValue: 0,
            duration: 2500,
            useNativeDriver: false,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(flowAnimation2, {
            toValue: 1,
            duration: 3200,
            useNativeDriver: false,
          }),
          Animated.timing(flowAnimation2, {
            toValue: 0,
            duration: 3200,
            useNativeDriver: false,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(flowAnimation3, {
            toValue: 1,
            duration: 2800,
            useNativeDriver: false,
          }),
          Animated.timing(flowAnimation3, {
            toValue: 0,
            duration: 2800,
            useNativeDriver: false,
          }),
        ])
      ).start();

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      glowAnimation.setValue(0);
      flowAnimation1.setValue(0);
      flowAnimation2.setValue(0);
      flowAnimation3.setValue(0);
      pulseAnimation.setValue(1);
    }
  }, [isPlaying]);

  // Configure audio mode on mount
  useEffect(() => {
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });
      } catch (error) {
        console.error('Error configuring audio:', error);
      }
    };
    configureAudio();
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sound]);

  const playSound = async () => {
    try {
      setIsLoading(true);
      
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      
      if (!currentSong) {
        Alert.alert('No Song Selected', 'Please select a song first');
        setIsLoading(false);
        return;
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: currentSong.url },
        { 
          shouldPlay: true, 
          isLooping: true,
          volume: 1.0,
        }
      );
      
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setMusicPosition(status.positionMillis);
          setMusicDuration(status.durationMillis || 0);
          if (status.didJustFinish && !status.isLooping) {
            setIsPlaying(false);
          }
        }
      });
      
      setSound(newSound);
      setIsPlaying(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to play audio. Please try again.');
      console.error('Audio playback error:', error);
    }
  };

  const pauseSound = async () => {
    try {
      if (sound) {
        await sound.pauseAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error pausing sound:', error);
    }
  };

  const stopSound = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error stopping sound:', error);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatMusicTime = (millis) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const onSliderChange = (value) => {
    const seconds = Math.floor(value * 60);
    setSelectedTime(seconds);
    if (!isRunning) {
      setRemainingTime(seconds);
    }
  };

  const handleMusicSliderChange = async (value) => {
    if (sound && musicDuration > 0) {
      const newPosition = value * musicDuration;
      await sound.setPositionAsync(newPosition);
      setMusicPosition(newPosition);
    }
  };

  // Timer countdown effect
  useEffect(() => {
    if (isRunning && remainingTime > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            pauseSound();
            Alert.alert('Time\'s Up!', 'Your focus session has ended.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, remainingTime]);

  const handleFocus = async () => {
    if (selectedTime === 0) {
      Alert.alert('Set Timer', 'Please set a timer duration first');
      return;
    }
    
    setRemainingTime(selectedTime);
    setIsRunning(true);
    
    if (!isPlaying) {
      await playSound();
    }
  };

  const handleBreak = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
    setRemainingTime(0);
    await pauseSound();
  };

  const handleSongSelect = async (song) => {
    const wasPlaying = isPlaying;
    
    if (isPlaying) {
      await stopSound();
    }
    
    setCurrentSong(song);
    setMusicPosition(0);
    setMusicDuration(0);
    
    if (wasPlaying) {
      setTimeout(() => {
        playSound();
      }, 300);
    }
  };

  const handleNextSong = () => {
    const currentIndex = availableSongs.findIndex(s => s.url === currentSong?.url);
    const nextIndex = (currentIndex + 1) % availableSongs.length;
    handleSongSelect(availableSongs[nextIndex]);
  };

  const handlePreviousSong = () => {
    const currentIndex = availableSongs.findIndex(s => s.url === currentSong?.url);
    const prevIndex = currentIndex === 0 ? availableSongs.length - 1 : currentIndex - 1;
    handleSongSelect(availableSongs[prevIndex]);
  };

  const glowOpacity = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  // Flowing gradient positions for Siri-like effect
  const flow1Position = flowAnimation1.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const flow2Position = flowAnimation2.interpolate({
    inputRange: [0, 1],
    outputRange: ['100%', '0%'],
  });

  const flow3Position = flowAnimation3.interpolate({
    inputRange: [0, 1],
    outputRange: ['50%', '150%'],
  });

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      {/* Siri-Style Flowing Border Animation */}
      {isPlaying && (
        <>
          {/* Multiple flowing gradient layers */}
          <Animated.View
            style={[
              styles.siriFlowBorder,
              {
                opacity: glowOpacity,
              },
            ]}
          >
            <LinearGradient
              colors={[
                `${colors.primary}00`,
                `${colors.primary}80`,
                `${colors.secondary}80`,
                `${colors.glow}80`,
                `${colors.primary}00`,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.siriGradient}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.siriFlowBorder2,
              {
                opacity: glowOpacity * 0.7,
              },
            ]}
          >
            <LinearGradient
              colors={[
                `${colors.secondary}00`,
                `${colors.glow}60`,
                `${colors.primary}60`,
                `${colors.secondary}00`,
              ]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.siriGradient}
            />
          </Animated.View>

          {/* Soft outer glow */}
          <Animated.View
            style={[
              styles.siriOuterGlow,
              {
                opacity: glowOpacity * 0.5,
                shadowColor: colors.glow,
              },
            ]}
          />
        </>
      )}

      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Svg width={24} height={24} fill="#ffffff">
            <Path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
          </Svg>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkMode && styles.titleDark]}>
          {theme?.title || 'Focus'} Session
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, isDarkMode && styles.titleDark]}>
          Select Timer Duration
        </Text>

        <Text style={[styles.timeDisplay, isDarkMode && styles.timeDisplayDark]}>
          {formatTime(Math.floor(selectedTime))}
        </Text>

        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={180}
          step={1}
          value={selectedTime / 60}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor="#cbd5e1"
          thumbTintColor={colors.primary}
          onValueChange={onSliderChange}
        />

        <Animated.View style={[styles.timerContainer, { transform: [{ scale: pulseAnimation }] }]}>
          <Text style={[styles.timerText, isDarkMode && styles.timerTextDark]}>
            {formatTime(remainingTime)}
          </Text>
        </Animated.View>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.button, { borderColor: colors.primary }]}
            onPress={handleFocus}
            disabled={selectedTime === 0 || isRunning}
          >
            <LinearGradient
              colors={[colors.primary + '20', colors.secondary + '20']}
              style={styles.buttonGradient}
            >
              <Text style={[styles.buttonText]}>
                {isRunning ? 'Running...' : 'Focus'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { borderColor: '#1E40AF' }]}
            onPress={handleBreak}
            disabled={!isRunning && remainingTime === 0}
          >
            <LinearGradient
              colors={['#1E40AF20', '#3B82F620']}
              style={styles.buttonGradient}
            >
              <Text style={[styles.buttonText]}>Break</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Glassmorphism Music Player Card */}
        <BlurView intensity={30} tint="dark" style={styles.glassCard}>
          <LinearGradient
            colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
            style={styles.glassGradient}
          >
            {/* Album Art / Visualization */}
            <View style={styles.albumArtContainer}>
              <Image
                source={require('../../assets/waves.gif')}
                style={styles.albumArt}
                resizeMode="cover"
              />
              <LinearGradient
                colors={[colors.primary + '40', colors.secondary + '40']}
                style={styles.albumOverlay}
              />
            </View>

            {/* Song Info */}
            <View style={styles.songInfo}>
              <Text style={styles.songLabel}>NOW PLAYING</Text>
              <Text style={styles.songTitle} numberOfLines={2}>
                {currentSong ? currentSong.name : 'No song selected'}
              </Text>
            </View>

            {/* Music Progress Slider */}
            <View style={styles.progressContainer}>
              <Text style={styles.timeText}>{formatMusicTime(musicPosition)}</Text>
              <Slider
                style={styles.musicSlider}
                minimumValue={0}
                maximumValue={1}
                value={musicDuration > 0 ? musicPosition / musicDuration : 0}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor="rgba(255,255,255,0.2)"
                thumbTintColor={colors.primary}
                onSlidingComplete={handleMusicSliderChange}
                disabled={!isPlaying || musicDuration === 0}
              />
              <Text style={styles.timeText}>{formatMusicTime(musicDuration)}</Text>
            </View>

            {/* Music Controls */}
            <View style={styles.musicControls}>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={handlePreviousSong}
                disabled={availableSongs.length === 0}
              >
                <Svg width={28} height={28} fill="#ffffff">
                  <Path d="M6,6h2v12H6V6z M9.5,12l8.5,6V6L9.5,12z" />
                </Svg>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.playButton, { backgroundColor: colors.primary }]}
                onPress={isPlaying ? pauseSound : playSound}
                disabled={isLoading || !currentSong}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Svg width={32} height={32} fill="#ffffff" viewBox="0 0 24 24">
                    {isPlaying ? (
                      <Path d="M6,4h4v16H6V4z M14,4h4v16h-4V4z" />
                    ) : (
                      <Path d="M8,5v14l11-7L8,5z" />
                    )}
                  </Svg>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.controlButton}
                onPress={handleNextSong}
                disabled={availableSongs.length === 0}
              >
                <Svg width={28} height={28} fill="#ffffff">
                  <Path d="M6,18l8.5-6L6,6V18z M16,6v12h2V6H16z" />
                </Svg>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </BlurView>

        {/* Song List with Glassmorphism */}
        <View style={styles.songListContainer}>
          <Text style={[styles.songListTitle, isDarkMode && styles.titleDark]}>
            Available Tracks ({availableSongs.length})
          </Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.songScrollContent}
          >
            {availableSongs.length > 0 ? (
              availableSongs.map((item, index) => (
                <TouchableOpacity
                  key={`${item.category}-${index}`}
                  onPress={() => handleSongSelect(item)}
                  activeOpacity={0.8}
                >
                  <BlurView 
                    intensity={20} 
                    tint="dark"
                    style={[
                      styles.songCard,
                      currentSong?.url === item.url && { 
                        borderColor: colors.primary,
                        borderWidth: 2,
                      }
                    ]}
                  >
                    <LinearGradient
                      colors={
                        currentSong?.url === item.url
                          ? [colors.primary + '40', colors.secondary + '40']
                          : ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.04)']
                      }
                      style={styles.songCardGradient}
                    >
                      {currentSong?.url === item.url && (
                        <View style={[styles.playingIndicator, { backgroundColor: colors.primary }]}>
                          <Text style={styles.playingText}>♫</Text>
                        </View>
                      )}
                      <Text
                        style={[
                          styles.songCardText,
                          currentSong?.url === item.url && styles.songCardTextActive,
                        ]}
                        numberOfLines={3}
                      >
                        {item.name}
                      </Text>
                    </LinearGradient>
                  </BlurView>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noSongsText}>
                No songs available for this category
              </Text>
            )}
          </ScrollView>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e1a',
  },
  containerDark: {
    backgroundColor: '#0a0e1a',
  },
  siriFlowBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    borderRadius: 0,
  },
  siriFlowBorder2: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    borderRadius: 0,
  },
  siriGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 4,
    borderRadius: 0,
  },
  siriOuterGlow: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    borderRadius: 40,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 60,
    zIndex: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'SpaceGrotesk',
  },
  scrollContainer: {
    flex: 1,
    zIndex: 2,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 24,
    fontFamily: 'SpaceGrotesk',
  },
  titleDark: {
    color: '#ffffff',
  },
  timeDisplay: {
    fontSize: 30,
    color: '#6b9aff',
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'Courier New',
  },
  timeDisplayDark: {
    color: '#6b9aff',
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 20,
  },
  timerContainer: {
    marginVertical: 20,
  },
  timerText: {
    fontSize: 72,
    color: '#ffffff',
    fontFamily: 'Courier New',
    fontWeight: 'bold',
  },
  timerTextDark: {
    color: '#ffffff',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 30,
  },
  button: {
    flex: 0.48,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
  },
  buttonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'SpaceGrotesk',
    color: '#ffffff',
  },
  glassCard: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  glassGradient: {
    padding: 20,
  },
  albumArtContainer: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  albumArt: {
    width: '100%',
    height: '100%',
  },
  albumOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  songInfo: {
    marginBottom: 12,
    alignItems: 'center',
  },
  songLabel: {
    fontSize: 10,
    color: '#6b9aff',
    fontFamily: 'SpaceGrotesk',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  songTitle: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'SpaceGrotesk',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  timeText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontFamily: 'Courier New',
    minWidth: 40,
  },
  musicSlider: {
    flex: 1,
    height: 40,
    marginHorizontal: 8,
  },
  musicControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  songListContainer: {
    width: '100%',
    marginTop: 10,
  },
  songListTitle: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'SpaceGrotesk',
  },
  songScrollContent: {
    paddingRight: 20,
  },
  songCard: {
    width: 180,
    height: 140,
    borderRadius: 16,
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  songCardGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  playingIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playingText: {
    fontSize: 16,
    color: '#ffffff',
  },
  songCardText: {
    color: '#94a3b8',
    fontSize: 13,
    fontFamily: 'SpaceGrotesk',
    lineHeight: 18,
  },
  songCardTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  noSongsText: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'SpaceGrotesk',
  },
});

export default TimerSliderScreen;