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

  // FIX: Simplified logout function. Its only job is to clear state and storage.
  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setUser(null);
    setIsAuthenticated(false);

    // Optional: Inform the backend, but don't wait for it.
    // Wrap in try/catch so a failed backend call doesn't break the frontend logout.
    apiClient.post('/auth/logout').catch(err => {
      console.error("AuthContext: Backend logout call failed, but user is logged out on the client.", err);
    });
    
    router.push('/sign-in');
  }, [router]);

  // FIX: This function now has a single purpose: fetch user data if a token exists.
  // It relies on the apiClient interceptor to add the header.
  const fetchUser = useCallback(async () => {
    try {
      const { data } = await apiClient.get<User>('/auth/status');
      setUser(data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("AuthContext: Token validation failed.", error);
      // If fetching fails, the token is invalid. Log the user out.
      logout();
    }
  }, [logout]);

  // FIX: Simplified login function.
  const login = useCallback(async (newToken: string) => {
    // 1. Save the token to storage. This is its primary job.
    localStorage.setItem(AUTH_TOKEN_KEY, newToken);
    // 2. Fetch the user to update the state.
    await fetchUser();
  }, [fetchUser]);

  // FIX: Renamed for clarity. This is the initial check on app load.
  const checkAuth = useCallback(async () => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    if (storedToken) {
      // If a token exists, try to validate it by fetching the user.
      await fetchUser();
    }
    // No matter what, we're done with the initial load.
    setIsLoading(false);
  }, [fetchUser]);

  // This effect runs only once on initial app load.
  useEffect(() => {
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