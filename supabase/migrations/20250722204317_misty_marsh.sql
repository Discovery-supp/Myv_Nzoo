/*
  # Fix Row Level Security for spaces table

  1. Security Changes
    - Enable RLS on spaces table
    - Create proper policies for authenticated users to have full CRUD access
    - Allow anonymous users to view active spaces for public display

  2. Policies Created
    - Authenticated users: Full CRUD access (SELECT, INSERT, UPDATE, DELETE)
    - Anonymous users: Can view active spaces only

  3. Changes Made
    - Drop conflicting existing policies
    - Create new comprehensive policies
    - Ensure authenticated role has all necessary permissions
*/

-- Ensure RLS is enabled for the spaces table
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view spaces" ON spaces;
DROP POLICY IF EXISTS "Users can insert spaces" ON spaces;
DROP POLICY IF EXISTS "Users can update spaces" ON spaces;
DROP POLICY IF EXISTS "Users can delete spaces" ON spaces;
DROP POLICY IF EXISTS "Authenticated users can view spaces" ON spaces;
DROP POLICY IF EXISTS "Authenticated users can insert spaces" ON spaces;
DROP POLICY IF EXISTS "Authenticated users can update spaces" ON spaces;
DROP POLICY IF EXISTS "Authenticated users can delete spaces" ON spaces;
DROP POLICY IF EXISTS "Anon users can view active spaces" ON spaces;

-- Create policies to grant full CRUD access to authenticated users
CREATE POLICY "Authenticated users can view spaces" 
  ON spaces 
  FOR SELECT 
  TO authenticated 
  USING (true);

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

-- Allow anonymous users to view active spaces for public display
CREATE POLICY "Anon users can view active spaces" 
  ON spaces 
  FOR SELECT 
  TO anon 
  USING (is_active = true);

-- Ensure authenticated role has necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.spaces TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;