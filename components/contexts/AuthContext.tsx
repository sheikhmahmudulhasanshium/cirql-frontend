"use client";

import React, { createContext, useState, useEffect, ReactNode, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';

// User and Context interfaces remain the same.
export interface User {
  _id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void; // No longer needs to be async from the component's perspective
  checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define a constant for the localStorage key to prevent typos.
const AUTH_TOKEN_KEY = 'authToken';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setUser(null);
    setIsAuthenticated(false);

    // Optional: Inform the backend, but don't wait for it.
    apiClient.post('/auth/logout').catch(err => {
      console.error("AuthContext: Backend logout call failed, but user is logged out on the client.", err);
    });
    
    router.push('/sign-in');
  }, [router]);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await apiClient.get<User>('/auth/status');
      setUser(data);
      setIsAuthenticated(true);
    } catch (error) {
      // This internal log is fine, it helps trace the logout trigger.
      console.log("AuthContext: Token validation failed, triggering logout.", error);
      // If fetching fails, the token is invalid. Log the user out.
      logout();
    }
  }, [logout]);

  const login = useCallback(async (newToken: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, newToken);
    await fetchUser();
  }, [fetchUser]);

  const checkAuth = useCallback(async () => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    if (storedToken) {
      await fetchUser();
    }
    // If there's no token, we just finish loading without fetching a user.
    setIsLoading(false);
  }, [fetchUser]);

  useEffect(() => {
    // This effect runs only once on initial app load.
    setIsLoading(true);
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout, checkAuth }}>
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