import { createContext, useContext, useState, ReactNode } from 'react';

interface GuestContextType {
  isGuest: boolean;
  setIsGuest: (isGuest: boolean) => void;
  guestSession: {
    browsedSpecialties: string[];
    viewedDoctors: string[];
  };
  addBrowsedSpecialty: (specialty: string) => void;
  addViewedDoctor: (doctorId: string) => void;
  clearGuestSession: () => void;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export function GuestProvider({ children }: { children: ReactNode }) {
  const [isGuest, setIsGuest] = useState(false);
  const [guestSession, setGuestSession] = useState({
    browsedSpecialties: [],
    viewedDoctors: []
  });

  const addBrowsedSpecialty = (specialty: string) => {
    setGuestSession(prev => ({
      ...prev,
      browsedSpecialties: [...prev.browsedSpecialties.filter(s => s !== specialty), specialty]
    }));
  };

  const addViewedDoctor = (doctorId: string) => {
    setGuestSession(prev => ({
      ...prev,
      viewedDoctors: [...prev.viewedDoctors.filter(d => d !== doctorId), doctorId]
    }));
  };

  const clearGuestSession = () => {
    setGuestSession({
      browsedSpecialties: [],
      viewedDoctors: []
    });
    setIsGuest(false);
  };

  return (
    <GuestContext.Provider value={{
      isGuest,
      setIsGuest,
      guestSession,
      addBrowsedSpecialty,
      addViewedDoctor,
      clearGuestSession
    }}>
      {children}
    </GuestContext.Provider>
  );
}

export function useGuest() {
  const context = useContext(GuestContext);
  if (!context) {
    throw new Error('useGuest must be used within GuestProvider');
  }
  return context;
}