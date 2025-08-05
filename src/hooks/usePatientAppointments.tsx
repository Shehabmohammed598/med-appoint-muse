import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'scheduled' | 'completed' | 'canceled' | 'no_show';
  notes: string | null;
  created_at: string;
  updated_at: string;
  doctor_profile?: {
    first_name: string | null;
    last_name: string | null;
    specialty: string | null;
  };
}

export function usePatientAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          doctor_profile:profiles!appointments_doctor_id_fkey(
            first_name,
            last_name,
            specialty
          )
        `)
        .eq('patient_id', user?.id)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
      } else {
        setAppointments((data || []) as Appointment[]);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointments.filter(apt => {
      const appointmentDate = new Date(apt.appointment_date);
      return appointmentDate >= today && apt.status !== 'completed' && apt.status !== 'canceled';
    });
  };

  const getPastAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointments.filter(apt => {
      const appointmentDate = new Date(apt.appointment_date);
      return appointmentDate < today || apt.status === 'completed';
    });
  };

  return {
    appointments,
    loading,
    refetch: fetchAppointments,
    getUpcomingAppointments,
    getPastAppointments,
  };
}