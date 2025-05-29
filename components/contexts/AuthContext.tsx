// cirql-frontend/components/contexts/AuthContext.tsx
"use client";

import React, { createContext, useState, useEffect, ReactNode, useContext, useCallback } from 'react';
// Corrected: Removed usePathname from import as it's not used
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';

interface User {
  _id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>; // logout in context is async
  checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  // const pathname = usePathname(); // This line was correctly removed/commented out previously

  const fetchUserAndSetState = useCallback(async (currentToken: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<User>('/auth/status');
      setUser(response.data);
      setToken(currentToken);
      setIsAuthenticated(true);
      localStorage.setItem('authToken', currentToken);
    } catch (error) {
      console.error('AuthContext: Token validation/user fetch failed:', error);
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []); // State setters are stable

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      await fetchUserAndSetState(storedToken);
    } else {
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, [fetchUserAndSetState]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (newToken: string) => {
    await fetchUserAndSetState(newToken);
  }, [fetchUserAndSetState]);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout');
      console.log("Backend logout acknowledged.");
    } catch (error) {
      console.error("Error calling backend logout endpoint:", error);
    }

    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    if (apiClient?.defaults?.headers?.common) {
        apiClient.defaults.headers.common['Authorization'] = '';
    }
    router.push('/sign-in');
  }, [router]); // router is a dependency

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};