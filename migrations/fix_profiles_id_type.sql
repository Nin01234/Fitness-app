-- This script specifically fixes the ID type issue with profiles table

-- First, check if the profiles table exists
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        -- Drop the existing table with potential ID type issues
        DROP TABLE IF EXISTS profiles CASCADE;
    END IF;
END $$;

-- Make sure UUID extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Recreate the profiles table with the correct UUID type
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,  -- Explicitly UUID, not bigint
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

-- Make sure we have the updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert with explicit UUID casting to ensure correct type handling
  INSERT INTO public.profiles (id)
  VALUES (NEW.id::UUID);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 