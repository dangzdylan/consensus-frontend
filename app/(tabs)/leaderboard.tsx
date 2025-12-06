import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/constants/colors';
import { useRouter } from 'expo-router';

// Mock data
const MOCK_RESTAURANTS = [
    {
        id: '1',
        name: 'Zhangliang Malatang',
        rating: 4.8,
        votes: 42,
        rank: 1,
        image: 'https://images.unsplash.com/photo-1549396535-c11d5c55b9df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
    },
    {
        id: '2',
        name: 'Marugame Udon',
        rating: 4.6,
        votes: 35,
        rank: 2,
        image: 'https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
    },
    {
        id: '3',
        name: 'Sliver Pizzeria',
        rating: 4.5,
        votes: 28,
        rank: 3,
        image: 'https://images.unsplash.com/photo-1574071318000-8431c9c9e6d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
    },
    {
        id: '4',
        name: 'Top Dog',
        rating: 4.4,
        votes: 20,
        rank: 4,
        image: 'https://images.unsplash.com/photo-1596792672305-d8137356a640?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
    }
];

export default function LeaderboardScreen() {
    const router = useRouter();

    const handleRestaurantPress = (restaurant: any) => {
        router.push({
            pathname: '/restaurant/[id]',
            params: { id: restaurant.id, restaurant: JSON.stringify(restaurant) }
        });
    };

    const winner = MOCK_RESTAURANTS[0];
    const others = MOCK_RESTAURANTS.slice(1);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Leaderboard</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                
                {/* Winner Card */}
                <TouchableOpacity 
                    style={styles.winnerCard}
                    onPress={() => handleRestaurantPress(winner)}
                >
                    <View style={styles.crownContainer}>
                        <Ionicons name="trophy" size={32} color="#FFD700" />
                    </View>
                    <Image source={{ uri: winner.image }} style={styles.winnerImage} />
                    <View style={styles.winnerOverlay} />
                    <View style={styles.winnerInfo}>
                        <Text style={styles.winnerText}>#1 Most Picked</Text>
                        <Text style={styles.winnerName}>{winner.name}</Text>
                        <View style={styles.statsRow}>
                            <View style={styles.stat}>
                                <Ionicons name="star" size={16} color="#FFD700" />
                                <Text style={styles.statText}>{winner.rating}</Text>
                            </View>
                            <View style={styles.stat}>
                                <Ionicons name="heart" size={16} color={colors.white} />
                                <Text style={styles.statText}>{winner.votes} Picks</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>Top Picks</Text>

                {/* Other Restaurants */}
                {others.map((item) => (
                    <TouchableOpacity 
                        key={item.id} 
                        style={styles.rankItem}
                        onPress={() => handleRestaurantPress(item)}
                    >
                        <Text style={styles.rankNumber}>{item.rank}</Text>
                        <Image source={{ uri: item.image }} style={styles.rankImage} />
                        <View style={styles.rankInfo}>
                            <Text style={styles.rankName}>{item.name}</Text>
                            <View style={styles.rankStats}>
                                <Ionicons name="star" size={14} color="#FFD700" />
                                <Text style={styles.rankStatText}>{item.rating}</Text>
                                <Text style={styles.dot}>•</Text>
                                <Text style={styles.rankStatText}>{item.votes} Picks</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.gray} />
                    </TouchableOpacity>
                ))}

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 24,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.white,
    },
    content: {
        padding: 24,
        paddingTop: 0,
    },
    winnerCard: {
        width: '100%',
        height: 250,
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 32,
        backgroundColor: colors.white,
        position: 'relative',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    winnerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    winnerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    crownContainer: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    winnerInfo: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingTop: 40,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    winnerText: {
        color: '#FFD700',
        fontWeight: 'bold',
        marginBottom: 4,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    winnerName: {
        color: colors.white,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    statsRow: {
        flexDirection: 'row',
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    statText: {
        color: colors.white,
        marginLeft: 4,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: 16,
    },
    rankItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
    },
    rankNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.gray,
        width: 30,
        textAlign: 'center',
    },
    rankImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginHorizontal: 12,
    },
    rankInfo: {
        flex: 1,
    },
    rankName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    rankStats: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rankStatText: {
        color: colors.darkGray,
        fontSize: 12,
        marginLeft: 2,
    },
    dot: {
        marginHorizontal: 6,
        color: colors.gray,
        fontSize: 12,
    },
});
