-- This script fixes potential issues with the profiles table
-- It checks if the table exists and recreates it if needed
-- It also ensures the triggers are properly set up

-- Check if the uuid-ossp extension is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing trigger if it exists to avoid errors when recreating
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- Recreate the profiles table if it has issues
DO $$
BEGIN
    -- Check if the table exists
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        -- Table exists, but we'll recreate it if requested
        -- RAISE NOTICE 'profiles table already exists';
        
        -- Uncomment the next line if you want to forcibly drop and recreate the table
        -- DROP TABLE IF EXISTS profiles;
    ELSE
        -- Table doesn't exist, create it
        RAISE NOTICE 'Creating profiles table';
    END IF;
END
$$;

-- Create or replace the profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  height NUMERIC,
  weight NUMERIC,
  age INTEGER,
  gender TEXT,
  fitness_level TEXT,
  goals TEXT[],
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create or replace the updated_at timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create or replace the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace the update_profiles_updated_at trigger
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create or replace the on_auth_user_created trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create an upsert statement for the current user's profile if needed
-- Uncomment and modify this if you want to force create a specific profile
/*
INSERT INTO profiles (id, username, full_name, avatar_url, points)
VALUES 
  ('your-user-id-here', 'username', 'Full Name', NULL, 0)
ON CONFLICT (id) 
DO UPDATE SET
  username = EXCLUDED.username,
  updated_at = NOW();
*/ 