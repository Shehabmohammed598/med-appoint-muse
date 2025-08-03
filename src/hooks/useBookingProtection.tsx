import { useState } from 'react';
import { useAuth } from './useAuth';
import { useGuest } from '@/contexts/GuestContext';

export function useBookingProtection() {
  const [showProtection, setShowProtection] = useState(false);
  const { user } = useAuth();
  const { isGuest } = useGuest();

  const checkBookingPermission = (callback: () => void) => {
    if (!user && isGuest) {
      setShowProtection(true);
      return false;
    } else if (!user) {
      setShowProtection(true);
      return false;
    }
    
    // User is authenticated, allow booking
    callback();
    return true;
  };

  return {
    showProtection,
    setShowProtection,
    checkBookingPermission,
    canBook: !!user
  };
}