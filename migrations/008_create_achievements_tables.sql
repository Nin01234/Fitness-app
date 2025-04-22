-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  badge_image TEXT,
  points INTEGER DEFAULT 0,
  requirements JSONB,
  emoji TEXT,
  category TEXT,
  difficulty TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_achievements junction table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  achievement_id UUID NOT NULL REFERENCES achievements(id),
  date_earned TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample achievements data
INSERT INTO achievements (name, description, badge_image, points, requirements, emoji, category, difficulty)
VALUES
  ('First Workout', 'Complete your first workout with FitLife', '/placeholder.svg?height=40&width=40', 25, '{"workouts": 1}', '🎯', 'Beginner', 'easy'),
  ('5-Day Streak', 'Log in for 5 consecutive days', '/placeholder.svg?height=40&width=40', 50, '{"login_streak": 5}', '🔥', 'Consistency', 'easy'),
  ('Weight Loss Milestone', 'Lose your first 5 pounds', '/placeholder.svg?height=40&width=40', 100, '{"weight_loss": 5}', '⚖️', 'Progress', 'medium'),
  ('Nutrition Master', 'Log your meals for 7 consecutive days', '/placeholder.svg?height=40&width=40', 75, '{"nutrition_streak": 7}', '🥗', 'Nutrition', 'medium'),
  ('Early Bird', 'Complete 5 workouts before 8 AM', '/placeholder.svg?height=40&width=40', 50, '{"early_workouts": 5}', '🌅', 'Lifestyle', 'medium'),
  ('Marathon Runner', 'Run a total of 26.2 miles', '/placeholder.svg?height=40&width=40', 150, '{"running_distance": 26.2}', '🏃', 'Cardio', 'hard'),
  ('Strength Gains', 'Increase your strength by 20%', '/placeholder.svg?height=40&width=40', 100, '{"strength_increase": 20}', '💪', 'Strength', 'hard'),
  ('Hydration Hero', 'Track water intake for 10 consecutive days', '/placeholder.svg?height=40&width=40', 50, '{"water_tracking": 10}', '💧', 'Nutrition', 'easy'),
  ('Social Butterfly', 'Connect with 5 friends on FitLife', '/placeholder.svg?height=40&width=40', 30, '{"friends": 5}', '🦋', 'Social', 'easy'),
  ('Perfect Week', 'Complete all your planned workouts for a week', '/placeholder.svg?height=40&width=40', 100, '{"perfect_week": 1}', '✅', 'Consistency', 'medium'),
  ('Meal Prep Pro', 'Use the meal planner for 4 consecutive weeks', '/placeholder.svg?height=40&width=40', 75, '{"meal_planning_weeks": 4}', '🍱', 'Nutrition', 'medium'),
  ('Sleep Champion', 'Log 8+ hours of sleep for 14 consecutive days', '/placeholder.svg?height=40&width=40', 100, '{"sleep_streak": 14}', '😴', 'Lifestyle', 'hard');

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_achievements_updated_at
BEFORE UPDATE ON achievements
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_achievements_updated_at
BEFORE UPDATE ON user_achievements
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 