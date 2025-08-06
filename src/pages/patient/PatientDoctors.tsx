import { GuestSafeLayout } from '@/components/layouts/GuestSafeLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getDoctorsBySpecialty, getSpecialtyByName } from '@/data/mockData';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  Languages, 
  AlertTriangle, 
  Calendar,
  ArrowLeft,
  MapPin,
  Award
} from 'lucide-react';

export function PatientDoctors() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { specialty } = useParams<{ specialty: string }>();
  
  const specialtyName = specialty ? decodeURIComponent(specialty) : '';
  const doctors = getDoctorsBySpecialty(specialtyName);
  const specialtyInfo = getSpecialtyByName(specialtyName);

  const handleDoctorClick = (doctorId: string) => {
    navigate(`/patient/doctor/${doctorId}`);
  };

  const handleBookAppointment = (doctorId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/patient/doctor/${doctorId}?book=true`);
  };

  const handleEmergencyRequest = (doctorId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/patient/doctor/${doctorId}?emergency=true`);
  };

  return (
    <GuestSafeLayout>
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/patient/specialties')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Specialties
          </Button>
        </div>

        {/* Specialty Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="text-6xl mb-4">{specialtyInfo?.icon}</div>
          <h1 className="text-4xl font-bold text-foreground">{specialtyName} Specialists</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {specialtyInfo?.description}
          </p>
          <div className="text-sm text-muted-foreground">
            {doctors.length} doctors available
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {doctors.map((doctor, index) => (
            <Card
              key={doctor.id}
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-border/50 bg-card/50 backdrop-blur-sm animate-slide-up"
              style={{ animationDelay: `${index * 150}ms` }}
              onClick={() => handleDoctorClick(doctor.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  {/* Doctor Photo */}
                  <div className="relative">
                    <img
                      src={doctor.photo}
                      alt={doctor.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-primary/20 group-hover:border-primary/40 transition-colors"
                    />
                    {doctor.isEmergencyAvailable && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-emergency text-white rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-3 w-3" />
                      </div>
                    )}
                  </div>

                  {/* Doctor Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                    
                    {/* Rating and Experience */}
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">{doctor.rating}</span>
                        <span className="text-sm text-muted-foreground">({doctor.reviewCount})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4 text-primary" />
                        <span className="text-sm text-muted-foreground">{doctor.experience} years</span>
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="flex items-center gap-2 mt-2">
                      <Languages className="h-4 w-4 text-muted-foreground" />
                      <div className="flex gap-1">
                        {doctor.languages.map((lang) => (
                          <Badge key={lang} variant="secondary" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Consultation Fee */}
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Consultation Fee</p>
                    <p className="text-lg font-semibold text-primary">${doctor.consultationFee}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Bio */}
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {doctor.bio}
                </p>

                {/* Schedule Preview */}
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Available: Mon-Fri {doctor.schedule.monday.start} - {doctor.schedule.friday.end}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button 
                    className="flex-1"
                    onClick={(e) => handleBookAppointment(doctor.id, e)}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                  
                  {doctor.isEmergencyAvailable && (
                    <Button
                      variant="outline"
                      className="border-emergency text-emergency hover:bg-emergency hover:text-white"
                      onClick={(e) => handleEmergencyRequest(doctor.id, e)}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Emergency
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Doctors Message */}
        {doctors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No doctors found
            </h3>
            <p className="text-muted-foreground">
              We're currently updating our {specialtyName} specialists. Please check back soon or contact support.
            </p>
          </div>
        )}
      </div>
    </GuestSafeLayout>
  );
}