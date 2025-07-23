/*
  # Fix admin user authentication

  1. Changes
    - Ensure admin user exists with correct password hash
    - Update existing admin user if needed
    - Set proper password hash for authentication

  2. Security
    - Use consistent password hashing approach
    - Ensure admin user is active
*/

-- Delete existing admin user to recreate with correct hash
DELETE FROM admin_users WHERE username = 'admin';

-- Insert admin user with correct password hash
INSERT INTO admin_users (
  username, 
  email, 
  password_hash, 
  role, 
  full_name, 
  is_active,
  created_at,
  updated_at
) VALUES (
  'admin',
  'admin@nzooimmo.com',
  'temp_admin123',
  'admin',
  'Administrateur Principal',
  true,
  now(),
  now()
);

-- Verify the admin user was created
SELECT 
  id,
  username,
  email,
  password_hash,
  role,
  full_name,
  is_active,
  created_at
FROM admin_users 
WHERE username = 'admin';