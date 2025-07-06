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

// --- START OF FIX: Add the Tester role to the frontend enum ---
export enum Role {
  User = 'user',
  Admin = 'admin',
  Owner = 'owner',
  Tester = 'tester',
}
// --- END OF FIX ---

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
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', action.payload.token);
      }
      return {
        ...state,
        status: 'authenticated',
        user: action.payload.user,
        token: action.payload.token,
        isAdmin: action.payload.user.roles.includes(Role.Admin) || action.payload.user.roles.includes(Role.Owner),
      };
    case 'SET_PARTIAL_LOGIN':
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', action.payload.token);
      }
      return {
        ...state,
        status: '2fa_required',
        user: null,
        token: action.payload.token,
        isAdmin: false,
      };
    case 'LOGOUT':
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('preLoginRedirectPath');
      }
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
    const tokenFromState = state.token;
    if (state.status !== 'authenticated' || !tokenFromState) return;
    try {
      const response = await apiClient.get('/auth/status');
      const user = response.data as User;
      dispatch({ type: 'LOGIN', payload: { token: tokenFromState, user } });
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