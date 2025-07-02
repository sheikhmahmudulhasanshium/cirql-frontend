'use client';

import { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import apiClient from '@/lib/apiClient';

export interface User {
  _id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  roles: Role[];
  is2FAEnabled: boolean;
  accountStatus: 'active' | 'banned';
  banReason?: string;
}

export enum Role {
  User = 'user',
  Admin = 'admin',
  Owner = 'owner',
}

interface AuthState {
  status: 'loading' | 'authenticated' | 'unauthenticated' | '2fa_required';
  user: User | null;
  token: string | null;
  isAdmin: boolean;
}

type AuthAction =
  | { type: 'LOGIN'; payload: { token: string; user: User } }
  | { type: 'SET_PARTIAL_LOGIN'; payload: { token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_STATUS'; payload: 'loading' | 'authenticated' | 'unauthenticated' | '2fa_required' };

const initialState: AuthState = {
  status: 'loading',
  user: null,
  token: null,
  isAdmin: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      // --- START OF FIX ---
      // When a user logs in, we must save the token to localStorage.
      localStorage.setItem('authToken', action.payload.token);
      // --- END OF FIX ---
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
      return {
        ...state,
        status: 'authenticated',
        user: action.payload.user,
        token: action.payload.token,
        isAdmin: action.payload.user.roles.includes(Role.Admin) || action.payload.user.roles.includes(Role.Owner),
      };
    case 'SET_PARTIAL_LOGIN':
      // --- START OF FIX ---
      // Also save the partial token for the 2FA step.
      localStorage.setItem('authToken', action.payload.token);
      // --- END OF FIX ---
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
      return {
        ...state,
        status: '2fa_required',
        user: null,
        token: action.payload.token,
        isAdmin: false,
      };
    case 'LOGOUT':
      // --- START OF FIX ---
      // When a user logs out, we must clear the token from localStorage.
      localStorage.removeItem('authToken');
      // --- END OF FIX ---
      delete apiClient.defaults.headers.common['Authorization'];
      return {
        ...initialState,
        status: 'unauthenticated',
      };
    case 'SET_STATUS':
      return {
        ...state,
        status: action.payload,
      };
    default:
      return state;
  }
};

interface AuthContextType {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const refreshUser = useCallback(async () => {
    if (state.status !== 'authenticated' || !state.token) return;
    try {
      const response = await apiClient.get('/auth/status');
      const user = response.data as User;
      dispatch({ type: 'LOGIN', payload: { token: state.token, user } });
    } catch (error) {
      console.error("Failed to refresh user, logging out.", error);
      dispatch({ type: 'LOGOUT' });
    }
  }, [state.status, state.token]);

  return (
    <AuthContext.Provider value={{ state, dispatch, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};