import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '../../contexts/AuthContext';
import { useScanHistory } from '../../contexts/ScanHistoryContext';
import { useRouter } from 'expo-router';

export default function AdminScreen() {
  const { scans } = useScanHistory();
  const { register, users, logout, isLoggedIn, loading } = useAuth();
  const router = useRouter();

  const [text, setText] = useState('');
  const [generated, setGenerated] = useState('');

  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleRegister = async () => {
    if (!newUsername || !newPassword) {
      Alert.alert('Missing Fields', 'Please fill out both username and password.');
      return;
    }

    const success = await register(newUsername, newPassword);
    if (success) {
      Alert.alert('Success', `Account "${newUsername}" created.`);
      setNewUsername('');
      setNewPassword('');
    } else {
      Alert.alert('Error', 'Username already exists.');
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    if (!isLoggedIn && !loading) {
      router.replace('/(auth)/login');
    }
  }, [isLoggedIn, loading]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Dashboard */}
      <Text style={styles.heading}>Admin Dashboard</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Total Scans:</Text>
        <Text style={styles.value}>{scans.length}</Text>
      </View>

      {/* QR Generator */}
      <Text style={styles.heading}>QR Code Generator</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter text to generate QR"
        value={text}
        onChangeText={(value) => {
          setText(value);
          setGenerated(value);
        }}
      />
      <View style={styles.qrContainer}>
        {generated ? (
          <QRCode value={generated} size={200} />
        ) : (
          <Text style={styles.placeholder}>QR Preview</Text>
        )}
      </View>

      {/* Account Creator */}
      <Text style={styles.heading}>Create New Account</Text>
      <TextInput
        style={styles.input}
        placeholder="New Username"
        value={newUsername}
        onChangeText={setNewUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    minHeight: 220,
  },
  placeholder: {
    color: '#999',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});