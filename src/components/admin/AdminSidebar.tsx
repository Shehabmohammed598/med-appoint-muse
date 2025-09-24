import { 
  Users, 
  Calendar, 
  LayoutDashboard, 
  LogOut,
  Shield,
  UserCheck
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const adminNavItems = [
  {
    title: 'admin.dashboard',
    url: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'admin.users',
    url: '/admin/users',
    icon: Users,
  },
  {
    title: 'admin.appointments',
    url: '/admin/appointments',
    icon: Calendar,
  },
  {
    title: 'Guest Bookings',
    url: '/admin/guest-bookings',
    icon: UserCheck,
  },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate('/auth');
      toast({
        title: t('auth.logoutSuccess'),
        description: t('auth.logoutSuccessDesc'),
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: t('auth.logoutError'),
        description: t('auth.logoutErrorDesc'),
        variant: 'destructive',
      });
    }
  };

  const collapsed = state === 'collapsed';

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {!collapsed && <span>{t('admin.panel')}</span>}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/admin'}
                      className={({ isActive }) =>
                        isActive 
                          ? "bg-primary text-primary-foreground font-medium" 
                          : "hover:bg-muted/50"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{t(item.title)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} className="hover:bg-destructive/10 hover:text-destructive">
                  <LogOut className="h-4 w-4" />
                  {!collapsed && <span>{t('nav.logout')}</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}