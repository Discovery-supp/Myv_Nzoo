/*
  # Allow anonymous users to manage spaces

  1. Security Changes
    - Add RLS policies for anon role to allow CRUD operations on spaces table
    - Grant necessary permissions to anon role for spaces table
    - Allow INSERT, UPDATE, DELETE operations for space management

  2. Changes
    - Add policy for anon users to insert spaces
    - Add policy for anon users to update spaces  
    - Add policy for anon users to delete spaces
    - Grant CRUD permissions to anon role
    - Grant USAGE on sequences to anon role
*/

-- Grant necessary permissions to anon role for spaces table
GRANT SELECT, INSERT, UPDATE, DELETE ON public.spaces TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Drop existing restrictive policies if they exist
DROP POLICY IF EXISTS "Authenticated users can insert spaces" ON spaces;
DROP POLICY IF EXISTS "Authenticated users can update spaces" ON spaces;
DROP POLICY IF EXISTS "Authenticated users can delete spaces" ON spaces;

-- Add RLS policies for anon role to allow CRUD operations
CREATE POLICY "Anon users can insert spaces"
  ON spaces
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon users can update spaces"
  ON spaces
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon users can delete spaces"
  ON spaces
  FOR DELETE
  TO anon
  USING (true);

-- Also maintain policies for authenticated users
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

-- Confirm the changes
SELECT 'RLS policies updated to allow anon access to spaces table!' as message;