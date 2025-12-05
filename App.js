import 'react-native-gesture-handler';
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import { UserProvider, useUser } from './context/UserContext';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import CreateLobbyScreen from './screens/CreateLobbyScreen';
import JoinLobbyScreen from './screens/JoinLobbyScreen';
import LobbyScreen from './screens/LobbyScreen';
import SwipingScreen from './screens/SwipingScreen';
import WaitingScreen from './screens/WaitingScreen';
import ItineraryScreen from './screens/ItineraryScreen';
import MatchScreen from './screens/MatchScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import RestaurantDetailsScreen from './screens/RestaurantDetailsScreen';
import colors from './constants/colors';

const Stack = createStackNavigator();

// Error Boundary Component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('App Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Something went wrong</Text>
                    <Text style={styles.errorDetails}>{this.state.error?.toString()}</Text>
                </View>
            );
        }

        return this.props.children;
    }
}

// Simple test component to verify rendering works
function TestScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
            <Text style={{ color: colors.white, fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
                App is Loading...
            </Text>
            <ActivityIndicator size="large" color={colors.white} />
        </View>
    );
}

// App Navigator Component (needs access to UserContext)
function AppNavigator() {
    let user, loading;
    
    try {
        const userContext = useUser();
        user = userContext.user;
        loading = userContext.loading;
        console.log('[AppNavigator] User:', user ? user.username : 'none', 'Loading:', loading);
    } catch (error) {
        console.error('❌ [AppNavigator] Error accessing UserContext:', error);
        // If UserContext fails, default to no user
        user = null;
        loading = false;
    }
    
    // Show loading screen while checking for stored user (with timeout protection)
    if (loading) {
        console.log('[AppNavigator] Still loading user, showing loading screen');
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
                <ActivityIndicator size="large" color={colors.white} />
                <Text style={{ color: colors.white, marginTop: 16 }}>Loading...</Text>
            </View>
        );
    }
    
    try {
        console.log('[AppNavigator] Rendering NavigationContainer, initialRoute:', user ? "Home" : "Login");
        return (
            <NavigationContainer
                onReady={() => {
                    console.log('✅ [NavigationContainer] Ready');
                }}
                onStateChange={(state) => {
                    const currentRoute = state?.routes[state.index]?.name;
                    console.log('[NavigationContainer] State changed, current route:', currentRoute);
                }}
                fallback={
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F26B3A' }}>
                        <Text style={{ color: 'white', fontSize: 20 }}>Loading navigation...</Text>
                    </View>
                }
            >
                <StatusBar style="light" />
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                        cardStyle: { backgroundColor: colors.background },
                    }}
                    initialRouteName={user ? "Home" : "Login"}
                >
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Signup" component={SignupScreen} />
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="CreateLobby" component={CreateLobbyScreen} />
                    <Stack.Screen name="JoinLobby" component={JoinLobbyScreen} />
                    <Stack.Screen name="Lobby" component={LobbyScreen} />
                    <Stack.Screen name="Swiping" component={SwipingScreen} />
                    <Stack.Screen name="Waiting" component={WaitingScreen} />
                    <Stack.Screen name="Itinerary" component={ItineraryScreen} />
                    <Stack.Screen name="Match" component={MatchScreen} />
                    <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
                    <Stack.Screen name="RestaurantDetails" component={RestaurantDetailsScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    } catch (error) {
        console.error('❌ [AppNavigator] Navigation error:', error);
        console.error('Error stack:', error.stack);
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Failed to load navigation</Text>
                <Text style={styles.errorDetails}>{error.toString()}</Text>
                {error.stack && <Text style={styles.errorDetails}>{error.stack}</Text>}
            </View>
        );
    }
}

// Main App Component
export default function App() {
    console.log('=== APP STARTING ===');
    console.log('App component rendering...');
    console.log('Colors:', colors);
    
    try {
        return (
            <ErrorBoundary>
                <UserProvider>
                    <AppNavigator />
                </UserProvider>
            </ErrorBoundary>
        );
    } catch (error) {
        console.error('❌ CRITICAL: App failed to render:', error);
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F26B3A', padding: 20 }}>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>App Failed to Load</Text>
                <Text style={{ color: 'white', fontSize: 14, textAlign: 'center' }}>{error.toString()}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: 20,
    },
    errorText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: 10,
    },
    errorDetails: {
        fontSize: 14,
        color: colors.white,
        textAlign: 'center',
    },
});
