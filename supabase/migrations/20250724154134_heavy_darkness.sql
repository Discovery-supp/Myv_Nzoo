/*
  # Fix spaces table schema with all required columns

  1. Table Updates
    - Ensure `spaces` table has all required columns:
      - `daily_price`, `monthly_price`, `yearly_price`, `hourly_price` (numeric)
      - `features` (text array)
      - `images` (text array)
      - `max_occupants` (integer)
      - `is_active` (boolean)

  2. Security
    - Maintain existing RLS policies
*/

-- Add missing columns if they don't exist
DO $$
BEGIN
  -- Add daily_price column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spaces' AND column_name = 'daily_price'
  ) THEN
    ALTER TABLE spaces ADD COLUMN daily_price numeric(10,2) DEFAULT 0;
  END IF;

  -- Add monthly_price column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spaces' AND column_name = 'monthly_price'
  ) THEN
    ALTER TABLE spaces ADD COLUMN monthly_price numeric(10,2) DEFAULT 0;
  END IF;

  -- Add yearly_price column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spaces' AND column_name = 'yearly_price'
  ) THEN
    ALTER TABLE spaces ADD COLUMN yearly_price numeric(10,2) DEFAULT 0;
  END IF;

  -- Add hourly_price column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spaces' AND column_name = 'hourly_price'
  ) THEN
    ALTER TABLE spaces ADD COLUMN hourly_price numeric(10,2) DEFAULT 0;
  END IF;

  -- Add features column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spaces' AND column_name = 'features'
  ) THEN
    ALTER TABLE spaces ADD COLUMN features text[] DEFAULT '{}';
  END IF;

  -- Add images column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spaces' AND column_name = 'images'
  ) THEN
    ALTER TABLE spaces ADD COLUMN images text[] DEFAULT '{}';
  END IF;

  -- Add max_occupants column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spaces' AND column_name = 'max_occupants'
  ) THEN
    ALTER TABLE spaces ADD COLUMN max_occupants integer DEFAULT 1 CHECK (max_occupants > 0);
  END IF;

  -- Add is_active column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spaces' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE spaces ADD COLUMN is_active boolean DEFAULT true;
  END IF;

  -- Add created_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spaces' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE spaces ADD COLUMN created_at timestamptz DEFAULT now();
  END IF;

  -- Add updated_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spaces' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE spaces ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Ensure the table has RLS enabled
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;

-- Create or replace policies for spaces table
DROP POLICY IF EXISTS "Authenticated users can view spaces" ON spaces;
DROP POLICY IF EXISTS "Authenticated users can insert spaces" ON spaces;
DROP POLICY IF EXISTS "Authenticated users can update spaces" ON spaces;
DROP POLICY IF EXISTS "Authenticated users can delete spaces" ON spaces;

-- Allow anon users to view spaces (for public viewing)
CREATE POLICY "Anyone can view spaces"
  ON spaces
  FOR SELECT
  USING (true);

-- Allow authenticated users to manage spaces
CREATE POLICY "Authenticated users can insert spaces"
  ON spaces
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update spaces"
  ON spaces
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete spaces"
  ON spaces
  FOR DELETE
  TO authenticated
  USING (true);

-- Create or replace the updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_spaces_updated_at ON spaces;
CREATE TRIGGER update_spaces_updated_at
  BEFORE UPDATE ON spaces
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();