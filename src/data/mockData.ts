import { Specialty, Doctor } from '@/types/medical';

export const specialties: Specialty[] = [
  {
    id: '1',
    name: 'Dentistry',
    name_ar: 'طب الأسنان',
    description: 'Comprehensive dental care including preventive, restorative, and cosmetic treatments.',
    icon: '🦷',
    doctorCount: 3
  },
  {
    id: '2',
    name: 'Ophthalmology',
    name_ar: 'طب العيون',
    description: 'Eye care services including vision correction, eye disease treatment, and surgery.',
    icon: '👁️',
    doctorCount: 3
  },
  {
    id: '3',
    name: 'Internal Medicine',
    name_ar: 'الطب الباطني',
    description: 'Comprehensive care for adult diseases and preventive medicine.',
    icon: '🩺',
    doctorCount: 3
  },
  {
    id: '4',
    name: 'Pediatrics',
    name_ar: 'طب الأطفال',
    description: 'Specialized medical care for infants, children, and adolescents.',
    icon: '👶',
    doctorCount: 3
  },
  {
    id: '5',
    name: 'Cardiology',
    name_ar: 'طب القلب',
    description: 'Heart and cardiovascular system diagnosis, treatment, and prevention.',
    icon: '❤️',
    doctorCount: 3
  },
  {
    id: '6',
    name: 'Neurology',
    name_ar: 'طب الأعصاب',
    description: 'Treatment of disorders affecting the nervous system and brain.',
    icon: '🧠',
    doctorCount: 3
  },
  {
    id: '7',
    name: 'Dermatology',
    name_ar: 'طب الجلدية',
    description: 'Skin, hair, and nail health treatment and cosmetic procedures.',
    icon: '🧴',
    doctorCount: 3
  },
  {
    id: '8',
    name: 'Orthopedics',
    name_ar: 'طب العظام',
    description: 'Bone, joint, and musculoskeletal system treatment and surgery.',
    icon: '🦴',
    doctorCount: 3
  }
];

