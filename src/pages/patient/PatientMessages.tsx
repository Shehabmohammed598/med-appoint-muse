import { PatientLayout } from '@/components/patient/PatientLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Mail } from 'lucide-react';

export function PatientMessages() {
  const { t } = useLanguage();

  return (
    <PatientLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('messages')}</h1>
          <p className="text-muted-foreground">{t('communicateWithDoctors')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {t('messageCenter')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <Mail className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('noMessages')}</h3>
            <p className="text-muted-foreground">{t('messagesWillAppearHere')}</p>
          </CardContent>
        </Card>
      </div>
    </PatientLayout>
  );
}