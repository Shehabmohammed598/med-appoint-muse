import { useProfile } from '@/hooks/useProfile';
import { useAppointments } from '@/hooks/useAppointments';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, CheckCircle, Clock } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export default function Dashboard() {
  const { profile } = useProfile();
  const { appointments, getTodayAppointments, getCompletedAppointments } = useAppointments();
  const { t, isRTL } = useLanguage();

  const todayAppointments = getTodayAppointments();
  const completedAppointments = getCompletedAppointments();
  const todayCompleted = todayAppointments.filter(apt => apt.status === 'completed');

  const stats = [
    {
      title: t('dashboard.todayAppointments'),
      value: todayAppointments.length,
      icon: Calendar,
      color: 'text-blue-600',
    },
    {
      title: t('dashboard.totalPatients'),
      value: new Set(appointments.map(apt => apt.patient_id)).size,
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: t('dashboard.completedToday'),
      value: todayCompleted.length,
      icon: CheckCircle,
      color: 'text-purple-600',
    },
    {
      title: t('dashboard.upcoming'),
      value: todayAppointments.filter(apt => apt.status === 'scheduled').length,
      icon: Clock,
      color: 'text-orange-600',
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: 'default',
      completed: 'secondary',
      canceled: 'destructive',
      no_show: 'outline',
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {t(`status.${status}`)}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-2xl font-bold">
            {t('dashboard.welcome')} {profile?.first_name} {profile?.last_name}
          </h1>
          <p className="text-muted-foreground">
            {profile?.specialty}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>{t('appointments.today')}</CardTitle>
          </CardHeader>
          <CardContent>
            {todayAppointments.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                {t('appointments.noAppointments')}
              </p>
            ) : (
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <div className="font-medium">
                          {appointment.patient_profile?.first_name} {appointment.patient_profile?.last_name}
                        </div>
                        <div className="text-muted-foreground">
                          {appointment.appointment_time}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(appointment.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}