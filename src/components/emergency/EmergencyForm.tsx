import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Upload, FileImage, Clock, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface EmergencyFormProps {
  doctorId: string;
  doctorName: string;
  specialty: string;
  onSubmit: () => void;
  onCancel: () => void;
}

export function EmergencyForm({ 
  doctorId, 
  doctorName, 
  specialty, 
  onSubmit, 
  onCancel 
}: EmergencyFormProps) {
  const [medicalDescription, setMedicalDescription] = useState('');
  const [medicalFile, setMedicalFile] = useState<File | null>(null);
  const [priorityLevel, setPriorityLevel] = useState(3);
  const [loading, setLoading] = useState(false);
  const [slotsAvailable, setSlotsAvailable] = useState<boolean | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  // Check emergency slot availability
  const checkSlotAvailability = async () => {
    try {
      const { data, error } = await supabase.rpc('check_emergency_slot_availability', {
        p_specialty: specialty
      });
      
      if (error) throw error;
      setSlotsAvailable(data);
      
      if (!data) {
        toast({
          title: "No Emergency Slots Available",
          description: "All emergency slots for today are full. Please try regular booking or contact the hospital directly.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error checking slot availability:', error);
      setSlotsAvailable(true); // Allow submission if check fails
    }
  };

  // Check slots when component mounts
  useEffect(() => {
    checkSlotAvailability();
  }, [specialty]);

  const handleFileUpload = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('medical-reports')
        .upload(fileName, file);

      if (error) throw error;
      return fileName;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "File Upload Failed",
        description: "Failed to upload medical report. You can still submit without it.",
        variant: "destructive"
      });
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!medicalDescription.trim()) {
      toast({
        title: "Description Required",
        description: "Please describe your medical condition or emergency.",
        variant: "destructive"
      });
      return;
    }

    if (slotsAvailable === false) {
      toast({
        title: "No Slots Available",
        description: "Emergency slots are full for today. Please contact the hospital directly.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      let fileUrl = null;
      
      // Upload medical file if provided
      if (medicalFile) {
        fileUrl = await handleFileUpload(medicalFile);
      }

      // Submit emergency request
      const { error: requestError } = await supabase
        .from('emergency_requests')
        .insert({
          patient_id: user?.id,
          doctor_id: doctorId,
          medical_description: medicalDescription,
          medical_report_url: fileUrl,
          priority_level: priorityLevel,
          message: `Emergency medical assistance requested for ${specialty} specialty`
        });

      if (requestError) throw requestError;

      // Increment emergency slot usage
      await supabase.rpc('increment_emergency_slot_usage', {
        p_specialty: specialty
      });

      toast({
        title: "Emergency Request Submitted",
        description: "Your emergency request has been sent to the doctor and admin for immediate review.",
      });

      onSubmit();
    } catch (error: any) {
      console.error('Error submitting emergency request:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit emergency request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (level: number) => {
    if (level >= 5) return 'bg-red-500';
    if (level >= 4) return 'bg-orange-500';
    if (level >= 3) return 'bg-yellow-500';
    if (level >= 2) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPriorityText = (level: number) => {
    if (level >= 5) return 'Critical';
    if (level >= 4) return 'High';
    if (level >= 3) return 'Medium';
    if (level >= 2) return 'Low';
    return 'Routine';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-400">
              Emergency Request
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              This will be sent immediately to the doctor and admin for urgent review
            </p>
          </div>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4" />
            <span className="font-medium">Dr. {doctorName}</span>
            <Badge variant="secondary">{specialty}</Badge>
          </div>
          {slotsAvailable === false && (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">No emergency slots available today</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Priority Level */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Priority Level *</Label>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <Button
                key={level}
                variant={priorityLevel === level ? "default" : "outline"}
                size="sm"
                onClick={() => setPriorityLevel(level)}
                className={`h-12 flex flex-col items-center justify-center ${
                  priorityLevel === level ? getPriorityColor(level) + ' text-white' : ''
                }`}
              >
                <span className="text-lg font-bold">{level}</span>
                <span className="text-xs">{getPriorityText(level)}</span>
              </Button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            5 = Life-threatening, 4 = Urgent, 3 = Semi-urgent, 2 = Less urgent, 1 = Non-urgent
          </p>
        </div>

        {/* Medical Description */}
        <div className="space-y-3">
          <Label htmlFor="medical-description" className="text-base font-semibold">
            Medical Case Description *
          </Label>
          <Textarea
            id="medical-description"
            value={medicalDescription}
            onChange={(e) => setMedicalDescription(e.target.value)}
            placeholder="Please describe your symptoms, current condition, and why you need emergency medical attention. Include any relevant medical history, medications, or immediate concerns."
            className="min-h-[120px] text-base"
            required
          />
          <p className="text-sm text-muted-foreground">
            Provide as much detail as possible to help the doctor assess your emergency
          </p>
        </div>

        {/* File Upload */}
        <div className="space-y-3">
          <Label htmlFor="medical-file" className="text-base font-semibold">
            Medical Report or Test Image
          </Label>
          <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
            <Input
              id="medical-file"
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              onChange={(e) => setMedicalFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <Label
              htmlFor="medical-file"
              className="cursor-pointer flex flex-col items-center gap-3 hover:bg-muted/50 rounded-lg p-4 transition-colors"
            >
              {medicalFile ? (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <FileImage className="h-6 w-6" />
                  <span className="font-medium">{medicalFile.name}</span>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Upload Medical Report</p>
                    <p className="text-sm text-muted-foreground">
                      Images, PDF, or document files (Optional)
                    </p>
                  </div>
                </>
              )}
            </Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Upload any relevant medical reports, test results, or images that might help the doctor
          </p>
        </div>

        {/* Warning */}
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-800 dark:text-amber-300 mb-1">
                For Life-Threatening Emergencies
              </p>
              <p className="text-amber-700 dark:text-amber-400">
                If you are experiencing a life-threatening emergency, please call emergency services immediately (911/999) 
                or visit the nearest emergency room. This system is for urgent medical consultations, not immediate life support.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSubmit}
            disabled={loading || !medicalDescription.trim() || slotsAvailable === false}
            className="flex-1 h-14 text-base font-semibold bg-red-600 hover:bg-red-700 text-white"
          >
            <AlertTriangle className="h-5 w-5 mr-2" />
            {loading ? 'Submitting Emergency Request...' : 'Submit Emergency Request'}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="h-14 px-8 text-base"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}