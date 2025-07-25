/*
  # Fix reservations RLS policies syntax

  1. Security Changes
    - Drop existing policies to avoid conflicts
    - Create new policies for anon role to allow CRUD operations on reservations
    - Grant necessary permissions to anon role

  2. Changes Made
    - Allow anon users to update reservations
    - Allow anon users to delete reservations
    - Ensure anon users can insert and select reservations
    - Grant all necessary permissions to anon role
*/

-- Grant necessary permissions to anon role for reservations table
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reservations TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anon users can update reservations" ON reservations;
DROP POLICY IF EXISTS "Anon users can delete reservations" ON reservations;
DROP POLICY IF EXISTS "Anon users can insert reservations" ON reservations;
DROP POLICY IF EXISTS "Anon users can select reservations" ON reservations;
DROP POLICY IF EXISTS "Permettre création de réservations" ON reservations;
DROP POLICY IF EXISTS "Admin peut voir toutes les réservations" ON reservations;
DROP POLICY IF EXISTS "Admin peut modifier les réservations" ON reservations;
DROP POLICY IF EXISTS "Admin peut supprimer les réservations" ON reservations;
DROP POLICY IF EXISTS "Allow public insert reservations" ON reservations;
DROP POLICY IF EXISTS "Allow public read reservations" ON reservations;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON reservations;

-- Create new policies for anon role to allow CRUD operations
CREATE POLICY "Anon users can select reservations"
  ON reservations
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon users can insert reservations"
  ON reservations
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon users can update reservations"
  ON reservations
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon users can delete reservations"
  ON reservations
  FOR DELETE
  TO anon
  USING (true);

-- Also maintain policies for authenticated users
CREATE POLICY "Authenticated users can select reservations"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert reservations"
  ON reservations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update reservations"
  ON reservations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete reservations"
  ON reservations
  FOR DELETE
  TO authenticated
  USING (true);

-- Confirm the changes
SELECT 'RLS policies updated successfully for reservations table!' as message;