import { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/hooks/useAuth';
import { useGuest } from '@/contexts/GuestContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { ForgotPasswordFlow } from './ForgotPasswordFlow';
import { Users, UserCheck, Eye, EyeOff, Mail, Lock, Heart } from 'lucide-react';

export function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('patient');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const { user, signIn, signUp } = useAuth();
  const { setIsGuest } = useGuest();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/redirect" replace />;
  }

  if (showForgotPassword) {
    return <ForgotPasswordFlow onBack={() => setShowForgotPassword(false)} />;
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


  const handleContinueAsGuest = () => {
    setIsGuest(true);
    navigate('/patient/specialties');
    toast({
      title: "Browsing as Guest",
      description: "You can explore doctors and specialties. Sign up to book appointments!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
          <Heart className="h-6 w-6" />
          <span className="text-xl font-bold">HealthCare</span>
        </Link>
        <div className="flex gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
      
      <Card className="w-full max-w-lg shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="space-y-4 pb-8">
          <div className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              {isSignUp 
                ? 'Join our healthcare platform to get started'
                : 'Sign in to access your healthcare dashboard'
              }
            </CardDescription>
          </div>
          
          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </span>{' '}
            <Button
              variant="link"
              className="p-0 h-auto font-medium text-primary hover:text-primary/80"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-3">
                     <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                     <Input
                       id="firstName"
                       type="text"
                       value={firstName}
                       onChange={(e) => setFirstName(e.target.value)}
                       placeholder="Enter first name"
                       className="h-12"
                       required
                     />
                   </div>
                   <div className="space-y-3">
                     <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                     <Input
                       id="lastName"
                       type="text"
                       value={lastName}
                       onChange={(e) => setLastName(e.target.value)}
                       placeholder="Enter last name"
                       className="h-12"
                       required
                     />
                   </div>
                 </div>
                 
                 <div className="space-y-4">
                   <Label className="text-sm font-medium">Account Type</Label>
                   <RadioGroup value={role} onValueChange={setRole} className="grid grid-cols-2 gap-4">
                     <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                       <RadioGroupItem value="patient" id="patient" />
                       <Label htmlFor="patient" className="font-normal cursor-pointer">Patient</Label>
                     </div>
                     <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                       <RadioGroupItem value="doctor" id="doctor" />
                       <Label htmlFor="doctor" className="font-normal cursor-pointer">Doctor</Label>
                     </div>
                   </RadioGroup>
                 </div>
              </>
            )}
            
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 pr-12 h-12"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                </Button>
              </div>
            </div>
            
            <Button type="submit" className="w-full h-12 text-base font-medium" disabled={loading}>
              <UserCheck className="w-4 h-4 mr-2" />
              {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </Button>

            {!isSignUp && (
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot your password?
                </Button>
              </div>
            )}
          </form>

          {/* Guest Mode Section */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Don't want to create an account right now?
                </p>
                <p className="text-xs text-muted-foreground">
                  Browse doctors and specialties without signing up
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 text-base font-medium border-dashed hover:border-solid transition-all"
                onClick={handleContinueAsGuest}
              >
                <Users className="w-4 h-4 mr-2" />
                Continue as Guest
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}