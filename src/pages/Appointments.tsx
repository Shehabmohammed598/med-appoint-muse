import { useState } from 'react';
import { useAppointments } from '@/hooks/useAppointments';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, User, Edit } from 'lucide-react';

export default function Appointments() {
  const { appointments, getTodayAppointments, getUpcomingAppointments, getCompletedAppointments, updateAppointmentStatus } = useAppointments();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const todayAppointments = getTodayAppointments();
  const upcomingAppointments = getUpcomingAppointments();
  const completedAppointments = getCompletedAppointments();

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: 'default',
      completed: 'secondary',
      canceled: 'destructive',
      no_show: 'outline',
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {t(`status.${status}`)}
      </Badge>
    );
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    const { error } = await updateAppointmentStatus(appointmentId, newStatus);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update appointment status",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Appointment status updated successfully",
      });
    }
  };

  const handleNotesUpdate = async () => {
    if (!selectedAppointment) return;

    const { error } = await updateAppointmentStatus(selectedAppointment.id, selectedAppointment.status, notes);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update notes",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Notes updated successfully",
      });
      setIsEditingNotes(false);
    }
  };

  const openPatientDialog = (appointment: any) => {
    setSelectedAppointment(appointment);
    setNotes(appointment.notes || '');
    setIsEditingNotes(false);
  };

  const AppointmentTable = ({ appointments }: { appointments: any[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('appointments.patient')}</TableHead>
          <TableHead>{t('appointments.time')}</TableHead>
          <TableHead>{t('appointments.status')}</TableHead>
          <TableHead>{t('appointments.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((appointment) => (
          <TableRow key={appointment.id}>
            <TableCell>
              <div>
                <div className="font-medium">
                  {appointment.patient_profile?.first_name} {appointment.patient_profile?.last_name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {appointment.patient_profile?.phone}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <div>{appointment.appointment_date}</div>
                <div className="text-sm text-muted-foreground">
                  {appointment.appointment_time}
                </div>
              </div>
            </TableCell>
            <TableCell>
              {getStatusBadge(appointment.status)}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openPatientDialog(appointment)}
                    >
                      <User className="h-4 w-4 mr-1" />
                      {t('actions.view')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t('patient.info')}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>{t('patient.name')}</Label>
                        <p>{selectedAppointment?.patient_profile?.first_name} {selectedAppointment?.patient_profile?.last_name}</p>
                      </div>
                      <div>
                        <Label>{t('patient.phone')}</Label>
                        <p>{selectedAppointment?.patient_profile?.phone}</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <Label>{t('appointments.notes')}</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditingNotes(!isEditingNotes)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            {t('actions.edit')}
                          </Button>
                        </div>
                        {isEditingNotes ? (
                          <div className="space-y-2 mt-2">
                            <Textarea
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="Add notes..."
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={handleNotesUpdate}>
                                {t('actions.save')}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => setIsEditingNotes(false)}
                              >
                                {t('actions.close')}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="mt-2">{selectedAppointment?.notes || 'No notes'}</p>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                {appointment.status === 'scheduled' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {t('actions.complete')}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleStatusUpdate(appointment.id, 'canceled')}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      {t('actions.cancel')}
                    </Button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">{t('appointments.title')}</h1>
        
        <Tabs defaultValue="today" className="space-y-4">
          <TabsList>
            <TabsTrigger value="today">{t('appointments.today')}</TabsTrigger>
            <TabsTrigger value="upcoming">{t('appointments.upcoming')}</TabsTrigger>
            <TabsTrigger value="completed">{t('appointments.completed')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today">
            <Card>
              <CardHeader>
                <CardTitle>{t('appointments.today')}</CardTitle>
              </CardHeader>
              <CardContent>
                {todayAppointments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    {t('appointments.noAppointments')}
                  </p>
                ) : (
                  <AppointmentTable appointments={todayAppointments} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>{t('appointments.upcoming')}</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    {t('appointments.noAppointments')}
                  </p>
                ) : (
                  <AppointmentTable appointments={upcomingAppointments} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>{t('appointments.completed')}</CardTitle>
              </CardHeader>
              <CardContent>
                {completedAppointments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    {t('appointments.noAppointments')}
                  </p>
                ) : (
                  <AppointmentTable appointments={completedAppointments} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}