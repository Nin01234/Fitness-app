-- Helper function to check if a table exists
CREATE OR REPLACE FUNCTION check_table_exists(table_name text)
RETURNS BOOLEAN AS $$
DECLARE
  exists BOOLEAN;
BEGIN
  SELECT COUNT(*) > 0 INTO exists
  FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = $1;
  
  RETURN exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to safely get count from a table that might not exist
CREATE OR REPLACE FUNCTION safe_get_count(table_name text, user_id uuid)
RETURNS INTEGER AS $$
DECLARE
  count_result INTEGER;
BEGIN
  -- Check if table exists first
  IF NOT check_table_exists(table_name) THEN
    RETURN 0;
  END IF;
  
  -- Dynamic SQL to get count safely
  EXECUTE format('SELECT COUNT(*) FROM public.%I WHERE user_id = $1', table_name)
  INTO count_result
  USING user_id;
  
  RETURN count_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 