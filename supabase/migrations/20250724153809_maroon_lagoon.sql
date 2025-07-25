/*
  # Fix admin_users RLS policies for anon access

  1. Security Updates
    - Add RLS policies for anon role to allow login functionality
    - Grant necessary permissions to anon role for admin_users table
    - Allow SELECT operations for login verification
    - Allow INSERT operations for user creation if needed

  2. Changes
    - Add policy for anon users to read admin_users for login
    - Grant SELECT, INSERT, UPDATE, DELETE permissions to anon role
    - Grant USAGE on sequences to anon role
*/

-- Grant necessary permissions to anon role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_users TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Add RLS policies for anon role to allow login functionality
CREATE POLICY "Anon users can read admin users for login"
  ON admin_users
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon users can create admin users"
  ON admin_users
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon users can update admin users"
  ON admin_users
  FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Anon users can delete admin users"
  ON admin_users
  FOR DELETE
  TO anon
  USING (true);

-- Confirm the changes
SELECT 'RLS policies updated for anon access to admin_users table!' as message;