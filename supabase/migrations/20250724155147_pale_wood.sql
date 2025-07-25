/*
  # Fix RLS policies for reservations table to allow anon CRUD operations

  1. Security Changes
    - Add RLS policies for anon role to allow full CRUD operations on reservations
    - Grant necessary permissions to anon role for reservations table
    - This allows the frontend to modify and delete reservations using the anon key

  2. Changes Made
    - Add policies for anon users to update reservations
    - Add policies for anon users to delete reservations
    - Grant UPDATE and DELETE permissions to anon role
*/

-- Grant necessary permissions to anon role for reservations table
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reservations TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Add RLS policies for anon role to allow CRUD operations on reservations
CREATE POLICY IF NOT EXISTS "Anon users can update reservations"
  ON reservations
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Anon users can delete reservations"
  ON reservations
  FOR DELETE
  TO anon
  USING (true);

-- Ensure existing policies for anon users are in place
CREATE POLICY IF NOT EXISTS "Anon users can insert reservations"
  ON reservations
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Anon users can select reservations"
  ON reservations
  FOR SELECT
  TO anon
  USING (true);

-- Confirm the changes
SELECT 'RLS policies updated to allow anon CRUD operations on reservations table!' as message;