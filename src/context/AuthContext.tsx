'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase';

type UserProfile = {
  nickname: string;
};

type AuthUser = User & {
  profile?: UserProfile;
};

type AuthContextType = {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, nickname?: string) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signOut: () => Promise<{ error: Error | null; }>;
  checkNicknameUniqueness: (nickname: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch user profile (nickname)
  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('nickname')
      .eq('user_id', userId)
      .single();
    
    if (!error && data) {
      return data;
    }
    return null;
  };

  useEffect(() => {
    // Function to update user with profile information (moved inside useEffect)
    const updateUserWithProfile = async (currentUser: User) => {
      const profile = await fetchUserProfile(currentUser.id);
      const userWithProfile: AuthUser = {
        ...currentUser,
        profile: profile ? { nickname: profile.nickname } : undefined
      };
      return userWithProfile;
    };

    // Get initial session
    const getSession = async () => {
      setIsLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!error && session) {
        setSession(session);
        
        // Get user with profile
        if (session.user) {
          const userWithProfile = await updateUserWithProfile(session.user);
          setUser(userWithProfile);
        }
      }
      setIsLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session?.user) {
          const userWithProfile = await updateUserWithProfile(session.user);
          setUser(userWithProfile);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array since updateUserWithProfile is now inside the effect

  // Check if nickname already exists
  const checkNicknameUniqueness = async (nickname: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('nickname')
      .eq('nickname', nickname.trim())
      .maybeSingle();
    
    if (error) {
      console.error('Error checking nickname:', error);
      throw new Error('Unable to check nickname availability');
    }
    
    return data === null; // If data is null, nickname is available
  };

  const value = {
    user,
    session,
    isLoading,
    checkNicknameUniqueness,
    signUp: async (email: string, password: string, nickname?: string) => {
      // First check if nickname exists if provided
      if (nickname) {
        const isNicknameAvailable = await checkNicknameUniqueness(nickname);
        if (!isNicknameAvailable) {
          return {
            data: null,
            error: new Error('This nickname is already taken. Please choose a different one.')
          };
        }
      }

      // Sign up the user
      const authResponse = await supabase.auth.signUp({ email, password });
      
      // If signup is successful and we have a user and nickname, save the nickname
      if (!authResponse.error && authResponse.data.user && nickname) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: authResponse.data.user.id,
            nickname: nickname.trim(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('Error saving user profile:', profileError);
          return {
            data: null,
            error: new Error('Registration successful, but there was a problem saving your nickname.')
          };
        }
      }
      
      return authResponse;
    },
    signIn: async (email: string, password: string) => {
      return await supabase.auth.signInWithPassword({ email, password });
    },
    signOut: async () => {
      return await supabase.auth.signOut();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};