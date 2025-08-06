import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useGuest } from '@/contexts/GuestContext';
import { PatientLayout } from '@/components/patient/PatientLayout';
import { PatientSidebar } from '@/components/patient/PatientSidebar';
import { MobileBottomNav } from '@/components/ui/mobile-bottom-nav';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useState } from 'react';

interface GuestSafeLayoutProps {
  children: ReactNode;
}

export function GuestSafeLayout({ children }: GuestSafeLayoutProps) {
  const { user } = useAuth();
  const { isGuest } = useGuest();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If user is authenticated, use the regular PatientLayout
  if (user) {
    return <PatientLayout>{children}</PatientLayout>;
  }

  // If guest mode, provide a simplified layout
  if (isGuest) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header with hamburger menu */}
        <header className="sticky top-0 z-40 bg-background border-b border-border shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-lg font-semibold text-foreground">Patient Portal (Guest)</h1>
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

  // If not authenticated and not guest, redirect to login
  return <PatientLayout>{children}</PatientLayout>;
}