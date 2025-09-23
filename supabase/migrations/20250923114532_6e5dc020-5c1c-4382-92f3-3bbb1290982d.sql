-- Fix security issues: Set search_path for functions to prevent security vulnerabilities

-- Fix check_emergency_slot_availability function
CREATE OR REPLACE FUNCTION public.check_emergency_slot_availability(
  p_specialty TEXT,
  p_date DATE DEFAULT CURRENT_DATE
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_used INTEGER;
  max_allowed INTEGER;
BEGIN
  -- Get or create daily limit record
  INSERT INTO public.emergency_limits (date, specialty)
  VALUES (p_date, p_specialty)
  ON CONFLICT (date, specialty) DO NOTHING;
  
  -- Get current usage and limits
  SELECT used_slots, max_emergency_slots
  INTO current_used, max_allowed
  FROM public.emergency_limits
  WHERE date = p_date AND specialty = p_specialty;
  
  RETURN current_used < max_allowed;
END;
$$;

-- Fix increment_emergency_slot_usage function
CREATE OR REPLACE FUNCTION public.increment_emergency_slot_usage(
  p_specialty TEXT,
  p_date DATE DEFAULT CURRENT_DATE
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.emergency_limits
  SET used_slots = used_slots + 1,
      updated_at = NOW()
  WHERE date = p_date AND specialty = p_specialty;
  
  RETURN FOUND;
END;
$$;

-- Fix notify_emergency_request function
CREATE OR REPLACE FUNCTION public.notify_emergency_request()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Notify the assigned doctor
  INSERT INTO public.notifications (
    recipient_id,
    sender_id,
    type,
    title,
    message,
    data
  ) VALUES (
    NEW.doctor_id,
    NEW.patient_id,
    'emergency_request',
    'Emergency Request Received',
    'A patient has submitted an emergency medical request requiring immediate attention.',
    jsonb_build_object(
      'emergency_request_id', NEW.id,
      'patient_id', NEW.patient_id,
      'priority_level', NEW.priority_level,
      'medical_description', NEW.medical_description
    )
  );
  
  -- Also notify admins
  INSERT INTO public.notifications (
    recipient_id,
    sender_id,
    type,
    title,
    message,
    data
  )
  SELECT 
    p.user_id,
    NEW.patient_id,
    'emergency_request',
    'Emergency Request - Admin Review',
    'A new emergency request has been submitted and requires admin review.',
    jsonb_build_object(
      'emergency_request_id', NEW.id,
      'patient_id', NEW.patient_id,
      'doctor_id', NEW.doctor_id,
      'priority_level', NEW.priority_level
    )
  FROM public.profiles p
  WHERE p.role = 'admin';
  
  RETURN NEW;
END;
$$;