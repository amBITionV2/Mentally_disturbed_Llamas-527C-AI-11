import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Image, Platform, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Svg, { Circle, G } from 'react-native-svg';

const { width } = Dimensions.get('window');

// --- Mock Data ---
const DAYS = [
    { day: 'Sun', date: '12' },
    { day: 'Mon', date: '13' },
    { day: 'Tue', date: '14' },
    { day: 'Wed', date: '15', active: true },
    { day: 'Thu', date: '16' },
    { day: 'Fri', date: '17' },
    { day: 'Sat', date: '18' },
];

const MEALS = [
    {
        id: 1,
        type: 'Breakfast',
        name: 'Blueberry Oatmeal',
        calories: 450,
        time: '08:00 AM',
        image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=500&q=80'
    },
    {
        id: 2,
        type: 'Snack',
        name: 'Avocado Toast',
        calories: 270,
        time: '10:30 AM',
        image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=500&q=80'
    },
    {
        id: 3,
        type: 'Lunch',
        name: 'Chicken Salad Bowl',
        calories: 620,
        time: '01:00 PM',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'
    },
    {
        id: 4,
        type: 'Snack',
        name: 'Greek Yogurt & Honey',
        calories: 180,
        time: '04:00 PM',
        image: 'https://images.unsplash.com/photo-1488477181946-6428a029177b?w=500&q=80'
    },
    {
        id: 5,
        type: 'Dinner',
        name: 'Grilled Salmon',
        calories: 550,
        time: '07:30 PM',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?w=500&q=80'
    },
];

const CircularProgress = ({ size, strokeWidth, progress, color, backgroundColor }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - progress * circumference;

    return (
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={backgroundColor}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                />
            </G>
        </Svg>
    );
};

// Animated Entry Component for Staggered List
const FadeInView = ({ delay, children, style }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                delay: delay,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 600,
                delay: delay,
                easing: Easing.out(Easing.back(1.5)),
                useNativeDriver: true,
            })
        ]).start();
    }, [delay]);

    return (
        <Animated.View
            style={{
                ...style,
                opacity: fadeAnim,
                transform: [{ translateY: translateY }],
            }}
        >
            {children}
        </Animated.View>
    );
};

const DayItem = ({ item, theme, index, active, onPress }) => (
    <FadeInView delay={index * 100}>
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.dayItem,
                { backgroundColor: active ? '#2a60ea' : theme.card },
                active && styles.dayItemActiveShadow
            ]}
        >
            <Text style={[styles.dayText, { color: active ? '#fff' : theme.textSecondary }]}>{item.day}</Text>
            <Text style={[styles.dateText, { color: active ? '#fff' : theme.text }]}>{item.date}</Text>
            {active && <View style={styles.activeDot} />}
        </TouchableOpacity>
    </FadeInView>
);

