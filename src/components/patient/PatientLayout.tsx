import { Navigate } from 'react-router-dom';
import { PatientSidebar } from './PatientSidebar';
import { MobileBottomNav } from '@/components/ui/mobile-bottom-nav';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useState } from 'react';

interface PatientLayoutProps {
  children: React.ReactNode;
}

export function PatientLayout({ children }: PatientLayoutProps) {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
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
    <div className="min-h-screen bg-background">
      {/* Header with hamburger menu */}
      <header className="sticky top-0 z-40 bg-background border-b border-border shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold text-foreground">Patient Portal</h1>
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2 hover:bg-accent">
                <Menu className="h-5 w-5 text-foreground" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 p-0">
              <PatientSidebar onNavigate={() => setSidebarOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main content */}
      <main className="pb-16 md:pb-0">
        {children}
      </main>

      {/* Mobile bottom navigation */}
      <MobileBottomNav />
    </div>
  );
}