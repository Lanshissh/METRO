import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode';

type User = {
  user_id: string;
  user_level: 'admin' | 'scanner' | string;
  user_fullname: string;
};

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const decoded: any = jwtDecode(token);
          setUser({
            user_id: decoded.user_id,
            user_level: decoded.user_level,
            user_fullname: decoded.user_fullname,
          });
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: username, user_password: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      const decoded: any = jwtDecode(data.token);

      await AsyncStorage.setItem('token', data.token);

      setUser({
        user_id: decoded.user_id,
        user_level: decoded.user_level,
        user_fullname: decoded.user_fullname,
      });

      setIsLoggedIn(true);

      // Navigate based on role
      if (decoded.user_level === 'admin') {
        router.replace('/admin');
      } else {
        router.replace('/scanner');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to login');
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setUser(null);
      setIsLoggedIn(false);
      router.replace('/(auth)/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);