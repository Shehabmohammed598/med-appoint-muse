import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, Users, Shield, Heart, Clock, Star } from 'lucide-react';

const Index = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Calendar,
      title: t('appointmentBooking'),
      description: t('easyOnlineBooking')
    },
    {
      icon: Users,
      title: t('doctorPatientPortal'),
      description: t('dedicatedPortals')
    },
    {
      icon: Shield,
      title: t('secureHealthRecords'),
      description: t('hipaaCompliant')
    }
  ];

  const stats = [
    { number: '500+', label: t('patients') },
    { number: '50+', label: t('doctors') },
    { number: '10,000+', label: t('appointments') },
    { number: '99.9%', label: t('uptime') }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">HealthCare</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              {t('contact')}
            </Link>
            <LanguageToggle />
            <ThemeToggle />
            <Button asChild variant="outline">
              <Link to="/admin-login">{t('signIn')}</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t('modernHealthcare')} <span className="text-primary">{t('management')}</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('comprehensiveHealthcarePlatform')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/book-appointment">
                <Calendar className="mr-2 h-5 w-5" />
                {t('getStarted')}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">{t('learnMore')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('whyChooseUs')}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('advancedFeaturesForModernHealthcare')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portal Access Section */}
      <section className="py-20 bg-muted/50 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('accessYourPortal')}</h2>
            <p className="text-xl text-muted-foreground">{t('selectPortalType')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <CardTitle>{t('patientPortal')}</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <p className="text-muted-foreground mb-4">{t('bookAppointmentsViewRecords')}</p>
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link to="/patient-auth">Patient Login</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/book-appointment">Book as Guest</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Clock className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <CardTitle>{t('doctorPortal')}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">{t('managePatientsAppointments')}</p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/admin-login">{t('doctorLogin')}</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <CardTitle>{t('adminPortal')}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">{t('systemAdministration')}</p>
                <Button asChild variant="destructive" className="w-full">
                  <Link to="/admin-login">{t('adminLogin')}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">HealthCare</span>
              </div>
              <p className="text-muted-foreground">{t('modernHealthcareSolution')}</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{t('quickLinks')}</h4>
              <div className="space-y-2">
                <Link to="/" className="block text-muted-foreground hover:text-foreground">
                  {t('signIn')}
                </Link>
                <Link to="/contact" className="block text-muted-foreground hover:text-foreground">
                  {t('contact')}
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{t('portals')}</h4>
              <div className="space-y-2">
                <Link to="/" className="block text-muted-foreground hover:text-foreground">
                  {t('patientPortal')}
                </Link>
                <Link to="/" className="block text-muted-foreground hover:text-foreground">
                  {t('doctorPortal')}
                </Link>
                <Link to="/" className="block text-muted-foreground hover:text-foreground">
                  {t('adminPortal')}
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{t('contact')}</h4>
              <div className="space-y-2 text-muted-foreground">
                <p>+1 (555) 123-4567</p>
                <p>info@healthcare.com</p>
                <p>123 Medical Center Dr</p>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 HealthCare. {t('allRightsReserved')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
