-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  avatar TEXT,
  rating INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial testimonial data
INSERT INTO testimonials (name, role, content, avatar, rating)
VALUES
  ('Alex Johnson', 'Fitness Enthusiast', 'FitLife has completely transformed my fitness journey. The workout tracking and nutrition monitoring features have helped me stay consistent and see real results.', '/placeholder.svg?height=40&width=40', 5),
  ('Sarah Williams', 'Marathon Runner', 'As a marathon runner, tracking my progress is crucial. FitLife provides all the tools I need to monitor my training, nutrition, and recovery in one place.', '/placeholder.svg?height=40&width=40', 5),
  ('Michael Chen', 'Personal Trainer', 'I recommend FitLife to all my clients. The comprehensive tracking features and user-friendly interface make it easy for anyone to stay on top of their fitness goals.', '/placeholder.svg?height=40&width=40', 4);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update the updated_at column on each update
CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON testimonials
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 