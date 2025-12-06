import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Platform, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/Button';
import colors from '@/constants/colors';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
    const { user, logout } = useUser();
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
          await logout();
          // Router redirect handled in app/index.tsx or we can push
          router.replace('/auth/login');
        } finally {
          setLoggingOut(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.content}>
                
                {/* Header with User Info */}
                <View style={styles.header}>
                    <View style={styles.userInfo}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{user?.username?.charAt(0).toUpperCase() || 'U'}</Text>
                        </View>
                        <View>
                            <Text style={styles.welcomeText}>Welcome back,</Text>
                            <Text style={styles.usernameText}>{user?.username || 'User'}</Text>
                        </View>
                    </View>
                    <TouchableOpacity 
                      onPress={handleLogout} 
                      style={styles.logoutButton}
                      disabled={loggingOut}
                    >
                        {loggingOut ? <ActivityIndicator color={colors.white} size="small" /> : <Ionicons name="log-out-outline" size={24} color={colors.white} />}
                    </TouchableOpacity>
                </View>

                {/* Main Action Buttons */}
                <View style={styles.mainActions}>
                    <TouchableOpacity 
                        style={styles.actionCard}
                        onPress={() => router.push('/lobby/create')}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: colors.white }]}>
                            <Ionicons name="add" size={32} color={colors.primary} />
                        </View>
                        <Text style={styles.actionTitle}>Create Lobby</Text>
                        <Text style={styles.actionDesc}>Start a new consensus group</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.actionCard}
                        onPress={() => router.push('/lobby/join')}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                            <Ionicons name="people" size={32} color={colors.white} />
                        </View>
                        <Text style={styles.actionTitle}>Join Lobby</Text>
                        <Text style={styles.actionDesc}>Enter a code to join friends</Text>
                    </TouchableOpacity>
                </View>

                {/* Recent Activity / Placeholder */}
                <Text style={styles.sectionTitle}>Recent Matches</Text>
                
                <View style={styles.emptyState}>
                    <View style={styles.emptyIcon}>
                        <Ionicons name="restaurant-outline" size={40} color={colors.white} />
                    </View>
                    <Text style={styles.emptyTitle}>No matches yet</Text>
                    <Text style={styles.emptyDesc}>Create or join a lobby to start finding places!</Text>
                </View>

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
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 10,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        color: colors.white,
        fontSize: 20,
        fontWeight: 'bold',
    },
    welcomeText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
    },
    usernameText: {
        color: colors.white,
        fontSize: 20,
        fontWeight: 'bold',
    },
    logoutButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
    },
    mainActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    actionCard: {
        width: '48%',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 24,
        padding: 20,
        alignItems: 'flex-start',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    actionTitle: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    actionDesc: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 13,
        lineHeight: 18,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: 16,
    },
    emptyState: {
        backgroundColor: colors.white,
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
    },
    emptyIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        opacity: 0.8,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    emptyDesc: {
        textAlign: 'center',
        color: colors.gray,
        lineHeight: 20,
    },
});
