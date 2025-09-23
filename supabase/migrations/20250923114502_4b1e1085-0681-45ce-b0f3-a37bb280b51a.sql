-- Add fields for emergency requests enhancement
ALTER TABLE public.emergency_requests 
ADD COLUMN IF NOT EXISTS medical_description TEXT,
ADD COLUMN IF NOT EXISTS medical_report_url TEXT,
ADD COLUMN IF NOT EXISTS priority_level INTEGER DEFAULT 1 CHECK (priority_level >= 1 AND priority_level <= 5),
ADD COLUMN IF NOT EXISTS admin_reviewed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS admin_review_notes TEXT;

-- Create storage bucket for medical reports
INSERT INTO storage.buckets (id, name, public) VALUES ('medical-reports', 'medical-reports', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for medical reports
CREATE POLICY "Authenticated users can upload medical reports" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'medical-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own medical reports" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'medical-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Doctors can view medical reports for their emergency requests" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'medical-reports' AND
  EXISTS (
    SELECT 1 FROM public.emergency_requests er
    WHERE er.doctor_id = auth.uid()
    AND er.medical_report_url = name
  )
);

-- Create daily emergency limits table
CREATE TABLE IF NOT EXISTS public.emergency_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  specialty TEXT NOT NULL,
  max_emergency_slots INTEGER NOT NULL DEFAULT 5,
  used_slots INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, specialty)
);

ALTER TABLE public.emergency_limits ENABLE ROW LEVEL SECURITY;

-- RLS policies for emergency limits
CREATE POLICY "Anyone can view emergency limits" 
ON public.emergency_limits 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage emergency limits" 
ON public.emergency_limits 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Function to check and update emergency slots
CREATE OR REPLACE FUNCTION public.check_emergency_slot_availability(
  p_specialty TEXT,
  p_date DATE DEFAULT CURRENT_DATE
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Function to increment emergency slot usage
CREATE OR REPLACE FUNCTION public.increment_emergency_slot_usage(
  p_specialty TEXT,
  p_date DATE DEFAULT CURRENT_DATE
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.emergency_limits
  SET used_slots = used_slots + 1,
      updated_at = NOW()
  WHERE date = p_date AND specialty = p_specialty;
  
  RETURN FOUND;
END;
$$;

-- Create offline sync table for booking data
CREATE TABLE IF NOT EXISTS public.offline_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  doctor_id UUID NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  notes TEXT,
  is_emergency BOOLEAN DEFAULT FALSE,
  medical_description TEXT,
  sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('pending', 'synced', 'failed')),
  created_offline_at TIMESTAMPTZ NOT NULL,
  synced_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.offline_bookings ENABLE ROW LEVEL SECURITY;

-- RLS policies for offline bookings
CREATE POLICY "Users can manage their own offline bookings" 
ON public.offline_bookings 
FOR ALL 
USING (auth.uid() = patient_id);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL,
  sender_id UUID,
  type TEXT NOT NULL CHECK (type IN ('emergency_request', 'appointment_booking', 'appointment_reminder', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = recipient_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = recipient_id);

-- Trigger to create emergency notification
CREATE OR REPLACE FUNCTION public.notify_emergency_request()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
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

CREATE TRIGGER trigger_notify_emergency_request
  AFTER INSERT ON public.emergency_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_emergency_request();