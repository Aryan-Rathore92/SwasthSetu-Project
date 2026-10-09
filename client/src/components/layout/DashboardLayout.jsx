import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Activity,
  LayoutDashboard,
  UserPlus,
  Users,
  Stethoscope,
  Calendar,
  ClipboardList,
  FileText,
  GitBranch,
  Pill,
  AlertCircle,
  Building2,
  BarChart3,
  FileSpreadsheet,
  Globe,
  LogOut,
  Menu,
  X,
  PhoneCall,
  Bell,
  HeartPulse,
  Video,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { emergencyApi } from '../../api/endpoints';
import { toast } from 'sonner';

export const DashboardLayout = () => {
  const { user, role, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [sosLoading, setSosLoading] = useState(false);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'hi' ? 'en' : 'hi';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('swasthsetu_lang', nextLang);
  };

  const triggerDemoSos = async () => {
    try {
      setSosLoading(true);
      const res = await emergencyApi.createSos({
        patientId: user?.role === 'patient' ? user?._id : null,
        reporterName: user?.name,
        reporterPhone: user?.phone,
        address: 'Current Rural Village Location (GPS Demo)',
        notes: 'Demonstration SOS alert triggered by patient portal.',
      });
      toast.success('Emergency alert sent to nearest healthcare facility!');
      setSosModalOpen(false);
    } catch (err) {
      toast.error('Failed to trigger demo emergency alert: ' + err.message);
    } finally {
      setSosLoading(false);
    }
  };

  // Nav menus per role
  const getNavLinks = () => {
    switch (role) {
      case 'patient':
        return [
          { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
          { name: 'My Profile', path: '/patient/profile', icon: Users },
          { name: 'Medical History', path: '/patient/history', icon: FileText },
          { name: 'Appointments', path: '/patient/appointments', icon: Calendar },
          { name: 'Prescriptions', path: '/patient/prescriptions', icon: HeartPulse },
          { name: 'Find Medicines', path: '/patient/medicines', icon: Pill },
        ];
      case 'health_worker':
        return [
          { name: 'Dashboard', path: '/healthworker/dashboard', icon: LayoutDashboard },
          { name: 'Register Patient', path: '/healthworker/register', icon: UserPlus },
          { name: 'Patient Directory', path: '/healthworker/patients', icon: Users },
          { name: 'Health Triage', path: '/healthworker/triage', icon: Stethoscope },
          { name: 'Follow-Up Tasks', path: '/healthworker/followups', icon: ClipboardList },
        ];
      case 'doctor':
        return [
          { name: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
          { name: 'Consultation Queue', path: '/doctor/queue', icon: ClipboardList },
          { name: 'Teleconsultation', path: '/doctor/tele', icon: Video },
          { name: 'Prescriptions', path: '/doctor/prescriptions', icon: FileText },
          { name: 'Referral Manager', path: '/doctor/referrals', icon: GitBranch },
        ];
      case 'facility_admin':
        return [
          { name: 'Facility Dashboard', path: '/facility/dashboard', icon: LayoutDashboard },
          { name: 'Appointments & Queue', path: '/facility/appointments', icon: Calendar },
          { name: 'Medicine Inventory', path: '/facility/inventory', icon: Pill },
          { name: 'Referral Transfers', path: '/facility/referrals', icon: GitBranch },
        ];
      case 'district_admin':
        return [
          { name: 'District Overview', path: '/district/dashboard', icon: LayoutDashboard },
          { name: 'Healthcare Facilities', path: '/district/facilities', icon: Building2 },
          { name: 'Health Analytics', path: '/district/analytics', icon: BarChart3 },
          { name: 'Reports & FHIR', path: '/district/reports', icon: FileSpreadsheet },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  const getRoleBadge = (userRole) => {
    switch (userRole) {
      case 'patient': return { label: 'Patient Portal', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'health_worker': return { label: 'Frontline ASHA/ANM', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'doctor': return { label: 'Medical Officer', color: 'bg-brand-50 text-brand-700 border-brand-200' };
      case 'facility_admin': return { label: 'Facility Admin', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'district_admin': return { label: 'Chief Medical Officer', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      default: return { label: 'Healthcare User', color: 'bg-gray-50 text-gray-700 border-gray-200' };
    }
  };

  const roleBadge = getRoleBadge(role);

  return (
    <div className="min-h-screen bg-surface-bg flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-surface-border">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-surface-border gap-3">
          <div className="w-9 h-9 rounded-xl bg-navy-900 flex items-center justify-center">
            <Activity className="w-5 h-5 text-brand-500" />
          </div>
          <div>
            <h1 className="text-base font-bold text-navy-900 leading-tight">
              Swasth<span className="text-brand-500">Setu</span>
            </h1>
            <p className="text-[10px] text-gray-500 font-medium uppercase">Care Network</p>
          </div>
        </div>

        {/* User Role Card */}
        <div className="p-4 mx-3 my-3 bg-slate-50 rounded-xl border border-surface-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-500/10 text-brand-600 font-bold flex items-center justify-center text-sm">
              {user?.name ? user.name[0] : 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-dark-text truncate">{user?.name || 'User'}</p>
              <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border ${roleBadge.color} mt-0.5`}>
                {roleBadge.label}
              </span>
            </div>
          </div>
          {user?.facility?.name && (
            <p className="text-[10px] text-gray-500 mt-2 truncate">
              📍 {user.facility.name}
            </p>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-dark-text hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-surface-border space-y-2">
          {/* Emergency SOS Button for Patient/Healthworker */}
          {(role === 'patient' || role === 'health_worker') && (
            <button
              onClick={() => setSosModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-2 px-3 rounded-lg shadow-sm transition-colors"
            >
              <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
              <span>Emergency Help (SOS)</span>
            </button>
          )}

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative w-64 bg-white flex flex-col h-full z-10">
            <div className="h-16 flex items-center justify-between px-6 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-brand-500" />
                <span className="font-bold text-navy-900">SwasthSetu</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 mx-3 my-2 bg-slate-50 rounded-xl border border-surface-border">
              <p className="text-xs font-semibold text-dark-text truncate">{user?.name}</p>
              <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border ${roleBadge.color} mt-1`}>
                {roleBadge.label}
              </span>
            </div>
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium ${
                      isActive ? 'bg-brand-500 text-white' : 'text-gray-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-3 border-t border-surface-border">
              <button
                onClick={() => { logout(); setSidebarOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-surface-border px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-sm font-semibold text-dark-text capitalize">
                {location.pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
              </h2>
              <p className="text-[10px] text-gray-500 hidden sm:block">
                National Healthcare Coordination Gateway • Demonstration System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-surface-border text-xs font-medium text-gray-700 hover:bg-surface-bg"
            >
              <Globe className="w-3.5 h-3.5 text-brand-500" />
              <span>{i18n.language === 'hi' ? 'EN' : 'हिन्दी'}</span>
            </button>

            {/* Emergency SOS in header for mobile */}
            {(role === 'patient' || role === 'health_worker') && (
              <button
                onClick={() => setSosModalOpen(true)}
                className="lg:hidden p-2 text-white bg-red-600 rounded-lg shadow-sm"
                title="Emergency SOS"
              >
                <AlertCircle className="w-4 h-4" />
              </button>
            )}

            <div className="h-5 w-px bg-surface-border mx-1"></div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 font-semibold text-xs flex items-center justify-center border border-brand-200">
                {user?.name ? user.name[0] : 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-medium text-dark-text leading-tight">{user?.name?.split(' ')[0]}</p>
                <p className="text-[10px] text-gray-400 capitalize">{role?.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Emergency SOS Modal */}
      {sosModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Emergency Assistance (SOS)</h3>
                <p className="text-xs text-gray-500">24x7 Rural Emergency Coordination</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 space-y-1">
              <p className="font-semibold">⚠️ Demonstration Emergency Protocol</p>
              <p>For genuine real-world medical emergencies, immediately call national toll-free helplines:</p>
              <p className="font-bold text-red-700">Dial 108 (Ambulance) • Dial 102 (Pregnancy Transport)</p>
            </div>

            <p className="text-xs text-gray-600">
              Triggering this alert will instantly notify the nearest Primary or Community Health Centre via real-time telemetry socket.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSosModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={triggerDemoSos}
                disabled={sosLoading}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md transition-colors disabled:opacity-50"
              >
                {sosLoading ? 'Dispatching Alert...' : 'Confirm SOS Alert'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

