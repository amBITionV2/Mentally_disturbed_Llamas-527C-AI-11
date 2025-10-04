import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const JournalEntry = ({ date, mood, notes, image }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.notes}>
          <Text style={styles.label}>Mood:</Text> {mood} {'\n'}
          <Text style={styles.label}>Notes:</Text> {notes}
        </Text>
      </View>
      <Image source={{ uri: image }} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16, // gap-4
    borderRadius: 8, // rounded-lg
    backgroundColor: 'rgba(0,0,0,0.2)', // dark:bg-black/20
    padding: 16, // p-4
    borderWidth: 1,
    borderColor: 'rgba(42,96,234,0.5)', // border-primary/50
    shadowColor: '#2a60ea', // glow
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  content: {
    flex: 1,
  },
  date: {
    fontWeight: 'bold',
    color: '#ffffff', // dark:text-white
    marginBottom: 4,
  },
  notes: {
    fontSize: 14, // text-sm
    color: '#9CA3AF', // dark:text-neutral-400
  },
  label: {
    fontWeight: '600',
  },
  image: {
    width: 96, // w-24
    height: 96, // h-24
    borderRadius: 8, // rounded-lg
    resizeMode: 'cover',
  },
});

export default JournalEntry;