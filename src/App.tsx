import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Profile from "./pages/Profile";
import { Contact } from "./pages/Contact";
import { AuthPage } from "./components/auth/AuthPage";
import { RoleBasedRedirect } from "./components/auth/RoleBasedRedirect";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { UserManagement } from "./pages/admin/UserManagement";
import { AppointmentManagement } from "./pages/admin/AppointmentManagement";
import { PatientDashboard } from "./pages/patient/PatientDashboard";
import { PatientAppointments } from "./pages/patient/PatientAppointments";
import { PatientBooking } from "./pages/patient/PatientBooking";
import { PatientMessages } from "./pages/patient/PatientMessages";
import { PatientProfile } from "./pages/patient/PatientProfile";
import { PatientSettings } from "./pages/patient/PatientSettings";
import { PatientSpecialties } from "./pages/patient/PatientSpecialties";
import { PatientDoctors } from "./pages/patient/PatientDoctors";
import { PatientDoctorDetails } from "./pages/patient/PatientDoctorDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/redirect" element={<RoleBasedRedirect />} />
                
                {/* Doctor Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/appointments" element={<Appointments />} />
                <Route path="/dashboard/profile" element={<Profile />} />
                
                {/* Patient Routes */}
                <Route path="/patient" element={<PatientDashboard />} />
                <Route path="/patient/specialties" element={<PatientSpecialties />} />
                <Route path="/patient/doctors/:specialty" element={<PatientDoctors />} />
                <Route path="/patient/doctor/:doctorId" element={<PatientDoctorDetails />} />
                <Route path="/patient/appointments" element={<PatientAppointments />} />
                <Route path="/patient/booking" element={<PatientBooking />} />
                <Route path="/patient/messages" element={<PatientMessages />} />
                <Route path="/patient/profile" element={<PatientProfile />} />
                <Route path="/patient/settings" element={<PatientSettings />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="appointments" element={<AppointmentManagement />} />
                </Route>
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
