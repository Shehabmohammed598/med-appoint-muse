-- Create the user_role enum type that's missing
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'admin');

-- Update the profiles table to use the enum properly
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE user_role USING role::text::user_role;