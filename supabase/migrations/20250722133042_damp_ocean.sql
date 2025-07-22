/*
  # Add missing is_active column to spaces table

  1. New Columns
    - `is_active` (boolean, default true) - Controls whether the space is active/visible

  2. Changes
    - Adds the is_active column if it doesn't already exist
    - Sets default value to true for existing records
*/

-- Add is_active column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spaces' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE spaces ADD COLUMN is_active boolean DEFAULT true;
  END IF;
END $$;