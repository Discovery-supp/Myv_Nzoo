@@ .. @@
 -- Allow anonymous users to view active spaces for public display
 CREATE POLICY "Anon users can view active spaces" 
   ON spaces 
   FOR SELECT 
   TO anon 
   USING (is_active = true);
 
+-- Allow anonymous users to perform CRUD operations (for development)
+CREATE POLICY "Anon users can insert spaces" 
+  ON spaces 
+  FOR INSERT 
+  TO anon 
+  WITH CHECK (true);
+
+CREATE POLICY "Anon users can update spaces" 
+  ON spaces 
+  FOR UPDATE 
+  TO anon 
+  USING (true) 
+  WITH CHECK (true);
+
+CREATE POLICY "Anon users can delete spaces" 
+  ON spaces 
+  FOR DELETE 
+  TO anon 
+  USING (true);
+
 -- Ensure authenticated role has necessary permissions
 GRANT SELECT, INSERT, UPDATE, DELETE ON public.spaces TO authenticated;
+GRANT SELECT, INSERT, UPDATE, DELETE ON public.spaces TO anon;
 GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
+GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;