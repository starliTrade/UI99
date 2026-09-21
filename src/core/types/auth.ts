/**
 * UI99 — Auth & User Identity Types
 */

export interface UserProfile {
  name: string;
  persianName?: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  themePreference: 'light-luxury' | 'warm-paper' | 'soft-rose' | 'dark-slate';
  preferredLanguage: 'en' | 'fa';
  rtlEnabled: boolean;
  captureShortcuts: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  profile: UserProfile;
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthSession {
  token: string;
  user: User;
  expiresAt: string;
}

export interface AuthCredentials {
  email: string;
  password?: string;
  name?: string;
}
