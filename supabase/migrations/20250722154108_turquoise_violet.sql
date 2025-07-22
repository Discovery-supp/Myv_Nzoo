/*
  # Grant database permissions to anon role for spaces table

  1. Security Changes
    - Grant INSERT, UPDATE, DELETE permissions on spaces table to anon role
    - This resolves the "new row violates row-level security policy" error
    - Allows the frontend to perform CRUD operations using the anonymous key

  2. Permissions Granted
    - INSERT: Allow anon role to create new spaces
    - UPDATE: Allow anon role to modify existing spaces  
    - DELETE: Allow anon role to remove spaces
    - SELECT: Ensure anon role can read spaces (should already exist)

  Note: This is for development purposes. In production, 
  proper authentication should be implemented.
*/

-- Grant all necessary permissions on spaces table to anon role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.spaces TO anon;

-- Also grant usage on the sequence if it exists (for auto-incrementing IDs)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;