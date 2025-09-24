-- Create guest bookings table
CREATE TABLE public.guest_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  specialty TEXT NOT NULL,
  doctor_name TEXT,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.guest_bookings ENABLE ROW LEVEL SECURITY;

-- Create policies - allow anyone to insert bookings, but only admins/doctors can view/manage
CREATE POLICY "Anyone can create guest bookings" 
ON public.guest_bookings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins and doctors can view all guest bookings" 
ON public.guest_bookings 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'doctor')
  )
);

CREATE POLICY "Admins and doctors can update guest bookings" 
ON public.guest_bookings 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'doctor')
  )
);

-- Create trigger for timestamp updates
CREATE TRIGGER update_guest_bookings_updated_at
BEFORE UPDATE ON public.guest_bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();