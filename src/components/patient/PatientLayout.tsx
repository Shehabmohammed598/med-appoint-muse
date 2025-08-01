import { Navigate } from 'react-router-dom';
import { PatientSidebar } from './PatientSidebar';
import { MobileBottomNav } from '@/components/ui/mobile-bottom-nav';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

interface PatientLayoutProps {
  children: React.ReactNode;
}

export function PatientLayout({ children }: PatientLayoutProps) {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (profile?.role !== 'patient') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">This area is only available for patients.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <PatientSidebar />
      <main className="flex-1 overflow-auto pb-16 md:pb-0">
        {children}
      </main>
      <MobileBottomNav />
    </div>
  );
}