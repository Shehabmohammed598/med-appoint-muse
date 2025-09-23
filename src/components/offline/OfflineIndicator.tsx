import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Wifi, 
  WifiOff, 
  Cloud, 
  CloudOff, 
  RotateCw, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useOfflineSync } from '@/hooks/useOfflineSync';

export function OfflineIndicator() {
  const { 
    networkStatus, 
    offlineBookings, 
    isSyncing, 
    syncOfflineBookings, 
    retryFailedBookings 
  } = useOfflineSync();

  const pendingBookings = offlineBookings.filter(b => b.syncStatus === 'pending');
  const failedBookings = offlineBookings.filter(b => b.syncStatus === 'failed');
  const syncedBookings = offlineBookings.filter(b => b.syncStatus === 'synced');

  if (networkStatus.isOnline && pendingBookings.length === 0 && failedBookings.length === 0) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 shadow-lg border-l-4 border-l-primary">
      <CardContent className="p-4 space-y-3">
        {/* Network Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {networkStatus.isOnline ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <span className="font-medium text-sm">
              {networkStatus.isOnline ? 'Online' : 'Offline'}
            </span>
            {networkStatus.isSlowConnection && (
              <Badge variant="secondary" className="text-xs">
                Slow
              </Badge>
            )}
          </div>
          
          {isSyncing && (
            <div className="flex items-center gap-1 text-blue-500">
              <RotateCw className="h-3 w-3 animate-spin" />
              <span className="text-xs">Syncing...</span>
            </div>
          )}
        </div>

        {/* Offline Bookings Status */}
        {(pendingBookings.length > 0 || failedBookings.length > 0 || syncedBookings.length > 0) && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">
              Offline Bookings
            </div>
            
            {/* Pending Bookings */}
            {pendingBookings.length > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-amber-500" />
                  <span>Pending: {pendingBookings.length}</span>
                </div>
                {networkStatus.isOnline && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={syncOfflineBookings}
                    disabled={isSyncing}
                  >
                    <RotateCw className="h-3 w-3 mr-1" />
                    Sync
                  </Button>
                )}
              </div>
            )}

            {/* Failed Bookings */}
            {failedBookings.length > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                  <span>Failed: {failedBookings.length}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={retryFailedBookings}
                  disabled={isSyncing}
                >
                  Retry
                </Button>
              </div>
            )}

            {/* Synced Bookings */}
            {syncedBookings.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-3 w-3" />
                <span>Synced: {syncedBookings.length}</span>
              </div>
            )}
          </div>
        )}

        {/* Offline Mode Message */}
        {!networkStatus.isOnline && (
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <CloudOff className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div className="text-xs">
                <p className="font-medium text-amber-800 dark:text-amber-300 mb-1">
                  You're currently offline
                </p>
                <p className="text-amber-700 dark:text-amber-400">
                  Your bookings will be saved locally and synced when connection is restored.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Slow Connection Message */}
        {networkStatus.isOnline && networkStatus.isSlowConnection && (
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Cloud className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-xs">
                <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                  Slow connection detected
                </p>
                <p className="text-blue-700 dark:text-blue-400">
                  Optimizing for performance. Some features may work offline.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}