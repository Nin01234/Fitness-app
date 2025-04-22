-- Create features table
CREATE TABLE IF NOT EXISTS features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial feature data
INSERT INTO features (title, description, icon, order)
VALUES
  ('Workout Tracking', 'Log and track your workouts with detailed exercise information, sets, reps, and weights.', 'dumbbell', 1),
  ('Nutrition Monitoring', 'Track your daily food intake, calories, and macronutrients to maintain a balanced diet.', 'utensils', 2),
  ('Progress Visualization', 'View your fitness journey with interactive charts and graphs showing your improvements over time.', 'lineChart', 3),
  ('Goal Setting', 'Set personalized fitness and nutrition goals with progress tracking to keep you motivated.', 'target', 4),
  ('Reminders & Notifications', 'Never miss a workout or meal with customizable reminders and notifications.', 'bell', 5),
  ('Achievements & Rewards', 'Earn badges and rewards as you reach milestones and complete challenges.', 'award', 6),
  ('Workout Planning', 'Plan your workout routines in advance with our easy-to-use calendar interface.', 'calendar', 7),
  ('Body Metrics', 'Track weight, body fat percentage, muscle mass, and other important body metrics.', 'barChart', 8),
  ('Activity Tracking', 'Monitor your daily activities and calculate calories burned throughout the day.', 'activity', 9);

-- Create trigger to update the updated_at column on each update (using the function created in the first migration)
CREATE TRIGGER update_features_updated_at
BEFORE UPDATE ON features
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 