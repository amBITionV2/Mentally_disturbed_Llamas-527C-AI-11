import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import Slider from '@react-native-community/slider'; // Install this dependency for slider
import { Svg, Path } from 'react-native-svg';

const TimerSliderScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';

  // Timer state in seconds
  const [selectedTime, setSelectedTime] = useState(0); // selected time in seconds
  const [remainingTime, setRemainingTime] = useState(0); // remaining countdown time
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Handle slider change in minutes, convert to seconds
  const onSliderChange = (value) => {
    const seconds = Math.floor(value * 60);
    setSelectedTime(seconds);
    if (!isRunning) {
      setRemainingTime(seconds);
    }
  };

  // Timer tick effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // Play button handler
  const handlePlay = () => {
    if (selectedTime > 0) {
      setRemainingTime(selectedTime);
      setIsRunning(true);
    }
  };

  // Resume button handler
  const handleResume = () => {
    if (remainingTime > 0) {
      setIsRunning(true);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={styles.content}>
        <Text style={[styles.title, isDarkMode && styles.titleDark]}>
          Select Timer Duration
        </Text>

        <Text style={[styles.timeDisplay, isDarkMode && styles.timeDisplayDark]}>
          {formatTime(Math.floor(selectedTime))}
        </Text>

        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={180} // 3 hours in minutes
          step={1}
          value={selectedTime / 60}
          minimumTrackTintColor="#2a60ea"
          maximumTrackTintColor="#cbd5e1"
          onValueChange={onSliderChange}
        />

        <View style={styles.timerContainer}>
          <Text style={[styles.timerText, isDarkMode && styles.timerTextDark]}>
            {formatTime(remainingTime)}
          </Text>
        </View>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#2a60ea' }]}
            onPress={handlePlay}
          >
            <View style={styles.playIcon}>
              <Svg width={24} height={24} fill="#fff" viewBox="0 0 24 24">
                <Path d="M8 5v14l11-7z" />
              </Svg>
            </View>
            <Text style={styles.buttonText}>Play</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#34d399' }]}
            onPress={handleResume}
            disabled={remainingTime === 0}
          >
            <Text style={styles.buttonText}>Resume</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111521',
  },
  containerDark: {
    backgroundColor: '#111521',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    justifyContent: 'flex-start',
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
    fontSize: 20,
    color: '#6b9aff',
    fontWeight: '600',
    marginBottom: 8,
  },
  timeDisplayDark: {
    color: '#6b9aff',
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 40,
  },
  timerContainer: {
    marginVertical: 20,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2a60ea',
    fontFamily: 'SpaceGrotesk',
  },
  timerTextDark: {
    color: '#2a60ea',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  playIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'SpaceGrotesk',
  },
});

export default TimerSliderScreen;
