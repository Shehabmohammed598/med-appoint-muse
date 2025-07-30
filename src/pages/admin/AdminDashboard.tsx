import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, UserCheck, UserX } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalUsers: number;
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  todayAppointments: number;
  completedAppointments: number;
}

export function AdminDashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    completedAppointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch user stats
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('role');

        if (profilesError) throw profilesError;

        // Fetch appointment stats
        const { data: appointments, error: appointmentsError } = await supabase
          .from('appointments')
          .select('status, appointment_date');

        if (appointmentsError) throw appointmentsError;

        const today = new Date().toISOString().split('T')[0];
        
        const doctorsCount = profiles?.filter(p => p.role === 'doctor').length || 0;
        const patientsCount = profiles?.filter(p => p.role === 'patient').length || 0;
        const todayCount = appointments?.filter(a => a.appointment_date === today).length || 0;
        const completedCount = appointments?.filter(a => a.status === 'completed').length || 0;

        setStats({
          totalUsers: profiles?.length || 0,
          totalDoctors: doctorsCount,
          totalPatients: patientsCount,
          totalAppointments: appointments?.length || 0,
          todayAppointments: todayCount,
          completedAppointments: completedCount,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: t('admin.stats.totalUsers'),
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: t('admin.stats.totalDoctors'),
      value: stats.totalDoctors,
      icon: UserCheck,
      color: 'text-green-600',
    },
    {
      title: t('admin.stats.totalPatients'),
      value: stats.totalPatients,
      icon: UserX,
      color: 'text-purple-600',
    },
    {
      title: t('admin.stats.totalAppointments'),
      value: stats.totalAppointments,
      icon: Calendar,
      color: 'text-orange-600',
    },
    {
      title: t('admin.stats.todayAppointments'),
      value: stats.todayAppointments,
      icon: Calendar,
      color: 'text-red-600',
    },
    {
      title: t('admin.stats.completedAppointments'),
      value: stats.completedAppointments,
      icon: UserCheck,
      color: 'text-emerald-600',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('admin.dashboard')}</h1>
        <p className="text-muted-foreground">{t('admin.dashboardDesc')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}