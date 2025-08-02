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
    doctorCount: 2
  },
  {
    id: '7',
    name: 'Dermatology',
    name_ar: 'طب الجلدية',
    description: 'Skin, hair, and nail health treatment and cosmetic procedures.',
    icon: '🧴',
    doctorCount: 2
  },
  {
    id: '8',
    name: 'Orthopedics',
    name_ar: 'طب العظام',
    description: 'Bone, joint, and musculoskeletal system treatment and surgery.',
    icon: '🦴',
    doctorCount: 2
  }
];

export const doctors: Doctor[] = [
  // Dentistry
  {
    id: 'd1',
    name: 'Dr. Emily Carter',
    specialty: 'Dentistry',
    photo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=300&fit=crop&crop=face',
    bio: 'Experienced dentist specializing in cosmetic procedures and preventative care. Passionate about patient comfort and education.',
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
    languages: ['English', 'Spanish'],
    qualifications: ['DDS - Harvard School of Dental Medicine', 'Cosmetic Dentistry Certification'],
    isEmergencyAvailable: true,
    consultationFee: 150
  },
  {
    id: 'd2',
    name: 'Dr. James Wilson',
    specialty: 'Dentistry',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face',
    bio: 'Specializing in oral surgery and dental implants with over 12 years of experience.',
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
    languages: ['English', 'French'],
    qualifications: ['DDS - University of Pennsylvania', 'Oral Surgery Residency'],
    isEmergencyAvailable: false,
    consultationFee: 200
  },
  // Ophthalmology
  {
    id: 'd3',
    name: 'Dr. Sarah Chen',
    specialty: 'Ophthalmology',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face',
    bio: 'Specialist in retinal diseases and LASIK surgery with cutting-edge technology.',
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
    languages: ['English', 'Mandarin'],
    qualifications: ['MD - Johns Hopkins', 'Ophthalmology Residency', 'Retinal Surgery Fellowship'],
    isEmergencyAvailable: true,
    consultationFee: 250
  },
  // Internal Medicine
  {
    id: 'd4',
    name: 'Dr. Michael Rodriguez',
    specialty: 'Internal Medicine',
    photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face',
    bio: 'Board-certified internist focusing on preventive care and chronic disease management.',
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
    languages: ['English', 'Spanish'],
    qualifications: ['MD - Stanford University', 'Internal Medicine Board Certification'],
    isEmergencyAvailable: true,
    consultationFee: 180
  },
  // Pediatrics
  {
    id: 'd5',
    name: 'Dr. Lisa Thompson',
    specialty: 'Pediatrics',
    photo: 'https://images.unsplash.com/photo-1594824717262-2d9ac7d7e74f?w=300&h=300&fit=crop&crop=face',
    bio: 'Pediatrician with special interest in developmental pediatrics and adolescent medicine.',
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
    languages: ['English', 'Portuguese'],
    qualifications: ['MD - University of California', 'Pediatrics Board Certification', 'Developmental Pediatrics Fellowship'],
    isEmergencyAvailable: true,
    consultationFee: 160
  },
  // Cardiology
  {
    id: 'd6',
    name: 'Dr. Robert Kim',
    specialty: 'Cardiology',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face',
    bio: 'Interventional cardiologist specializing in minimally invasive cardiac procedures.',
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
    languages: ['English', 'Korean'],
    qualifications: ['MD - Mayo Clinic', 'Cardiology Fellowship', 'Interventional Cardiology Fellowship'],
    isEmergencyAvailable: true,
    consultationFee: 300
  },
  // Additional Dentistry Doctor
  {
    id: 'd7',
    name: 'Dr. Maria Gonzalez',
    specialty: 'Dentistry',
    photo: 'https://images.unsplash.com/photo-1594824717262-2d9ac7d7e74f?w=300&h=300&fit=crop&crop=face',
    bio: 'Expert in pediatric dentistry and orthodontics with a gentle approach for all ages.',
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
    languages: ['English', 'Spanish', 'Portuguese'],
    qualifications: ['DDS - UCLA School of Dentistry', 'Pediatric Dentistry Residency'],
    isEmergencyAvailable: true,
    consultationFee: 175
  },
  // Additional Ophthalmology Doctors
  {
    id: 'd8',
    name: 'Dr. David Park',
    specialty: 'Ophthalmology',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face',
    bio: 'Cornea specialist with expertise in cataract surgery and corneal transplants.',
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
    languages: ['English', 'Korean', 'Japanese'],
    qualifications: ['MD - Harvard Medical School', 'Ophthalmology Residency', 'Cornea Fellowship'],
    isEmergencyAvailable: false,
    consultationFee: 275
  },
  {
    id: 'd9',
    name: 'Dr. Amanda Foster',
    specialty: 'Ophthalmology',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face',
    bio: 'Pediatric ophthalmologist specializing in children\'s vision problems and strabismus.',
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
    languages: ['English', 'French'],
    qualifications: ['MD - Columbia University', 'Pediatric Ophthalmology Fellowship'],
    isEmergencyAvailable: true,
    consultationFee: 230
  },
  // Additional Internal Medicine Doctors
  {
    id: 'd10',
    name: 'Dr. Jennifer Adams',
    specialty: 'Internal Medicine',
    photo: 'https://images.unsplash.com/photo-1594824717262-2d9ac7d7e74f?w=300&h=300&fit=crop&crop=face',
    bio: 'Internal medicine physician with expertise in diabetes management and hypertension.',
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
    languages: ['English', 'Arabic'],
    qualifications: ['MD - University of Michigan', 'Internal Medicine Board Certification'],
    isEmergencyAvailable: true,
    consultationFee: 190
  },
  {
    id: 'd11',
    name: 'Dr. Thomas Brown',
    specialty: 'Internal Medicine',
    photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face',
    bio: 'Primary care physician focusing on geriatric medicine and preventive healthcare.',
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
    languages: ['English', 'German'],
    qualifications: ['MD - Yale School of Medicine', 'Geriatric Medicine Fellowship'],
    isEmergencyAvailable: false,
    consultationFee: 200
  },
  // Additional Pediatrics Doctors
  {
    id: 'd12',
    name: 'Dr. Rachel Green',
    specialty: 'Pediatrics',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face',
    bio: 'Pediatric emergency medicine specialist with extensive experience in acute care.',
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
    languages: ['English', 'Italian'],
    qualifications: ['MD - Northwestern University', 'Pediatric Emergency Medicine Fellowship'],
    isEmergencyAvailable: true,
    consultationFee: 180
  },
  {
    id: 'd13',
    name: 'Dr. Kevin Lee',
    specialty: 'Pediatrics',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face',
    bio: 'Pediatric pulmonologist specializing in asthma and respiratory conditions in children.',
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
    languages: ['English', 'Mandarin'],
    qualifications: ['MD - University of Chicago', 'Pediatric Pulmonology Fellowship'],
    isEmergencyAvailable: false,
    consultationFee: 210
  },
  // Additional Cardiology Doctors
  {
    id: 'd14',
    name: 'Dr. Lisa Martinez',
    specialty: 'Cardiology',
    photo: 'https://images.unsplash.com/photo-1594824717262-2d9ac7d7e74f?w=300&h=300&fit=crop&crop=face',
    bio: 'Non-invasive cardiologist with expertise in echocardiography and stress testing.',
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
    languages: ['English', 'Spanish'],
    qualifications: ['MD - Emory University', 'Cardiology Fellowship', 'Echocardiography Certification'],
    isEmergencyAvailable: true,
    consultationFee: 280
  },
  {
    id: 'd15',
    name: 'Dr. Brian White',
    specialty: 'Cardiology',
    photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face',
    bio: 'Cardiac electrophysiologist specializing in arrhythmia treatment and pacemaker implantation.',
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
    languages: ['English', 'Russian'],
    qualifications: ['MD - Duke University', 'Electrophysiology Fellowship', 'Advanced Cardiac Life Support'],
    isEmergencyAvailable: false,
    consultationFee: 350
  },
  // Neurology Doctors
  {
    id: 'd16',
    name: 'Dr. Susan Clark',
    specialty: 'Neurology',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face',
    bio: 'Neurologist specializing in epilepsy and seizure disorders with advanced EEG expertise.',
    experience: 14,
    rating: 4.8,
    reviewCount: 89,
    schedule: {
      monday: { start: '09:00', end: '17:00', available: true },
      tuesday: { start: '09:00', end: '17:00', available: true },
      wednesday: { start: '09:00', end: '17:00', available: true },
      thursday: { start: '09:00', end: '17:00', available: true },
      friday: { start: '09:00', end: '17:00', available: true },
      saturday: { start: '00:00', end: '00:00', available: false },
      sunday: { start: '00:00', end: '00:00', available: false }
    },
    languages: ['English', 'French'],
    qualifications: ['MD - Boston University', 'Neurology Residency', 'Epilepsy Fellowship'],
    isEmergencyAvailable: true,
    consultationFee: 320
  },
  {
    id: 'd17',
    name: 'Dr. Mark Taylor',
    specialty: 'Neurology',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face',
    bio: 'Movement disorders specialist with expertise in Parkinson\'s disease and tremor treatment.',
    experience: 17,
    rating: 4.7,
    reviewCount: 67,
    schedule: {
      monday: { start: '08:00', end: '16:00', available: true },
      tuesday: { start: '08:00', end: '16:00', available: true },
      wednesday: { start: '08:00', end: '16:00', available: true },
      thursday: { start: '08:00', end: '16:00', available: true },
      friday: { start: '08:00', end: '16:00', available: true },
      saturday: { start: '09:00', end: '13:00', available: true },
      sunday: { start: '00:00', end: '00:00', available: false }
    },
    languages: ['English', 'German'],
    qualifications: ['MD - Washington University', 'Movement Disorders Fellowship'],
    isEmergencyAvailable: false,
    consultationFee: 300
  },
  // Dermatology Doctors
  {
    id: 'd18',
    name: 'Dr. Emma Wilson',
    specialty: 'Dermatology',
    photo: 'https://images.unsplash.com/photo-1594824717262-2d9ac7d7e74f?w=300&h=300&fit=crop&crop=face',
    bio: 'Dermatologist specializing in skin cancer detection and cosmetic dermatology procedures.',
    experience: 9,
    rating: 4.8,
    reviewCount: 145,
    schedule: {
      monday: { start: '10:00', end: '18:00', available: true },
      tuesday: { start: '10:00', end: '18:00', available: true },
      wednesday: { start: '10:00', end: '18:00', available: true },
      thursday: { start: '10:00', end: '18:00', available: true },
      friday: { start: '10:00', end: '18:00', available: true },
      saturday: { start: '09:00', end: '15:00', available: true },
      sunday: { start: '00:00', end: '00:00', available: false }
    },
    languages: ['English', 'Spanish'],
    qualifications: ['MD - University of Pennsylvania', 'Dermatology Residency', 'Mohs Surgery Fellowship'],
    isEmergencyAvailable: false,
    consultationFee: 220
  },
  {
    id: 'd19',
    name: 'Dr. Alex Johnson',
    specialty: 'Dermatology',
    photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face',
    bio: 'Pediatric dermatologist with expertise in childhood skin conditions and allergic reactions.',
    experience: 12,
    rating: 4.9,
    reviewCount: 103,
    schedule: {
      monday: { start: '08:30', end: '16:30', available: true },
      tuesday: { start: '08:30', end: '16:30', available: true },
      wednesday: { start: '08:30', end: '16:30', available: true },
      thursday: { start: '08:30', end: '16:30', available: true },
      friday: { start: '08:30', end: '16:30', available: true },
      saturday: { start: '00:00', end: '00:00', available: false },
      sunday: { start: '00:00', end: '00:00', available: false }
    },
    languages: ['English', 'Portuguese'],
    qualifications: ['MD - University of Florida', 'Pediatric Dermatology Fellowship'],
    isEmergencyAvailable: true,
    consultationFee: 200
  },
  // Orthopedics Doctors
  {
    id: 'd20',
    name: 'Dr. Chris Anderson',
    specialty: 'Orthopedics',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face',
    bio: 'Orthopedic surgeon specializing in sports medicine and arthroscopic surgery.',
    experience: 15,
    rating: 4.7,
    reviewCount: 87,
    schedule: {
      monday: { start: '07:00', end: '17:00', available: true },
      tuesday: { start: '07:00', end: '17:00', available: true },
      wednesday: { start: '07:00', end: '17:00', available: true },
      thursday: { start: '07:00', end: '17:00', available: true },
      friday: { start: '07:00', end: '17:00', available: true },
      saturday: { start: '08:00', end: '14:00', available: true },
      sunday: { start: '00:00', end: '00:00', available: false }
    },
    languages: ['English', 'Spanish'],
    qualifications: ['MD - University of Texas', 'Orthopedic Surgery Residency', 'Sports Medicine Fellowship'],
    isEmergencyAvailable: true,
    consultationFee: 280
  },
  {
    id: 'd21',
    name: 'Dr. Michelle Davis',
    specialty: 'Orthopedics',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face',
    bio: 'Spine specialist with expertise in minimally invasive spinal surgery and pain management.',
    experience: 18,
    rating: 4.8,
    reviewCount: 72,
    schedule: {
      monday: { start: '08:00', end: '16:00', available: true },
      tuesday: { start: '08:00', end: '16:00', available: true },
      wednesday: { start: '08:00', end: '16:00', available: true },
      thursday: { start: '08:00', end: '16:00', available: true },
      friday: { start: '08:00', end: '16:00', available: true },
      saturday: { start: '00:00', end: '00:00', available: false },
      sunday: { start: '00:00', end: '00:00', available: false }
    },
    languages: ['English', 'French'],
    qualifications: ['MD - Johns Hopkins', 'Spine Surgery Fellowship', 'Pain Management Certification'],
    isEmergencyAvailable: false,
    consultationFee: 320
  }
];

// Helper function to get doctors by specialty
export const getDoctorsBySpecialty = (specialtyName: string): Doctor[] => {
  return doctors.filter(doctor => doctor.specialty === specialtyName);
};

// Helper function to get specialty by name
export const getSpecialtyByName = (name: string): Specialty | undefined => {
  return specialties.find(specialty => specialty.name === name);
};