/*
  # Add missing price columns to spaces table

  1. Changes
    - Add `daily_price` column (decimal)
    - Add `monthly_price` column (decimal)
    - Add `yearly_price` column (decimal)
    - Add `hourly_price` column (decimal)

  2. Notes
    - These columns are required by the application for space pricing
    - All columns are nullable to allow flexible pricing models
*/

-- Add missing price columns to spaces table
DO $$
BEGIN
  -- Add daily_price column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spaces' AND column_name = 'daily_price'
  ) THEN
    ALTER TABLE spaces ADD COLUMN daily_price decimal(10,2);
  END IF;

  -- Add monthly_price column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spaces' AND column_name = 'monthly_price'
  ) THEN
    ALTER TABLE spaces ADD COLUMN monthly_price decimal(10,2);
  END IF;

  -- Add yearly_price column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spaces' AND column_name = 'yearly_price'
  ) THEN
    ALTER TABLE spaces ADD COLUMN yearly_price decimal(10,2);
  END IF;

  -- Add hourly_price column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spaces' AND column_name = 'hourly_price'
  ) THEN
    ALTER TABLE spaces ADD COLUMN hourly_price decimal(10,2);
  END IF;
END $$;