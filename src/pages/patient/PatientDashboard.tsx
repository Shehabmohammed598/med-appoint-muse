import { PatientLayout } from '@/components/patient/PatientLayout';
import { useProfile } from '@/hooks/useProfile';
import { useAppointments } from '@/hooks/useAppointments';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, FileText } from 'lucide-react';

export function PatientDashboard() {
  const { profile } = useProfile();
  const { appointments } = useAppointments();
  const { t } = useLanguage();

  // Filter appointments for this patient
  const myAppointments = appointments.filter(apt => apt.patient_id === profile?.user_id);
  const upcomingAppointments = myAppointments.filter(apt => {
    const appointmentDate = new Date(apt.appointment_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointmentDate >= today && apt.status !== 'completed' && apt.status !== 'canceled';
  });

  const recentAppointments = myAppointments
    .filter(apt => apt.status === 'completed')
    .slice(0, 3);

  const stats = [
    {
      title: t('upcomingAppointments'),
      value: upcomingAppointments.length,
      icon: Calendar,
    },
    {
      title: t('completedAppointments'),
      value: myAppointments.filter(apt => apt.status === 'completed').length,
      icon: FileText,
    },
    {
      title: t('totalAppointments'),
      value: myAppointments.length,
      icon: Clock,
    },
  ];

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

  return (
    <PatientLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            {t('welcome')}, {profile?.first_name || t('patient')}!
          </h1>
          <p className="text-muted-foreground">{t('patientDashboardSubtitle')}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t('upcomingAppointments')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length === 0 ? (
              <p className="text-muted-foreground">{t('noUpcomingAppointments')}</p>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.slice(0, 3).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">
                          {new Date(appointment.appointment_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.appointment_time}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t('recentAppointments')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentAppointments.length === 0 ? (
              <p className="text-muted-foreground">{t('noRecentAppointments')}</p>
            ) : (
              <div className="space-y-4">
                {recentAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">
                          {new Date(appointment.appointment_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.appointment_time}
                        </p>
                        {appointment.notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {appointment.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PatientLayout>
  );
}