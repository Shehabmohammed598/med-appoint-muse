import { GuestSafeLayout } from '@/components/layouts/GuestSafeLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { useGuest } from '@/contexts/GuestContext';
import { specialties } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';

export function PatientSpecialties() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { addBrowsedSpecialty } = useGuest();

  const handleSpecialtyClick = (specialtyName: string) => {
    addBrowsedSpecialty(specialtyName);
    navigate(`/patient/doctors/${encodeURIComponent(specialtyName)}`);
  };

  return (
    <GuestSafeLayout>
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Medical Specialties</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our comprehensive range of medical specialties to find the right healthcare professional for your needs.
          </p>
        </div>

        {/* Specialties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {specialties.map((specialty, index) => (
            <Card
              key={specialty.id}
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-border/50 bg-card/50 backdrop-blur-sm animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleSpecialtyClick(specialty.name)}
            >
              <CardContent className="p-6 text-center space-y-4">
                {/* Icon */}
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {specialty.icon}
                </div>

                {/* Specialty Name */}
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {specialty.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed min-h-[60px]">
                  {specialty.description}
                </p>

                {/* Doctor Count */}
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{specialty.doctorCount} doctors available</span>
                </div>

                {/* Arrow */}
                <div className="flex justify-center pt-2">
                  <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="bg-medical-light-blue/30 rounded-lg p-6 mt-12 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Need Help Choosing?
          </h3>
          <p className="text-muted-foreground">
            Our medical team is here to help you find the right specialist for your specific needs. 
            Contact our support team for personalized recommendations.
          </p>
        </div>
      </div>
    </GuestSafeLayout>
  );
}