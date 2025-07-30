import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Edit, Trash2, Calendar, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface AppointmentWithProfiles {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string | null;
  patient_profile: {
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
  } | null;
  doctor_profile: {
    first_name: string | null;
    last_name: string | null;
    specialty: string | null;
  } | null;
}

export function AppointmentManagement() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<AppointmentWithProfiles[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'completed' | 'canceled' | 'no_show'>('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patient_profile:profiles!appointments_patient_id_fkey(first_name, last_name, phone),
          doctor_profile:profiles!appointments_doctor_id_fkey(first_name, last_name, specialty)
        `)
        .order('appointment_date', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: t('admin.error'),
        description: t('admin.fetchAppointmentsError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId);

      if (error) throw error;

      setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
      toast({
        title: t('admin.success'),
        description: t('admin.appointmentDeleted'),
      });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast({
        title: t('admin.error'),
        description: t('admin.deleteAppointmentError'),
        variant: 'destructive',
      });
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const patientName = `${appointment.patient_profile?.first_name || ''} ${appointment.patient_profile?.last_name || ''}`.toLowerCase();
    const doctorName = `${appointment.doctor_profile?.first_name || ''} ${appointment.doctor_profile?.last_name || ''}`.toLowerCase();
    
    const matchesSearch = 
      patientName.includes(searchTerm.toLowerCase()) ||
      doctorName.includes(searchTerm.toLowerCase()) ||
      appointment.patient_profile?.phone?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'scheduled': return 'secondary';
      case 'canceled': return 'destructive';
      case 'no_show': return 'outline';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('admin.appointments')}</h1>
          <p className="text-muted-foreground">{t('admin.appointmentsDesc')}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.appointmentList')}</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('admin.searchAppointments')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border rounded-md bg-background text-foreground"
            >
              <option value="all">{t('admin.allStatuses')}</option>
              <option value="scheduled">{t('status.scheduled')}</option>
              <option value="completed">{t('status.completed')}</option>
              <option value="canceled">{t('status.canceled')}</option>
              <option value="no_show">{t('status.no_show')}</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('appointments.patient')}</TableHead>
                  <TableHead>{t('admin.doctor')}</TableHead>
                  <TableHead>{t('appointments.time')}</TableHead>
                  <TableHead>{t('appointments.status')}</TableHead>
                  <TableHead>{t('appointments.notes')}</TableHead>
                  <TableHead className="text-right">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {t('admin.noAppointments')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>
                            {appointment.patient_profile?.first_name || ''} {appointment.patient_profile?.last_name || ''}
                          </div>
                          {appointment.patient_profile?.phone && (
                            <div className="text-sm text-muted-foreground">
                              {appointment.patient_profile.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>
                            {appointment.doctor_profile?.first_name || ''} {appointment.doctor_profile?.last_name || ''}
                          </div>
                          {appointment.doctor_profile?.specialty && (
                            <div className="text-sm text-muted-foreground">
                              {appointment.doctor_profile.specialty}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div>{appointment.appointment_date}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {appointment.appointment_time}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(appointment.status)}>
                          {t(`status.${appointment.status}`)}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {appointment.notes || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t('admin.deleteAppointment')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t('admin.deleteAppointmentConfirm')}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t('actions.cancel')}</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteAppointment(appointment.id)}
                                  className="bg-destructive text-destructive-foreground"
                                >
                                  {t('actions.delete')}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}