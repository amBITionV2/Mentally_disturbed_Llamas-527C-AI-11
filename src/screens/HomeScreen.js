import React, { useState, useEffect } from 'react';
import { View,Image, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import {Video} from 'expo-av';
import StatCard from '../components/StatCard';

const HomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('Alex'); // Dynamic user name (replace with auth context/API)
  const [stats, setStats] = useState({
    sleep: '7.5 hrs',
    heartRate: '72 bpm',
    stressScore: '25',
  });

  useEffect(() => {
    // Mock API fetch for stats (replace with real API)
    const fetchStats = async () => {
      try {
        // Example: const response = await axios.get('https://api.example.com/user/stats');
        const mockStats = {
          sleep: '7.5 hrs',
          heartRate: '72 bpm',
          stressScore: '25',
        };
        setStats(mockStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

const handleChat = () => {
  navigation.navigate('Chat');
};
const handleLogMood = () => {
  navigation.navigate('MoodCheck');
};
const handleGuidedBreathing = () => {
  navigation.navigate('Wellness');
};

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.headerInner}>
            <View style={styles.placeholder} />
            <Text style={styles.headerTitle}>Home</Text>
            <TouchableOpacity style={styles.settingsButton}>
              <Icon name="settings" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.greeting}>Hey {userName}, how are you today?</Text>
        </View>
        <View style={styles.main}>
          <View style={styles.moodTracker}>
            <LinearGradient
              colors={['rgba(42,96,234,0.1)', 'rgba(42,96,234,0.2)']} // bg-primary/10 dark:bg-primary/20
              style={styles.moodTrackerInner}
            >
              
              <View style={{ 
  marginTop: 20, 
  alignItems: 'center' 
}}>
  <View 
    style={{
      width: 250,
      height: 250,
      borderRadius: 125,   // half of width/height
      overflow: 'hidden',  // ensures GIF doesn’t overflow the circle
    }}
  >
    <Image
      source={require('../../assets/home.gif')}
      style={{ width: '100%', height: '100%' }}
    />
  </View>
</View>


              <Text style={styles.moodTitle}>Mood Tracker</Text>
              <Text style={styles.moodText}>Track your mood to gain insights into your emotional well-being.</Text>
            </LinearGradient>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButtonPrimary} onPress={handleChat}>
              <Text style={styles.buttonText}>Chat with Rancho</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButtonSecondary} onPress={handleLogMood}>
              <Text style={styles.buttonText}>Log Mood</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButtonTertiary} onPress={handleGuidedBreathing}>
              <LinearGradient
                colors={['rgba(42,96,234,0.2)', 'rgba(42,96,234,0.2)']}
                style={styles.blurOverlay}
              />
              <Text style={styles.buttonTextTertiary}>Guided Breathing</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statsSection}>
            <Text style={styles.statsTitle}>Your Stats</Text>
            <View style={styles.statsGrid}>
              <StatCard label="Sleep" value={stats.sleep} />
              <StatCard label="Heart Rate" value={stats.heartRate} />
              <StatCard label="Stress Score" value={stats.stressScore} />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111521', // dark:bg-background-dark
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    padding: 16, // p-4
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  placeholder: {
    width: 40, // w-10
  },
  headerTitle: {
    fontSize: 18, // text-lg
    fontWeight: 'bold',
    color: '#ffffff',
  },
  settingsButton: {
    width: 40, // w-10
    height: 40, // h-10
    borderRadius: 9999, // rounded-full
    backgroundColor: 'rgba(42,96,234,0.3)', // bg-primary/30
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    marginTop: 24, // mt-6
    fontSize: 24, // text-2xl
    fontWeight: 'bold',
    color: '#ffffff',
  },
  main: {
    padding: 16, // p-4
  },
  moodTracker: {
    borderRadius: 8, // rounded-lg
    overflow: 'hidden',
  },
  moodTrackerInner: {
    padding: 32, // p-8
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodCircleContainer: {
    width: 192, // w-48
    height: 192, // h-48
    position: 'relative',
  },
  outerCircle: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 9999,
    borderWidth: 8,
    borderColor: 'rgba(42,96,234,0.3)', // border-primary/30
  },
  innerCircle: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    bottom: 16,
    borderRadius: 9999,
    borderWidth: 8,
    borderColor: 'rgba(42,96,234,0.5)', // border-primary/50
  },
  centerCircle: {
    position: 'absolute',
    top: 32,
    left: 32,
    right: 32,
    bottom: 32,
    borderRadius: 9999,
    backgroundColor: 'rgba(42,96,234,0.6)', // bg-primary/60
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotTop: {
    position: 'absolute',
    left: '50%',
    top: 0,
    marginLeft: -8,
    width: 16, // w-4
    height: 16, // h-4
    borderRadius: 9999,
    backgroundColor: '#ffffff',
  },
  dotBottom: {
    position: 'absolute',
    left: '50%',
    bottom: 0,
    marginLeft: -8,
    width: 16,
    height: 16,
    borderRadius: 9999,
    backgroundColor: '#ffffff',
    opacity: 0.5,
  },
  dotLeft: {
    position: 'absolute',
    top: '50%',
    left: 0,
    marginTop: -8,
    width: 16,
    height: 16,
    borderRadius: 9999,
    backgroundColor: '#ffffff',
    opacity: 0.5,
  },
  dotRight: {
    position: 'absolute',
    top: '50%',
    right: 0,
    marginTop: -8,
    width: 16,
    height: 16,
    borderRadius: 9999,
    backgroundColor: '#ffffff',
    opacity: 0.5,
  },
  moodTitle: {
    marginTop: 24, // mt-6
    fontSize: 18, // text-lg
    fontWeight: 'bold',
    color: '#ffffff',
  },
  moodText: {
    marginTop: 8, // mt-2
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)', // text-white/60
    textAlign: 'center',
  },
  actions: {
    marginTop: 24, // mt-6
    gap: 16, // gap-4
  },
  actionButtonPrimary: {
    width: '100%',
    borderRadius: 9999, // rounded-full
    backgroundColor: '#2a60ea', // bg-primary
    paddingVertical: 12, // py-3
    alignItems: 'center',
    shadowColor: '#2a60ea',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 10,
  },
  actionButtonSecondary: {
    width: '100%',
    borderRadius: 9999,
    backgroundColor: 'rgba(42,96,234,0.3)', // bg-primary/30
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionButtonTertiary: {
    width: '100%',
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(42,96,234,0.5)', // border-primary/50
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.2,
  },
  buttonText: {
    fontSize: 14, // text-sm
    fontWeight: 'bold',
    color: '#ffffff',
  },
  buttonTextTertiary: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2a60ea', // text-primary
  },
  statsSection: {
    marginTop: 32, // mt-8
  },
  statsTitle: {
    fontSize: 18, // text-lg
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statsGrid: {
    marginTop: 16, // mt-4
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16, // gap-4
  },
});

export default HomeScreen;
