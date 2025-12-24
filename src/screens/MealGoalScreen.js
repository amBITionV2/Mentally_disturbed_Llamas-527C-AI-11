import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const GOALS = [
    { id: 'lose_weight', title: 'Lose Weight', icon: 'flame-outline' },
    { id: 'gain_weight', title: 'Gain Weight', icon: 'barbell-outline' },
    { id: 'diet_plan', title: 'Diet Plan', icon: 'nutrition-outline' },
    { id: 'maintain', title: 'Maintain Weight', icon: 'scale-outline' },
    { id: 'boost_energy', title: 'Boost Energy', icon: 'flash-outline' },
    { id: 'nutrition', title: 'Improve Nutrition', icon: 'leaf-outline' },
    { id: 'muscle', title: 'Gain Muscle', icon: 'body-outline' },
    { id: 'wellness', title: 'Mental Wellness', icon: 'happy-outline' },
];

const MealGoalScreen = ({ navigation }) => {
    const { theme, toggleTheme, isDark } = useTheme();
    const [selectedGoal, setSelectedGoal] = useState('diet_plan');

    const handleNext = () => {
        navigation.navigate('MealPlanner', { goal: selectedGoal });
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>

                <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                        <View style={[styles.progressFill, { width: '60%' }]} />
                    </View>
                    <Text style={[styles.progressText, { color: theme.textSecondary }]}>7/11</Text>
                </View>

                <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
                    <Ionicons name={isDark ? "sunny-outline" : "moon-outline"} size={24} color={theme.text} />
                </TouchableOpacity>
            </View>

            <Text style={[styles.title, { color: theme.text }]}>What is your main goal?</Text>

            <ScrollView contentContainerStyle={styles.grid}>
                {GOALS.map((goal) => {
                    const isSelected = selectedGoal === goal.id;
                    return (
                        <TouchableOpacity
                            key={goal.id}
                            style={[
                                styles.card,
                                {
                                    backgroundColor: isSelected ? theme.primary : theme.card,
                                    borderColor: isSelected ? theme.primary : theme.border
                                }
                            ]}
                            onPress={() => setSelectedGoal(goal.id)}
                        >
                            <View style={styles.cardHeader}>
                                <Ionicons
                                    name={goal.icon}
                                    size={32}
                                    color={isSelected ? '#fff' : theme.primary}
                                />
                                {isSelected && (
                                    <Ionicons name="checkmark-circle" size={20} color="#fff" style={styles.checkIcon} />
                                )}
                            </View>
                            <Text style={[
                                styles.cardTitle,
                                { color: isSelected ? '#fff' : theme.text }
                            ]}>
                                {goal.title}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.button} onPress={handleNext}>
                    <LinearGradient
                        colors={['#2a60ea', '#1e40a0']}
                        style={styles.buttonGradient}
                    >
                        <Text style={styles.buttonText}>Next</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    iconButton: {
        padding: 8,
    },
    progressContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
    },
    progressBar: {
        flex: 1,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#ff8c00', // Orange from design
        borderRadius: 4,
    },
    progressText: {
        fontSize: 12,
        fontWeight: '600',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
        fontFamily: 'SpaceGrotesk',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16,
        paddingBottom: 100,
    },
    card: {
        width: (width - 56) / 2, // 2 columns with padding/gap
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 12,
        position: 'relative',
    },
    checkIcon: {
        position: 'absolute',
        top: -8,
        right: -20,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
    },
    button: {
        borderRadius: 30,
        overflow: 'hidden',
        shadowColor: '#2a60ea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonGradient: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default MealGoalScreen;
