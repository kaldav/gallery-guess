import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for the entire app
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Database types for type safety
export type Database = {
  public: {
    Tables: {
      game_scores: {
        Row: {
          id: string;
          user_id: string;
          score: number;
          played_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          score: number;
          played_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          score?: number;
          played_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          nickname: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          nickname: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          nickname?: string;
          updated_at?: string;
        };
      };
    };
  };
};