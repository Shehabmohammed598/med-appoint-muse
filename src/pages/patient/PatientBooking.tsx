import { useState, useEffect } from 'react';
import { PatientLayout } from '@/components/patient/PatientLayout';
import { useProfile } from '@/hooks/useProfile';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CalendarIcon, Clock, User } from 'lucide-react';

interface Doctor {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  specialty: string | null;
}

export function PatientBooking() {
  const { profile } = useProfile();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, first_name, last_name, specialty')
        .eq('role', 'doctor');

      if (error) {
        console.error('Error fetching doctors:', error);
        toast({
          title: t('error'),
          description: t('errorFetchingDoctors'),
          variant: 'destructive',
        });
      } else {
        console.log('Fetched doctors:', data);
        setDoctors(data || []);
        if (!data || data.length === 0) {
          toast({
            title: 'No Doctors Available',
            description: 'No doctors are currently registered in the system.',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime || !selectedDoctor || !profile) {
      toast({
        title: t('error'),
        description: t('pleaseSelectAllFields'),
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Booking appointment with data:', {
        patient_id: profile.user_id,
        doctor_id: selectedDoctor,
        appointment_date: selectedDate.toISOString().split('T')[0],
        appointment_time: selectedTime,
        notes: notes || null,
        status: 'scheduled'
      });

      const { error } = await supabase
        .from('appointments')
        .insert({
          patient_id: profile.user_id,
          doctor_id: selectedDoctor,
          appointment_date: selectedDate.toISOString().split('T')[0],
          appointment_time: selectedTime,
          notes: notes || null,
          status: 'scheduled'
        });

      if (error) {
        console.error('Error booking appointment:', error);
        toast({
          title: t('error'),
          description: `Failed to book appointment: ${error.message}`,
          variant: 'destructive',
        });
      } else {
        console.log('Appointment booked successfully');
        toast({
          title: t('success'),
          description: t('appointmentBooked'),
        });
        
        // Reset form
        setSelectedDate(undefined);
        setSelectedTime('');
        setSelectedDoctor('');
        setNotes('');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: t('error'),
        description: t('errorBookingAppointment'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Disable past dates and weekends
    return date < today || date.getDay() === 0 || date.getDay() === 6;
  };

  return (
    <PatientLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('bookAppointment')}</h1>
          <p className="text-muted-foreground">{t('selectDateTimeDoctor')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Date and Time Selection */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {t('selectDate')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={isDateDisabled}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {t('selectTime')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                      disabled={!selectedDate}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Doctor Selection and Notes */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {t('selectDoctor')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectDoctor')} />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.user_id} value={doctor.user_id}>
                        <div>
                          <p className="font-medium">
                            Dr. {doctor.first_name} {doctor.last_name}
                          </p>
                          {doctor.specialty && (
                            <p className="text-sm text-muted-foreground">
                              {doctor.specialty}
                            </p>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('additionalNotes')}</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={t('enterAnyAdditionalNotes')}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('appointmentSummary')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p><strong>{t('date')}:</strong> {selectedDate?.toLocaleDateString() || t('notSelected')}</p>
                  <p><strong>{t('time')}:</strong> {selectedTime || t('notSelected')}</p>
                  <p><strong>{t('doctor')}:</strong> {
                    selectedDoctor 
                      ? doctors.find(d => d.user_id === selectedDoctor)?.first_name + ' ' + 
                        doctors.find(d => d.user_id === selectedDoctor)?.last_name
                      : t('notSelected')
                  }</p>
                </div>
                
                <Button 
                  onClick={handleBookAppointment} 
                  disabled={!selectedDate || !selectedTime || !selectedDoctor || loading}
                  className="w-full"
                >
                  {loading ? t('booking') : t('confirmBooking')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}