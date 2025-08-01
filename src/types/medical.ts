export interface Specialty {
  id: string;
  name: string;
  name_ar?: string;
  description: string;
  icon: string;
  doctorCount: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  photo: string;
  bio: string;
  experience: number;
  rating: number;
  reviewCount: number;
  schedule: {
    [key: string]: {
      start: string;
      end: string;
      available: boolean;
    };
  };
  languages: string[];
  qualifications: string[];
  isEmergencyAvailable: boolean;
  consultationFee: number;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  type: 'consultation' | 'emergency';
}