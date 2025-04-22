-- Create pricing_plans table
CREATE TABLE IF NOT EXISTS pricing_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price TEXT NOT NULL,
  duration TEXT NOT NULL,
  features JSONB NOT NULL,
  cta TEXT NOT NULL,
  popular BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial pricing plan data
INSERT INTO pricing_plans (name, description, price, duration, features, cta, popular)
VALUES
  (
    'Free', 
    'Basic features for personal use', 
    '$0', 
    'forever', 
    '["Basic workout tracking", "Simple nutrition logging", "Weight tracking", "Limited progress charts", "3 workout templates"]'::JSONB, 
    'Get Started', 
    false
  ),
  (
    'Pro', 
    'Advanced features for fitness enthusiasts', 
    '$9.99', 
    'per month', 
    '["Advanced workout tracking", "Comprehensive nutrition analysis", "Body composition tracking", "Advanced progress visualization", "Unlimited workout templates", "Custom meal plans", "Priority support"]'::JSONB, 
    'Start Free Trial', 
    true
  ),
  (
    'Team', 
    'For trainers and fitness groups', 
    '$19.99', 
    'per month', 
    '["All Pro features", "Team management", "Client progress tracking", "Workout assignment", "Nutrition plan creation", "Team challenges", "API access", "Dedicated support"]'::JSONB, 
    'Contact Sales', 
    false
  );

-- Create trigger to update the updated_at column on each update (using the function created in the first migration)
CREATE TRIGGER update_pricing_plans_updated_at
BEFORE UPDATE ON pricing_plans
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 