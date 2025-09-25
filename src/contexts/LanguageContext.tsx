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
    'auth.adminLogin': 'Admin Login',
    'auth.logoutSuccess': 'Logged out successfully',
    'auth.logoutSuccessDesc': 'You have been signed out',
    'auth.logoutError': 'Logout failed',
    'auth.logoutErrorDesc': 'Failed to sign out',
    
    // Theme
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.system': 'System',
    
    // Admin
    'admin.title': 'Admin Panel',
    'admin.panel': 'Admin',
    'admin.dashboard': 'Dashboard',
    'admin.dashboardDesc': 'Monitor and manage your system',
    'admin.users': 'User Management',
    'admin.usersDesc': 'Manage patients, doctors, and administrators',
    'admin.appointments': 'Appointment Management', 
    'admin.appointmentsDesc': 'View and manage all appointments',
    'admin.stats.totalUsers': 'Total Users',
    'admin.stats.totalDoctors': 'Total Doctors',
    'admin.stats.totalPatients': 'Total Patients',
    'admin.stats.totalAppointments': 'Total Appointments',
    'admin.stats.todayAppointments': 'Today\'s Appointments',
    'admin.stats.completedAppointments': 'Completed Appointments',
    'admin.userList': 'User List',
    'admin.appointmentList': 'Appointment List',
    'admin.searchUsers': 'Search users...',
    'admin.searchAppointments': 'Search appointments...',
    'admin.allRoles': 'All Roles',
    'admin.allStatuses': 'All Statuses',
    'admin.patients': 'Patients',
    'admin.doctors': 'Doctors',
    'admin.admins': 'Admins',
    'admin.doctor': 'Doctor',
    'admin.joined': 'Joined',
    'admin.noUsers': 'No users found',
    'admin.noAppointments': 'No appointments found',
    'admin.deleteUser': 'Delete User',
    'admin.deleteUserConfirm': 'Are you sure you want to delete this user? This action cannot be undone.',
    'admin.deleteAppointment': 'Delete Appointment',
    'admin.deleteAppointmentConfirm': 'Are you sure you want to delete this appointment? This action cannot be undone.',
    'admin.success': 'Success',
    'admin.error': 'Error',
    'admin.userDeleted': 'User deleted successfully',
    'admin.appointmentDeleted': 'Appointment deleted successfully',
    'admin.deleteUserError': 'Failed to delete user',
    'admin.deleteAppointmentError': 'Failed to delete appointment',
    'admin.fetchUsersError': 'Failed to fetch users',
    'admin.fetchAppointmentsError': 'Failed to fetch appointments',
    'role.patient': 'Patient',
    'role.doctor': 'Doctor',
    'role.admin': 'Admin',
    'actions': 'Actions',
    'actions.delete': 'Delete',
    
    // Landing Page
    'modernHealthcare': 'Modern Healthcare',
    'management': 'Management',
    'comprehensiveHealthcarePlatform': 'Comprehensive healthcare platform for patients, doctors and administrators',
    'getStarted': 'Get Started',
    'learnMore': 'Learn More',
    'patients': 'Patients',
    'doctors': 'Doctors',
    'appointments': 'Appointments',
    'uptime': 'Uptime',
    'whyChooseUs': 'Why Choose Us?',
    'advancedFeaturesForModernHealthcare': 'Advanced features for modern healthcare management',
    'appointmentBooking': 'Appointment Booking',
    'easyOnlineBooking': 'Easy online appointment booking system',
    'doctorPatientPortal': 'Doctor & Patient Portal',
    'dedicatedPortals': 'Dedicated portals for healthcare providers and patients',
    'secureHealthRecords': 'Secure Health Records',
    'hipaaCompliant': 'HIPAA compliant health record management',
    'accessYourPortal': 'Access Your Portal',
    'selectPortalType': 'Select your portal type to get started',
    'patientPortal': 'Patient Portal',
    'bookAppointmentsViewRecords': 'Book appointments and view medical records',
    'doctorPortal': 'Doctor Portal',
    'managePatientsAppointments': 'Manage patients and appointments',
    'adminPortal': 'Admin Portal',
    'systemAdministration': 'System administration and user management',
    'doctorLogin': 'Doctor Login',
    'adminLogin': 'Admin Login',
    'modernHealthcareSolution': 'Modern healthcare management solution',
    'quickLinks': 'Quick Links',
    'portals': 'Portals',
    'contact': 'Contact',
    'signIn': 'Sign In',
    'allRightsReserved': 'All rights reserved',
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
    'auth.adminLogin': 'دخول المدير',
    'auth.logoutSuccess': 'تم تسجيل الخروج بنجاح',
    'auth.logoutSuccessDesc': 'تم تسجيل خروجك',
    'auth.logoutError': 'فشل تسجيل الخروج',
    'auth.logoutErrorDesc': 'فشل في تسجيل الخروج',
    
    // Theme
    'theme.light': 'فاتح',
    'theme.dark': 'داكن',
    'theme.system': 'النظام',
    
    // Admin
    'admin.title': 'لوحة الإدارة',
    'admin.panel': 'الإدارة',
    'admin.dashboard': 'لوحة التحكم',
    'admin.dashboardDesc': 'مراقبة وإدارة النظام',
    'admin.users': 'إدارة المستخدمين',
    'admin.usersDesc': 'إدارة المرضى والأطباء والمديرين',
    'admin.appointments': 'إدارة المواعيد',
    'admin.appointmentsDesc': 'عرض وإدارة جميع المواعيد',
    'admin.stats.totalUsers': 'إجمالي المستخدمين',
    'admin.stats.totalDoctors': 'إجمالي الأطباء',
    'admin.stats.totalPatients': 'إجمالي المرضى',
    'admin.stats.totalAppointments': 'إجمالي المواعيد',
    'admin.stats.todayAppointments': 'مواعيد اليوم',
    'admin.stats.completedAppointments': 'المواعيد المكتملة',
    'admin.userList': 'قائمة المستخدمين',
    'admin.appointmentList': 'قائمة المواعيد',
    'admin.searchUsers': 'البحث عن المستخدمين...',
    'admin.searchAppointments': 'البحث عن المواعيد...',
    'admin.allRoles': 'جميع الأدوار',
    'admin.allStatuses': 'جميع الحالات',
    'admin.patients': 'المرضى',
    'admin.doctors': 'الأطباء',
    'admin.admins': 'المديرين',
    'admin.doctor': 'الطبيب',
    'admin.joined': 'تاريخ الانضمام',
    'admin.noUsers': 'لا يوجد مستخدمين',
    'admin.noAppointments': 'لا توجد مواعيد',
    'admin.deleteUser': 'حذف المستخدم',
    'admin.deleteUserConfirm': 'هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.',
    'admin.deleteAppointment': 'حذف الموعد',
    'admin.deleteAppointmentConfirm': 'هل أنت متأكد من حذف هذا الموعد؟ لا يمكن التراجع عن هذا الإجراء.',
    'admin.success': 'نجح',
    'admin.error': 'خطأ',
    'admin.userDeleted': 'تم حذف المستخدم بنجاح',
    'admin.appointmentDeleted': 'تم حذف الموعد بنجاح',
    'admin.deleteUserError': 'فشل في حذف المستخدم',
    'admin.deleteAppointmentError': 'فشل في حذف الموعد',
    'admin.fetchUsersError': 'فشل في جلب المستخدمين',
    'admin.fetchAppointmentsError': 'فشل في جلب المواعيد',
    'role.patient': 'مريض',
    'role.doctor': 'طبيب',
    'role.admin': 'مدير',
    'actions': 'الإجراءات',
    'actions.delete': 'حذف',
    
    // Landing Page
    'modernHealthcare': 'الرعاية الصحية الحديثة',
    'management': 'الإدارة',
    'comprehensiveHealthcarePlatform': 'منصة رعاية صحية شاملة للمرضى والأطباء والمديرين',
    'getStarted': 'ابدأ الآن',
    'learnMore': 'اعرف المزيد',
    'patients': 'المرضى',
    'doctors': 'الأطباء',
    'appointments': 'المواعيد',
    'uptime': 'وقت التشغيل',
    'whyChooseUs': 'لماذا تختارنا؟',
    'advancedFeaturesForModernHealthcare': 'ميزات متقدمة لإدارة الرعاية الصحية الحديثة',
    'appointmentBooking': 'حجز المواعيد',
    'easyOnlineBooking': 'نظام حجز مواعيد إلكتروني سهل',
    'doctorPatientPortal': 'بوابة الطبيب والمريض',
    'dedicatedPortals': 'بوابات مخصصة لمقدمي الرعاية الصحية والمرضى',
    'secureHealthRecords': 'السجلات الصحية الآمنة',
    'hipaaCompliant': 'إدارة السجلات الصحية المتوافقة مع HIPAA',
    'accessYourPortal': 'ادخل إلى بوابتك',
    'selectPortalType': 'اختر نوع البوابة للبدء',
    'patientPortal': 'بوابة المريض',
    'bookAppointmentsViewRecords': 'احجز المواعيد واعرض السجلات الطبية',
    'doctorPortal': 'بوابة الطبيب',
    'managePatientsAppointments': 'إدارة المرضى والمواعيد',
    'adminPortal': 'بوابة المدير',
    'systemAdministration': 'إدارة النظام وإدارة المستخدمين',
    'doctorLogin': 'دخول الطبيب',
    'adminLogin': 'دخول المدير',
    'modernHealthcareSolution': 'حلول إدارة الرعاية الصحية الحديثة',
    'quickLinks': 'روابط سريعة',
    'portals': 'البوابات',
    'contact': 'اتصل بنا',
    'signIn': 'تسجيل الدخول',
    'allRightsReserved': 'جميع الحقوق محفوظة',
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