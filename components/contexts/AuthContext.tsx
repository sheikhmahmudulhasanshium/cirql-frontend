"use client";

import React, { createContext, useState, useEffect, ReactNode, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import type { AxiosHeaderValue } from 'axios'; // Import AxiosHeaderValue

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
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// Interface for the 'common' headers object
interface CommonHeaders {
  Authorization?: string;
  [key: string]: AxiosHeaderValue | undefined; // More specific value type
}

// Interface for the overall headers structure we are asserting to
interface ExpectedAxiosHeaders {
  common?: CommonHeaders;
  [key: string]: CommonHeaders | AxiosHeaderValue | undefined; // Other methods like 'get', 'post' can also have CommonHeaders
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchUserAndSetState = useCallback(async (currentToken: string) => {
    setIsLoading(true);
    try {
      localStorage.setItem('authToken', currentToken);

      if (apiClient?.defaults?.headers) {
        const headers = apiClient.defaults.headers as unknown as ExpectedAxiosHeaders;
        if (headers.common) {
          headers.common['Authorization'] = `Bearer ${currentToken}`;
        } else {
          // If 'common' doesn't exist, create it and set Authorization
          headers.common = { Authorization: `Bearer ${currentToken}` };
        }
      } else {
        console.warn("AuthContext: apiClient.defaults.headers is not available to set Authorization header.");
      }

      const response = await apiClient.get<User>('/auth/status');
      setUser(response.data);
      setToken(currentToken);
      setIsAuthenticated(true);

    } catch (error) {
      console.error('AuthContext: Token validation/user fetch failed:', error);
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);

      if (apiClient?.defaults?.headers) {
        const headers = apiClient.defaults.headers as unknown as ExpectedAxiosHeaders;
        if (headers.common) {
          delete headers.common['Authorization'];
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    setIsLoading(true);
    try {
      await apiClient.post('/auth/logout');
      console.log("AuthContext: Backend logout acknowledged.");
    } catch (error) {
      console.error("AuthContext: Error calling backend logout endpoint:", error);
    }

    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    if (apiClient?.defaults?.headers) {
      const headers = apiClient.defaults.headers as unknown as ExpectedAxiosHeaders;
      if (headers.common) {
        delete headers.common['Authorization'];
      }
    }
    setIsLoading(false);
    router.push('/sign-in');
  }, [router]);

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