-- Add missing INSERT policy for profiles table
-- This allows the service role to insert profiles during signup

CREATE POLICY "Service role can insert profiles" ON profiles
    FOR INSERT WITH CHECK (true);
 
-- Also add a policy for users to insert their own profile (in case they need to create it manually)
CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id); 