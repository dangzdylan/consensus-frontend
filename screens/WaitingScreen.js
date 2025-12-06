import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import colors from '../constants/colors';
import { consensusAPI } from '../services/api';

export default function WaitingScreen({ route, navigation }) {
    const { lobby_id, lobbyData, isOwner } = route?.params || {};
    const MAX_WAIT_TIME = 300000; // 5 minutes max wait
    const POLL_INTERVAL = 2000; // Poll every 2 seconds
    
    const [waitingFor, setWaitingFor] = React.useState([]);
    const [isComplete, setIsComplete] = React.useState(false);
    const [waitTime, setWaitTime] = React.useState(0);
    const [currentRound, setCurrentRound] = React.useState(1);
    const [totalRounds, setTotalRounds] = React.useState(0);
    const startTimeRef = React.useRef(Date.now());
    const isMountedRef = React.useRef(true);

    // Poll waiting status from backend
    React.useEffect(() => {
        isMountedRef.current = true;
        
        if (!lobby_id) {
            Alert.alert('Error', 'Lobby ID missing');
            if (navigation && navigation.goBack) {
                navigation.goBack();
            }
            return;
        }

        const startTime = Date.now();
        startTimeRef.current = startTime;

        const pollWaitingStatus = async () => {
            if (!isMountedRef.current) return;
            
            try {
                const result = await consensusAPI.getWaitingStatus(lobby_id);

                if (!isMountedRef.current) return;

                if (result.error) {
                    console.error('Error fetching waiting status:', result.error);
                    return;
                }

                if (result.data && isMountedRef.current) {
                    setCurrentRound(result.data.current_round || 1);
                    setTotalRounds(result.data.total_rounds || 0);
                    
                    // Check if all rounds are complete
                    if (result.data.all_finished && result.data.current_round >= result.data.total_rounds) {
                        setIsComplete(true);
                        setWaitingFor([]);
                    } else {
                        // Backend returns usernames in users_waiting array
                        setWaitingFor(result.data.users_waiting || []);
                    }
                }
            } catch (error) {
                console.error('Error polling waiting status:', error);
            }
        };

        // Initial poll
        pollWaitingStatus();

        // Poll interval
        const pollInterval = setInterval(() => {
            if (!isMountedRef.current) return;
            
            const elapsed = Date.now() - startTime;
            setWaitTime(elapsed);

            // Check timeout
            if (elapsed > MAX_WAIT_TIME) {
                clearInterval(pollInterval);
                if (isMountedRef.current) {
                    Alert.alert('Timeout', 'Wait time exceeded. Returning to lobby.');
                    if (navigation && navigation.goBack) {
                        navigation.goBack();
                    }
                }
                return;
            }

            pollWaitingStatus();
        }, POLL_INTERVAL);

        return () => {
            isMountedRef.current = false;
            clearInterval(pollInterval);
        };
    }, [lobby_id, navigation]);

    // Navigate to itinerary when complete
    React.useEffect(() => {
        if (isComplete && isMountedRef.current) {
            const timer = setTimeout(() => {
                if (isMountedRef.current && navigation && navigation.replace) {
                    navigation.replace('Itinerary', {
                        lobby_id,
                        lobbyData: lobbyData || {},
                        isOwner: isOwner !== undefined ? isOwner : false,
                    });
                }
            }, 2000); // Wait 2 seconds to show completion

            return () => {
                clearTimeout(timer);
            };
        }
    }, [isComplete, navigation, lobby_id, lobbyData, isOwner]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <Header />
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="hourglass-outline" size={80} color={colors.white} />
                </View>

                <Text style={styles.title}>
                    {isComplete ? 'All done!' : 'Great job!'}
                </Text>
                <Text style={styles.subtitle}>
                    {isComplete 
                        ? 'Generating your itinerary...' 
                        : "You've finished swiping"}
                </Text>

                <View style={styles.waitingContainer}>
                    <ActivityIndicator size="large" color={colors.white} />
                    <Text style={styles.waitingText}>
                        {isComplete 
                            ? 'Finalizing results...' 
                            : 'Waiting for others to finish...'}
                    </Text>
                </View>

                {!isComplete && (
                    <Text style={styles.roundInfo}>
                        Round {currentRound} of {totalRounds}
                    </Text>
                )}

                {waitingFor.length > 0 && !isComplete && (
                    <View style={styles.membersList}>
                        <Text style={styles.membersTitle}>
                            Still swiping ({waitingFor.length}):
                        </Text>
                        <ScrollView 
                            style={styles.membersScrollView}
                            showsVerticalScrollIndicator={waitingFor.length > 5}
                        >
                            {waitingFor.slice(0, 10).map((username, index) => (
                                <View key={`${username}-${index}`} style={styles.memberItem}>
                                    <View style={styles.avatarCircle}>
                                        <Ionicons name="person" size={20} color={colors.primary} />
                                    </View>
                                    <Text style={styles.memberName}>{username}</Text>
                                    <ActivityIndicator size="small" color={colors.white} />
                                </View>
                            ))}
                            {waitingFor.length > 10 && (
                                <Text style={styles.moreMembersText}>
                                    +{waitingFor.length - 10} more...
                                </Text>
                            )}
                        </ScrollView>
                    </View>
                )}
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 32,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 48,
    },
    waitingContainer: {
        alignItems: 'center',
        marginBottom: 48,
    },
    waitingText: {
        fontSize: 16,
        color: colors.white,
        marginTop: 16,
    },
    membersList: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
        padding: 16,
    },
    membersTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: 12,
    },
    memberItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
    },
    avatarCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    memberName: {
        flex: 1,
        fontSize: 16,
        color: colors.white,
        fontWeight: '600',
    },
    membersScrollView: {
        maxHeight: 200,
    },
    moreMembersText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
        marginTop: 8,
        fontStyle: 'italic',
    },
    roundInfo: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 24,
        fontWeight: '600',
    },
});
