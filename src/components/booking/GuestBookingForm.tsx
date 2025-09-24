import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Calendar as CalendarIcon, Clock, User, Phone, Stethoscope, FileText } from 'lucide-react';
import { format, addDays, isWeekend } from 'date-fns';
import { cn } from '@/lib/utils';

const specialties = [
  'Cardiology',
  'Dermatology', 
  'Endocrinology',
  'Family Medicine',
  'Gastroenterology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Radiology'
];

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

export default function GuestBookingForm() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || isWeekend(date);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }
    
    if (!phoneNumber.trim()) {
      toast({
        title: "Validation Error", 
        description: "Please enter your phone number.",
        variant: "destructive",
      });
      return;
    }
    
    if (!specialty) {
      toast({
        title: "Validation Error",
        description: "Please select a specialty.",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedDate) {
      toast({
        title: "Validation Error",
        description: "Please select an appointment date.",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedTime) {
      toast({
        title: "Validation Error",
        description: "Please select an appointment time.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('guest_bookings')
        .insert([
          {
            full_name: fullName.trim(),
            phone_number: phoneNumber.trim(),
            specialty,
            appointment_date: format(selectedDate, 'yyyy-MM-dd'),
            appointment_time: selectedTime,
            notes: notes.trim() || null,
          }
        ]);

      if (error) {
        console.error('Booking error:', error);
        toast({
          title: "Booking Failed",
          description: "Failed to create your appointment. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Booking Confirmed!",
          description: "Your appointment has been scheduled successfully.",
        });
        
        // Navigate to confirmation page with booking details
        navigate('/booking-confirmation', {
          state: {
            fullName,
            phoneNumber,
            specialty,
            appointmentDate: format(selectedDate, 'MMMM dd, yyyy'),
            appointmentTime: selectedTime,
            notes
          }
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="space-y-4 pb-8">
          <div className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
              <Stethoscope className="h-8 w-8 text-primary" />
              Book Appointment
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Schedule your appointment with our healthcare professionals
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="h-12"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter your phone number"
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Appointment Details
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="specialty">Medical Specialty *</Label>
                  <Select value={specialty} onValueChange={setSpecialty}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select a specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Appointment Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal h-12",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={isDateDisabled}
                          fromDate={addDays(new Date(), 1)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Appointment Time *</Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {time}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Additional Information
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional information or special requests..."
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium" 
              disabled={loading}
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}