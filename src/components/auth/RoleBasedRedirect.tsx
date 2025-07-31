import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

export function RoleBasedRedirect() {
  const { user } = useAuth();
  const { profile, loading } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || loading) return;

    if (profile) {
      switch (profile.role) {
        case 'patient':
          navigate('/patient', { replace: true });
          break;
        case 'doctor':
          navigate('/dashboard', { replace: true });
          break;
        case 'admin':
          navigate('/admin', { replace: true });
          break;
        default:
          navigate('/auth', { replace: true });
      }
    }
  }, [user, profile, loading, navigate]);

  return null;
}