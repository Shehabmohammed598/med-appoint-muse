import { PatientLayout } from '@/components/patient/PatientLayout';
import { useProfile } from '@/hooks/useProfile';
import { usePatientAppointments } from '@/hooks/usePatientAppointments';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, FileText, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PatientAppointments() {
  const { profile } = useProfile();
  const { appointments, loading, getUpcomingAppointments, getPastAppointments } = usePatientAppointments();
  const { t } = useLanguage();

  const upcomingAppointments = getUpcomingAppointments();
  const pastAppointments = getPastAppointments();

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      scheduled: 'default',
      completed: 'secondary',
      canceled: 'destructive',
      no_show: 'outline',
    };

    return (
      <Badge variant={statusColors[status] || 'default'}>
        {t(status)}
      </Badge>
    );
  };

  const renderAppointmentList = (appointmentList: typeof appointments) => (
    <div className="space-y-4">
      {appointmentList.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">{t('noAppointments')}</p>
      ) : (
        appointmentList.map((appointment) => (
          <Card key={appointment.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Calendar className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">
                      {new Date(appointment.appointment_date).toLocaleDateString()}
                    </h3>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                       <Clock className="h-4 w-4" />
                       {appointment.appointment_time}
                     </div>
                     {appointment.doctor_profile && (
                       <p className="text-sm font-medium mt-1">
                         Dr. {appointment.doctor_profile.first_name} {appointment.doctor_profile.last_name}
                         {appointment.doctor_profile.specialty && (
                           <span className="text-muted-foreground"> - {appointment.doctor_profile.specialty}</span>
                         )}
                       </p>
                     )}
                    {appointment.notes && (
                      <div className="flex items-start gap-2 mt-2">
                        <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(appointment.status)}
                  <p className="text-xs text-muted-foreground mt-2">
                    {t('created')}: {new Date(appointment.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  return (
    <PatientLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('myAppointments')}</h1>
            <p className="text-muted-foreground">{t('manageAppointments')}</p>
          </div>
          <Button asChild>
            <Link to="/patient/booking">
              <Plus className="h-4 w-4 mr-2" />
              {t('bookAppointment')}
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">
              {t('upcoming')} ({upcomingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="history">
              {t('history')} ({pastAppointments.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-6">
            {renderAppointmentList(upcomingAppointments)}
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            {renderAppointmentList(pastAppointments)}
          </TabsContent>
        </Tabs>
      </div>
    </PatientLayout>
  );
}