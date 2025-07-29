import { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Doctor Dashboard',
    'nav.appointments': 'Appointments',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    
    // Dashboard
    'dashboard.welcome': 'Welcome, Dr.',
    'dashboard.todayAppointments': 'Today\'s Appointments',
    'dashboard.totalPatients': 'Total Patients',
    'dashboard.completedToday': 'Completed Today',
    'dashboard.upcoming': 'Upcoming',
    
    // Appointments
    'appointments.title': 'Appointments',
    'appointments.today': 'Today',
    'appointments.upcoming': 'Upcoming',
    'appointments.completed': 'Completed',
    'appointments.patient': 'Patient',
    'appointments.time': 'Time',
    'appointments.status': 'Status',
    'appointments.actions': 'Actions',
    'appointments.notes': 'Notes',
    'appointments.noAppointments': 'No appointments found',
    
    // Status
    'status.scheduled': 'Scheduled',
    'status.completed': 'Completed',
    'status.canceled': 'Canceled',
    'status.no_show': 'No Show',
    
    // Actions
    'actions.complete': 'Complete',
    'actions.cancel': 'Cancel',
    'actions.view': 'View Patient',
    'actions.edit': 'Edit Notes',
    'actions.save': 'Save',
    'actions.close': 'Close',
    
    // Profile
    'profile.title': 'Doctor Profile',
    'profile.personalInfo': 'Personal Information',
    'profile.firstName': 'First Name',
    'profile.lastName': 'Last Name',
    'profile.phone': 'Phone',
    'profile.specialty': 'Specialty',
    'profile.language': 'Language',
    'profile.updateSuccess': 'Profile updated successfully',
    'profile.updateError': 'Failed to update profile',
    
    // Patient Info
    'patient.info': 'Patient Information',
    'patient.name': 'Name',
    'patient.phone': 'Phone',
    'patient.appointments': 'Appointment History',
    
    // Auth
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.noAccount': 'Don\'t have an account?',
    'auth.hasAccount': 'Already have an account?',
    'auth.doctorAccount': 'Doctor Account',
    'auth.patientAccount': 'Patient Account',
    'auth.role': 'Account Type',
    
    // Theme
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.system': 'System',
  },
  ar: {
    // Navigation
    'nav.dashboard': 'لوحة تحكم الطبيب',
    'nav.appointments': 'المواعيد',
    'nav.profile': 'الملف الشخصي',
    'nav.logout': 'تسجيل الخروج',
    
    // Dashboard
    'dashboard.welcome': 'مرحباً، د.',
    'dashboard.todayAppointments': 'مواعيد اليوم',
    'dashboard.totalPatients': 'إجمالي المرضى',
    'dashboard.completedToday': 'تم إنجازها اليوم',
    'dashboard.upcoming': 'القادمة',
    
    // Appointments
    'appointments.title': 'المواعيد',
    'appointments.today': 'اليوم',
    'appointments.upcoming': 'القادمة',
    'appointments.completed': 'المكتملة',
    'appointments.patient': 'المريض',
    'appointments.time': 'الوقت',
    'appointments.status': 'الحالة',
    'appointments.actions': 'الإجراءات',
    'appointments.notes': 'الملاحظات',
    'appointments.noAppointments': 'لا توجد مواعيد',
    
    // Status
    'status.scheduled': 'مجدول',
    'status.completed': 'مكتمل',
    'status.canceled': 'ملغي',
    'status.no_show': 'لم يحضر',
    
    // Actions
    'actions.complete': 'إكمال',
    'actions.cancel': 'إلغاء',
    'actions.view': 'عرض المريض',
    'actions.edit': 'تعديل الملاحظات',
    'actions.save': 'حفظ',
    'actions.close': 'إغلاق',
    
    // Profile
    'profile.title': 'الملف الشخصي للطبيب',
    'profile.personalInfo': 'المعلومات الشخصية',
    'profile.firstName': 'الاسم الأول',
    'profile.lastName': 'الاسم الأخير',
    'profile.phone': 'الهاتف',
    'profile.specialty': 'التخصص',
    'profile.language': 'اللغة',
    'profile.updateSuccess': 'تم تحديث الملف الشخصي بنجاح',
    'profile.updateError': 'فشل في تحديث الملف الشخصي',
    
    // Patient Info
    'patient.info': 'معلومات المريض',
    'patient.name': 'الاسم',
    'patient.phone': 'الهاتف',
    'patient.appointments': 'تاريخ المواعيد',
    
    // Auth
    'auth.signIn': 'تسجيل الدخول',
    'auth.signUp': 'إنشاء حساب',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.noAccount': 'ليس لديك حساب؟',
    'auth.hasAccount': 'لديك حساب بالفعل؟',
    'auth.doctorAccount': 'حساب طبيب',
    'auth.patientAccount': 'حساب مريض',
    'auth.role': 'نوع الحساب',
    
    // Theme
    'theme.light': 'فاتح',
    'theme.dark': 'داكن',
    'theme.system': 'النظام',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && ['en', 'ar'].includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      isRTL: language === 'ar',
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}