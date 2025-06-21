import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

// Initialize database
import { initializeDatabase } from "@/services/database";

// Pages
import Index from "./pages/Index";
import GeneralLogin from "./pages/GeneralLogin";
import FacilitySetup from "./pages/FacilitySetup";
import NotFound from "./pages/NotFound";

// Role-based dashboards
import SuperAdminDashboard from "./pages/dashboards/SuperAdminDashboard";
import FacilityAdminDashboard from "./pages/dashboards/FacilityAdminDashboard";

// Admin Pages
import { AdminLayout } from "./components/layout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Patients from "./pages/admin/Patients";
import Doctors from "./pages/admin/Doctors";
import Appointments from "./pages/admin/Appointments";
import Settings from "./pages/admin/Settings";
import StaffManagement from "./pages/admin/StaffManagement";
import Nurses from "./pages/admin/Nurses";
import CarePlans from "./pages/admin/CarePlans";
import HealthLevelAdmin from "./pages/admin/HealthLevelAdmin";
import Laboratory from "./pages/admin/Laboratory";
import LabTechnicians from "./pages/admin/LabTechnicians";
import Pharmacy from "./pages/admin/Pharmacy";
import LocationsManagement from "./pages/admin/LocationsManagement";
import HospitalRegistration from "./pages/admin/HospitalRegistration";

// Doctor Pages
import { DoctorLayout } from "./components/layout/DoctorLayout";
import DoctorLogin from "./pages/doctor/DoctorLogin";
import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorPatients from "./pages/doctor/Patients";
import DoctorCarePlans from "./pages/doctor/CarePlans";
import Prescriptions from "./pages/doctor/Prescriptions";
import TreatmentHistory from "./pages/doctor/TreatmentHistory";
import LabResults from "./pages/doctor/LabResults";
import PatientRecords from "./pages/doctor/PatientRecords";
import Schedule from "./pages/doctor/Schedule";
import PatientManagement from "./pages/doctor/PatientManagement";
import Messaging from "./pages/doctor/Messaging";
import EmergencyCenter from "./pages/doctor/EmergencyCenter";
import VitalsMonitoring from "./pages/doctor/VitalsMonitoring";
import DoctorMaternalHealth from "./pages/doctor/DoctorMaternalHealth";

// Nurse Pages
import { NurseLayout } from "./components/layout/NurseLayout";
import NurseLogin from "./pages/nurse/NurseLogin";
import NurseDashboard from "./pages/nurse/Dashboard";
import NursePatients from "./pages/nurse/Patients";
import NurseRegistration from "./pages/nurse/Registration";
import NurseSchedules from "./pages/nurse/Schedules";
import NurseCarePlans from "./pages/nurse/CarePlans";
import NurseVitals from "./pages/nurse/Vitals";
import NursePatientMonitoring from "./pages/nurse/PatientMonitoring";
import NurseMedicationAdministration from "./pages/nurse/MedicationAdministration";
import NurseLabResults from "./pages/nurse/LabResults";
import NurseDocumentation from "./pages/nurse/Documentation";
import NurseAlerts from "./pages/nurse/Alerts";
import NurseMessages from "./pages/nurse/Messages";

// Lab Technician Pages
import { LabTechLayout } from "./components/layout/LabTechLayout";
import LabTechLogin from "./pages/labtech/LabTechLogin";
import LabTechDashboard from "./pages/labtech/Dashboard";
import TestRequests from "./pages/labtech/TestRequests";
import SampleTracking from "./pages/labtech/SampleTracking";
import ResultEntry from "./pages/labtech/ResultEntry";
import MaternalLabTests from "./pages/labtech/MaternalLabTests";
import Verification from "./pages/labtech/Verification";
import Reports from "./pages/labtech/Reports";

// Receptionist Pages
import { ReceptionistLayout } from "./components/layout/ReceptionistLayout";
import ReceptionistLogin from "./pages/receptionist/ReceptionistLogin";
import ReceptionistDashboard from "./pages/receptionist/Dashboard";
import ReceptionistAppointments from "./pages/receptionist/Appointments";
import Registration from "./pages/receptionist/Registration";
import ReceptionistPatients from "./pages/receptionist/Patients";
import CheckIn from "./pages/receptionist/CheckIn";
import ReceptionistSearch from "./pages/receptionist/Search";
import ReceptionistNotifications from "./pages/receptionist/Notifications";
import ReceptionistBilling from "./pages/receptionist/Billing";

