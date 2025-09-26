import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useGuest } from '@/contexts/GuestContext';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { 
  Heart, 
  Eye, 
  Stethoscope, 
  Brain, 
  Bone, 
  Baby, 
  Activity,
  User,
  LogOut
} from 'lucide-react';

interface Specialty {
  id: string;
  name_en: string;
  name_ar: string;
}

const specialtyIcons: Record<string, any> = {
  'Cardiology': Heart,
  'Ophthalmology': Eye,
  'Internal Medicine': Stethoscope,
  'Neurology': Brain,
  'Orthopedics': Bone,
  'Pediatrics': Baby,
  'General Practice': Activity,
};

const Specialties = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();
  const { isGuest, setIsGuest } = useGuest();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const fetchSpecialties = async () => {
    try {
      const { data, error } = await supabase
        .from('specialties')
        .select('*')
        .order('name_en');

      if (error) {
        console.error('Error fetching specialties:', error);
      } else {
        setSpecialties(data || []);
      }
    } catch (error) {
      console.error('Error fetching specialties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpecialtyClick = (specialtyId: string, specialtyName: string) => {
    navigate(`/specialties/${specialtyId}/doctors`, { 
      state: { specialtyName } 
    });
  };

  const handleSignOut = async () => {
    if (isGuest) {
      setIsGuest(false);
    } else {
      await signOut();
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            <Heart className="h-6 w-6" />
            <span className="text-xl font-bold">Doctor Reservation</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <ThemeToggle />
            
            {user && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
            )}
            
            {isGuest && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Guest User</span>
              </div>
            )}
            
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              {isGuest ? 'Exit Guest' : 'Sign Out'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose a Medical Specialty</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the medical specialty you need to find qualified doctors and book your appointment.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-full mx-auto mb-4" />
                  <div className="h-6 bg-muted rounded w-3/4 mx-auto" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialties.map((specialty) => {
              const IconComponent = specialtyIcons[specialty.name_en] || Stethoscope;
              
              return (
                <Card 
                  key={specialty.id} 
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 border-2 hover:border-primary/20"
                  onClick={() => handleSpecialtyClick(specialty.id, specialty.name_en)}
                >
                  <CardHeader className="text-center">
                    <IconComponent className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle className="text-xl">{specialty.name_en}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      Find specialized doctors in {specialty.name_en.toLowerCase()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button variant="outline" className="w-full">
                      View Doctors
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && specialties.length === 0 && (
          <div className="text-center py-12">
            <Stethoscope className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Specialties Available</h3>
            <p className="text-muted-foreground">
              We're working on adding more medical specialties. Please check back later.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Specialties;