import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Public pages
import { Landing } from './pages/public/Landing';
import { About } from './pages/public/About';
import { Contact } from './pages/public/Contact';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// Patient pages
import { PatientDashboard } from './pages/patient/Dashboard';
import { PatientProfile } from './pages/patient/Profile';
import { MedicalHistory } from './pages/patient/MedicalHistory';
import { PatientAppointments } from './pages/patient/Appointments';
import { PatientPrescriptions } from './pages/patient/Prescriptions';
import { FindMedicine } from './pages/patient/FindMedicine';

// Health Worker pages
import { HealthWorkerDashboard } from './pages/healthworker/Dashboard';
import { RegisterPatient } from './pages/healthworker/RegisterPatient';
import { PatientDirectory } from './pages/healthworker/PatientDirectory';
import { HealthWorkerTriage } from './pages/healthworker/Triage';
import { HealthWorkerFollowUps } from './pages/healthworker/FollowUps';

// Doctor pages
import { DoctorDashboard } from './pages/doctor/Dashboard';
import { DoctorQueue } from './pages/doctor/Queue';
import { DoctorConsultation } from './pages/doctor/Consultation';
import { DoctorTeleconsultation } from './pages/doctor/Teleconsultation';
import { DoctorPrescriptions } from './pages/doctor/Prescriptions';
import { DoctorReferrals } from './pages/doctor/Referrals';

// Facility Admin pages
import { FacilityDashboard } from './pages/facility/Dashboard';
import { FacilityAppointments } from './pages/facility/Appointments';
import { FacilityInventory } from './pages/facility/Inventory';
import { FacilityReferrals } from './pages/facility/Referrals';

// District Admin pages
import { DistrictDashboard } from './pages/district/Dashboard';
import { DistrictFacilities } from './pages/district/Facilities';
import { DistrictAnalytics } from './pages/district/Analytics';
import { DistrictReports } from './pages/district/Reports';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, isAuthenticated, loading, getDashboardPathForRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-gray-500 font-medium">Verifying SwasthSetu session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={getDashboardPathForRole(user?.role)} replace />;
  }

  return children;
};

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Patient Portal Routes */}
            <Route
              path="/patient"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/patient/dashboard" replace />} />
              <Route path="dashboard" element={<PatientDashboard />} />
              <Route path="profile" element={<PatientProfile />} />
              <Route path="history" element={<MedicalHistory />} />
              <Route path="appointments" element={<PatientAppointments />} />
              <Route path="prescriptions" element={<PatientPrescriptions />} />
              <Route path="medicines" element={<FindMedicine />} />
            </Route>

            {/* Frontline Health Worker (ASHA / ANM) Routes */}
            <Route
              path="/healthworker"
              element={
                <ProtectedRoute allowedRoles={['health_worker']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/healthworker/dashboard" replace />} />
              <Route path="dashboard" element={<HealthWorkerDashboard />} />
              <Route path="register" element={<RegisterPatient />} />
              <Route path="patients" element={<PatientDirectory />} />
              <Route path="triage" element={<HealthWorkerTriage />} />
              <Route path="followups" element={<HealthWorkerFollowUps />} />
            </Route>

            {/* Doctor / Medical Officer Routes */}
            <Route
              path="/doctor"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/doctor/dashboard" replace />} />
              <Route path="dashboard" element={<DoctorDashboard />} />
              <Route path="queue" element={<DoctorQueue />} />
              <Route path="consultation" element={<DoctorConsultation />} />
              <Route path="tele" element={<DoctorTeleconsultation />} />
              <Route path="prescriptions" element={<DoctorPrescriptions />} />
              <Route path="referrals" element={<DoctorReferrals />} />
            </Route>

            {/* Facility Admin Routes */}
            <Route
              path="/facility"
              element={
                <ProtectedRoute allowedRoles={['facility_admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/facility/dashboard" replace />} />
              <Route path="dashboard" element={<FacilityDashboard />} />
              <Route path="appointments" element={<FacilityAppointments />} />
              <Route path="inventory" element={<FacilityInventory />} />
              <Route path="referrals" element={<FacilityReferrals />} />
            </Route>

            {/* District Admin (CMO) Routes */}
            <Route
              path="/district"
              element={
                <ProtectedRoute allowedRoles={['district_admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/district/dashboard" replace />} />
              <Route path="dashboard" element={<DistrictDashboard />} />
              <Route path="facilities" element={<DistrictFacilities />} />
              <Route path="analytics" element={<DistrictAnalytics />} />
              <Route path="reports" element={<DistrictReports />} />
            </Route>

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
