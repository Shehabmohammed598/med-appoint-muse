import { CheckCircle, Calendar, Clock, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface BookingConfirmationProps {
  doctorName: string;
  date: Date;
  time: string;
  onClose: () => void;
  onViewAppointments: () => void;
}

export function BookingConfirmation({ 
  doctorName, 
  date, 
  time, 
  onClose, 
  onViewAppointments 
}: BookingConfirmationProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md animate-scale-in">
        <CardContent className="p-6 text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </div>

          {/* Title */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Appointment Confirmed!
            </h2>
            <p className="text-muted-foreground">
              Your appointment has been successfully booked
            </p>
          </div>

          {/* Appointment Details */}
          <div className="bg-medical-light-blue/30 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <User className="h-4 w-4 text-primary" />
              <span className="font-medium">{doctorName}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{format(date, 'EEEE, MMMM do, yyyy')}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span>{time}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button onClick={onViewAppointments} className="flex-1">
              View Appointments
            </Button>
          </div>

          {/* Note */}
          <p className="text-xs text-muted-foreground">
            You will receive a confirmation email and SMS shortly
          </p>
        </CardContent>
      </Card>
    </div>
  );
}