/*
  # Create admin_users table

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `email` (text, unique)
      - `password_hash` (text)
      - `role` (text) - 'admin' or 'user'
      - `full_name` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Disable RLS for development
    - Grant permissions to anon role
    - Insert default admin user

  3. Indexes
    - Performance indexes on commonly queried columns
*/

-- Create the admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  full_name text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);

-- Function to update updated_at automatically
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at automatically
DROP TRIGGER IF EXISTS update_admin_users_updated_at_trigger ON admin_users;
CREATE TRIGGER update_admin_users_updated_at_trigger
    BEFORE UPDATE ON admin_users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_admin_users_updated_at();

-- Disable RLS for development
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Grant permissions to anon role for development
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_users TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Insert default admin user
INSERT INTO admin_users (
  username, 
  email, 
  password_hash, 
  role, 
  full_name, 
  is_active
) VALUES (
  'admin',
  'admin@nzooimmo.com',
  'temp_admin123',
  'admin',
  'Administrateur Principal',
  true
) ON CONFLICT (username) DO UPDATE SET
  password_hash = 'temp_admin123',
  is_active = true;

-- Confirm table creation
SELECT 'Table admin_users created successfully!' as message;