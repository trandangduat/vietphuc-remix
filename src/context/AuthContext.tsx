import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_MOCK_USER_KEY = 'vietphuc_mock_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile from Supabase profiles table
  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setProfile({
          id: data.id,
          email: data.email || email,
          display_name: data.display_name || email.split('@')[0],
          avatar_url: data.avatar_url,
          bio: data.bio,
        });
      } else {
        // Fallback profile if profile row hasn't synced yet
        setProfile({
          id: userId,
          email: email,
          display_name: email.split('@')[0],
        });
      }
    } catch {
      setProfile({
        id: userId,
        email: email,
        display_name: email.split('@')[0],
      });
    }
  };

  useEffect(() => {
    if (isSupabaseConfigured) {
      // 1. REAL SUPABASE AUTH FLOW
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id, session.user.email || '');
        }
        setIsLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id, session.user.email || '');
        } else {
          setProfile(null);
        }
        setIsLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // 2. OFFLINE / DEV MOCK AUTH FLOW (Local storage fallback until .env is filled)
      try {
        const stored = localStorage.getItem(LOCAL_MOCK_USER_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser({ id: parsed.id, email: parsed.email } as User);
          setProfile(parsed);
        }
      } catch {
        // Ignore parse error
      }
      setIsLoading(false);
    }
  }, []);

  // Sign in with Google (OAuth)
  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      // Mock Google Sign In
      const mockProfile: UserProfile = {
        id: `mock-google-${Date.now()}`,
        email: 'user.vietphuc@gmail.com',
        display_name: 'Nguyễn Văn Việt',
        avatar_url: '',
      };
      localStorage.setItem(LOCAL_MOCK_USER_KEY, JSON.stringify(mockProfile));
      setUser({ id: mockProfile.id, email: mockProfile.email } as User);
      setProfile(mockProfile);
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });

      if (error) return { error: error.message };
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Lỗi khi kết nối với tài khoản Google' };
    }
  };

  // Sign up
  const signUp = async (email: string, password: string, displayName?: string) => {
    if (!isSupabaseConfigured) {
      // Mock Sign Up
      const mockProfile: UserProfile = {
        id: `mock-user-${Date.now()}`,
        email,
        display_name: displayName?.trim() || email.split('@')[0],
      };
      localStorage.setItem(LOCAL_MOCK_USER_KEY, JSON.stringify(mockProfile));
      setUser({ id: mockProfile.id, email: mockProfile.email } as User);
      setProfile(mockProfile);
      return { error: null };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName?.trim() || email.split('@')[0],
          },
        },
      });

      if (error) return { error: error.message };

      if (data.user) {
        setUser(data.user);
        setProfile({
          id: data.user.id,
          email: data.user.email || email,
          display_name: displayName?.trim() || email.split('@')[0],
        });
      }
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Lỗi khi đăng ký tài khoản' };
    }
  };

  // Sign in
  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      // Mock Sign In
      const mockProfile: UserProfile = {
        id: `mock-user-${Date.now()}`,
        email,
        display_name: email.split('@')[0],
      };
      localStorage.setItem(LOCAL_MOCK_USER_KEY, JSON.stringify(mockProfile));
      setUser({ id: mockProfile.id, email: mockProfile.email } as User);
      setProfile(mockProfile);
      return { error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error: error.message };

      if (data.user) {
        setUser(data.user);
        await fetchProfile(data.user.id, data.user.email || email);
      }
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Lỗi khi đăng nhập' };
    }
  };

  // Sign out
  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem(LOCAL_MOCK_USER_KEY);
    }
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  // Update profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: 'Chưa đăng nhập' };

    if (!isSupabaseConfigured) {
      const newProfile = { ...profile, ...updates } as UserProfile;
      localStorage.setItem(LOCAL_MOCK_USER_KEY, JSON.stringify(newProfile));
      setProfile(newProfile);
      return { error: null };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: updates.display_name,
          avatar_url: updates.avatar_url,
          bio: updates.bio,
        })
        .eq('id', user.id);

      if (error) return { error: error.message };

      setProfile((prev) => (prev ? { ...prev, ...updates } : null));
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Không thể cập nhật hồ sơ' };
    }
  };

  const value = useMemo(
    () => ({
      user,
      profile,
      session,
      isLoading,
      isConfigured: isSupabaseConfigured,
      signInWithGoogle,
      signUp,
      signIn,
      signOut,
      updateProfile,
    }),
    [user, profile, session, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
