import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export function TestDoctorSetup() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createTestDoctor = async () => {
    setLoading(true);
    try {
      // Create a new auth user first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: 'dr.ahmed@test.com',
        password: 'testpass123',
        options: {
          data: {
            first_name: 'Ahmed',
            last_name: 'Hassan',
            role: 'doctor'
          }
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      if (authData.user) {
        // Update the profile with specialty
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ specialty: 'Cardiology' })
          .eq('user_id', authData.user.id);

        if (profileError) {
          console.error('Profile error:', profileError);
          throw profileError;
        }

        toast({
          title: 'Success',
          description: 'Test doctor created successfully',
        });
      }
    } catch (error: any) {
      console.error('Error creating test doctor:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Test Doctor Setup</CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={createTestDoctor} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Creating...' : 'Create Test Doctor'}
        </Button>
      </CardContent>
    </Card>
  );
}