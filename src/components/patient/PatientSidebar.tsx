import { Link, useLocation } from 'react-router-dom';
import { Calendar, MessageSquare, User, Settings, BookOpen, LogOut, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useLanguage } from '@/contexts/LanguageContext';

interface PatientSidebarProps {
  onNavigate?: () => void;
}

export function PatientSidebar({ onNavigate }: PatientSidebarProps) {
  const location = useLocation();
  const { signOut } = useAuth();
  const { t } = useLanguage();

  const navigation = [
    { name: t('dashboard'), href: '/patient', icon: BookOpen },
    { name: 'Specialties', href: '/patient/specialties', icon: Stethoscope },
    { name: t('appointments'), href: '/patient/appointments', icon: Calendar },
    { name: t('booking'), href: '/patient/booking', icon: Calendar },
    { name: t('messages'), href: '/patient/messages', icon: MessageSquare },
    { name: t('profile'), href: '/patient/profile', icon: User },
    { name: t('settings'), href: '/patient/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-medical-primary">{t('patientPortal')}</h2>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={onNavigate}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-medical-primary text-white shadow-md'
                    : 'text-medical-text hover:bg-medical-accent hover:text-medical-primary'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 space-y-4 border-t bg-gray-50">
          <div className="flex gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              signOut();
              onNavigate?.();
            }}
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