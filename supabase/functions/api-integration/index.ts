import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface APIRequest {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  headers?: Record<string, string>;
}

interface HealthSystemIntegration {
  hospitalId: string;
  patientId: string;
  doctorId: string;
  appointmentData: any;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { endpoint, method, data, headers } = await req.json() as APIRequest;

    switch (endpoint) {
      case 'hospital-systems/appointments':
        return await handleHospitalAppointments(method, data);
      
      case 'medical-records/sync':
        return await handleMedicalRecordsSync(method, data);
      
      case 'payment-gateway/process':
        return await handlePaymentProcessing(method, data);
      
      case 'ai-analytics/congestion':
        return await handleAICongestionPrediction(method, data);
      
      case 'external-calendar/sync':
        return await handleExternalCalendarSync(method, data);
      
      default:
        return new Response(
          JSON.stringify({ error: 'Unknown endpoint' }), 
          { status: 400, headers: corsHeaders }
        );
    }

  } catch (error: any) {
    console.error('API Integration Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 500, headers: corsHeaders }
    );
  }
};

// Hospital System Integration
async function handleHospitalAppointments(method: string, data: any) {
  console.log('Hospital Appointments Integration:', method, data);

  switch (method) {
    case 'GET':
      // Fetch appointments from external hospital system
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patient_profile:profiles!appointments_patient_id_fkey(first_name, last_name, phone),
          doctor_profile:profiles!appointments_doctor_id_fkey(first_name, last_name, specialty)
        `)
        .eq('status', 'scheduled');

      if (error) throw error;

      // Transform data for external system compatibility
      const transformedAppointments = appointments.map(apt => ({
        external_id: apt.id,
        patient: {
          name: `${apt.patient_profile.first_name} ${apt.patient_profile.last_name}`,
          phone: apt.patient_profile.phone
        },
        doctor: {
          name: `${apt.doctor_profile.first_name} ${apt.doctor_profile.last_name}`,
          specialty: apt.doctor_profile.specialty
        },
        datetime: `${apt.appointment_date}T${apt.appointment_time}`,
        status: apt.status,
        notes: apt.notes
      }));

      return new Response(
        JSON.stringify({ 
          appointments: transformedAppointments,
          total: appointments.length 
        }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    case 'POST':
      // Receive appointment from external hospital system
      const { error: insertError } = await supabase
        .from('appointments')
        .insert({
          patient_id: data.patient_id,
          doctor_id: data.doctor_id,
          appointment_date: data.date,
          appointment_time: data.time,
          status: 'scheduled',
          notes: `External booking from ${data.hospital_system || 'Hospital System'}`
        });

      if (insertError) throw insertError;

      return new Response(
        JSON.stringify({ success: true, message: 'Appointment created' }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    default:
      throw new Error('Method not supported');
  }
}

// Medical Records Synchronization
async function handleMedicalRecordsSync(method: string, data: any) {
  console.log('Medical Records Sync:', method, data);

  // This would integrate with medical record systems like Epic, Cerner, etc.
  const mockMedicalRecords = {
    patient_id: data.patient_id,
    records: [
      {
        type: 'visit_summary',
        date: '2024-01-15',
        provider: 'Dr. Smith',
        diagnosis: 'Annual checkup - healthy',
        medications: ['Vitamin D 1000mg daily']
      },
      {
        type: 'lab_results',
        date: '2024-01-10',
        tests: ['Complete Blood Count', 'Lipid Panel'],
        results: 'All values within normal range'
      }
    ]
  };

  return new Response(
    JSON.stringify(mockMedicalRecords), 
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Payment Gateway Integration
async function handlePaymentProcessing(method: string, data: any) {
  console.log('Payment Processing:', method, data);

  // This would integrate with payment gateways like Stripe, PayPal, etc.
  const mockPaymentResponse = {
    transaction_id: `txn_${Date.now()}`,
    status: 'success',
    amount: data.amount,
    currency: data.currency || 'USD',
    payment_method: data.payment_method,
    receipt_url: `https://receipts.example.com/txn_${Date.now()}`
  };

  // Log payment in database
  const { error } = await supabase
    .from('appointments')
    .update({ 
      notes: `Payment processed: ${mockPaymentResponse.transaction_id}` 
    })
    .eq('id', data.appointment_id);

  if (error) console.error('Error logging payment:', error);

  return new Response(
    JSON.stringify(mockPaymentResponse), 
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// AI-Based Congestion Prediction
async function handleAICongestionPrediction(method: string, data: any) {
  console.log('AI Congestion Prediction:', method, data);

  // Get historical appointment data
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select('appointment_date, appointment_time, doctor_id, status')
    .gte('appointment_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  if (error) throw error;

  // Simple congestion analysis (this could be enhanced with ML models)
  const congestionAnalysis = analyzeCongestionPatterns(appointments);

  return new Response(
    JSON.stringify({
      current_load: congestionAnalysis.currentLoad,
      predicted_busy_hours: congestionAnalysis.busyHours,
      recommended_times: congestionAnalysis.recommendedTimes,
      capacity_utilization: congestionAnalysis.utilizationRate
    }), 
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// External Calendar Synchronization
async function handleExternalCalendarSync(method: string, data: any) {
  console.log('External Calendar Sync:', method, data);

  // This would integrate with Google Calendar, Outlook, etc.
  const mockCalendarSync = {
    provider: data.provider || 'google',
    synced_appointments: [],
    conflicts: [],
    last_sync: new Date().toISOString()
  };

  return new Response(
    JSON.stringify(mockCalendarSync), 
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Helper function for congestion analysis
function analyzeCongestionPatterns(appointments: any[]) {
  const hourlyLoad: { [key: string]: number } = {};
  const dailyLoad: { [key: string]: number } = {};

  appointments.forEach(apt => {
    const hour = apt.appointment_time.split(':')[0];
    const date = apt.appointment_date;

    hourlyLoad[hour] = (hourlyLoad[hour] || 0) + 1;
    dailyLoad[date] = (dailyLoad[date] || 0) + 1;
  });

  const busyHours = Object.entries(hourlyLoad)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([hour]) => `${hour}:00`);

  const quietHours = Object.entries(hourlyLoad)
    .sort(([,a], [,b]) => a - b)
    .slice(0, 3)
    .map(([hour]) => `${hour}:00`);

  const totalAppointments = appointments.length;
  const maxCapacity = 100; // This would be configurable
  const utilizationRate = (totalAppointments / maxCapacity) * 100;

  return {
    currentLoad: totalAppointments,
    busyHours,
    recommendedTimes: quietHours,
    utilizationRate: Math.round(utilizationRate)
  };
}

serve(handler);