export const doctors: Doctor[] = [
  // Dentistry
  {
    id: 'd1',
    name: 'Dr. Ahmed Ali',
    specialty: 'Dentistry',
    photo: 'https://randomuser.me/api/portraits/men/1.jpg',
    bio: 'Experienced dentist specializing in cosmetic procedures and preventative care. Expert in dental implants and smile makeovers with over 8 years of experience.',
    experience: 8,
    rating: 4.9,
    reviewCount: 127,
    schedule: {
      monday: { start: '09:00', end: '17:00', available: true },
      tuesday: { start: '09:00', end: '17:00', available: true },
      wednesday: { start: '09:00', end: '17:00', available: true },
      thursday: { start: '09:00', end: '17:00', available: true },
      friday: { start: '09:00', end: '17:00', available: true },
      saturday: { start: '09:00', end: '13:00', available: true },
      sunday: { start: '00:00', end: '00:00', available: false }
    },
    languages: ['Arabic', 'English', 'French'],
    qualifications: ['DDS - Damascus University', 'Cosmetic Dentistry Certification'],
    isEmergencyAvailable: true,
    consultationFee: 150
  },
  {
    id: 'd2',
    name: 'Dr. Mohamed Mojtaba',
    specialty: 'Dentistry',
    photo: 'https://randomuser.me/api/portraits/men/2.jpg',
    bio: 'Specializing in oral surgery and dental implants with over 12 years of experience. Expert in complex dental procedures and patient care.',
    experience: 12,
    rating: 4.8,
    reviewCount: 89,
    schedule: {
      monday: { start: '08:00', end: '16:00', available: true },
      tuesday: { start: '08:00', end: '16:00', available: true },
      wednesday: { start: '08:00', end: '16:00', available: true },
      thursday: { start: '08:00', end: '16:00', available: true },
      friday: { start: '08:00', end: '16:00', available: true },
      saturday: { start: '00:00', end: '00:00', available: false },
      sunday: { start: '00:00', end: '00:00', available: false }
    },
    languages: ['Arabic', 'English'],
    qualifications: ['DDS - Cairo University', 'Oral Surgery Residency'],
    isEmergencyAvailable: false,
    consultationFee: 200
  },
  {
    id: 'd3',
    name: 'Dr. Abdallah Alshikh',
    specialty: 'Dentistry',
    photo: 'https://randomuser.me/api/portraits/men/3.jpg',
    bio: 'Expert in pediatric dentistry and orthodontics with a gentle approach for all ages. Specializes in children dental care and anxiety management.',
    experience: 11,
    rating: 4.7,
    reviewCount: 95,
    schedule: {
      monday: { start: '10:00', end: '18:00', available: true },
      tuesday: { start: '10:00', end: '18:00', available: true },
      wednesday: { start: '10:00', end: '18:00', available: true },
      thursday: { start: '10:00', end: '18:00', available: true },
      friday: { start: '10:00', end: '18:00', available: true },
      saturday: { start: '08:00', end: '14:00', available: true },
      sunday: { start: '00:00', end: '00:00', available: false }
    },
    languages: ['Arabic', 'English', 'Turkish'],
    qualifications: ['DDS - University of Aleppo', 'Pediatric Dentistry Residency'],
    isEmergencyAvailable: true,
    consultationFee: 175
  },
  // Ophthalmology
  {
    id: 'd4',
    name: 'Dr. Hind Yusuf',
    specialty: 'Ophthalmology',
    photo: 'https://randomuser.me/api/portraits/women/4.jpg',
    bio: 'Specialist in retinal diseases and LASIK surgery with cutting-edge technology. Expert in advanced eye care and vision correction procedures.',
    experience: 10,
    rating: 4.9,
    reviewCount: 156,
    schedule: {
      monday: { start: '08:30', end: '17:30', available: true },
      tuesday: { start: '08:30', end: '17:30', available: true },
      wednesday: { start: '08:30', end: '17:30', available: true },
      thursday: { start: '08:30', end: '17:30', available: true },
      friday: { start: '08:30', end: '17:30', available: true },
      saturday: { start: '09:00', end: '14:00', available: true },
      sunday: { start: '00:00', end: '00:00', available: false }
    },
    languages: ['Arabic', 'English', 'French'],
    qualifications: ['MD - Damascus University', 'Ophthalmology Residency', 'Retinal Surgery Fellowship'],
    isEmergencyAvailable: true,
    consultationFee: 250
  },
  {
    id: 'd5',
    name: 'Dr. Ahmed Mahmoud',
    specialty: 'Ophthalmology',
    photo: 'https://randomuser.me/api/portraits/men/5.jpg',
    bio: 'Cornea specialist with expertise in cataract surgery and corneal transplants. Leading expert in complex eye surgeries.',
    experience: 14,
    rating: 4.8,
    reviewCount: 132,
    schedule: {
      monday: { start: '09:00', end: '17:00', available: true },
      tuesday: { start: '09:00', end: '17:00', available: true },
      wednesday: { start: '09:00', end: '17:00', available: true },
      thursday: { start: '09:00', end: '17:00', available: true },
      friday: { start: '09:00', end: '17:00', available: true },
      saturday: { start: '00:00', end: '00:00', available: false },
      sunday: { start: '00:00', end: '00:00', available: false }
    },
    languages: ['Arabic', 'English'],
    qualifications: ['MD - Cairo University', 'Ophthalmology Residency', 'Cornea Fellowship'],
    isEmergencyAvailable: false,
    consultationFee: 275
  },
  {
    id: 'd6',
    name: 'Dr. Fatima Al-Zahra',
    specialty: 'Ophthalmology',
    photo: 'https://randomuser.me/api/portraits/women/6.jpg',
    bio: 'Pediatric ophthalmologist specializing in children\'s vision problems and strabismus. Dedicated to providing gentle care for young patients.',
    experience: 7,
    rating: 4.9,
    reviewCount: 87,
    schedule: {
      monday: { start: '08:00', end: '16:00', available: true },
      tuesday: { start: '08:00', end: '16:00', available: true },
      wednesday: { start: '08:00', end: '16:00', available: true },
      thursday: { start: '08:00', end: '16:00', available: true },
      friday: { start: '08:00', end: '16:00', available: true },
      saturday: { start: '09:00', end: '13:00', available: true },
      sunday: { start: '00:00', end: '00:00', available: false }
    },
    languages: ['Arabic', 'English'],
    qualifications: ['MD - Baghdad University', 'Pediatric Ophthalmology Fellowship'],
    isEmergencyAvailable: true,
    consultationFee: 230
  },
  // Internal Medicine
  {
    id: 'd7',
    name: 'Dr. Omar Hassan',
    specialty: 'Internal Medicine',
    photo: 'https://randomuser.me/api/portraits/men/7.jpg',
    bio: 'Board-certified internist focusing on preventive care and chronic disease management. Expert in diabetes and hypertension treatment.',
    experience: 15,
    rating: 4.7,
    reviewCount: 203,
    schedule: {
      monday: { start: '07:00', end: '19:00', available: true },
      tuesday: { start: '07:00', end: '19:00', available: true },
      wednesday: { start: '07:00', end: '19:00', available: true },
      thursday: { start: '07:00', end: '19:00', available: true },
      friday: { start: '07:00', end: '19:00', available: true },
      saturday: { start: '08:00', end: '16:00', available: true },
      sunday: { start: '10:00', end: '16:00', available: true }
    },
    languages: ['Arabic', 'English'],
    qualifications: ['MD - University of Damascus', 'Internal Medicine Board Certification'],
    isEmergencyAvailable: true,
    consultationFee: 180
  },
  {
    id: 'd8',
    name: 'Dr. Amina Khalil',
    specialty: 'Internal Medicine',
    photo: 'https://randomuser.me/api/portraits/women/8.jpg',
    bio: 'Internal medicine physician with expertise in diabetes management and hypertension. Specialized in women\'s health and preventive medicine.',
    experience: 12,
    rating: 4.6,
    reviewCount: 167,
    schedule: {
      monday: { start: '08:00', end: '18:00', available: true },
      tuesday: { start: '08:00', end: '18:00', available: true },
      wednesday: { start: '08:00', end: '18:00', available: true },
      thursday: { start: '08:00', end: '18:00', available: true },
      friday: { start: '08:00', end: '18:00', available: true },
      saturday: { start: '09:00', end: '15:00', available: true },
      sunday: { start: '00:00', end: '00:00', available: false }
    },
    languages: ['Arabic', 'English', 'French'],
    qualifications: ['MD - American University of Beirut', 'Internal Medicine Board Certification'],
    isEmergencyAvailable: true,
    consultationFee: 190
  },
  {
    id: 'd9',
    name: 'Dr. Khalid Al-Rashid',
    specialty: 'Internal Medicine',
    photo: 'https://randomuser.me/api/portraits/men/9.jpg',
    bio: 'Primary care physician focusing on geriatric medicine and preventive healthcare. Expert in managing complex medical conditions in elderly patients.',
    experience: 20,
    rating: 4.8,
    reviewCount: 245,
    schedule: {
      monday: { start: '07:30', end: '17:30', available: true },
      tuesday: { start: '07:30', end: '17:30', available: true },
      wednesday: { start: '07:30', end: '17:30', available: true },
      thursday: { start: '07:30', end: '17:30', available: true },
      friday: { start: '07:30', end: '17:30', available: true },
      saturday: { start: '08:00', end: '14:00', available: true },
      sunday: { start: '00:00', end: '00:00', available: false }
    },
    languages: ['Arabic', 'English'],
    qualifications: ['MD - King Saud University', 'Geriatric Medicine Fellowship'],
    isEmergencyAvailable: false,
    consultationFee: 200
  },
  // Pediatrics
  {
    id: 'd10',
    name: 'Dr. Layla Nasser',
    specialty: 'Pediatrics',
    photo: 'https://randomuser.me/api/portraits/women/10.jpg',
    bio: 'Pediatrician with special interest in developmental pediatrics and adolescent medicine. Passionate about children\'s health and family care.',
    experience: 9,
    rating: 4.9,
    reviewCount: 174,
    schedule: {
      monday: { start: '08:00', end: '18:00', available: true },
      tuesday: { start: '08:00', end: '18:00', available: true },
      wednesday: { start: '08:00', end: '18:00', available: true },
      thursday: { start: '08:00', end: '18:00', available: true },
      friday: { start: '08:00', end: '18:00', available: true },
      saturday: { start: '09:00', end: '15:00', available: true },
      sunday: { start: '00:00', end: '00:00', available: false }
    },
    languages: ['Arabic', 'English'],
    qualifications: ['MD - University of Damascus', 'Pediatrics Board Certification', 'Developmental Pediatrics Fellowship'],
    isEmergencyAvailable: true,
    consultationFee: 160
  },
  {
    id: 'd11',
    name: 'Dr. Yusuf Al-Mansouri',
    specialty: 'Pediatrics',
    photo: 'https://randomuser.me/api/portraits/men/11.jpg',
    bio: 'Pediatric emergency medicine specialist with extensive experience in acute care. Expert in pediatric emergencies and critical care.',
    experience: 13,
    rating: 4.7,
    reviewCount: 134,
    schedule: {
      monday: { start: '10:00', end: '20:00', available: true },
      tuesday: { start: '10:00', end: '20:00', available: true },
      wednesday: { start: '10:00', end: '20:00', available: true },
      thursday: { start: '10:00', end: '20:00', available: true },
      friday: { start: '10:00', end: '20:00', available: true },
      saturday: { start: '12:00', end: '18:00', available: true },
      sunday: { start: '12:00', end: '18:00', available: true }
    },
    languages: ['Arabic', 'English'],
    qualifications: ['MD - University of Aleppo', 'Pediatric Emergency Medicine Fellowship'],
    isEmergencyAvailable: true,
    consultationFee: 180
  },
  {
    id: 'd12',
    name: 'Dr. Mariam Qasemi',
    specialty: 'Pediatrics',
    photo: 'https://randomuser.me/api/portraits/women/12.jpg',
    bio: 'Pediatric pulmonologist specializing in asthma and respiratory conditions in children. Expert in childhood respiratory disorders.',
    experience: 16,
    rating: 4.8,
    reviewCount: 98,
    schedule: {
      monday: { start: '09:00', end: '17:00', available: true },
      tuesday: { start: '09:00', end: '17:00', available: true },
      wednesday: { start: '09:00', end: '17:00', available: true },
      thursday: { start: '09:00', end: '17:00', available: true },
      friday: { start: '09:00', end: '17:00', available: true },
      saturday: { start: '00:00', end: '00:00', available: false },
      sunday: { start: '00:00', end: '00:00', available: false }
    },
    languages: ['Arabic', 'English', 'Persian'],
    qualifications: ['MD - Tehran University', 'Pediatric Pulmonology Fellowship'],
    isEmergencyAvailable: false,
    consultationFee: 210
  },
  // Cardiology
  {
    id: 'd13',
    name: 'Dr. Samir Abdel-Rahman',
    specialty: 'Cardiology',
    photo: 'https://randomuser.me/api/portraits/men/13.jpg',
    bio: 'Interventional cardiologist specializing in minimally invasive cardiac procedures. Leader in advanced cardiac interventions.',
    experience: 18,
    rating: 4.8,
    reviewCount: 98,
    schedule: {
      monday: { start: '07:30', end: '18:30', available: true },
      tuesday: { start: '07:30', end: '18:30', available: true },
      wednesday: { start: '07:30', end: '18:30', available: true },
      thursday: { start: '07:30', end: '18:30', available: true },
      friday: { start: '07:30', end: '18:30', available: true },
      saturday: { start: '00:00', end: '00:00', available: false },
      sunday: { start: '00:00', end: '00:00', available: false }
    },
    languages: ['Arabic', 'English'],
    qualifications: ['MD - Cairo University', 'Cardiology Fellowship', 'Interventional Cardiology Fellowship'],
    isEmergencyAvailable: true,
    consultationFee: 300
  },
  {
    id: 'd14',
    name: 'Dr. Nadia Al-Khoury',
    specialty: 'Cardiology',
    photo: 'https://randomuser.me/api/portraits/women/14.jpg',
    bio: 'Non-invasive cardiologist with expertise in echocardiography and stress testing. Specialized in preventive cardiology.',
    experience: 11,
    rating: 4.7,
    reviewCount: 112,
    schedule: {
      monday: { start: '08:30', end: '17:30', available: true },
      tuesday: { start: '08:30', end: '17:30', available: true },
      wednesday: { start: '08:30', end: '17:30', available: true },
      thursday: { start: '08:30', end: '17:30', available: true },
      friday: { start: '08:30', end: '17:30', available: true },
      saturday: { start: '09:00', end: '13:00', available: true },
      sunday: { start: '00:00', end: '00:00', available: false }
    },
    languages: ['Arabic', 'English', 'French'],
    qualifications: ['MD - American University of Beirut', 'Cardiology Fellowship', 'Echocardiography Certification'],
    isEmergencyAvailable: true,
    consultationFee: 280
  },
  {
    id: 'd15',
    name: 'Dr. Hassan Al-Baghdadi',
    specialty: 'Cardiology',
    photo: 'https://randomuser.me/api/portraits/men/15.jpg',
    bio: 'Cardiac electrophysiologist specializing in arrhythmia treatment and pacemaker implantation. Expert in complex cardiac rhythm disorders.',
    experience: 19,
    rating: 4.9,
    reviewCount: 76,
    schedule: {
      monday: { start: '07:00', end: '16:00', available: true },
      tuesday: { start: '07:00', end: '16:00', available: true },
      wednesday: { start: '07:00', end: '16:00', available: true },
      thursday: { start: '07:00', end: '16:00', available: true },
      friday: { start: '07:00', end: '16:00', available: true },
      saturday: { start: '00:00', end: '00:00', available: false },
      sunday: { start: '00:00', end: '00:00', available: false }
    },
    languages: ['Arabic', 'English'],
    qualifications: ['MD - University of Baghdad', 'Electrophysiology Fellowship', 'Advanced Cardiac Life Support'],
    isEmergencyAvailable: false,
    consultationFee: 350
  }
];

// Helper function to get doctors by specialty
export const getDoctorsBySpecialty = (specialty: string): Doctor[] => {
  return doctors.filter(doctor => doctor.specialty === specialty);
};

// Helper function to get doctor by ID
export const getDoctorById = (id: string): Doctor | undefined => {
  return doctors.find(doctor => doctor.id === id);
};

// Helper function to get specialty by name
export const getSpecialtyByName = (name: string): Specialty | undefined => {
  return specialties.find(specialty => specialty.name === name);
};