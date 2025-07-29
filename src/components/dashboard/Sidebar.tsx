import { Calendar, Home, LogOut, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'nav.dashboard', href: '/dashboard', icon: Home },
  { name: 'nav.appointments', href: '/dashboard/appointments', icon: Calendar },
  { name: 'nav.profile', href: '/dashboard/profile', icon: Settings },
];

export function Sidebar() {
  const { signOut } = useAuth();
  const { t, isRTL } = useLanguage();
  const location = useLocation();

  return (
    <div className={cn(
      "flex flex-col w-64 bg-sidebar border-r border-sidebar-border",
      isRTL && "border-l border-r-0"
    )}>
      <div className="p-6">
        <h1 className="text-lg font-semibold text-sidebar-foreground">
          {t('nav.dashboard')}
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isRTL && "flex-row-reverse"
              )}
            >
              <Icon className="h-4 w-4" />
              {t(item.name)}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 space-y-2">
        <div className="flex gap-2 justify-center">
          <LanguageToggle />
          <ThemeToggle />
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          {t('nav.logout')}
        </Button>
      </div>
    </div>
  );
}