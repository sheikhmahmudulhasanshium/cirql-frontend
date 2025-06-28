// src/components/contexts/AuthContext.tsx
'use client';

import { createContext, useReducer, Dispatch, useContext, ReactNode, useCallback } from 'react';
import apiClient from '@/lib/apiClient';

export interface User {
  _id: string;
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  roles: string[];
  is2FAEnabled: boolean;
  accountStatus: 'active' | 'banned' | 'inactive';
  banReason?: string;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | '2fa_required';

interface AuthState {
  user: User | null;
  token: string | null;
  status: AuthStatus;
  isAdmin: boolean;
}

export type AuthAction =
  | { type: 'LOGIN'; payload: { token: string; user: User } }
  | { type: 'LOGOUT' }
  | { type: 'SET_STATUS'; payload: AuthStatus }
  | { type: 'SET_PARTIAL_LOGIN'; payload: { token: string } }
  | { type: 'UPDATE_USER'; payload: { user: User } };

const initialState: AuthState = {
  user: null,
  token: null,
  status: 'loading',
  isAdmin: false,
};

const checkIsAdmin = (user: User | null): boolean => {
  return user?.roles?.some(role => ['admin', 'owner'].includes(role)) || false;
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('authToken', action.payload.token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        status: 'authenticated',
        isAdmin: checkIsAdmin(action.payload.user),
      };
    case 'LOGOUT':
      localStorage.removeItem('authToken');
      delete apiClient.defaults.headers.common['Authorization'];
      return {
        ...initialState,
        status: 'unauthenticated',
      };
    case 'SET_STATUS':
      return { ...state, status: action.payload };
    case 'SET_PARTIAL_LOGIN':
      localStorage.setItem('authToken', action.payload.token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
      return {
        ...state,
        token: action.payload.token,
        status: '2fa_required',
        user: null,
        isAdmin: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload.user,
        isAdmin: checkIsAdmin(action.payload.user),
      };
    default:
      return state;
  }
};

export const AuthContext = createContext<{
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
  refreshUser: () => Promise<void>;
} | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const refreshUser = useCallback(async () => {
    if (state.status === 'authenticated' && state.token) {
      try {
        const response = await apiClient.get('/auth/status');
        dispatch({ type: 'UPDATE_USER', payload: { user: response.data } });
      } catch {
        dispatch({ type: 'LOGOUT' });
      }
    }
  }, [state.status, state.token, dispatch]);

  return (
    <AuthContext.Provider value={{ state, dispatch, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};