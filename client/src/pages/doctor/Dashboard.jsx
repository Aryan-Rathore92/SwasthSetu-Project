import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dashboardApi } from '../../api/endpoints';
import {
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  GitBranch,
  ShieldAlert,
  ArrowRight,
  ClipboardList,
  Stethoscope,
  Video,
} from 'lucide-react';

export const DoctorDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardApi.getDoctor();
        if (res.data) setData(res.data);
      } catch (err) {
        console.error('Failed to load doctor dashboard:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="p-8 text-center text-xs text-gray-500">Loading doctor clinical dashboard...</div>;

  const {
    todayAppointments = [],
    waitingCount = 0,
    completedCount = 0,
    pendingReferrals = [],
    flaggedPatients = [],
  } = data || {};

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-navy-900 to-brand-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-500/30 text-brand-300">
            Medical Officer Desk
          </span>
          <h1 className="text-xl sm:text-2xl font-bold mt-1">
            Dr. {user?.name || 'Medical Officer'}
          </h1>
          <p className="text-xs text-gray-300 mt-1">
            {user?.department || 'General Medicine'} • MCI Reg: {user?.registrationNumber || 'MCI-UP-48201'} • 📍 {user?.facility?.name || 'Primary Health Centre'}
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/doctor/queue"
            className="inline-flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow transition-all"
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Open Consultation Queue</span>
          </Link>
          <Link
            to="/doctor/referrals"
            className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/20 transition-all"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Facility Referrals</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold">Today's Total OPD</span>
            <Calendar className="w-4 h-4 text-brand-500" />
          </div>
          <p className="text-2xl font-bold text-navy-900">{todayAppointments.length}</p>
          <p className="text-[10px] text-gray-400">Total appointments today</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold">Patients Waiting</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600">{waitingCount}</p>
          <p className="text-[10px] text-gray-400">In OPD or virtual waiting room</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold">Consultations Done</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">{completedCount}</p>
          <p className="text-[10px] text-gray-400">Prescriptions signed today</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold">Critical Triage</span>
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-600">{flaggedPatients.length}</p>
          <p className="text-[10px] text-gray-400">RED urgency alerts</p>
        </div>
      </div>

      {/* Grid: Active Patient Queue & Referrals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Live Queue Preview (Left Col 7) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-surface-border p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-navy-900 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-brand-500" />
              <span>Live Patient Queue (OPD & Telehealth)</span>
            </h2>
            <Link to="/doctor/queue" className="text-xs font-semibold text-brand-600 hover:underline">
              View Full Queue →
            </Link>
          </div>

          <div className="space-y-3">
            {todayAppointments.length > 0 ? (
              todayAppointments.slice(0, 5).map((apt) => (
                <div key={apt._id} className="p-3.5 bg-surface-bg rounded-xl border border-surface-border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-600 font-bold flex items-center justify-center text-xs">
                      #{apt.tokenNumber}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-navy-900">{apt.patientId?.name}</p>
                        <span className="font-mono text-[10px] text-gray-400">({apt.patientId?.patientId})</span>
                      </div>
                      <p className="text-[11px] text-gray-500">
                        {apt.appointmentTime || '10:30 AM'} • Mode: <span className="font-semibold text-gray-700">{apt.mode}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      apt.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                      apt.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {apt.status}
                    </span>

                    <Link
                      to={`/doctor/consultation?appointmentId=${apt._id}`}
                      className="px-3 py-1 bg-navy-900 hover:bg-navy-800 text-white rounded-lg font-semibold text-[11px] transition-colors"
                    >
                      Examine
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 text-center py-6">No patients currently in consultation queue.</p>
            )}
          </div>
        </div>

        {/* Pending Referrals (Right Col 5) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-surface-border p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-navy-900 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-brand-500" />
              <span>Pending Referral Cases</span>
            </h2>
            <Link to="/doctor/referrals" className="text-xs font-semibold text-brand-600 hover:underline">
              Create New →
            </Link>
          </div>

          <div className="space-y-3">
            {pendingReferrals.length > 0 ? (
              pendingReferrals.slice(0, 4).map((ref) => (
                <div key={ref._id} className="p-3 bg-surface-bg rounded-xl border border-surface-border text-xs space-y-1.5">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-navy-900">{ref.patientId?.name}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      {ref.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 line-clamp-1">
                    To: {ref.toFacilityId?.name} ({ref.department})
                  </p>
                  <p className="text-[10px] text-brand-600 font-semibold">
                    Priority: {ref.priority}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 text-center py-6">No pending referrals.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

