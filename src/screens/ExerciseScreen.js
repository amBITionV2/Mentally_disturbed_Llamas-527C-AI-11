import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView, Animated, TouchableOpacity, Easing, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

const FadeInView = ({ delay, children, style }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                delay: delay,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 800,
                delay: delay,
                easing: Easing.out(Easing.cubic),
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

const FeatureCard = ({ title, desc, icon, color, delay, image }) => (
    <FadeInView delay={delay} style={styles.cardContainer}>
        <LinearGradient
            colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
            style={styles.infoCard}
        >
            <View style={styles.cardContent}>
                {image ? (
                    <Image source={image} style={styles.avatarImage} />
                ) : (
                    <View style={[styles.iconContainer, { backgroundColor: color }]}>
                        <Ionicons name={icon} size={24} color="#fff" />
                    </View>
                )}
                <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    <Text style={styles.cardDescription}>{desc}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.4)" />
            </View>
        </LinearGradient>
    </FadeInView>
);

const ExerciseScreen = ({ navigation }) => {
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            {/* Background Image - Hero */}
            <ImageBackground
                source={require('../../assets/fitness.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                {/* Gradient for Text Readability - Darker at bottom, transparent top */}
                <LinearGradient
                    colors={['transparent', 'rgba(17,21,33,0.5)', '#111521']}
                    locations={[0, 0.45, 0.9]}
                    style={styles.gradientOverlay}
                />

                {/* Blue Glow Effect - Subtle but present */}
                <LinearGradient
                    colors={['transparent', 'rgba(42,96,234,0.3)', 'rgba(42,96,234,0.1)']}
                    locations={[0, 0.7, 1]}
                    style={styles.bottomGlow}
                    pointerEvents="none"
                />

                <ScrollView
                    style={{ flex: 1, zIndex: 10 }}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >

                    {/* Spacer Adjusted to 38% height to show face but keep text visible */}
                    <View style={{ height: height * 0.38 }} />

                    <FadeInView delay={200} style={styles.header}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>COMING SOON</Text>
                        </View>
                        <Text style={styles.heroTitle}>Unleash Your{'\n'}Full Potential.</Text>
                        <Text style={styles.heroSubtitle}>Train Smarter, Not Harder.</Text>
                    </FadeInView>

                    <View style={styles.cardsContainer}>
                        <FeatureCard
                            title="Train with Maya"
                            desc="Interactive workouts with your AI friend."
                            image={require('../../assets/maya.png')}
                            delay={400}
                        />

                        <FeatureCard
                            title="AI Form Correction"
                            desc="Real-time posture analysis via camera."
                            icon="scan-outline"
                            color="#2a60ea"
                            delay={550}
                        />

                        <FeatureCard
                            title="AR Gamification"
                            desc="Turn fitness into an immersive game."
                            icon="game-controller-outline"
                            color="#8a2be2"
                            delay={700}
                        />

                        <FeatureCard
                            title="Holistic Wellness"
                            desc="Meditation & recovery plans."
                            icon="leaf-outline"
                            color="#00c853"
                            delay={850}
                        />
                    </View>

                    <FadeInView delay={1000} style={styles.footer}>
                        <TouchableOpacity style={styles.actionButton}>
                            <LinearGradient
                                colors={['#2a60ea', '#1e40a0']}
                                style={styles.buttonGradient}
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                            >
                                <Ionicons name="notifications" size={20} color="#fff" />
                                <Text style={styles.buttonText}>Notify When Available</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </FadeInView>

                    <View style={{ height: 120 }} />
                </ScrollView>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111521',
    },
    backgroundImage: {
        width: width,
        height: height,
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
    },
    bottomGlow: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: height * 0.5, // Covers bottom half
        zIndex: 2,
    },
    scrollContent: {
        minHeight: height,
        justifyContent: 'flex-end',
        paddingHorizontal: 24,
        zIndex: 3, // This is for CHILDREN inside ScrollView if position was absolute, but standard scrolling respects layout flow
    },
    header: {
        marginBottom: 32,
    },
    badge: {
        backgroundColor: 'rgba(42,96,234,0.9)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#fff',
        shadowColor: "#2a60ea",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    heroTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
        fontFamily: 'SpaceGrotesk',
        lineHeight: 44,
        textShadowColor: 'rgba(0,0,0,0.8)', // Stronger black shadow for readability
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 6,
    },
    heroSubtitle: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.95)', // Increased opacity
        fontWeight: '500',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    cardsContainer: {
        gap: 16,
        marginBottom: 32,
    },
    cardContainer: {
        width: '100%',
    },
    infoCard: {
        borderRadius: 20,
        padding: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        backgroundColor: 'rgba(17,21,33,0.7)',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    avatarImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: '#2a60ea',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTextContainer: {
        marginLeft: 16,
        flex: 1,
    },
    cardTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardDescription: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
    },
    footer: {
        alignItems: 'center',
    },
    actionButton: {
        width: '100%',
        borderRadius: 30,
        shadowColor: "#2a60ea",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 15,
        elevation: 10,
    },
    buttonGradient: {
        flexDirection: 'row',
        paddingVertical: 18,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 0.5,
    },
});

export default ExerciseScreen;
