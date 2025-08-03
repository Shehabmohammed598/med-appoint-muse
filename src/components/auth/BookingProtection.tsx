import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useGuest } from '@/contexts/GuestContext';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { UserPlus, LogIn } from 'lucide-react';

interface BookingProtectionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingProtection({ open, onOpenChange }: BookingProtectionProps) {
  const { isGuest, clearGuestSession } = useGuest();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/auth');
    onOpenChange(false);
  };

  const handleSignIn = () => {
    navigate('/auth');
    onOpenChange(false);
  };

  // Don't show if user is authenticated
  if (user) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Sign in Required
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            To book an appointment, you need to sign in to your account or create a new one.
            {isGuest && (
              <div className="mt-3 p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Don't worry!</p>
                <p className="text-sm text-muted-foreground">
                  Your browsing session will be saved when you sign up.
                </p>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col space-y-2 sm:flex-col sm:space-x-0">
          <AlertDialogAction
            onClick={handleSignUp}
            className="w-full"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Create New Account
          </AlertDialogAction>
          <Button
            variant="outline"
            onClick={handleSignIn}
            className="w-full"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign In to Existing Account
          </Button>
          <AlertDialogCancel className="w-full">
            Continue Browsing as Guest
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}