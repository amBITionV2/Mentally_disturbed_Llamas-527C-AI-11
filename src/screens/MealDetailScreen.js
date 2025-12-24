import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const MealDetailScreen = ({ route, navigation }) => {
    const { theme, isDark } = useTheme();
    const { meal } = route.params;

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView bounces={false}>
                {/* Image Header */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: meal.image }} style={styles.image} />
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <View style={styles.backButtonCircle}>
                            <Ionicons name="arrow-back" size={24} color="#000" />
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={[styles.contentContainer, { backgroundColor: theme.background }]}>
                    <View style={styles.headerRow}>
                        <View>
                            <Text style={[styles.mealType, { color: theme.primary }]}>{meal.type}</Text>
                            <Text style={[styles.title, { color: theme.text }]}>{meal.name}</Text>
                        </View>
                        <View style={[styles.ratingContainer, { borderColor: theme.border }]}>
                            <Ionicons name="star" size={16} color="#FFD700" />
                            <Text style={[styles.ratingText, { color: theme.text }]}>4.8</Text>
                        </View>
                    </View>

                    {/* Metrics */}
                    <View style={styles.metricsRow}>
                        <View style={[styles.metricItem, { backgroundColor: theme.card }]}>
                            <Ionicons name="flame-outline" size={20} color={theme.primary} />
                            <Text style={[styles.metricValue, { color: theme.text }]}>{meal.calories}</Text>
                            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>kcal</Text>
                        </View>
                        <View style={[styles.metricItem, { backgroundColor: theme.card }]}>
                            <Ionicons name="time-outline" size={20} color={theme.primary} />
                            <Text style={[styles.metricValue, { color: theme.text }]}>20</Text>
                            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>min</Text>
                        </View>
                        <View style={[styles.metricItem, { backgroundColor: theme.card }]}>
                            <Ionicons name="restaurant-outline" size={20} color={theme.primary} />
                            <Text style={[styles.metricValue, { color: theme.text }]}>Easy</Text>
                            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Level</Text>
                        </View>
                    </View>

                    {/* Ingredients */}
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Ingredients</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ingredientsList}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <View key={i} style={[styles.ingredientCard, { backgroundColor: theme.card }]}>
                                <View style={styles.ingredientIcon} />
                                <Text style={[styles.ingredientName, { color: theme.text }]}>Item {i}</Text>
                                <Text style={[styles.ingredientAmount, { color: theme.textSecondary }]}>100g</Text>
                            </View>
                        ))}
                    </ScrollView>

                    {/* Recipe */}
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Preparation</Text>
                    <Text style={[styles.recipeText, { color: theme.textSecondary }]}>
                        1. Wash all vegetables thoroughly.{'\n'}
                        2. Heat a pan with medium heat and add olive oil.{'\n'}
                        3. Add the main ingredients and sauté for 5 minutes.{'\n'}
                        4. Season with salt, pepper, and herbs.{'\n'}
                        5. Serve hot and enjoy your healthy meal!
                    </Text>

                </View>
            </ScrollView>

            {/* Floating Button */}
            <View style={[styles.footer, { backgroundColor: theme.background }]}>
                <TouchableOpacity style={styles.button}>
                    <LinearGradient
                        colors={['#2a60ea', '#1e40a0']}
                        style={styles.buttonGradient}
                    >
                        <Text style={styles.buttonText}>Add to Daily Log</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageContainer: {
        height: 300,
        width: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
    },
    backButtonCircle: {
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 20,
        padding: 8,
    },
    contentContainer: {
        flex: 1,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
        padding: 24,
        paddingBottom: 100,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    mealType: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        width: '80%',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 1,
        borderRadius: 12,
        gap: 4,
    },
    ratingText: {
        fontWeight: 'bold',
    },
    metricsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
        gap: 12,
    },
    metricItem: {
        flex: 1,
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    metricValue: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 8,
    },
    metricLabel: {
        fontSize: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    ingredientsList: {
        marginBottom: 32,
    },
    ingredientCard: {
        padding: 12,
        borderRadius: 12,
        marginRight: 12,
        alignItems: 'center',
        minWidth: 80,
    },
    ingredientIcon: {
        width: 40,
        height: 40,
        backgroundColor: '#ccc',
        borderRadius: 20,
        marginBottom: 8,
    },
    ingredientName: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 2,
    },
    ingredientAmount: {
        fontSize: 10,
    },
    recipeText: {
        fontSize: 14,
        lineHeight: 24,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        borderTopWidth: 0,
    },
    button: {
        borderRadius: 30,
        overflow: 'hidden',
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

export default MealDetailScreen;
