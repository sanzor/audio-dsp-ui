/* eslint-disable react-refresh/only-export-components */
import {
  getSession,
  refreshToken,
  logout,
  getGoogleOAuthUrl,
} from './AuthService';
import type { SessionResponse, RefreshResponse } from './AuthTypes';
import { createContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@/Domain/User';

// Define context interface
interface AuthServiceContext {
  user: User | null;
  loading: boolean;
  getSession: () => Promise<SessionResponse>;
  refreshToken: () => Promise<RefreshResponse>;
  logout: () => Promise<void>;
  getGoogleOAuthUrl: () => string;
}

// Create context
export const AuthContext = createContext<AuthServiceContext | null>(null);

// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession()
      .then((res) => {
        if (res.user) {
          // Transform response shape to match User type
          setUser({
            id: Number.parseInt(res.user.user_id),
            name: res.user.name,
            email: res.user.email,
            photo: res.user.photo,
          });
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const value: AuthServiceContext = {
    user,
    loading,
    getSession,
    refreshToken,
    logout,
    getGoogleOAuthUrl,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
