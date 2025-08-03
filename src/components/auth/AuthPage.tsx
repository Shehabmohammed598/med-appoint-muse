import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/useAuth';
import { useGuest } from '@/contexts/GuestContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { supabase } from '@/integrations/supabase/client';
import { Users, UserCheck } from 'lucide-react';

export function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('patient');
  const [loading, setLoading] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resettingPassword, setResettingPassword] = useState(false);
  
  const { user, signIn, signUp } = useAuth();
  const { setIsGuest } = useGuest();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/redirect" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, {
          first_name: firstName,
          last_name: lastName,
          role,
        });
        
        if (error) {
          console.error('Signup error:', error);
          let errorMessage = "Unable to create account. Please try again.";
          
          if (error.message.includes('already registered')) {
            errorMessage = "This email is already registered. Please sign in instead.";
          } else if (error.message.includes('Password')) {
            errorMessage = "Password must be at least 6 characters long.";
          } else if (error.message.includes('email')) {
            errorMessage = "Please enter a valid email address.";
          }
          
          toast({
            title: "Signup Failed",
            description: errorMessage,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Account Created!",
            description: "Please check your email to verify your account before signing in.",
          });
          // Switch to sign in mode after successful signup
          setIsSignUp(false);
          setPassword(''); // Clear password for security
        }
      } else {
        const { error } = await signIn(email, password);
        
        if (error) {
          console.error('Login error:', error);
          let errorMessage = "Invalid login credentials. Please check your email and password.";
          
          if (error.message.includes('Email not confirmed')) {
            errorMessage = "Please verify your email address before signing in. Check your inbox for a confirmation email.";
          } else if (error.message.includes('Invalid login credentials')) {
            errorMessage = "Invalid email or password. Please try again or reset your password.";
          } else if (error.message.includes('too many requests')) {
            errorMessage = "Too many login attempts. Please wait a few minutes before trying again.";
          }
          
          toast({
            title: "Login Failed",
            description: errorMessage,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You have been signed in successfully.",
          });
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Authentication Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setResettingPassword(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) {
        toast({
          title: "Reset Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Reset Email Sent",
          description: "Check your email for password reset instructions.",
        });
        setShowPasswordReset(false);
        setResetEmail('');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setResettingPassword(false);
    }
  };

  const handleContinueAsGuest = () => {
    setIsGuest(true);
    navigate('/patient/specialties');
    toast({
      title: "Browsing as Guest",
      description: "You can explore doctors and specialties. Sign up to book appointments!",
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4 flex gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isSignUp ? t('auth.signUp') : t('auth.signIn')}</CardTitle>
          <CardDescription>
            {isSignUp 
              ? t('auth.hasAccount')
              : t('auth.noAccount')
            }
            <Button
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? t('auth.signIn') : t('auth.signUp')}
            </Button>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t('profile.firstName')}</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t('profile.lastName')}</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>{t('auth.role')}</Label>
                  <RadioGroup value={role} onValueChange={setRole}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="patient" id="patient" />
                      <Label htmlFor="patient">{t('auth.patientAccount')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="doctor" id="doctor" />
                      <Label htmlFor="doctor">{t('auth.doctorAccount')}</Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              <UserCheck className="w-4 h-4 mr-2" />
              {loading ? 'Please wait...' : (isSignUp ? t('auth.signUp') : t('auth.signIn'))}
            </Button>

            {!isSignUp && (
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  className="text-sm text-muted-foreground"
                  onClick={() => {
                    setResetEmail(email);
                    setShowPasswordReset(true);
                  }}
                >
                  Forgot your password?
                </Button>
              </div>
            )}
          </form>

          {/* Guest Mode Section */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Don't want to create an account right now?
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleContinueAsGuest}
              >
                <Users className="w-4 h-4 mr-2" />
                Continue as Guest
              </Button>
              <p className="text-xs text-muted-foreground">
                Browse doctors and specialties without signing up
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Reset Dialog */}
      <AlertDialog open={showPasswordReset} onOpenChange={setShowPasswordReset}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Password</AlertDialogTitle>
            <AlertDialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="resetEmail">Email Address</Label>
            <Input
              id="resetEmail"
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPasswordReset(false)}
            >
              Cancel
            </Button>
            <AlertDialogAction
              onClick={handlePasswordReset}
              disabled={resettingPassword}
            >
              {resettingPassword ? 'Sending...' : 'Send Reset Email'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}