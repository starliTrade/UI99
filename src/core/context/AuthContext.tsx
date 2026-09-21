/**
 * UI99 — Auth Context
 * Authentic session management, profile state, and language/RTL preferences.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserProfile } from '../types/auth';
import { api } from '../services/apiClient';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  isRTL: boolean;
  toggleRTL: () => void;
  language: 'en' | 'fa';
  setLanguage: (lang: 'en' | 'fa') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRTL, setIsRTL] = useState<boolean>(false);
  const [language, setLanguageState] = useState<'en' | 'fa'>('en');

  // Load session on mount
  useEffect(() => {
    async function initSession() {
      try {
        // Enforce English LTR by default across all platforms and first load
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = 'en';

        const storedToken = localStorage.getItem('ui99_auth_token');
        if (storedToken) {
          const res = await api.getMe();
          setUser(res.user);
          // Only switch to RTL if explicitly saved as Persian, otherwise default to English
          if (res.user.profile?.preferredLanguage === 'fa') {
            setIsRTL(true);
            setLanguageState('fa');
            document.documentElement.dir = 'rtl';
            document.documentElement.lang = 'fa';
          } else {
            setIsRTL(false);
            setLanguageState('en');
            document.documentElement.dir = 'ltr';
            document.documentElement.lang = 'en';
          }
        }
      } catch (err) {
        console.warn('Session verification failed, prompting login:', err);
        api.setToken(null);
      } finally {
        setIsLoading(false);
      }
    }
    initSession();
  }, []);

  const login = async (email?: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email);
      setUser(res.user);
      if (res.user.profile?.rtlEnabled !== undefined) {
        setIsRTL(res.user.profile.rtlEnabled);
        document.documentElement.dir = res.user.profile.rtlEnabled ? 'rtl' : 'ltr';
      }
      if (res.user.profile?.preferredLanguage) {
        setLanguageState(res.user.profile.preferredLanguage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileUpdates: Partial<UserProfile>) => {
    if (!user) return;
    const res = await api.updateProfile(profileUpdates);
    setUser(res.user);
    if (profileUpdates.rtlEnabled !== undefined) {
      setIsRTL(profileUpdates.rtlEnabled);
      document.documentElement.dir = profileUpdates.rtlEnabled ? 'rtl' : 'ltr';
    }
    if (profileUpdates.preferredLanguage) {
      setLanguageState(profileUpdates.preferredLanguage);
    }
  };

  const toggleRTL = () => {
    const nextRTL = !isRTL;
    setIsRTL(nextRTL);
    document.documentElement.dir = nextRTL ? 'rtl' : 'ltr';
    if (user) {
      updateProfile({ rtlEnabled: nextRTL });
    }
  };

  const setLanguage = (lang: 'en' | 'fa') => {
    setLanguageState(lang);
    const shouldRTL = lang === 'fa';
    setIsRTL(shouldRTL);
    document.documentElement.dir = shouldRTL ? 'rtl' : 'ltr';
    if (user) {
      updateProfile({ preferredLanguage: lang, rtlEnabled: shouldRTL });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateProfile,
        isRTL,
        toggleRTL,
        language,
        setLanguage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
