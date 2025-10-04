import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Svg, Path } from 'react-native-svg';

const TimerSliderScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const [selectedTime, setSelectedTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const onSliderChange = (value) => {
    const seconds = Math.floor(value * 60);
    setSelectedTime(seconds);
    if (!isRunning) {
      setRemainingTime(seconds);
    }
  };

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

  // Focus and Break button handlers
  const handleFocus = () => {
    if (selectedTime > 0) {
      setRemainingTime(selectedTime);
      setIsRunning(true);
    }
  };

  const handleBreak = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setRemainingTime(0);
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={styles.content}>
        <Text style={[styles.title, isDarkMode && styles.titleDark]}>Select Timer Duration</Text>

        <Text style={[styles.timeDisplay, isDarkMode && styles.timeDisplayDark]}>
          {formatTime(Math.floor(selectedTime))}
        </Text>


        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={180}
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
            style={[styles.button, styles.focusButton]}
            onPress={handleFocus}
            disabled={selectedTime === 0}
          >
            <Text style={[styles.buttonText, styles.focusButtonText]}>Focus</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.breakButton]}
            onPress={handleBreak}
            disabled={!isRunning && remainingTime === 0}
          >
            <Text style={[styles.buttonText, styles.breakButtonText]}>Break</Text>
          </TouchableOpacity>
          
        </View>
         <View style={{ 
          marginTop: 20, 
          alignItems: 'center' 
        }}>
          <View 
            style={{
              width: 300,
              height: 260,
              borderRadius: 10,   // half of width/height
              overflow: 'hidden',  // ensures GIF doesn’t overflow the circle
            }}
          >
            <Image
              source={require('../../assets/waves.gif')}
              style={{ width: '100%', height: '50%' }}
            />
          </View>
        </View>
        {/* Song name box below buttons */}
<View style={[styles.songNameBox, isDarkMode && styles.songNameBoxDark]}>
  <Text style={[styles.songName, isDarkMode && styles.songNameDark]}>
    Song name placeholder
  </Text>
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
    fontSize: 30,
    color: '#6b9aff',
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'Courier New',  // Different font for timer number
  },
  timeDisplayDark: {
    color: '#6b9aff',
  },
  songName: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#94a3b8',
    marginBottom: 24,
    fontFamily: 'SpaceGrotesk',
  },
  songNameDark: {
    color: '#94a3b8',
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
    fontSize: 85, // bigger timer number
    
    color: '#ffffff',
    fontFamily: 'Courier New',  // Different font for countdown number
  },
  timerTextDark: {
    color: '#ffffff',
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
    paddingHorizontal: 36,
    borderRadius: 15,
  },
  focusButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#AA336A',
  },
  breakButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#1E40AF',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'SpaceGrotesk',
  },
  focusButtonText: {
    color: '#ffffff',
  },
  breakButtonText: {
    color: '#ffffff',
  },
  songNameBox: {
    width: '80%',               // same width as buttons row
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // subtle translucent bg
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,              // space above box from buttons
  },
  songNameBoxDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },  
});

export default TimerSliderScreen;
