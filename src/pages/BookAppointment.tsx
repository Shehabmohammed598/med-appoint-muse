import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useGuest } from '@/contexts/GuestContext';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { 
  Heart, 
  ArrowLeft, 
  User, 
  Calendar as CalendarIcon,
  LogOut,
  Clock,
  Stethoscope,
  Phone,
  Mail
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

const BookAppointment = () => {
  const { doctorId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isGuest, setIsGuest } = useGuest();
  const { toast } = useToast();
  
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Form data
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('09:00');
  
  const doctorName = location.state?.doctorName || '';
  const specialty = location.state?.specialty || '';

  useEffect(() => {
    fetchDoctorDetails();
    
    // Pre-fill user data if logged in
    if (user) {
      // We could fetch user profile data here if needed
      setFullName(''); // Will be filled from user profile
      setPhoneNumber(''); // Will be filled from user profile
    }
  }, [doctorId, user]);

  const fetchDoctorDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', doctorId)
        .eq('role', 'doctor')
        .single();

      if (error) {
        console.error('Error fetching doctor:', error);
      } else {
        setDoctor(data);
      }
    } catch (error) {
      console.error('Error fetching doctor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      toast({
        title: "Date Required",
        description: "Please select an appointment date.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      if (user) {
        // Authenticated user - save to appointments table
        const { error } = await supabase
          .from('appointments')
          .insert({
            patient_id: user.id,
            doctor_id: doctorId,
            appointment_date: selectedDate.toISOString().split('T')[0],
            appointment_time: appointmentTime,
            notes: notes || null,
            status: 'scheduled'
          });

        if (error) {
          throw error;
        }

        toast({
          title: "Appointment Booked!",
          description: "Your appointment has been successfully scheduled.",
        });
        
        navigate('/patient/appointments');
      } else {
        // Guest user - save to guest_bookings table
        if (!fullName || !phoneNumber) {
          toast({
            title: "Information Required",
            description: "Please provide your full name and phone number.",
            variant: "destructive",
          });
          return;
        }

        const { error } = await supabase
          .from('guest_bookings')
          .insert({
            appointment_date: selectedDate.toISOString().split('T')[0],
            appointment_time: appointmentTime,
            full_name: fullName,
            phone_number: phoneNumber,
            specialty: doctor?.specialty || specialty,
            doctor_name: doctor ? `${doctor.first_name} ${doctor.last_name}` : doctorName,
            notes: notes || null,
            status: 'pending'
          });

        if (error) {
          throw error;
        }

        toast({
          title: "Appointment Request Submitted!",
          description: "Your appointment request has been submitted. We'll contact you to confirm.",
        });
        
        navigate('/booking-confirmation');
      }
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Booking Failed",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    if (isGuest) {
      setIsGuest(false);
    } else {
      await signOut();
    }
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading doctor information...</p>
        </div>
      </div>
    );
  }

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
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Doctors
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Book Your Appointment</h1>
            <p className="text-xl text-muted-foreground">
              Schedule your visit with {doctor ? `Dr. ${doctor.first_name} ${doctor.last_name}` : doctorName}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Doctor Info Card */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>
                        {doctor ? `Dr. ${doctor.first_name} ${doctor.last_name}` : doctorName}
                      </CardTitle>
                      <Badge variant="secondary">
                        {doctor?.specialty || specialty}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Stethoscope className="h-4 w-4" />
                    <span>{doctor?.specialty || specialty} Specialist</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Working Hours: 9:00 AM - 5:00 PM</span>
                  </div>
                  {doctor?.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{doctor.phone}</span>
                    </div>
                  )}
                  {doctor?.language && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>Languages: {doctor.language}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Details</CardTitle>
                  <CardDescription>
                    Please fill in your information and select your preferred appointment time.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Guest Information */}
                    {!user && (
                      <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                        <h3 className="font-semibold">Your Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name *</Label>
                            <Input
                              id="fullName"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="Enter your full name"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number *</Label>
                            <Input
                              id="phoneNumber"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              placeholder="Enter your phone number"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Date Selection */}
                    <div className="space-y-2">
                      <Label>Select Date *</Label>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                        className="rounded-md border"
                      />
                    </div>

                    {/* Time Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="time">Preferred Time *</Label>
                      <select
                        id="time"
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        className="w-full p-2 border rounded-md bg-background"
                        required
                      >
                        <option value="09:00">9:00 AM</option>
                        <option value="09:30">9:30 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="10:30">10:30 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="11:30">11:30 AM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="14:30">2:30 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="15:30">3:30 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="16:30">4:30 PM</option>
                      </select>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any specific concerns or notes for the doctor..."
                        rows={4}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={submitting}>
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {submitting ? 'Booking...' : 'Book Appointment'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookAppointment;