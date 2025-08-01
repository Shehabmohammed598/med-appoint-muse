import { Link, useLocation } from 'react-router-dom';
import { Calendar, MessageSquare, User, Settings, BookOpen, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useLanguage } from '@/contexts/LanguageContext';

export function PatientSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();
  const { t } = useLanguage();

  const navigation = [
    { name: t('dashboard'), href: '/patient', icon: BookOpen },
    { name: 'Specialties', href: '/patient/specialties', icon: Calendar },
    { name: t('appointments'), href: '/patient/appointments', icon: Calendar },
    { name: t('booking'), href: '/patient/booking', icon: Calendar },
    { name: t('messages'), href: '/patient/messages', icon: MessageSquare },
    { name: t('profile'), href: '/patient/profile', icon: User },
    { name: t('settings'), href: '/patient/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col w-64 bg-card border-r">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <h2 className="text-lg font-semibold">{t('patientPortal')}</h2>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 space-y-4">
          <div className="flex gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut()}
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t('logout')}
          </Button>
        </div>
      </div>
    </div>
  );
}