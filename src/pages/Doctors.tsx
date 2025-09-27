import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useGuest } from '@/contexts/GuestContext';
import { useBookingProtection } from '@/hooks/useBookingProtection';
import { BookingProtection } from '@/components/auth/BookingProtection';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { calculateQueueingMetrics, generateAppointmentSlots, checkEmergencyAvailability } from '@/utils/queueing';
import { 
  Heart, 
  ArrowLeft, 
  User, 
  Clock, 
  Calendar,
  LogOut,
  Stethoscope,
  AlertTriangle,
  Star,
  Globe,
  Award
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
  const [emergencyAvailability, setEmergencyAvailability] = useState<Record<string, boolean>>({});
  const { user, signOut } = useAuth();
  const { isGuest, setIsGuest } = useGuest();
  const { showProtection, setShowProtection, checkBookingPermission } = useBookingProtection();
  
  const specialtyName = location.state?.specialtyName || 'Unknown Specialty';

  useEffect(() => {
    fetchDoctors();
  }, [specialtyId]);

  useEffect(() => {
    // Check emergency availability for each doctor
    const checkEmergencySlots = async () => {
      const availability: Record<string, boolean> = {};
      for (const doctor of doctors) {
        if (doctor.specialty) {
          availability[doctor.id] = await checkEmergencyAvailability(new Date(), doctor.specialty);
        }
      }
      setEmergencyAvailability(availability);
    };

    if (doctors.length > 0) {
      checkEmergencySlots();
    }
  }, [doctors]);

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

  const handleBookAppointment = (doctorId: string, doctorName: string, isEmergency: boolean = false) => {
    checkBookingPermission(() => {
      navigate(`/book-appointment/${doctorId}`, {
        state: { 
          doctorName,
          specialty: specialtyName,
          isEmergency
        }
      });
    });
  };

  const calculateWaitTime = (doctor: Doctor): number => {
    const metrics = calculateQueueingMetrics(6, 2, 1); // 6 patients/hour, 2 service rate, 1 doctor
    return Math.round(metrics.expectedWaitTime);
  };

  const getAvailableSlots = (doctor: Doctor): number => {
    const slots = generateAppointmentSlots('09:00', '17:00', 30, [], 2);
    return slots.filter(slot => slot.available).length;
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => {
              const waitTime = calculateWaitTime(doctor);
              const availableSlots = getAvailableSlots(doctor);
              const hasEmergencySlots = emergencyAvailability[doctor.id];

              return (
                <Card 
                  key={doctor.id} 
                  className="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 overflow-hidden"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <img 
                          src={`https://randomuser.me/api/portraits/${doctor.first_name?.toLowerCase().includes('hind') || doctor.first_name?.toLowerCase().includes('amina') || doctor.first_name?.toLowerCase().includes('fatima') ? 'women' : 'men'}/${Math.abs(doctor.id.charCodeAt(1) % 50)}.jpg`}
                          alt={`Dr. ${doctor.first_name} ${doctor.last_name}`}
                          className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=64&h=64&fit=crop&crop=face';
                          }}
                        />
                        {doctor.specialty && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <Stethoscope className="h-3 w-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">
                          Dr. {doctor.first_name} {doctor.last_name}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs mb-2">
                          {doctor.specialty}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">4.8</span>
                          <span>({Math.floor(Math.random() * 100 + 50)} reviews)</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4 pt-0">
                    {/* Doctor Bio */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Specialized in {doctor.specialty?.toLowerCase()} with extensive experience in patient care and modern treatment methods.
                    </p>

                    {/* Schedule & Wait Time */}
                    <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
                      <div className="text-center">
                        <Clock className="h-4 w-4 text-primary mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">Expected Wait</p>
                        <p className="text-sm font-semibold">{waitTime} min</p>
                      </div>
                      <div className="text-center">
                        <Calendar className="h-4 w-4 text-primary mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">Available Slots</p>
                        <p className="text-sm font-semibold">{availableSlots}</p>
                      </div>
                    </div>

                    {/* Languages & Qualifications */}
                    <div className="space-y-2 text-xs">
                      {doctor.language && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Globe className="h-3 w-3" />
                          <span>Languages: {doctor.language}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Award className="h-3 w-3" />
                        <span>Working Hours: 9:00 AM - 5:00 PM</span>
                      </div>
                    </div>

                    {/* Booking Buttons */}
                    <div className="space-y-2 pt-2">
                      <Button 
                        className="w-full"
                        onClick={() => handleBookAppointment(
                          doctor.user_id, 
                          `${doctor.first_name} ${doctor.last_name}`,
                          false
                        )}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Normal Booking
                      </Button>
                      
                      <Button 
                        variant={hasEmergencySlots ? "destructive" : "outline"}
                        className="w-full"
                        disabled={!hasEmergencySlots}
                        onClick={() => handleBookAppointment(
                          doctor.user_id, 
                          `${doctor.first_name} ${doctor.last_name}`,
                          true
                        )}
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        {hasEmergencySlots ? 'Emergency Booking' : 'Emergency Slots Full'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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

      {/* Booking Protection Dialog */}
      <BookingProtection 
        open={showProtection}
        onOpenChange={setShowProtection}
      />
    </div>
  );
};

export default Doctors;