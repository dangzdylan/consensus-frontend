import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/Button';
import Input from '@/components/Input';
import colors from '@/constants/colors';
import { authAPI } from '@/services/api';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const { login } = useUser();
    const router = useRouter();

    const handleSignup = async () => {
        setError('');
        
        if (!username || username.trim() === '') {
            setError('Please enter a username');
            return;
        }

        if (!agreed) {
            setError('Please agree to the Terms of Service');
            return;
        }

        setLoading(true);

        try {
            const result = await authAPI.signup(username.trim());

            if (result.error) {
                setError(result.error);
                setLoading(false);
                return;
            }

            if (!result.data) {
                setError('Signup failed. Please try again.');
                setLoading(false);
                return;
            }
                
            try {
                const loginResult = await login(result.data);
                if (loginResult.success) {
                    router.replace('/(tabs)');
                } else {
                    setError('Failed to save user data.');
                    setLoading(false);
                }
            } catch (loginError) {
                console.error('Error saving user data:', loginError);
                setError('Failed to save user data.');
                setLoading(false);
            }
        } catch (error) {
            console.error('Signup error:', error);
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <TouchableOpacity 
                        onPress={() => router.back()} 
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={24} color={colors.white} />
                        <Text style={styles.backText}>back</Text>
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Text style={styles.title}>Sign up to</Text>
                        <Text style={styles.titleBold}>Consensus</Text>
                    </View>

                    <View style={styles.form}>
                        <Text style={styles.label}>Username</Text>
                        <Input 
                            placeholder="Enter username" 
                            value={username} 
                            onChangeText={(text: string) => {
                                setUsername(text);
                                setError('');
                            }} 
                            autoCapitalize="none"
                            editable={!loading}
                        />

                        <TouchableOpacity style={styles.checkboxContainer} onPress={() => setAgreed(!agreed)}>
                            <View style={[styles.checkbox, agreed && styles.checked]}>
                                {agreed && <Ionicons name="checkmark" size={12} color={colors.primary} />}
                            </View>
                            <Text style={styles.checkboxLabel}>
                                I agree with the <Text style={styles.link}>Terms of Service</Text> and <Text style={styles.link}>Privacy policy</Text>
                            </Text>
                        </TouchableOpacity>

                        {error ? (
                            <Text style={styles.errorText}>{error}</Text>
                        ) : null}

                        <Button 
                            title={loading ? "Creating Account..." : "Create Account"} 
                            onPress={handleSignup} 
                            style={styles.signupButton}
                            loading={loading}
                            disabled={loading || !username.trim() || !agreed}
                        />

                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>Already have an account? </Text>
                            <TouchableOpacity 
                                onPress={() => router.push('/auth/login')}
                            >
                                <Text style={styles.loginLink}>Log In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    backText: {
        color: colors.white,
        marginLeft: 4,
        fontSize: 16,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        color: colors.white,
        fontWeight: '400',
    },
    titleBold: {
        fontSize: 32,
        color: colors.white,
        fontWeight: 'bold',
    },
    form: {
        width: '100%',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
    },
    checkbox: {
        width: 20,
        height: 20,
        backgroundColor: colors.white,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    checked: {
        backgroundColor: colors.white,
    },
    checkboxLabel: {
        color: colors.white,
        fontSize: 12,
        flex: 1,
    },
    link: {
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
    signupButton: {
        backgroundColor: colors.darkGray,
        marginTop: 8,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    loginText: {
        color: colors.white,
        fontWeight: 'bold',
    },
    loginLink: {
        color: colors.white,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    errorText: {
        color: colors.error,
        fontSize: 14,
        marginTop: -8,
        marginBottom: 8,
        textAlign: 'center',
    },
    label: {
        color: colors.white,
        fontWeight: '400',
        marginBottom: 8,
        fontSize: 16,
    },
});