const MealCard = ({ meal, theme, index, onPress }) => (
    <FadeInView delay={index * 150 + 300}>
        <TouchableOpacity
            style={[styles.mealCard, { backgroundColor: theme.card }]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Image source={{ uri: meal.image }} style={styles.mealImage} />
            <View style={styles.mealContent}>
                <View style={styles.mealHeader}>
                    <Text style={[styles.mealType, { color: '#2a60ea' }]}>{meal.type}</Text>
                    <Text style={[styles.mealTime, { color: theme.textSecondary }]}>{meal.time}</Text>
                </View>
                <Text style={[styles.mealName, { color: theme.text }]}>{meal.name}</Text>
                <View style={styles.mealFooter}>
                    <View style={styles.calContainer}>
                        <Ionicons name="flame" size={14} color="#FF6B6B" />
                        <Text style={[styles.calText, { color: theme.textSecondary }]}>{meal.calories} kcal</Text>
                    </View>
                    <View style={[styles.addButton, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                        <Ionicons name="add" size={20} color={theme.text} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    </FadeInView>
);

const MealPlannerScreen = ({ navigation }) => {
    const { theme, toggleTheme, isDark } = useTheme();
    const [activeDate, setActiveDate] = useState('15');

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >

                {/* Header Section */}
                <FadeInView delay={0} style={styles.header}>
                    <View>
                        <Text style={[styles.greeting, { color: theme.textSecondary }]}>Hello, Jaip7</Text>
                        <Text style={[styles.headerTitle, { color: theme.text }]}>Your Diet Plan</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.profileButton, { borderColor: theme.border }]}
                        onPress={toggleTheme}
                    >
                        <Ionicons name={isDark ? "sunny" : "moon"} size={20} color={theme.text} />
                    </TouchableOpacity>
                </FadeInView>

                {/* Nutrition Summary Card */}
                <FadeInView delay={200} style={styles.summaryContainer}>
                    <LinearGradient
                        colors={['#2a60ea', '#1e40a0']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        style={styles.summaryCard}
                    >
                        <View style={styles.summaryContent}>
                            <View>
                                <Text style={styles.summaryLabel}>Daily Goal</Text>
                                <View style={styles.calRow}>
                                    <Text style={styles.summaryValue}>1,250</Text>
                                    <Text style={styles.summaryUnit}>kcal</Text>
                                </View>
                                <Text style={styles.summarySub}>85% of daily intake</Text>

                                <TouchableOpacity
                                    style={styles.detailButton}
                                    onPress={() => navigation.navigate('MealGoal')}
                                >
                                    <Text style={styles.detailButtonText}>Change Goal</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.progressContainer}>
                                <CircularProgress
                                    size={100}
                                    strokeWidth={10}
                                    progress={0.85}
                                    color="#fff"
                                    backgroundColor="rgba(255,255,255,0.2)"
                                />
                                <View style={styles.progressIcon}>
                                    <Ionicons name="nutrition" size={24} color="#fff" />
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </FadeInView>

                {/* Date Selector */}
                <View style={styles.dateSection}>
                    {DAYS.map((item, index) => (
                        <DayItem
                            key={index}
                            item={item}
                            index={index}
                            theme={theme}
                            active={activeDate === item.date}
                            onPress={() => setActiveDate(item.date)}
                        />
                    ))}
                </View>

                {/* Meal List */}
                <View style={styles.listSection}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Today's Meals</Text>
                    {MEALS.map((meal, index) => (
                        <MealCard
                            key={meal.id}
                            meal={meal}
                            index={index}
                            theme={theme}
                            onPress={() => navigation.navigate('MealDetail', { meal })}
                        />
                    ))}
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: Platform.OS === 'ios' ? 60 : 40,
        marginBottom: 20,
    },
    greeting: {
        fontSize: 14,
        marginBottom: 4,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'SpaceGrotesk',
    },
    profileButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    summaryContainer: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    summaryCard: {
        borderRadius: 24,
        padding: 24,
        shadowColor: "#2a60ea",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    summaryContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginBottom: 4,
    },
    calRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    summaryUnit: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginLeft: 4,
    },
    summarySub: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        marginBottom: 16,
    },
    detailButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    detailButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    progressContainer: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressIcon: {
        position: 'absolute',
    },
    dateSection: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    dayItem: {
        width: 44,
        height: 70,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayItemActiveShadow: {
        shadowColor: "#2a60ea",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    dayText: {
        fontSize: 10,
        marginBottom: 4,
        fontWeight: '600',
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#fff',
        marginTop: 4,
    },
    listSection: {
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    mealCard: {
        flexDirection: 'row',
        padding: 12,
        borderRadius: 20,
        marginBottom: 16,
        alignItems: 'center',
    },
    mealImage: {
        width: 80,
        height: 80,
        borderRadius: 16,
        backgroundColor: '#eee',
    },
    mealContent: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    mealHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    mealType: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    mealTime: {
        fontSize: 12,
    },
    mealName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    mealFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    calContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    calText: {
        fontSize: 12,
        fontWeight: '500',
    },
    addButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MealPlannerScreen;
