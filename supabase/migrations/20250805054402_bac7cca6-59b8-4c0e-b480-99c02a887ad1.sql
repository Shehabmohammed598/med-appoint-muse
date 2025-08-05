-- Create emergency_requests table
CREATE TABLE public.emergency_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  doctor_id UUID NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.emergency_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for emergency requests
CREATE POLICY "Patients can create their own emergency requests" 
ON public.emergency_requests 
FOR INSERT 
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can view their own emergency requests" 
ON public.emergency_requests 
FOR SELECT 
USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view emergency requests assigned to them" 
ON public.emergency_requests 
FOR SELECT 
USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can update emergency requests assigned to them" 
ON public.emergency_requests 
FOR UPDATE 
USING (auth.uid() = doctor_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_emergency_requests_updated_at
BEFORE UPDATE ON public.emergency_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();