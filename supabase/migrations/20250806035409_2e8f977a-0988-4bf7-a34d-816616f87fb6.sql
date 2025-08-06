-- Insert sample doctor profiles 
INSERT INTO public.profiles (user_id, first_name, last_name, role, specialty) VALUES
  (gen_random_uuid(), 'Ahmed', 'Hassan', 'doctor', 'Cardiology'),
  (gen_random_uuid(), 'Fatima', 'Al-Zahra', 'doctor', 'Pediatrics'),
  (gen_random_uuid(), 'Omar', 'Mahmoud', 'doctor', 'Orthopedics'),
  (gen_random_uuid(), 'Layla', 'Salem', 'doctor', 'Dermatology'),
  (gen_random_uuid(), 'Khalid', 'Rashid', 'doctor', 'Neurology');