import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface OfflineBooking {
  id: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
  isEmergency?: boolean;
  medicalDescription?: string;
  createdOfflineAt: string;
  syncStatus: 'pending' | 'synced' | 'failed';
}

interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
}

export function useOfflineSync() {
  const [offlineBookings, setOfflineBookings] = useState<OfflineBooking[]>([]);
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isSlowConnection: false
  });
  const [isSyncing, setIsSyncing] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus(prev => ({ ...prev, isOnline: true }));
      toast({
        title: "Connection Restored",
        description: "Syncing offline bookings...",
      });
      syncOfflineBookings();
    };

    const handleOffline = () => {
      setNetworkStatus(prev => ({ ...prev, isOnline: false }));
      toast({
        title: "Offline Mode",
        description: "Your bookings will be saved locally and synced when connection is restored.",
        variant: "destructive"
      });
    };

    // Detect slow connection
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    let cleanupConnection: (() => void) | undefined;
    
    if (connection) {
      const updateConnectionStatus = () => {
        const isSlowConnection = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
        setNetworkStatus(prev => ({ ...prev, isSlowConnection }));
        
        if (isSlowConnection) {
          toast({
            title: "Slow Connection Detected",
            description: "Booking data will be saved locally for better performance.",
          });
        }
      };

      connection.addEventListener('change', updateConnectionStatus);
      updateConnectionStatus();
      
      cleanupConnection = () => {
        connection.removeEventListener('change', updateConnectionStatus);
      };
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (cleanupConnection) {
        cleanupConnection();
      }
    };
  }, []);

  // Load offline bookings from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('offline_bookings');
    if (stored) {
      try {
        setOfflineBookings(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading offline bookings:', error);
      }
    }
  }, []);

  // Save offline bookings to localStorage
  useEffect(() => {
    localStorage.setItem('offline_bookings', JSON.stringify(offlineBookings));
  }, [offlineBookings]);

  // Auto-sync when online
  useEffect(() => {
    if (networkStatus.isOnline && offlineBookings.some(b => b.syncStatus === 'pending')) {
      syncOfflineBookings();
    }
  }, [networkStatus.isOnline]);

  const saveBookingOffline = (bookingData: Omit<OfflineBooking, 'id' | 'createdOfflineAt' | 'syncStatus'>) => {
    const offlineBooking: OfflineBooking = {
      ...bookingData,
      id: crypto.randomUUID(),
      createdOfflineAt: new Date().toISOString(),
      syncStatus: 'pending'
    };

    setOfflineBookings(prev => [...prev, offlineBooking]);
    
    toast({
      title: "Booking Saved Locally",
      description: "Your booking has been saved offline and will be submitted when connection is restored.",
    });

    // Try to sync immediately if online
    if (networkStatus.isOnline) {
      setTimeout(() => syncOfflineBookings(), 1000);
    }

    return offlineBooking.id;
  };

  const syncOfflineBookings = async () => {
    if (!user || isSyncing) return;

    const pendingBookings = offlineBookings.filter(b => b.syncStatus === 'pending');
    if (pendingBookings.length === 0) return;

    setIsSyncing(true);

    try {
      for (const booking of pendingBookings) {
        try {
          // Try to sync to database
          if (booking.isEmergency) {
            // Sync emergency request
            const { error } = await supabase
              .from('emergency_requests')
              .insert({
                patient_id: user.id,
                doctor_id: booking.doctorId,
                medical_description: booking.medicalDescription || booking.notes || '',
                message: 'Emergency request submitted offline'
              });

            if (error) throw error;
          } else {
            // Sync regular appointment
            const { error } = await supabase
              .from('appointments')
              .insert({
                patient_id: user.id,
                doctor_id: booking.doctorId,
                appointment_date: booking.appointmentDate,
                appointment_time: booking.appointmentTime,
                notes: booking.notes || ''
              });

            if (error) throw error;
          }

          // Mark as synced
          setOfflineBookings(prev => 
            prev.map(b => 
              b.id === booking.id 
                ? { ...b, syncStatus: 'synced' as const }
                : b
            )
          );

        } catch (error: any) {
          console.error('Error syncing booking:', error);
          
          // Mark as failed
          setOfflineBookings(prev => 
            prev.map(b => 
              b.id === booking.id 
                ? { ...b, syncStatus: 'failed' as const }
                : b
            )
          );
        }
      }

      const syncedCount = offlineBookings.filter(b => b.syncStatus === 'synced').length;
      const failedCount = offlineBookings.filter(b => b.syncStatus === 'failed').length;

      if (syncedCount > 0) {
        toast({
          title: "Bookings Synced",
          description: `Successfully synced ${syncedCount} booking(s).`,
        });
      }

      if (failedCount > 0) {
        toast({
          title: "Some Bookings Failed to Sync",
          description: `${failedCount} booking(s) could not be synced. They will retry automatically.`,
          variant: "destructive"
        });
      }

      // Clean up synced bookings after 24 hours
      setTimeout(() => {
        setOfflineBookings(prev => 
          prev.filter(b => 
            b.syncStatus !== 'synced' || 
            new Date().getTime() - new Date(b.createdOfflineAt).getTime() < 24 * 60 * 60 * 1000
          )
        );
      }, 1000);

    } finally {
      setIsSyncing(false);
    }
  };

  const retryFailedBookings = () => {
    setOfflineBookings(prev => 
      prev.map(b => 
        b.syncStatus === 'failed' 
          ? { ...b, syncStatus: 'pending' }
          : b
      )
    );
    
    if (networkStatus.isOnline) {
      syncOfflineBookings();
    }
  };

  const clearSyncedBookings = () => {
    setOfflineBookings(prev => prev.filter(b => b.syncStatus !== 'synced'));
  };

  return {
    networkStatus,
    offlineBookings,
    isSyncing,
    saveBookingOffline,
    syncOfflineBookings,
    retryFailedBookings,
    clearSyncedBookings
  };
}