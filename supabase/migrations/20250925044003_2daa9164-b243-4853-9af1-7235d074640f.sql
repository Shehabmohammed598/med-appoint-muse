-- Add index on patient_id and doctor_id for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON public.appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date_time ON public.appointments(appointment_date, appointment_time);

-- Create RLS policy for patients to create their own appointments
DROP POLICY IF EXISTS "Patients can create their own appointments" ON public.appointments;
CREATE POLICY "Patients can create their own appointments" 
ON public.appointments 
FOR INSERT 
WITH CHECK (auth.uid() = patient_id);

-- Create RLS policy for patients to update their own appointments (limited fields)
DROP POLICY IF EXISTS "Patients can update their own appointments" ON public.appointments;
CREATE POLICY "Patients can update their own appointments" 
ON public.appointments 
FOR UPDATE 
USING (auth.uid() = patient_id)
WITH CHECK (auth.uid() = patient_id);

-- Create a view for patient appointment history with doctor information
CREATE OR REPLACE VIEW public.patient_appointment_history AS
SELECT 
  a.id,
  a.appointment_date,
  a.appointment_time,
  a.status,
  a.notes,
  a.created_at,
  a.updated_at,
  p.first_name as doctor_first_name,
  p.last_name as doctor_last_name,
  p.specialty as doctor_specialty
FROM public.appointments a
LEFT JOIN public.profiles p ON a.doctor_id = p.user_id
WHERE a.patient_id = auth.uid();

-- Grant access to the view
GRANT SELECT ON public.patient_appointment_history TO authenticated;