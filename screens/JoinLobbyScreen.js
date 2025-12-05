import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Button from '../components/Button';
import CodeInput from '../components/CodeInput';
import colors from '../constants/colors';
import { lobbyAPI } from '../services/api';
import { useUser } from '../context/UserContext';

export default function JoinLobbyScreen({ navigation }) {
    const { userId } = useUser();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleJoin = async () => {
        // Check if user is logged in
        if (!userId) {
            Alert.alert('Error', 'Please log in to join a lobby');
            if (navigation && navigation.navigate) {
                navigation.navigate('Login');
            }
            return;
        }

        // Validate code format (4-6 alphanumeric characters)
        if (!code || code.length < 4) {
            setError('Please enter a valid lobby code');
            return;
        }

        const isValidCode = /^[A-Z0-9]{4,6}$/i.test(code);
        
        if (!isValidCode) {
            setError('Invalid code format. Use 4-6 letters or numbers.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Call backend API
            const result = await lobbyAPI.join(code.toUpperCase(), userId);

            if (result.error) {
                setError(result.error);
                setLoading(false);
                return;
            }

            if (result.data) {
                // Create lobby data object for navigation
                const lobbyData = {
                    lobby_id: result.data.lobby_id,
                    code: result.data.code,
                    radius: result.data.radius,
                    date: result.data.date,
                    startHour: result.data.start_hour,
                    endHour: result.data.end_hour,
                    activityCounts: result.data.activity_counts,
                    location: result.data.location,
                    maxMembers: result.data.max_members,
                    status: result.data.status,
                };

                // Navigate to Lobby screen with lobby data
                if (navigation && navigation.navigate) {
                    navigation.navigate('Lobby', { 
                        lobbyData,
                        lobbyCode: result.data.code,
                        isOwner: false,
                        lobby_id: result.data.lobby_id
                    });
                } else {
                    console.error('Navigation not available');
                    setError('Navigation error. Please try again.');
                }
            } else {
                setError('Failed to join lobby. Please try again.');
            }
        } catch (error) {
            console.error('Join lobby error:', error);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Join a</Text>
                    <Text style={styles.title}>Consensus</Text>
                </View>

                <Text style={styles.label}>Enter a code</Text>

                <CodeInput length={6} onCodeChange={(newCode) => {
                    setCode(newCode);
                    setError('');
                }} />

                {error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : null}

                <Button
                    title={loading ? "Joining..." : "Join"}
                    onPress={handleJoin}
                    style={styles.joinButton}
                    disabled={!code || code.length < 4 || loading}
                    loading={loading}
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
        paddingTop: 60,
    },
    header: {
        marginBottom: 48,
        alignItems: 'center',
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: colors.white,
    },
    label: {
        fontSize: 18,
        color: colors.white,
        marginBottom: 24,
    },
    joinButton: {
        backgroundColor: colors.darkGray,
        marginTop: 'auto',
        marginBottom: 24,
    },
    errorText: {
        color: colors.error,
        fontSize: 14,
        marginTop: -16,
        marginBottom: 16,
        textAlign: 'center',
    },
});
