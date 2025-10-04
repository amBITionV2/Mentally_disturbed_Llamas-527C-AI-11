import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, useColorScheme } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

const DropdownMenu = ({ isVisible, onClose }) => {
  const navigation = useNavigation();
  const isDarkMode = useColorScheme() === 'dark';

  const menuItems = [
    { id: 'home', title: 'Home', icon: 'M10,20V14H14V20H19V12H22L12,3,2,12H5V20Z', screen: 'Tabs' },
    { id: 'chat', title: 'Chat', icon: 'M12,2A10,10,0,0,0,2,12a9.89,9.89,0,0,0,2.26,6.33l-2,2a1,1,0,0,0-.21,1.09A1,1,0,0,0,3,22h9A10,10,0,0,0,12,2Zm0,18a8,8,0,0,1-8-8,7.93,7.93,0,0,1,1.69-4.9L9,12.5a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V8.5l2.31,2.6A7.93,7.93,0,0,1,20,12,8,8,0,0,1,12,20Z', screen: 'Tabs' },
    { id: 'journal', title: 'Journal', icon: 'M19,3H5C3.89,3,3,3.89,3,5V19A2,2,0,0,0,5,21H19A2,2,0,0,0,21,19V5C21,3.89,20.1,3,19,3M19,19H5V5H19V19Z', screen: 'Tabs' },
    { id: 'tools', title: 'Tools', icon: 'M22.7,19L13.6,9.9C14.5,7.6,14,4.9,12.1,3C10.1,1,7.1,1,5.1,3S1,7.1,3,9.1C4.9,11,7.6,11.5,9.9,10.6L19,19.7C19.4,20.1,19.9,20.1,20.3,19.7L22.6,17.4C23.1,16.9,23.1,16.1,22.7,19Z', screen: 'Tabs' },
    { id: 'profile', title: 'Profile', icon: 'M12,12A5,5,0,1,0,7,7,5,5,0,0,0,12,12Zm0,8a7,7,0,0,0,7-7,7,7,0,0,0-7-7,7,7,0,0,0-7,7A7,7,0,0,0,12,20Z', screen: 'Tabs' },
    { id: 'mood', title: 'Mood Check', icon: 'M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20ZM12,6a6,6,0,0,0-6,6H8a4,4,0,0,1,8,0h2A6,6,0,0,0,12,6Z', screen: 'MoodCheck' },
    { id: 'wellness', title: 'Wellness', icon: 'M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20ZM12,6a6,6,0,0,0-6,6H8a4,4,0,0,1,8,0h2A6,6,0,0,0,12,6Z', screen: 'Wellness' },
  ];

  const handleMenuPress = (screen) => {
    onClose();
    navigation.navigate(screen);
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
        <View style={[styles.menuContainer, isDarkMode && styles.menuContainerDark]}>
          <View style={styles.menuHeader}>
            <Text style={[styles.menuTitle, isDarkMode && styles.menuTitleDark]}>Menu</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Svg width={24} height={24} fill={isDarkMode ? '#ffffff' : '#4b5563'}>
                <Path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12Z" />
              </Svg>
            </TouchableOpacity>
          </View>
          <View style={styles.menuItems}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, isDarkMode && styles.menuItemDark]}
                onPress={() => handleMenuPress(item.screen)}
              >
                <View style={styles.menuItemIcon}>
                  <Svg width={20} height={20} fill={isDarkMode ? '#13ecec' : '#2a60ea'}>
                    <Path d={item.icon} />
                  </Svg>
                </View>
                <Text style={[styles.menuItemText, isDarkMode && styles.menuItemTextDark]}>
                  {item.title}
                </Text>
                <Svg width={16} height={16} fill={isDarkMode ? '#ffffff' : '#4b5563'}>
                  <Path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                </Svg>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#111521',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  menuContainerDark: {
    backgroundColor: '#111521',
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'SpaceGrotesk',
  },
  menuTitleDark: {
    color: '#ffffff',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(19, 236, 236, 0.1)',
  },
  menuItems: {
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  menuItemDark: {
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(19, 236, 236, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'SpaceGrotesk',
  },
  menuItemTextDark: {
    color: '#ffffff',
  },
});

export default DropdownMenu;