// Maternal Mortality Standalone Page
import MaternalMortality from "./pages/admin/MaternalMortality";

// Maternal Patient Management Components
import { PatientManagement as MaternalPatientManagement } from "./components/maternal/PatientManagement";
import { PatientView } from "./components/maternal/PatientView";
import { PatientEdit } from "./components/maternal/PatientEdit";
import { MaternalLayout } from "./components/layout/MaternalLayout";

// Disease Outbreak Standalone Page
import DiseaseOutbreak from "./pages/DiseaseOutbreak";

// Emergency Team Standalone Page
import EmergencyTeam from "./pages/EmergencyTeam";

// Pharmacy Pages
import { PharmacyLayout } from "./components/layout/PharmacyLayout";
import PharmacyDashboard from "./pages/pharmacy/Dashboard";
import PharmacyPrescriptions from "./pages/pharmacy/Prescriptions";
import PharmacyInventory from "./pages/pharmacy/Inventory";
import PharmacyPatients from "./pages/pharmacy/Patients";
import PharmacyOrders from "./pages/pharmacy/Orders";
import PharmacyCarePlans from "./pages/pharmacy/CarePlans";
import PharmacyLabResults from "./pages/pharmacy/LabResults";
import PharmacyTreatments from "./pages/pharmacy/Treatments";
import PharmacyReports from "./pages/pharmacy/Reports";
import PharmacyMessages from "./pages/pharmacy/Messages";
import PharmacyManagement from "./pages/pharmacy/Management";

// Emergency Pages
import { EmergencyLayout } from "./components/layout/EmergencyLayout";
import EmergencyDashboard from "./pages/emergency/Dashboard";
import EmergencySection from "./pages/emergency/EmergencySection";

import { 
  FileText, Package, Users, ShoppingCart, Calendar, 
  TestTube, Stethoscope, TrendingUp, MessageSquare, Activity,
  AlertTriangle, Truck, Radio, MapPin, Clock, Phone, Zap, Shield, Heart, Award
} from "lucide-react";

// Individual page dashboards for role-based routes
import StaffDashboard from "./pages/staff/Dashboard";

// Layout components
import { StaffLayout } from "./components/layout/StaffLayout";

const queryClient = new QueryClient();

