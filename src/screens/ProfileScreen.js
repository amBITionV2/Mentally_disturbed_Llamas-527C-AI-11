import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useColorScheme, Alert, Switch } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import DropdownMenu from '../components/DropdownMenu';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const isDarkMode = useColorScheme() === 'dark';
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(isDarkMode);
  const [showDropdown, setShowDropdown] = useState(false);

  const profileOptions = [
    {
      id: 1,
      title: 'Personal Information',
      description: 'Update your profile details',
      icon: 'M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z',
      onPress: () => Alert.alert('Profile', 'Opening Personal Information'),
    },
    {
      id: 2,
      title: 'Privacy Settings',
      description: 'Manage your privacy and data',
      icon: 'M224,48V128a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM48,208H72V48H48Zm160,0V48H88V208H208Z',
      onPress: () => Alert.alert('Profile', 'Opening Privacy Settings'),
    },
    {
      id: 3,
      title: 'Help & Support',
      description: 'Get help and contact support',
      icon: 'M232,96a16,16,0,0,0-16-16H184V48a16,16,0,0,0-16-16H40A16,16,0,0,0,24,48V176a8,8,0,0,0,13,6.22L72,154V184a16,16,0,0,0,16,16h93.59L219,230.22a8,8,0,0,0,5,1.78,8,8,0,0,0,8-8Zm-42.55,89.78a8,8,0,0,0-5-1.78H88V152h80a16,16,0,0,0,16-16V96h32V207.25Z',
      onPress: () => Alert.alert('Profile', 'Opening Help & Support'),
    },
    {
      id: 4,
      title: 'About',
      description: 'App version and information',
      icon: 'M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm24,32a12,12,0,1,1-12-12A12,12,0,0,1,144,164Z',
      onPress: () => Alert.alert('About', 'Mental Health App v1.0.0'),
    },
  ];

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      {/* Header */}
      <View style={[styles.appHeader, isDarkMode && styles.appHeaderDark]}>
        <View style={styles.headerSpacer} />
        <Text style={[styles.headerTitle, isDarkMode && styles.headerTitleDark]}>Profile</Text>
        <TouchableOpacity style={styles.menuButton} onPress={() => setShowDropdown(true)}>
          <Svg width={24} height={24} fill="#ffffff">
            <Path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
          </Svg>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.profileHeader}>
          <View style={[styles.avatarContainer, isDarkMode && styles.avatarContainerDark]}>
            <Svg width={60} height={60} fill="#13ecec">
              <Path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
            </Svg>
          </View>
          <Text style={[styles.userName, isDarkMode && styles.userNameDark]}>Alex Johnson</Text>
          <Text style={[styles.userEmail, isDarkMode && styles.userEmailDark]}>alex.johnson@example.com</Text>
        </View>

        <View style={styles.settingsContainer}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>Settings</Text>
          
          <View style={[styles.settingItem, isDarkMode && styles.settingItemDark]}>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, isDarkMode && styles.settingTitleDark]}>Notifications</Text>
              <Text style={[styles.settingDescription, isDarkMode && styles.settingDescriptionDark]}>
                Receive push notifications
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#767577', true: '#13ecec' }}
              thumbColor={notifications ? '#ffffff' : '#f4f3f4'}
            />
          </View>

          <View style={[styles.settingItem, isDarkMode && styles.settingItemDark]}>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, isDarkMode && styles.settingTitleDark]}>Dark Mode</Text>
              <Text style={[styles.settingDescription, isDarkMode && styles.settingDescriptionDark]}>
                Use dark theme
              </Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#767577', true: '#13ecec' }}
              thumbColor={darkMode ? '#ffffff' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.optionsContainer}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>Account</Text>
          {profileOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.optionItem, isDarkMode && styles.optionItemDark]}
              onPress={option.onPress}
            >
              <View style={[styles.optionIcon, isDarkMode && styles.optionIconDark]}>
                <Svg width={24} height={24} fill="#13ecec">
                  <Path d={option.icon} />
                </Svg>
              </View>
              <View style={styles.optionContent}>
                <Text style={[styles.optionTitle, isDarkMode && styles.optionTitleDark]}>
                  {option.title}
                </Text>
                <Text style={[styles.optionDescription, isDarkMode && styles.optionDescriptionDark]}>
                  {option.description}
                </Text>
              </View>
              <Svg width={16} height={16} fill={isDarkMode ? 'rgba(255, 255, 255, 0.5)' : '#6b7280'}>
                <Path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
              </Svg>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, isDarkMode && styles.logoutButtonDark]}
          onPress={() => Alert.alert('Logout', 'Are you sure you want to logout?')}
        >
          <Text style={[styles.logoutText, isDarkMode && styles.logoutTextDark]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
      <DropdownMenu isVisible={showDropdown} onClose={() => setShowDropdown(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111521', // Match app theme
  },
  containerDark: {
    backgroundColor: '#111521', // Consistent dark theme
  },
  // App Header Styles
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#111521',
  },
  appHeaderDark: {
    backgroundColor: '#111521',
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
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
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(19, 236, 236, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainerDark: {
    backgroundColor: 'rgba(19, 236, 236, 0.2)',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    fontFamily: 'SpaceGrotesk',
  },
  userNameDark: {
    color: '#ffffff',
  },
  userEmail: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
    fontFamily: 'SpaceGrotesk',
  },
  userEmailDark: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  settingsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    fontFamily: 'SpaceGrotesk',
  },
  sectionTitleDark: {
    color: '#ffffff',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(19, 236, 236, 0.05)',
    borderRadius: 12,
    marginBottom: 8,
  },
  settingItemDark: {
    backgroundColor: 'rgba(246, 248, 248, 0.05)',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'SpaceGrotesk',
  },
  settingTitleDark: {
    color: '#ffffff',
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
    fontFamily: 'SpaceGrotesk',
  },
  settingDescriptionDark: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(19, 236, 236, 0.05)',
    borderRadius: 12,
    marginBottom: 8,
  },
  optionItemDark: {
    backgroundColor: 'rgba(246, 248, 248, 0.05)',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(19, 236, 236, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionIconDark: {
    backgroundColor: 'rgba(19, 236, 236, 0.2)',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'SpaceGrotesk',
  },
  optionTitleDark: {
    color: '#ffffff',
  },
  optionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
    fontFamily: 'SpaceGrotesk',
  },
  optionDescriptionDark: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  logoutButton: {
    padding: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 80, // Space for bottom nav
  },
  logoutButtonDark: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    fontFamily: 'SpaceGrotesk',
  },
  logoutTextDark: {
    color: '#f87171',
  },
});

export default ProfileScreen;
