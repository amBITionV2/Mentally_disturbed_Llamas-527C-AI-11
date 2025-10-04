import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useColorScheme, Alert } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import BottomNav from '../components/BottomNav';
import CharacterAvatar from '../components/CharacterAvatar';

const ToolsScreen = ({ navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';

  const tools = [
    {
      id: 1,
      title: 'Breathing Exercises',
      description: 'Guided breathing techniques for relaxation',
      icon: 'M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm24,32a12,12,0,1,1-12-12A12,12,0,0,1,144,164Z',
      onPress: () => Alert.alert('Tools', 'Opening Breathing Exercises'),
    },
    {
      id: 2,
      title: 'Meditation',
      description: 'Mindfulness and meditation sessions',
      icon: 'M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z',
      onPress: () => Alert.alert('Tools', 'Opening Meditation'),
    },
    {
      id: 3,
      title: 'Mood Tracker',
      description: 'Track your daily mood and emotions',
      icon: 'M184,112a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16h64A8,8,0,0,1,184,112Zm-8,24H112a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Zm48-88V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM48,208H72V48H48Zm160,0V48H88V208H208Z',
      onPress: () => navigation.navigate('Journal'),
    },
    {
      id: 4,
      title: 'Sleep Tracker',
      description: 'Monitor your sleep patterns and quality',
      icon: 'M231.81,32.19a28,28,0,0,0-39.67.07L18.27,210.6A8,8,0,0,0,22.2,224a154.93,154.93,0,0,0,35,4c33.42,0,66.88-10.88,98.33-32.21,31.75-21.53,50.15-45.85,50.92-46.88a8,8,0,0,0-.74-10.46l-18.74-18.76,45-48A28.08,28.08,0,0,0,231.81,32.19ZM189.22,144.63a225.51,225.51,0,0,1-43.11,38.18c-34.47,23.25-70,32.7-105.84,28.16l106.3-109ZM220.5,60.5l-.18.19-44.71,47.67L157.74,90.47l45.78-47a12,12,0,0,1,17,17Z',
      onPress: () => Alert.alert('Tools', 'Opening Sleep Tracker'),
    },
  ];

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <CharacterAvatar type="focus" size={50} color="#13ecec" />
            <View style={styles.headerText}>
              <Text style={[styles.headerTitle, isDarkMode && styles.headerTitleDark]}>Tools</Text>
              <Text style={[styles.headerSubtitle, isDarkMode && styles.headerSubtitleDark]}>
                Mental health tools and resources
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.toolsContainer}>
          {tools.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              style={[styles.toolCard, isDarkMode && styles.toolCardDark]}
              onPress={tool.onPress}
            >
              <View style={[styles.toolIcon, isDarkMode && styles.toolIconDark]}>
                <Svg width={32} height={32} fill="#13ecec">
                  <Path d={tool.icon} />
                </Svg>
              </View>
              <View style={styles.toolContent}>
                <Text style={[styles.toolTitle, isDarkMode && styles.toolTitleDark]}>
                  {tool.title}
                </Text>
                <Text style={[styles.toolDescription, isDarkMode && styles.toolDescriptionDark]}>
                  {tool.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <BottomNav activeTab="Tools" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8f8', // background-light
  },
  containerDark: {
    backgroundColor: '#102222', // background-dark
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    fontFamily: 'SpaceGrotesk',
  },
  headerTitleDark: {
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 8,
    fontFamily: 'SpaceGrotesk',
  },
  headerSubtitleDark: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  toolsContainer: {
    gap: 16,
    paddingBottom: 80, // Space for bottom nav
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(19, 236, 236, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(19, 236, 236, 0.1)',
  },
  toolCardDark: {
    backgroundColor: 'rgba(246, 248, 248, 0.05)',
    borderColor: 'rgba(246, 248, 248, 0.1)',
  },
  toolIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(19, 236, 236, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  toolIconDark: {
    backgroundColor: 'rgba(19, 236, 236, 0.2)',
  },
  toolContent: {
    flex: 1,
  },
  toolTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    fontFamily: 'SpaceGrotesk',
  },
  toolTitleDark: {
    color: '#ffffff',
  },
  toolDescription: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'SpaceGrotesk',
  },
  toolDescriptionDark: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default ToolsScreen;
