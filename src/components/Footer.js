import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Svg, Path, Circle } from 'react-native-svg';

const FooterNav = ({ navigation, activeTab }) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('Home')}
      >
        <Svg width={24} height={24} fill={activeTab === 'Home' ? '#13ecec' : '#6b7280'}>
          <Path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z" />
        </Svg>
        <Text style={[styles.navText, activeTab === 'Home' && styles.activeText]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('Rancho')}
      >
        <View style={styles.iconContainer}>
          <Svg width={24} height={24} fill={activeTab === 'Rancho' ? '#13ecec' : '#6b7280'}>
            <Path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm24,32a12,12,0,1,1-12-12A12,12,0,0,1,144,164Z" />
          </Svg>
          {activeTab === 'Rancho' && (
            <View style={styles.badge}>
              <View style={styles.badgeDot} />
            </View>
          )}
        </View>
        <Text style={[styles.navText, activeTab === 'Rancho' && styles.activeText]}>Rancho</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('Profile')}
      >
        <Svg width={24} height={24} fill={activeTab === 'Profile' ? '#13ecec' : '#6b7280'}>
          <Path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
        </Svg>
        <Text style={[styles.navText, activeTab === 'Profile' && styles.activeText]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(19, 236, 236, 0.2)', // primary/20
    backgroundColor: 'rgba(246, 248, 248, 0.8)', // background-light/80
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  badgeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#13ecec', // primary
    borderWidth: 2,
    borderColor: '#102222', // background-dark
  },
  navText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280', // text-gray-500
  },
  activeText: {
    color: '#13ecec', // primary
  },
});

export default FooterNav;