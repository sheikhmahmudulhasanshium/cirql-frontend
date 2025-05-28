// Assuming path: cirql-frontend/context/AuthContext.tsx
"use client";

import React, { createContext, useState, useEffect, ReactNode, useContext, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import apiClient from '@/lib/apiClient'; // Assumes lib folder at root: cirql-frontend/lib/apiClient.ts

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
  login: (token: string) => Promise<void>; // Called by /auth/google/callback page
  logout: () => void;
  checkAuth: () => Promise<void>; // To verify token on app load
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUserAndSetState = useCallback(async (currentToken: string) => {
    setIsLoading(true);
    try {
      // apiClient should automatically add the Authorization header
      const response = await apiClient.get<User>('/auth/status'); // Backend endpoint
      setUser(response.data);
      setToken(currentToken);
      setIsAuthenticated(true);
      localStorage.setItem('authToken', currentToken); // Persist token
    } catch (error) {
      console.error('AuthContext: Token validation/user fetch failed:', error);
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      // Optionally redirect if on a protected page and token becomes invalid
      // if (!['/login', '/sign-in', '/auth/google/callback', '/'].includes(pathname)) {
      //    router.push('/login'); // Or '/sign-in'
      // }
    } finally {
      setIsLoading(false);
    }
  }, [pathname, router]); // Added router and pathname

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // checkAuth is memoized, safe for dependency array

  const login = async (newToken: string) => {
    // This function is called from the /auth/google/callback page on the frontend
    // after the backend redirects with the token.
    await fetchUserAndSetState(newToken);
    // Navigation (e.g., to /dashboard) should happen in the callback page itself after login completes.
  };

  // In cirql-frontend/context/AuthContext.tsx
// ...
  const logout = async () => { // Make it async
    try {
      // Optional: Call backend logout endpoint
      await apiClient.post('/auth/logout'); // Assumes your apiClient is set up
      console.log("Backend logout acknowledged.");
    } catch (error) {
      console.error("Error calling backend logout endpoint:", error);
      // Still proceed with client-side logout even if backend call fails
    }

    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    if (apiClient?.defaults?.headers?.common) {
        apiClient.defaults.headers.common['Authorization'] = '';
    }
    router.push('/sign-in');
  };
// ...
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