const App = () => {
  // Initialize database on app start
  useEffect(() => {
    const setupDatabase = async () => {
      try {
        console.log('Initializing hospital database...');
        await initializeDatabase();
        console.log('Database initialization complete');
      } catch (error) {
        console.error('Database initialization failed:', error);
      }
    };

    setupDatabase();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Home route shows the Index page */}
            <Route path="/" element={<Index />} />
            
            {/* General Login Page - Single entry point for all users */}
            <Route path="/login" element={<GeneralLogin />} />
            
            {/* Individual Login Pages */}
            <Route path="/doctor/login" element={<DoctorLogin />} />
            <Route path="/nurse/login" element={<NurseLogin />} />
            <Route path="/labtech/login" element={<LabTechLogin />} />
            <Route path="/receptionist/login" element={<ReceptionistLogin />} />
            
            {/* Specialized Portal Routes */}
            <Route path="/maternal-mortality" element={<MaternalMortality />} />
            <Route path="/disease-outbreak" element={<DiseaseOutbreak />} />
            <Route path="/emergency-team" element={<Navigate to="/emergency/dashboard" replace />} />
            
            {/* Facility Setup for Super Admin or first-time setup */}
            <Route path="/facility-setup" element={<FacilitySetup />} />
            
            {/* Role-based dashboard routes - now using layouts */}
            <Route path="/super-admin/*" element={<SuperAdminDashboard />} />
            <Route path="/facility-admin/*" element={<FacilityAdminDashboard />} />
            <Route path="/staff" element={<StaffLayout />}>
              <Route index element={<Navigate to="/staff/dashboard" replace />} />
              <Route path="dashboard" element={<StaffDashboard />} />
              <Route path="schedule" element={<div>Staff Schedule - Coming Soon</div>} />
              <Route path="tasks" element={<div>Staff Tasks - Coming Soon</div>} />
              <Route path="reports" element={<div>Staff Reports - Coming Soon</div>} />
              <Route path="directory" element={<div>Staff Directory - Coming Soon</div>} />
              <Route path="notifications" element={<div>Staff Notifications - Coming Soon</div>} />
            </Route>
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="patients" element={<Patients />} />
              <Route path="doctors" element={<Doctors />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="staff" element={<StaffManagement />} />
              <Route path="nurses" element={<Nurses />} />
              <Route path="careplans" element={<CarePlans />} />
              <Route path="health-admin" element={<HealthLevelAdmin />} />
              <Route path="laboratory" element={<Laboratory />} />
              <Route path="lab-technicians" element={<LabTechnicians />} />
              <Route path="locations" element={<LocationsManagement />} />
              <Route path="hospital-registration" element={<HospitalRegistration />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            {/* Maternal Patient Management Routes */}
            <Route path="/maternal" element={<MaternalLayout />}>
              <Route index element={<Navigate to="/maternal/patient-management" replace />} />
              <Route path="patient-management" element={<MaternalPatientManagement />} />
              <Route path="patient-view/:patientId" element={<PatientView />} />
              <Route path="patient-edit/:patientId" element={<PatientEdit />} />
            </Route>
            
            {/* Doctor routes */}
            <Route path="/doctor" element={<DoctorLayout />}>
              <Route index element={<Navigate to="/doctor/dashboard" replace />} />
              <Route path="dashboard" element={<DoctorDashboard />} />
              <Route path="patients" element={<DoctorPatients />} />
              <Route path="careplans" element={<DoctorCarePlans />} />
              <Route path="prescriptions" element={<Prescriptions />} />
              <Route path="history" element={<TreatmentHistory />} />
              <Route path="lab-results" element={<LabResults />} />
              <Route path="records" element={<PatientRecords />} />
              <Route path="schedule" element={<Schedule />} />
              <Route path="management" element={<PatientManagement />} />
              <Route path="messaging" element={<Messaging />} />
              <Route path="emergency" element={<EmergencyCenter />} />
              <Route path="vitals" element={<VitalsMonitoring />} />
              <Route path="maternal-health" element={
                <DoctorMaternalHealth 
                  doctorId="doctor_001" 
                  doctorName="Dr. Sarah Johnson" 
                />
              } />
            </Route>
            
            {/* Pharmacy routes */}
            <Route path="/pharmacy" element={<PharmacyLayout />}>
              <Route index element={<Navigate to="/pharmacy/dashboard" replace />} />
              <Route path="dashboard" element={<PharmacyDashboard />} />
              <Route path="prescriptions" element={<PharmacyPrescriptions />} />
              <Route path="inventory" element={<PharmacyInventory />} />
              <Route path="patients" element={<PharmacyPatients />} />
              <Route path="orders" element={<PharmacyOrders />} />
              <Route path="careplans" element={<PharmacyCarePlans />} />
              <Route path="labresults" element={<PharmacyLabResults />} />
              <Route path="treatments" element={<PharmacyTreatments />} />
              <Route path="reports" element={<PharmacyReports />} />
              <Route path="messages" element={<PharmacyMessages />} />
              <Route path="management" element={<PharmacyManagement />} />
            </Route>
            
            {/* Nurse routes */}
            <Route path="/nurse" element={<NurseLayout />}>
              <Route index element={<Navigate to="/nurse/dashboard" replace />} />
              <Route path="dashboard" element={<NurseDashboard />} />
              <Route path="patients" element={<NursePatients />} />
              <Route path="registration" element={<NurseRegistration />} />
              <Route path="schedules" element={<NurseSchedules />} />
              <Route path="careplans" element={<NurseCarePlans />} />
              <Route path="vitals" element={<NurseVitals />} />
              <Route path="monitoring" element={<NursePatientMonitoring />} />
              <Route path="medication" element={<NurseMedicationAdministration />} />
              <Route path="lab-results" element={<NurseLabResults />} />
              <Route path="notes" element={<NurseDocumentation />} />
              <Route path="alerts" element={<NurseAlerts />} />
              <Route path="messages" element={<NurseMessages />} />
            </Route>
            
            {/* Lab Technician routes */}
            <Route path="/labtech" element={<LabTechLayout />}>
              <Route index element={<Navigate to="/labtech/dashboard" replace />} />
              <Route path="dashboard" element={<LabTechDashboard />} />
              <Route path="test-requests" element={<TestRequests />} />
              <Route path="sample-tracking" element={<SampleTracking />} />
              <Route path="result-entry" element={<ResultEntry />} />
              <Route path="maternal-lab-tests" element={<MaternalLabTests />} />
              <Route path="verification" element={<Verification />} />
              <Route path="reports" element={<Reports />} />
            </Route>
            
            {/* Receptionist routes */}
            <Route path="/receptionist" element={<ReceptionistLayout />}>
              <Route index element={<Navigate to="/receptionist/dashboard" replace />} />
              <Route path="dashboard" element={<ReceptionistDashboard />} />
              <Route path="appointments" element={<ReceptionistAppointments />} />
              <Route path="registration" element={<Registration />} />
              <Route path="patients" element={<ReceptionistPatients />} />
              <Route path="check-in" element={<CheckIn />} />
              <Route path="search" element={<ReceptionistSearch />} />
              <Route path="notifications" element={<ReceptionistNotifications />} />
              <Route path="billing" element={<ReceptionistBilling />} />
            </Route>
            
            {/* Emergency routes */}
            <Route path="/emergency" element={<EmergencyLayout />}>
              <Route index element={<Navigate to="/emergency/dashboard" replace />} />
              <Route path="dashboard" element={<EmergencyDashboard />} />
              <Route path="teams" element={
                <EmergencySection 
                  title="Emergency Teams" 
                  description="Manage emergency response teams and their assignments"
                  icon={<Shield className="h-6 w-6 text-red-600" />}
                />
              } />
              <Route path="staff" element={
                <EmergencySection 
                  title="Staff Assignments" 
                  description="Assign medical staff to emergency response teams"
                  icon={<Users className="h-6 w-6 text-red-600" />}
                />
              } />
              <Route path="outbreak" element={
                <EmergencySection 
                  title="Outbreak Responses" 
                  description="Coordinate emergency responses for disease outbreaks"
                  icon={<AlertTriangle className="h-6 w-6 text-red-600" />}
                />
              } />
              <Route path="maternal" element={
                <EmergencySection 
                  title="Maternal Emergency Responses" 
                  description="Manage emergency responses for maternal health crises"
                  icon={<Heart className="h-6 w-6 text-red-600" />}
                />
              } />
              <Route path="deployments" element={
                <EmergencySection 
                  title="Team Deployments" 
                  description="Track and manage emergency team deployments"
                  icon={<Truck className="h-6 w-6 text-red-600" />}
                />
              } />
              <Route path="training" element={
                <EmergencySection 
                  title="Training Programs" 
                  description="Manage training programs for emergency response teams"
                  icon={<Award className="h-6 w-6 text-red-600" />}
                />
              } />
              <Route path="analytics" element={
                <EmergencySection 
                  title="Analytics & Reports" 
                  description="View analytics and generate reports on emergency response performance"
                  icon={<TrendingUp className="h-6 w-6 text-red-600" />}
                />
              } />
              <Route path="incidents" element={
                <EmergencySection 
                  title="Active Incidents" 
                  description="Monitor and manage active emergency incidents"
                  icon={<AlertTriangle className="h-6 w-6 text-red-600" />}
                />
              } />
              <Route path="vehicles" element={
                <EmergencySection 
                  title="Vehicles & Equipment" 
                  description="Track emergency vehicles and equipment status"
                  icon={<Truck className="h-6 w-6 text-red-600" />}
                />
              } />
              <Route path="dispatch" element={
                <EmergencySection 
                  title="Dispatch Center" 
                  description="Central dispatch and coordination hub"
                  icon={<Radio className="h-6 w-6 text-red-600" />}
                />
              } />
              <Route path="locations" element={
                <EmergencySection 
                  title="Emergency Locations" 
                  description="Manage emergency response locations and zones"
                  icon={<MapPin className="h-6 w-6 text-red-600" />}
                />
              } />
              <Route path="protocols" element={
                <EmergencySection 
                  title="Response Protocols" 
                  description="Emergency response procedures and protocols"
                  icon={<FileText className="h-6 w-6 text-red-600" />}
                />
              } />
              <Route path="monitoring" element={
                <EmergencySection 
                  title="Real-time Monitoring" 
                  description="Live monitoring of emergency situations"
                  icon={<Activity className="h-6 w-6 text-red-600" />}
                />
              } />
              <Route path="response-times" element={
                <EmergencySection 
                  title="Response Times" 
                  description="Track and analyze emergency response times"
                  icon={<Clock className="h-6 w-6 text-red-600" />}
                />
              } />
              <Route path="communications" element={
                <EmergencySection 
                  title="Communications" 
                  description="Emergency communication systems and channels"
                  icon={<Phone className="h-6 w-6 text-red-600" />}
                />
              } />
              <Route path="alerts" element={
                <EmergencySection 
                  title="Alert System" 
                  description="Emergency alert and notification management"
                  icon={<Zap className="h-6 w-6 text-red-600" />}
                />
              } />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
