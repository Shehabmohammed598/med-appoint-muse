import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useGuest } from '@/contexts/GuestContext';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { 
  Heart, 
  ArrowLeft, 
  User, 
  Clock, 
  Calendar,
  LogOut,
  Stethoscope
} from 'lucide-react';

interface Doctor {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  specialty: string;
  phone: string;
  language: string;
}

const Doctors = () => {
  const { specialtyId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();
  const { isGuest, setIsGuest } = useGuest();
  
  const specialtyName = location.state?.specialtyName || 'Unknown Specialty';

  useEffect(() => {
    fetchDoctors();
  }, [specialtyId]);

  const fetchDoctors = async () => {
    try {
      // First get the specialty name to match with doctor profiles
      const { data: specialtyData, error: specialtyError } = await supabase
        .from('specialties')
        .select('name_en')
        .eq('id', specialtyId)
        .single();

      if (specialtyError) {
        console.error('Error fetching specialty:', specialtyError);
        return;
      }

      // Then fetch doctors with that specialty
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'doctor')
        .eq('specialty', specialtyData.name_en);

      if (error) {
        console.error('Error fetching doctors:', error);
      } else {
        setDoctors(data || []);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = (doctorId: string, doctorName: string) => {
    navigate(`/book-appointment/${doctorId}`, {
      state: { 
        doctorName,
        specialty: specialtyName 
      }
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
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/specialties')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Specialties
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{specialtyName} Doctors</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our qualified {specialtyName.toLowerCase()} specialists to book your appointment.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                    <div className="h-10 bg-muted rounded w-full mt-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <Card 
                key={doctor.id} 
                className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20"
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        Dr. {doctor.first_name} {doctor.last_name}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {doctor.specialty}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4" />
                      <span>Specialized in {doctor.specialty}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Working Hours: 9:00 AM - 5:00 PM</span>
                    </div>
                    {doctor.language && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Languages: {doctor.language}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => handleBookAppointment(
                      doctor.user_id, 
                      `${doctor.first_name} ${doctor.last_name}`
                    )}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    View Details & Book
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && doctors.length === 0 && (
          <div className="text-center py-12">
            <Stethoscope className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Doctors Available</h3>
            <p className="text-muted-foreground mb-6">
              Currently no doctors are available for {specialtyName}. Please try another specialty or check back later.
            </p>
            <Button variant="outline" onClick={() => navigate('/specialties')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Browse Other Specialties
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Doctors;