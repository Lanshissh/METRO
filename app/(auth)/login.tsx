import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert, Image, KeyboardAvoidingView, Platform, StyleSheet,
  Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
  const { login, users } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Missing Fields', 'Please enter both username and password.');
      return;
    }

    const success = await login(username, password);
    if (success) {
      const user = users.find(u => u.username === username);
      if (user?.role === 'admin2') {
        router.replace('/(tabs)/scanner');
      } else {
        router.replace('/(tabs)/admin');
      }
    } else {
      Alert.alert('Login Failed', 'Invalid username or password.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <View style={styles.innerContainer}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfdfd', justifyContent: 'center' },
  innerContainer: { paddingHorizontal: 24, alignItems: 'center' },
  logo: { width: 200, height: 200, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 32, color: '#333' },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8,
    backgroundColor: '#fff', width: '100%', marginBottom: 16
  },
  button: { backgroundColor: '#007bff', paddingVertical: 14, borderRadius: 8, width: '100%', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});