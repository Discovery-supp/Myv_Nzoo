/*
  # Fix admin_users RLS policies for user management

  1. Security Changes
    - Ensure anon role can perform CRUD operations on admin_users table
    - Add proper RLS policies for user management functionality
    - Grant necessary permissions to anon role

  2. Changes Made
    - Drop existing conflicting policies
    - Create new policies allowing anon access
    - Grant CRUD permissions to anon role
*/

-- Grant necessary permissions to anon role for admin_users table
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_users TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anon users can read admin users for login" ON admin_users;
DROP POLICY IF EXISTS "Anon users can create admin users" ON admin_users;
DROP POLICY IF EXISTS "Anon users can update admin users" ON admin_users;
DROP POLICY IF EXISTS "Anon users can delete admin users" ON admin_users;
DROP POLICY IF EXISTS "Authenticated users can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Authenticated users can create admin users" ON admin_users;
DROP POLICY IF EXISTS "Authenticated users can update admin users" ON admin_users;
DROP POLICY IF EXISTS "Authenticated users can delete admin users" ON admin_users;

-- Create new policies for anon role to allow CRUD operations
CREATE POLICY "Anon users can select admin users"
  ON admin_users
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon users can insert admin users"
  ON admin_users
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon users can update admin users"
  ON admin_users
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon users can delete admin users"
  ON admin_users
  FOR DELETE
  TO anon
  USING (true);

-- Also maintain policies for authenticated users
CREATE POLICY "Authenticated users can select admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert admin users"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update admin users"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete admin users"
  ON admin_users
  FOR DELETE
  TO authenticated
  USING (true);

-- Confirm the changes
SELECT 'RLS policies updated successfully for admin_users table!' as message;