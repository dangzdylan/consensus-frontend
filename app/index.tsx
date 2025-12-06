import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useUser } from '../context/UserContext';
import { View, ActivityIndicator } from 'react-native';
import colors from '../constants/colors';

export default function Index() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/auth/login" />;
}
