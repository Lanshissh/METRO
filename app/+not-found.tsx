import { Redirect, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';

export default function NotFoundScreen() {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">Loading...</ThemedText>
      </ThemedView>
    );
  }

  const redirectHref = (isLoggedIn ? '/(tabs)' : '/(auth)/login') as '/(tabs)' | '/(auth)/login';

  return (
    <>
      <Stack.Screen options={{ title: 'Redirecting...' }} />
      <Redirect href={redirectHref} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});