-- Add specialty field to profiles table for doctors
ALTER TABLE public.profiles ADD COLUMN specialty TEXT;

-- Create specialties table
CREATE TABLE public.specialties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for specialties
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;

-- Create policy for specialties (readable by all authenticated users)
CREATE POLICY "All authenticated users can view specialties"
ON public.specialties
FOR SELECT
TO authenticated
USING (true);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'canceled', 'no_show')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Create policies for appointments
CREATE POLICY "Patients can view their own appointments"
ON public.appointments
FOR SELECT
USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view their assigned appointments"
ON public.appointments
FOR SELECT
USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can update their assigned appointments"
ON public.appointments
FOR UPDATE
USING (auth.uid() = doctor_id);

CREATE POLICY "Admins can create appointments"
ON public.appointments
FOR INSERT
WITH CHECK (true);

-- Add trigger for automatic timestamp updates on appointments
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample specialties
INSERT INTO public.specialties (name_en, name_ar) VALUES
  ('General Medicine', 'طب عام'),
  ('Cardiology', 'أمراض القلب'),
  ('Dermatology', 'الأمراض الجلدية'),
  ('Pediatrics', 'طب الأطفال'),
  ('Orthopedics', 'جراحة العظام'),
  ('Neurology', 'طب الأعصاب'),
  ('Psychiatry', 'الطب النفسي'),
  ('Ophthalmology', 'طب العيون'),
  ('ENT', 'أنف وأذن وحنجرة'),
  ('Gynecology', 'أمراض النساء');