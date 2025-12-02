import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Button from '../components/Button';
import colors from '../constants/colors';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');
const MAP_SIZE = width - 48; // Account for padding

export default function CreateLobbyScreen({ navigation }) {
    const [radius, setRadius] = useState(2.5);

    const handleContinue = () => {
        navigation.navigate('Swiping');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Create Consensus</Text>
                </View>

                <Text style={styles.label}>Where to Eat?</Text>

                <View style={styles.mapContainer}>
                    {/* Map Placeholder */}
                    <View style={styles.mapPlaceholder}>
                        {/* Simple grid pattern to simulate map */}
                        {Array.from({ length: 10 }).map((_, i) => (
                            <View
                                key={`h-${i}`}
                                style={[
                                    styles.gridLine,
                                    { top: (i * MAP_SIZE) / 10, width: '100%' }
                                ]}
                            />
                        ))}
                        {Array.from({ length: 10 }).map((_, i) => (
                            <View
                                key={`v-${i}`}
                                style={[
                                    styles.gridLineVertical,
                                    { left: (i * MAP_SIZE) / 10, height: '100%' }
                                ]}
                            />
                        ))}
                    </View>
                    
                    {/* Radius Overlay Circle */}
                    <View
                        style={[
                            styles.radiusCircle,
                            {
                                width: (radius / 2.5) * (MAP_SIZE * 0.6),
                                height: (radius / 2.5) * (MAP_SIZE * 0.6),
                                borderRadius: (radius / 2.5) * (MAP_SIZE * 0.3),
                            }
                        ]}
                    />
                    
                    {/* Center Dot */}
                    <View style={styles.centerDot} />
                    
                    {/* Radius Label */}
                    <View style={styles.radiusLabel}>
                        <Text style={styles.radiusText}>{radius.toFixed(1)} mi</Text>
                    </View>
                </View>

                <Text style={styles.sliderLabel}>Drag to adjust radius</Text>

                <Slider
                    style={styles.slider}
                    minimumValue={0.5}
                    maximumValue={10}
                    step={0.5}
                    value={radius}
                    onValueChange={setRadius}
                    minimumTrackTintColor={colors.darkGray}
                    maximumTrackTintColor="rgba(0,0,0,0.1)"
                    thumbTintColor={colors.darkGray}
                />

                <Button
                    title="Continue"
                    onPress={handleContinue}
                    style={styles.continueButton}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        padding: 24,
        alignItems: 'center',
    },
    header: {
        marginTop: 20,
        marginBottom: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: colors.white,
    },
    label: {
        fontSize: 20,
        color: colors.white,
        marginBottom: 16,
    },
    mapContainer: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 24,
        overflow: 'hidden',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#eee',
    },
    mapPlaceholder: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        opacity: 0.3,
    },
    gridLine: {
        position: 'absolute',
        borderBottomWidth: 1,
        borderBottomColor: '#999',
    },
    gridLineVertical: {
        position: 'absolute',
        borderRightWidth: 1,
        borderRightColor: '#999',
    },
    radiusCircle: {
        position: 'absolute',
        backgroundColor: 'rgba(242, 107, 58, 0.3)',
        borderWidth: 2,
        borderColor: colors.primary,
    },
    centerDot: {
        position: 'absolute',
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: colors.black,
        borderWidth: 3,
        borderColor: colors.white,
    },
    radiusLabel: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: colors.white,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    radiusText: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    sliderLabel: {
        color: colors.white,
        marginBottom: 8,
        fontWeight: '500',
    },
    slider: {
        width: '100%',
        height: 40,
        marginBottom: 24,
    },
    continueButton: {
        backgroundColor: colors.darkGray,
        marginTop: 'auto',
    },
});

