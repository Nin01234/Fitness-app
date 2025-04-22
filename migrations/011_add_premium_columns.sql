-- Add premium columns to profiles table
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS premium_plan TEXT,
  ADD COLUMN IF NOT EXISTS premium_since TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS premium_expires TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS premium_trial_used BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS subscription_id TEXT;

-- Create premium_subscription_history table to track changes
CREATE TABLE IF NOT EXISTS premium_subscription_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  action TEXT NOT NULL,  -- 'subscribed', 'cancelled', 'upgraded', 'downgraded', 'trial_started'
  plan TEXT,
  price NUMERIC,
  payment_method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create premium features access table
CREATE TABLE IF NOT EXISTS premium_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  feature_key TEXT UNIQUE NOT NULL,
  requires_plan TEXT[], -- Which plans can access this feature ('monthly', 'quarterly', 'annual')
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial premium features
INSERT INTO premium_features (name, description, feature_key, requires_plan)
VALUES 
  ('Advanced Analytics', 'Access detailed analytics and insights about your workouts and nutrition', 'advanced_analytics', ARRAY['monthly', 'quarterly', 'annual']),
  ('Custom Workout Plans', 'Get personalized workout plans tailored to your goals', 'custom_workout_plans', ARRAY['monthly', 'quarterly', 'annual']),
  ('Nutrition Predictions', 'Access AI-powered nutrition predictions and recommendations', 'nutrition_predictions', ARRAY['monthly', 'quarterly', 'annual']),
  ('Ad-Free Experience', 'Enjoy an ad-free experience across the entire app', 'ad_free', ARRAY['monthly', 'quarterly', 'annual']),
  ('Priority Support', 'Get priority customer support and assistance', 'priority_support', ARRAY['quarterly', 'annual']),
  ('Video Form Analysis', 'AI-powered analysis of your exercise technique', 'video_form_analysis', ARRAY['quarterly', 'annual']),
  ('Advanced Training Courses', 'Access to premium training courses and educational content', 'training_courses', ARRAY['annual']),
  ('Unlimited Cloud Storage', 'Store unlimited workout and nutrition data', 'unlimited_storage', ARRAY['annual']);

-- Create trigger for the premium_features table
CREATE TRIGGER update_premium_features_updated_at
BEFORE UPDATE ON premium_features
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 