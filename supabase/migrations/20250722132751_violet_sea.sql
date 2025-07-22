/*
  # Add missing array columns to spaces table

  1. New Columns
    - `features` (text array) - List of space features/amenities
    - `images` (text array) - List of image URLs for the space

  2. Changes
    - Add features column with default empty array
    - Add images column with default empty array
    - Use conditional logic to prevent errors if columns already exist
*/

-- Add features column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spaces' AND column_name = 'features'
  ) THEN
    ALTER TABLE spaces ADD COLUMN features text[] DEFAULT '{}';
  END IF;
END $$;

-- Add images column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spaces' AND column_name = 'images'
  ) THEN
    ALTER TABLE spaces ADD COLUMN images text[] DEFAULT '{}';
  END IF;
END $$;