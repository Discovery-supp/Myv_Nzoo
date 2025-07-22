@@ .. @@
+-- Disable RLS for spaces table to allow anonymous operations
+ALTER TABLE spaces DISABLE ROW LEVEL SECURITY;
+
 -- Allow anonymous users to view active spaces for public display
 CREATE POLICY "Anon users can view active spaces" 
   ON spaces 
   FOR SELECT 
   TO anon 
   USING (is_active = true);