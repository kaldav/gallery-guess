-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on the nickname to speed up uniqueness checks
CREATE INDEX IF NOT EXISTS idx_user_profiles_nickname ON public.user_profiles(nickname);

-- Create an index on the user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);

-- Set up Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow public read access to nicknames
CREATE POLICY "Allow public read access to user_profiles" 
  ON public.user_profiles 
  FOR SELECT 
  USING (true);

-- Allow users to update only their own profiles
CREATE POLICY "Allow users to update their own profiles" 
  ON public.user_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Allow service role to create profiles
CREATE POLICY "Allow authorized service to create profiles" 
  ON public.user_profiles 
  FOR INSERT 
  WITH CHECK (true);