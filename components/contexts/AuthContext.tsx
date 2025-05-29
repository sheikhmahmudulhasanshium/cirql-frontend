"use client";

import React, { createContext, useState, useEffect, ReactNode, useContext, useCallback } from 'react';
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
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
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
      // 1. Set token in localStorage first
      localStorage.setItem('authToken', currentToken);

      // 2. Explicitly set the Authorization header for THIS apiClient instance
      //    for the upcoming call. This ensures the /auth/status call uses
      //    the brand new token. The interceptor will handle subsequent requests.
      if (apiClient?.defaults?.headers?.common) {
           apiClient.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
      } else if (apiClient?.defaults?.headers) { // Fallback if common is not there
           (apiClient.defaults.headers as any)['Authorization'] = `Bearer ${currentToken}`;
      } else {
        console.warn("AuthContext: apiClient.defaults.headers or common is not available to set Authorization header directly.");
      }

      const response = await apiClient.get<User>('/auth/status');
      setUser(response.data);
      setToken(currentToken); // Set context state for current token
      setIsAuthenticated(true);
      // localStorage.setItem('authToken', currentToken); // Already done above
    } catch (error) {
      console.error('AuthContext: Token validation/user fetch failed:', error);
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      // Clear the header from the default instance if auth fails
      if (apiClient?.defaults?.headers?.common) {
          delete apiClient.defaults.headers.common['Authorization'];
      } else if (apiClient?.defaults?.headers) {
          delete (apiClient.defaults.headers as any)['Authorization'];
      }
    } finally {
      setIsLoading(false);
    }
  }, []); // Dependencies: state setters are stable, apiClient is stable.

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
    // The primary action is to fetch user and set state based on the new token.
    // The apiClient instance will be updated inside fetchUserAndSetState.
    await fetchUserAndSetState(newToken);
  }, [fetchUserAndSetState]);

  const logout = useCallback(async () => {
    setIsLoading(true); // Indicate loading during logout process
    try {
      // Attempt to inform the backend, but proceed with client-side logout regardless
      await apiClient.post('/auth/logout');
      console.log("AuthContext: Backend logout acknowledged.");
    } catch (error) {
      console.error("AuthContext: Error calling backend logout endpoint:", error);
    }

    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    // Clear Authorization header from the global apiClient instance
    if (apiClient?.defaults?.headers?.common) {
        delete apiClient.defaults.headers.common['Authorization'];
    } else if (apiClient?.defaults?.headers) {
        delete (apiClient.defaults.headers as any)['Authorization'];
    }
    setIsLoading(false);
    router.push('/sign-in'); // Redirect after all cleanup
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