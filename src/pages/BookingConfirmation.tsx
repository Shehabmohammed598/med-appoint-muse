import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Calendar, Clock, User, Phone, Stethoscope, FileText, Home } from 'lucide-react';

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state;

  // Redirect if no booking details
  if (!bookingDetails) {
    navigate('/');
    return null;
  }

  const { fullName, phoneNumber, specialty, appointmentDate, appointmentTime, notes } = bookingDetails;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="space-y-4 pb-8 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-green-600 dark:text-green-400">
            Booking Confirmed!
          </CardTitle>
          <p className="text-lg text-muted-foreground">
            Your appointment has been successfully scheduled
          </p>
        </CardHeader>
        
        <CardContent className="px-8 pb-8 space-y-6">
          {/* Booking Details */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b pb-2">Appointment Details</h3>
            
            <div className="grid gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Patient Name</p>
                  <p className="font-medium">{fullName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="font-medium">{phoneNumber}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Stethoscope className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Medical Specialty</p>
                  <p className="font-medium">{specialty}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{appointmentDate}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{appointmentTime}</p>
                </div>
              </div>
              
              {notes && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <FileText className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="font-medium">{notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Important Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b pb-2">Important Information</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Please arrive 15 minutes before your scheduled appointment time</p>
              <p>• Bring a valid ID and any relevant medical documents</p>
              <p>• If you need to cancel or reschedule, please contact us at least 24 hours in advance</p>
              <p>• Our medical staff will contact you if any changes are needed</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button asChild className="flex-1 h-12">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 h-12"
              onClick={() => navigate('/book-appointment')}
            >
              Book Another Appointment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}