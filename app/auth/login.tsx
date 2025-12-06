import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Button from '@/components/Button';
import Input from '@/components/Input';
import colors from '@/constants/colors';
import { authAPI } from '@/services/api';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useUser();
  const router = useRouter();

  const handleLogin = async () => {
    setError('');
    
    if (!username || username.trim() === '') {
      setError('Please enter a username');
      return;
    }

    setLoading(true);

    try {
      const result = await authAPI.login(username.trim());

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      if (!result.data) {
        setError('Login failed. Please try again.');
        setLoading(false);
        return;
      }
      
      try {
        await login(result.data);
        router.replace('/(tabs)');
      } catch (loginError) {
        console.error('Error saving user data:', loginError);
        setError('Failed to save user data.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
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
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Ready for a</Text>
            <Text style={styles.titleBold}>Consensus?</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Username</Text>
            <Input
              placeholder="Enter your username"
              value={username}
              onChangeText={(text: string) => {
                setUsername(text);
                setError('');
              }}
              autoCapitalize="none"
              style={styles.input}
              inputStyle={styles.inputText}
              placeholderTextColor={colors.gray}
              editable={!loading}
            />

            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}

            <Button 
              title={loading ? "Logging in..." : "Log in"} 
              onPress={handleLogin} 
              style={styles.loginButton}
              loading={loading}
              disabled={loading || !username.trim()}
            />

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity 
                onPress={() => router.push('/auth/signup')}
              >
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
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
  label: {
    color: colors.white,
    fontWeight: '400',
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 30,
    borderWidth: 0,
    marginBottom: 24,
  },
  inputText: {
    color: colors.black, // Explicitly set to black
  },
  loginButton: {
    backgroundColor: colors.white,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: -8,
    marginBottom: 8,
    textAlign: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signupText: {
    color: colors.white,
  },
  signupLink: {
    color: colors.white,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
