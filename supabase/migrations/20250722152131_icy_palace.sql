/*
  # Add missing columns to spaces table

  1. Changes
    - Add `max_occupants` column to spaces table if it doesn't exist
    - Add `display_order` column to spaces table if it doesn't exist  
    - Add `admin_notes` column to spaces table if it doesn't exist
    - Add `availability_status` column to spaces table if it doesn't exist
    - Add `updated_at` column to spaces table if it doesn't exist

  2. Safety
    - Uses IF NOT EXISTS checks to prevent errors if columns already exist
    - Sets appropriate default values for new columns
*/

-- Add max_occupants column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spaces' AND column_name = 'max_occupants'
  ) THEN
    ALTER TABLE spaces ADD COLUMN max_occupants integer NOT NULL DEFAULT 1;
  END IF;
END $$;

-- Add display_order column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spaces' AND column_name = 'display_order'
  ) THEN
    ALTER TABLE spaces ADD COLUMN display_order integer DEFAULT 0;
  END IF;
END $$;

-- Add admin_notes column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spaces' AND column_name = 'admin_notes'
  ) THEN
    ALTER TABLE spaces ADD COLUMN admin_notes text;
  END IF;
END $$;

-- Add availability_status column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spaces' AND column_name = 'availability_status'
  ) THEN
    ALTER TABLE spaces ADD COLUMN availability_status text DEFAULT 'available' CHECK (availability_status IN ('available', 'maintenance', 'reserved', 'unavailable'));
  END IF;
END $$;

-- Add updated_at column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spaces' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE spaces ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;