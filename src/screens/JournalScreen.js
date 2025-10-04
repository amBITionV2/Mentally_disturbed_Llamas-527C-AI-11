import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import Svg, { Path, LinearGradient, Stop } from 'react-native-svg';
import JournalEntry from '../components/JournalEntry';

const JournalScreen = ({ navigation }) => {
  const [month, setMonth] = useState('October 2024');
  const [calendarDays, setCalendarDays] = useState(
    Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      mood: Math.random() > 0.7 ? ['green', 'blue', 'red'][Math.floor(Math.random() * 3)] : null,
    }))
  );

  const journalEntries = [
    {
      date: 'Oct 20, 2024',
      mood: 'Happy',
      notes: 'Had a great day at the park with friends.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2cHR3uQa33ymtcU3Pufe2svRhw_iEhvLK0xFRc_1AjTOiX5KlOX0aOzWMAmnOSsGnXLW9IwEytJTPr-DWC43DnlSoAHUCdRRRx2c0WeZ2PTit0wK0JQFg3HoEvS67vC1kwqIvaIY1Xa6jMTKn0a2X6b0IFp4Ek-F28KYlu_-R2U7e-5ZmREY0zb76w2jwUKCOl1CwcJixaNDm-UHtdvxnN9w454CswpIjEIpcaDavrvNd6cpvzvNL5toPxsJ9HIeB7b2EzISVIAc',
    },
    {
      date: 'Oct 19, 2024',
      mood: 'Calm',
      notes: 'Relaxing evening at home, reading a book.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWOZLiA04ENrc_t5OA1BCCl_oKyziBr0RHDgY85cf_FNVHy7sc527BufDCHKbsLkI2JMgQMpG9oAE7xSxEtnOjXIw8Ar_J5K3QX3nxMLhGtuMs3618NFcgeuJS0v7JKb7qxfZIoKonxPqU3YVkJY6ua3cIP3UQCzTkCbr_1Mi47hxhiomoWkk5gcgPAJ-bsF4KsAlVnH1Yvc6DqC3vKCIH07tudXclsOLoUOahf9Yy7vv6mvXLdBMbFs96OFdTzhB1JNW-Y6b1Dtc',
    },
    {
      date: 'Oct 18, 2024',
      mood: 'Stressed',
      notes: 'Work was overwhelming today, feeling anxious.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFGEtEP54RyTKn7Y-RrwHShXAfzEThWgPJkQWPbcIJajGpTl3vEIi5PKSTKz5i72OKliW88NUmaKQjlwsIqktASL_kOs_JEblXyeLWHEIBMF9kJiyxOlIW2VtnhOdQnNQYE1-EUErKkW8I19eTSnvSsSsHmWubrC4bKZ1XUL5D3wBN-N0OOkih3bO3tBHhVss-mYFScTkY6lQX3w9RVf_5JFUYOumKXuDUsQvxycbcJdUwYvDmW3_lRJWnXyTRdN7gi2_qGRRijRM',
    },
  ];

  const handlePrevMonth = () => {
    setMonth('September 2024'); // Mock; replace with real month logic
    Alert.alert('Month Changed', 'Showing September 2024');
  };

  const handleNextMonth = () => {
    setMonth('November 2024'); // Mock
    Alert.alert('Month Changed', 'Showing November 2024');
  };

  const handleDayPress = (day) => {
    Alert.alert('Day Selected', `Selected day ${day}`);
    // Navigate to detailed view or show mood details
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton} onPress={() => Alert.alert('Menu', 'Open menu')}>
            <Svg width={24} height={24} viewBox="0 0 256 256" fill="#ffffff">
              <Path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
            </Svg>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Wellness</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.main}>
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity style={styles.arrowButton} onPress={handlePrevMonth}>
                <Svg width={18} height={18} viewBox="0 0 256 256" fill="#ffffff">
                  <Path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
                </Svg>
              </TouchableOpacity>
              <Text style={styles.calendarTitle}>{month}</Text>
              <TouchableOpacity style={styles.arrowButton} onPress={handleNextMonth}>
                <Svg width={18} height={18} viewBox="0 0 256 256" fill="#ffffff">
                  <Path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
                </Svg>
              </TouchableOpacity>
            </View>
            <View style={styles.calendarGrid}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                <Text key={day} style={styles.dayLabel}>{day}</Text>
              ))}
              <View style={[styles.dayCell, { marginLeft: 3 * 40 }]} /> {/* Offset for col-start-4 */}
              {calendarDays.map(({ day, mood }) => (
                <View key={day} style={styles.dayCell}>
                  <TouchableOpacity
                    style={[styles.dayButton, day === 5 && styles.activeDayButton]}
                    onPress={() => handleDayPress(day)}
                  >
                    <Text style={[styles.dayText, day === 5 && styles.activeDayText]}>
                      {day}
                      {mood && (
                        <View
                          style={[
                            styles.moodDot,
                            { backgroundColor: mood === 'green' ? '#4ADE80' : mood === 'blue' ? '#60A5FA' : '#F87171' },
                          ]}
                        />
                      )}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
          <Text style={styles.sectionTitle}>Journal</Text>
          <View style={styles.journalContainer}>
            {journalEntries.map((entry, index) => (
              <JournalEntry
                key={index}
                date={entry.date}
                mood={entry.mood}
                notes={entry.notes}
                image={entry.image}
              />
            ))}
          </View>
          <Text style={styles.sectionTitle}>Insights</Text>
          <View style={styles.insightsContainer}>
            <Text style={styles.insightsTitle}>Heart Rate Trend vs. Mood Score</Text>
            <View style={styles.insightsStats}>
              <Text style={styles.insightsValue}>72 bpm</Text>
              <Text style={styles.insightsChange}>+2%</Text>
            </View>
            <Text style={styles.insightsSubtitle}>Last 7 Days (1D CNN Prediction)</Text>
            <View style={styles.chartContainer}>
              <Svg width="100%" height={160} viewBox="0 0 472 150" preserveAspectRatio="none">
                <Path
                  d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V150H0V109Z"
                  fill="url(#paint0_linear_chart)"
                />
                <Path
                  d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
                  stroke="url(#paint1_linear_chart)"
                  strokeWidth={3}
                  strokeLinecap="round"
                />
                <LinearGradient id="paint0_linear_chart" x1="236" y1="1" x2="236" y2="150" gradientUnits="userSpaceOnUse">
                  <Stop stopColor="#2a60ea" stopOpacity={0.5} />
                  <Stop offset={1} stopColor="#111521" stopOpacity={0} />
                </LinearGradient>
                <LinearGradient id="paint1_linear_chart" x1="236" y1="1" x2="236" y2="149" gradientUnits="userSpaceOnUse">
                  <Stop stopColor="#2a60ea" />
                </LinearGradient>
              </Svg>
            </View>
            <Text style={styles.insightsFooter}>Stress peaks at night. Your calmest days: weekends.</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16, // p-4
    backgroundColor: 'rgba(17,21,33,0.8)', // dark:bg-background-dark/80
  },
  menuButton: {
    width: 40, // w-10
    height: 40, // h-10
    borderRadius: 9999, // rounded-full
    backgroundColor: 'rgba(42,96,234,0.3)', // dark:bg-primary/30
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20, // text-xl
    fontWeight: 'bold',
    color: '#ffffff', // dark:text-white
  },
  placeholder: {
    width: 40, // w-10
  },
  main: {
    padding: 16, // p-4
  },
  calendarContainer: {
    marginBottom: 32, // mb-8
    borderRadius: 8, // rounded-lg
    backgroundColor: 'rgba(0,0,0,0.2)', // dark:bg-black/20
    padding: 16, // p-4
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16, // mb-4
  },
  arrowButton: {
    padding: 8, // p-2
    borderRadius: 9999, // rounded-full
  },
  calendarTitle: {
    fontSize: 18, // text-lg
    fontWeight: 'bold',
    color: '#ffffff', // dark:text-white
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4, // gap-1
  },
  dayLabel: {
    flex: 1,
    width: 40,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#9CA3AF', // dark:text-neutral-400
    paddingVertical: 8, // py-2
  },
  dayCell: {
    width: 40, // Approx for grid-cols-7
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButton: {
    width: 40, // w-10
    height: 40, // h-10
    borderRadius: 9999, // rounded-full
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDayButton: {
    backgroundColor: '#2a60ea', // bg-primary
  },
  dayText: {
    color: '#ffffff', // dark:text-white
    position: 'relative',
  },
  activeDayText: {
    color: '#ffffff',
  },
  moodDot: {
    position: 'absolute',
    bottom: -8, // -bottom-2
    right: -4, // -right-1
    width: 6, // h-1.5
    height: 6, // w-1.5
    borderRadius: 9999, // rounded-full
  },
  sectionTitle: {
    fontSize: 24, // text-2xl
    fontWeight: 'bold',
    color: '#ffffff', // dark:text-white
    paddingHorizontal: 16, // px-4
    marginBottom: 16, // mb-4
    marginTop: 32, // mt-8 for Insights
  },
  journalContainer: {
    gap: 16, // space-y-4
    paddingHorizontal: 16, // px-4
  },
  insightsContainer: {
    paddingHorizontal: 16, // px-4
    marginBottom: 16, // mb-4
    borderRadius: 8, // rounded-lg
    backgroundColor: 'rgba(0,0,0,0.2)', // dark:bg-black/20
    borderWidth: 1,
    borderColor: 'rgba(42,96,234,0.3)', // border-primary/30
    padding: 24, // p-6
  },
  insightsTitle: {
    fontSize: 18, // text-lg
    fontWeight: 'bold',
    color: '#ffffff', // dark:text-white
  },
  insightsStats: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8, // gap-2
    marginTop: 4, // mt-1
  },
  insightsValue: {
    fontSize: 36, // text-4xl
    fontWeight: 'bold',
    color: '#2a60ea', // text-primary
  },
  insightsChange: {
    fontSize: 14, // text-sm
    fontWeight: '500',
    color: '#4ADE80', // text-green-400
  },
  insightsSubtitle: {
    fontSize: 14, // text-sm
    color: '#9CA3AF', // dark:text-neutral-400
    marginBottom: 16, // mb-4
  },
  chartContainer: {
    height: 160, // h-40
  },
  insightsFooter: {
    fontSize: 14, // text-sm
    color: '#9CA3AF', // dark:text-neutral-400
    textAlign: 'center',
    marginTop: 16, // mt-4
  },
});

export default JournalScreen;