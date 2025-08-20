// /auth/auth-service.ts

import type {
  SessionResponse,
  RefreshResponse,
} from './AuthTypes';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000';

/**
 * Fetches the current user session.
 */
export async function getSession(): Promise<SessionResponse> {
  const res = await fetch(`${BASE_URL}/auth/google/session`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Failed to fetch session');
  return res.json();
}

/**
 * Refreshes the access token using the refresh token (cookie).
 */
export async function refreshToken(): Promise<RefreshResponse> {
  const res = await fetch(`${BASE_URL}/auth/google/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Refresh token failed');
  return res.json();
}

/**
 * Logs out the user by clearing auth-related cookies.
 */
export async function logout(): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/google/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Logout failed');
}

/**
 * Returns the backend's Google OAuth redirect URL.
 * Use this to open a popup or redirect the browser.
 */
export function getGoogleOAuthUrl(): string {
  return `${BASE_URL}/auth/google/`;
}
