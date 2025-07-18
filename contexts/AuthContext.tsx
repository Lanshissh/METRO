import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  username: string;
  password: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, password: string) => Promise<boolean>;
  users: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const initialize = async () => {
      const storedUsers = await AsyncStorage.getItem('users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        const defaultUser = [{ username: 'admin', password: '1234' }];
        await AsyncStorage.setItem('users', JSON.stringify(defaultUser));
        setUsers(defaultUser);
      }

      const loginStatus = await AsyncStorage.getItem('isLoggedIn');
      setIsLoggedIn(loginStatus === 'true');
      setLoading(false);
    };
    initialize();
  }, []);

  const saveUsers = async (newUsers: User[]) => {
    await AsyncStorage.setItem('users', JSON.stringify(newUsers));
    setUsers(newUsers);
  };

  const login = async (username: string, password: string) => {
    const match = users.find((u) => u.username === username && u.password === password);
    if (match) {
      setIsLoggedIn(true);
      await AsyncStorage.setItem('isLoggedIn', 'true');
      return true;
    }
    return false;
  };

  const logout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.setItem('isLoggedIn', 'false');
  };

  const register = async (username: string, password: string) => {
    const exists = users.find((u) => u.username === username);
    if (exists) return false;
    const newUsers = [...users, { username, password }];
    await saveUsers(newUsers);
    return true;
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, loading, login, logout, register, users }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};