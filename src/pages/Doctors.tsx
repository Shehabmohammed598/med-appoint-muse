import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useGuest } from '@/contexts/GuestContext';
import { useBookingProtection } from '@/hooks/useBookingProtection';
import { BookingProtection } from '@/components/auth/BookingProtection';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { calculateQueueingMetrics } from '@/utils/queueing';
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
  Award
} from 'lucide-react';
import { toast } from 'sonner';

interface Doctor {
  id: string;
  name: string;
  specialty_id: string;
  bio: string | null;
  photo_url: string | null;
  working_hours: string | null;
  queue_length: number;
  created_at: string;
}

interface Specialty {
  id: string;
  name: string;
  created_at: string;
}

const Doctors = () => {
  const { specialtyId } = useParams();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialty, setSpecialty] = useState<Specialty | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();
  const { isGuest, setIsGuest } = useGuest();
  const { showProtection, setShowProtection, checkBookingPermission } = useBookingProtection();

  useEffect(() => {
    fetchDoctorsAndSpecialty();

    // Subscribe to realtime changes
    const doctorsChannel = supabase
      .channel('doctors-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'doctors'
        },
        () => {
          fetchDoctorsAndSpecialty();
        }
      )
      .subscribe();

    const specialtiesChannel = supabase
      .channel('specialties-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'specialties'
        },
        () => {
          fetchDoctorsAndSpecialty();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(doctorsChannel);
      supabase.removeChannel(specialtiesChannel);
    };
  }, [specialtyId]);

  const fetchDoctorsAndSpecialty = async () => {
    if (!specialtyId) return;

    try {
      setLoading(true);

      // Fetch specialty info
      const { data: specialtyData, error: specialtyError } = await supabase
        .from('specialties')
        .select('*')
        .eq('id', specialtyId)
        .single();

      if (specialtyError) {
        console.error('Error fetching specialty:', specialtyError);
        toast.error('Failed to load specialty');
      } else if (specialtyData) {
        // Cast to handle both name and name_en/name_ar fields
        setSpecialty({
          id: specialtyData.id,
          name: (specialtyData as any).name || (specialtyData as any).name_en || 'Unknown',
          created_at: specialtyData.created_at
        });
      }

      // Fetch doctors for this specialty
      const { data: doctorsData, error: doctorsError } = await (supabase as any)
        .from('doctors')
        .select('*')
        .eq('specialty_id', specialtyId)
        .order('name');

      if (doctorsError) {
        console.error('Error fetching doctors:', doctorsError);
        toast.error('Failed to load doctors');
      } else {
        // Cast the data to our interface
        setDoctors((doctorsData as any[]).map(doc => ({
          id: doc.id,
          name: doc.name,
          specialty_id: doc.specialty_id,
          bio: doc.bio,
          photo_url: doc.photo_url,
          working_hours: doc.working_hours,
          queue_length: doc.queue_length || 0,
          created_at: doc.created_at
        })));
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = (doctorId: string, doctorName: string, isEmergency: boolean = false) => {
    checkBookingPermission(() => {
      navigate(`/book-appointment/${doctorId}`, {
        state: { 
          doctorName,
          specialty: specialty?.name || 'Doctor',
          isEmergency
        }
      });
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

  const emergencySlotsAvailable = (doctor: Doctor) => {
    // In a real app, check against emergency_limits table
    return true;
  };

  const calculateWaitTime = (queueLength: number): number => {
    const metrics = calculateQueueingMetrics(queueLength / 2, 2, 1);
    return Math.round(metrics.expectedWaitTime);
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
          <h1 className="text-4xl font-bold mb-4">
            {specialty?.name || 'Loading...'} Doctors
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our qualified specialists to book your appointment.
          </p>
          {!loading && (
            <Badge variant="secondary" className="mt-4">
              {doctors.length} {doctors.length === 1 ? 'Doctor' : 'Doctors'} Available
            </Badge>
          )}
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
        ) : doctors.length === 0 ? (
          <div className="text-center py-12">
            <Stethoscope className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Doctors Available</h3>
            <p className="text-muted-foreground mb-6">
              Currently no doctors are available for {specialty?.name}. Please try another specialty or check back later.
            </p>
            <Button variant="outline" onClick={() => navigate('/specialties')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Browse Other Specialties
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => {
              const waitTime = calculateWaitTime(doctor.queue_length);
              const hasEmergencySlots = emergencySlotsAvailable(doctor);

              return (
                <Card 
                  key={doctor.id} 
                  className="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 overflow-hidden"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <img 
                          src={doctor.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.id}`}
                          alt={doctor.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=64&h=64&fit=crop&crop=face';
                          }}
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Stethoscope className="h-3 w-3 text-primary-foreground" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">
                          Dr. {doctor.name}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs mb-2">
                          {specialty?.name}
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
                      {doctor.bio || `Specialized in ${specialty?.name?.toLowerCase()} with extensive experience in patient care.`}
                    </p>

                    {/* Schedule & Wait Time */}
                    <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
                      <div className="text-center">
                        <Clock className="h-4 w-4 text-primary mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">Expected Wait</p>
                        <p className="text-sm font-semibold">{waitTime} min</p>
                      </div>
                      <div className="text-center">
                        <User className="h-4 w-4 text-primary mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">Queue</p>
                        <p className="text-sm font-semibold">{doctor.queue_length} patients</p>
                      </div>
                    </div>

                    {/* Working Hours */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Award className="h-3 w-3" />
                        <span>Working Hours: {doctor.working_hours || '9:00 AM - 5:00 PM'}</span>
                      </div>
                    </div>

                    {/* Booking Buttons */}
                    <div className="space-y-2 pt-2">
                      <Button 
                        className="w-full"
                        onClick={() => handleBookAppointment(
                          doctor.id, 
                          doctor.name,
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
                          doctor.id, 
                          doctor.name,
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
