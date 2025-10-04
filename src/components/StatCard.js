import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

const StatCard = ({ label, value }) => {
  return (
    <LinearGradient
      colors={['rgba(42,96,234,0.2)', 'rgba(42,96,234,0.3)']} // bg-primary/20 dark:bg-primary/30
      style={styles.card}
    >
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 100, // For responsive grid (sm:grid-cols-3)
    borderRadius: 8, // rounded-lg
    padding: 16, // p-4
  },
  label: {
    fontSize: 14, // text-sm
    color: 'rgba(255,255,255,0.6)', // text-white/60
  },
  value: {
    fontSize: 24, // text-2xl
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default StatCard;