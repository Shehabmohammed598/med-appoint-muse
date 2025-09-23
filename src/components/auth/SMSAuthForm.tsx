import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, ArrowLeft, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SMSAuthFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function SMSAuthForm({ onBack, onSuccess }: SMSAuthFormProps) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const sendOTP = async () => {
    if (!phone.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number.",
        variant: "destructive"
      });
      return;
    }

    // Validate phone number format
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number with country code.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone.replace(/\s+/g, ''),
        options: {
          channel: 'sms'
        }
      });

      if (error) throw error;

      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code.",
      });
      
      setStep('otp');
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      toast({
        title: "Failed to Send OTP",
        description: error.message || "Please try again or use email login.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp.trim() || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit verification code.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: phone.replace(/\s+/g, ''),
        token: otp,
        type: 'sms'
      });

      if (error) throw error;

      toast({
        title: "Login Successful",
        description: "You have been signed in successfully.",
      });
      
      onSuccess();
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid verification code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove non-digits except plus sign
    const cleaned = value.replace(/[^\d+]/g, '');
    
    // Basic formatting for display
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setPhone(formatted);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto p-3 rounded-full bg-primary/10">
          <Smartphone className="h-8 w-8 text-primary" />
        </div>
        <div>
          <CardTitle className="text-2xl font-bold">
            {step === 'phone' ? 'Enter Phone Number' : 'Verify OTP'}
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {step === 'phone' 
              ? 'We\'ll send you a verification code via SMS'
              : `Enter the 6-digit code sent to ${phone}`
            }
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {step === 'phone' ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </Label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="+1 234 567 8900"
                  className="pl-10 h-12 text-base"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Include country code (e.g., +1 for US, +44 for UK)
              </p>
            </div>
            
            <Button
              onClick={sendOTP}
              disabled={loading || !phone.trim()}
              className="w-full h-12 text-base font-medium"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {loading ? 'Sending OTP...' : 'Send Verification Code'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-sm font-medium">
                Verification Code
              </Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="h-12 text-center text-2xl font-mono tracking-widest"
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground text-center">
                Didn't receive the code? 
                <Button
                  variant="link"
                  className="p-0 h-auto ml-1 text-xs"
                  onClick={() => setStep('phone')}
                  disabled={loading}
                >
                  Try again
                </Button>
              </p>
            </div>
            
            <Button
              onClick={verifyOTP}
              disabled={loading || otp.length !== 6}
              className="w-full h-12 text-base font-medium"
            >
              {loading ? 'Verifying...' : 'Verify & Sign In'}
            </Button>
          </div>
        )}

        <Button
          variant="outline"
          onClick={onBack}
          className="w-full h-12 text-base"
          disabled={loading}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Email Login
        </Button>

        {/* SMS Notice */}
        <div className="bg-muted/50 rounded-lg p-4 text-sm">
          <p className="text-muted-foreground">
            <strong>Note:</strong> SMS verification may not be available in all regions. 
            Standard messaging rates may apply. If you don't receive the code, please use email login instead.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}