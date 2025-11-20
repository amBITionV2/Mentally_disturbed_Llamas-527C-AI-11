import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

const BLUE = '#3b82f6';
const DARK_BG = '#13142a';
const INACTIVE_ICON = 'rgba(255,255,255,0.7)';

const BottomNav = ({ state, navigation }) => {
  const activeTab = state.routes[state.index].name;


  const tabs = [
    {
      name: 'Home',
      icon: (
        <Svg width={24} height={24} viewBox="0 0 256 256" fill={activeTab === 'Home' ? BLUE : INACTIVE_ICON}>
          <Path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z" />
        </Svg>
      ),
      label: 'Home',
    },
    {
      name: 'Chat',
      icon: (
        <Svg width={24} height={24} viewBox="0 0 256 256" fill={activeTab === 'Chat' ? BLUE : INACTIVE_ICON}>
          <Path d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM84,116a12,12,0,1,0,12,12A12,12,0,0,0,84,116Zm88,0a12,12,0,1,0,12,12A12,12,0,0,0,172,116Zm60,12A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Zm-16,0A88,88,0,1,0,51.81,172.06a8,8,0,0,1,.66,6.54L40,216,77.4,203.53a7.85,7.85,0,0,1,2.53-.42,8,8,0,0,1,4,1.08A88,88,0,0,0,216,128Z" />
        </Svg>
      ),
      label: 'Chat',
    },
    {
      name: 'Journal',
      icon: (
        <Svg width={24} height={24} viewBox="0 0 256 256" fill={activeTab === 'Journal' ? BLUE : INACTIVE_ICON}>
          <Path d="M240,64V192a16,16,0,0,1-16,16H160a24,24,0,0,0-24,24,8,8,0,0,1-16,0,24,24,0,0,0-24-24H32a16,16,0,0,1-16-16V64A16,16,0,0,1,32,48H88a32,32,0,0,1,32,32v88a8,8,0,0,0,16,0V80a32,32,0,0,1,32-32h56A16,16,0,0,1,240,64Z" />
        </Svg>
      ),
      label: 'Journal',
    },
    {
      name: 'Tools',
      icon: (
        <Svg width={24} height={24} viewBox="0 0 256 256" fill={activeTab === 'Tools' ? BLUE : INACTIVE_ICON}>
          <Path d="M226.76,69a8,8,0,0,0-12.84-2.88l-40.3,37.19-17.23-3.7-3.7-17.23,37.19-40.3A8,8,0,0,0,187,29.24,72,72,0,0,0,88,96,72.34,72.34,0,0,0,94,124.94L33.79,177c-.15.12-.29.26-.43.39a32,32,0,0,0,45.26,45.26c.13-.13.27-.28.39-.42L131.06,162A72,72,0,0,0,232,96,71.56,71.56,0,0,0,226.76,69ZM160,152a56.14,56.14,0,0,1-27.07-7,8,8,0,0,0-9.92,1.77L67.11,211.51a16,16,0,0,1-22.62-22.62L109.18,133a8,8,0,0,0,1.77-9.93,56,56,0,0,1,58.36-82.31l-31.2,33.81a8,8,0,0,0-1.94,7.1L141.83,108a8,8,0,0,0,6.14,6.14l26.35,5.66a8,8,0,0,0,7.1-1.94l33.81-31.2A56.06,56.06,0,0,1,160,152Z" />
        </Svg>
      ),
      label: 'Tools',
    },
    {
      name: 'Profile',
      icon: (
        <Svg width={24} height={24} viewBox="0 0 256 256" fill={activeTab === 'Profile' ? BLUE : INACTIVE_ICON}>
          <Path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
        </Svg>
      ),
      label: 'Profile',
    },
    {
      name: 'Relax',
      icon: (
        <Svg width={24} height={24} viewBox="0 0 256 256" fill={activeTab === 'Relax' ? BLUE : INACTIVE_ICON}>
          <Path d="M200 32v136a40 40 0 1 1-24-37.32V72h-40v96a40 40 0 1 1-24-37.32V32z" />
        </Svg>
      ),
      label: 'Relax',
    },
  ];
  const handleNavPress = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.name}
            style={[styles.item, activeTab === tab.name && styles.activeItem]}
            onPress={() => handleNavPress(tab.name)}
          >
            {tab.icon}
            <Text style={[styles.label, activeTab === tab.name ? styles.labelActive : styles.labelInactive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: DARK_BG,
    borderTopWidth: 1,
    borderTopColor: 'rgba(59,130,246,0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 20,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 10,
    height: 80,
  },
  item: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
    minWidth: 56,
  },
  activeItem: {
    backgroundColor: 'rgba(59,130,246,0.10)',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'SpaceGrotesk',
    textAlign: 'center',
  },
  labelActive: {
    color: BLUE,
    fontWeight: '600',
  },
  labelInactive: {
    color: INACTIVE_ICON,
  },
});

export default BottomNav;
