import { PatientLayout } from '@/components/patient/PatientLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { BookingConfirmation } from '@/components/ui/booking-confirmation';
import { BookingProtection } from '@/components/auth/BookingProtection';
import { useBookingProtection } from '@/hooks/useBookingProtection';
import { useGuest } from '@/contexts/GuestContext';
import { doctors } from '@/data/mockData';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Star, 
  Clock, 
  Languages, 
  AlertTriangle, 
  ArrowLeft,
  Award,
  MapPin,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';

export function PatientDoctorDetails() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { doctorId } = useParams<{ doctorId: string }>();
  const [searchParams] = useSearchParams();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const { showProtection, setShowProtection, checkBookingPermission } = useBookingProtection();
  const { addViewedDoctor } = useGuest();

  const doctor = doctors.find(d => d.id === doctorId);
  const showBooking = searchParams.get('book') === 'true';
  const isEmergency = searchParams.get('emergency') === 'true';

  // Track doctor view for guest session
  useEffect(() => {
    if (doctor && doctorId) {
      addViewedDoctor(doctorId);
    }
  }, [doctor, doctorId, addViewedDoctor]);

  if (!doctor) {
    return (
      <PatientLayout>
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Doctor Not Found</h1>
          <Button onClick={() => navigate('/patient/specialties')}>
            Back to Specialties
          </Button>
        </div>
      </PatientLayout>
    );
  }

  // Generate available time slots for the selected date
  const generateTimeSlots = () => {
    const slots = [];
    const today = format(selectedDate || new Date(), 'EEEE').toLowerCase();
    const schedule = doctor.schedule[today as keyof typeof doctor.schedule];
    
    if (!schedule?.available) return [];

    const [startHour, startMin] = schedule.start.split(':').map(Number);
    const [endHour, endMin] = schedule.end.split(':').map(Number);
    
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour + 1 < endHour || (hour + 1 === endHour && endMin >= 30)) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) return;
    
    checkBookingPermission(() => {
      // Here you would typically make an API call to book the appointment
      setShowConfirmation(true);
    });
  };

  const handleEmergencyRequest = () => {
    checkBookingPermission(() => {
      // Handle emergency request
      console.log('Emergency request submitted');
    });
  };

  return (
    <PatientLayout>
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          {isEmergency && (
            <Badge variant="destructive" className="bg-emergency">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Emergency Request
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Doctor Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Profile Card */}
            <Card className="animate-slide-up">
              <CardHeader>
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <img
                      src={doctor.photo}
                      alt={doctor.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                    />
                    {doctor.isEmergencyAvailable && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-emergency text-white rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-foreground mb-2">{doctor.name}</h1>
                    <p className="text-lg text-primary font-medium mb-4">{doctor.specialty}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{doctor.rating}</span>
                        <span className="text-sm text-muted-foreground">({doctor.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        <span className="text-sm">{doctor.experience} years experience</span>
                      </div>
                      <div className="text-right md:text-left">
                        <p className="text-sm text-muted-foreground">Consultation Fee</p>
                        <p className="text-xl font-bold text-primary">${doctor.consultationFee}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <Languages className="h-5 w-5 text-muted-foreground" />
                      <div className="flex gap-2">
                        {doctor.languages.map((lang) => (
                          <Badge key={lang} variant="secondary">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  {/* Bio */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">About</h3>
                    <p className="text-muted-foreground leading-relaxed">{doctor.bio}</p>
                  </div>

                  {/* Qualifications */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Qualifications</h3>
                    <div className="space-y-2">
                      {doctor.qualifications.map((qual, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-success" />
                          <span className="text-sm">{qual}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Schedule */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Weekly Schedule</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(doctor.schedule).map(([day, schedule]) => (
                        <div key={day} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                          <span className="font-medium capitalize">{day}</span>
                          <span className="text-sm text-muted-foreground">
                            {schedule.available 
                              ? `${schedule.start} - ${schedule.end}`
                              : 'Closed'
                            }
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Section */}
          <div className="space-y-6">
            <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {isEmergency ? 'Emergency Booking' : 'Book Appointment'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEmergency ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-emergency/10 border border-emergency/20 rounded-lg">
                      <p className="text-sm text-emergency font-medium mb-2">Emergency Request</p>
                      <p className="text-xs text-muted-foreground">
                        This will be prioritized and the doctor will be notified immediately.
                      </p>
                    </div>
                    <Button 
                      className="w-full bg-emergency hover:bg-emergency/90"
                      onClick={handleEmergencyRequest}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Submit Emergency Request
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Date Selection */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Select Date</label>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border"
                        disabled={(date) => date < new Date()}
                      />
                    </div>

                    {/* Time Selection */}
                    {selectedDate && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">Select Time</label>
                        {timeSlots.length > 0 ? (
                          <div className="grid grid-cols-2 gap-2">
                            {timeSlots.map((time) => (
                              <Button
                                key={time}
                                variant={selectedTime === time ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedTime(time)}
                                className="text-sm"
                              >
                                {time}
                              </Button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground p-4 border border-dashed rounded-lg text-center">
                            No available slots for this day
                          </p>
                        )}
                      </div>
                    )}

                    {/* Booking Summary */}
                    {selectedDate && selectedTime && (
                      <div className="p-4 bg-medical-light-blue/30 rounded-lg space-y-2">
                        <h4 className="font-medium">Booking Summary</h4>
                        <p className="text-sm text-muted-foreground">
                          Date: {format(selectedDate, 'PPP')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Time: {selectedTime}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Fee: ${doctor.consultationFee}
                        </p>
                      </div>
                    )}

                    <Button 
                      className="w-full" 
                      onClick={handleBooking}
                      disabled={!selectedDate || !selectedTime}
                    >
                      Book Appointment
                    </Button>
                  </div>
                )}

                {/* Contact Options */}
                <div className="border-t pt-4 space-y-2">
                  <h4 className="font-medium text-sm">Need help?</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Office
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {showConfirmation && selectedDate && doctor && (
        <BookingConfirmation
          doctorName={doctor.name}
          date={selectedDate}
          time={selectedTime}
          onClose={() => setShowConfirmation(false)}
          onViewAppointments={() => navigate('/patient/appointments')}
        />
      )}

      {/* Booking Protection for Guests */}
      <BookingProtection 
        open={showProtection} 
        onOpenChange={setShowProtection} 
      />
    </PatientLayout>
  );
}