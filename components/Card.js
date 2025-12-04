import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import colors from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

export default function Card({ item }) {
    return (
        <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.detailsRow}>
                    <Ionicons name="location-outline" size={16} color={colors.secondary} />
                    <Text style={styles.detailsText}>{item.distance} miles</Text>
                    <Ionicons name="time-outline" size={16} color={colors.secondary} style={{ marginLeft: 12 }} />
                    <Text style={styles.detailsText}>{item.time}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        backgroundColor: colors.white,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '75%',
        resizeMode: 'cover',
    },
    infoContainer: {
        padding: 16,
        alignItems: 'center',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 8,
        textAlign: 'center',
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailsText: {
        marginLeft: 4,
        color: colors.text,
        fontSize: 14,
    },
});
