import { Home, Calendar, Stethoscope, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Home', path: '/patient' },
  { icon: Calendar, label: 'Appointments', path: '/patient/appointments' },
  { icon: Stethoscope, label: 'Doctors', path: '/patient/specialties' },
  { icon: Settings, label: 'Settings', path: '/patient/settings' },
];

export function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/patient') {
      return location.pathname === '/patient';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 transition-colors",
                active 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 mb-1",
                active && "text-primary"
              )} />
              <span className={cn(
                "text-xs font-medium",
                active && "text-primary"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}