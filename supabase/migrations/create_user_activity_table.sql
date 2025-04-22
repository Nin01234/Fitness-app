-- Create user_activity table for tracking user activities and streaks
CREATE TABLE IF NOT EXISTS public.user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('workout', 'nutrition', 'progress')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Add a unique constraint to prevent duplicate entries for the same user and date
  UNIQUE(user_id, date, activity_type)
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS user_activity_user_id_idx ON public.user_activity(user_id);
CREATE INDEX IF NOT EXISTS user_activity_date_idx ON public.user_activity(date);

-- Create activity_photos table if it doesn't exist yet
CREATE TABLE IF NOT EXISTS public.activity_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL,
  activity_type TEXT NOT NULL,
  user_id UUID NOT NULL,
  photo_url TEXT NOT NULL,
  upload_date TIMESTAMPTZ NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for the activity_photos table
CREATE INDEX IF NOT EXISTS activity_photos_activity_id_idx ON public.activity_photos(activity_id);
CREATE INDEX IF NOT EXISTS activity_photos_user_id_idx ON public.activity_photos(user_id);

-- Grant permissions
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_photos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_activity
CREATE POLICY "Users can view their own activity"
  ON public.user_activity
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity"
  ON public.user_activity
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activity"
  ON public.user_activity
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create RLS policies for activity_photos
CREATE POLICY "Users can view their own photos"
  ON public.activity_photos
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own photos"
  ON public.activity_photos
  FOR INSERT
  WITH CHECK (auth.uid() = user_id); 