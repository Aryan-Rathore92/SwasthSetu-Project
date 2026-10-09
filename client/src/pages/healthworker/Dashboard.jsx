import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  ClipboardList,
  AlertTriangle,
  GitBranch,
  Stethoscope,
  PlusCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { dashboardApi } from '../../api/endpoints';

export const HealthWorkerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardApi.getHealthWorker();
        if (res.data) setData(res.data);
      } catch (err) {
        console.error('Failed to load health worker dashboard:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="p-8 text-center text-xs text-gray-500">Loading frontline health worker dashboard...</div>;

  const {
    totalPatients = 0,
    todayAppointments = 0,
    pendingFollowUps = 0,
    attentionPatients = [],
    activeReferrals = [],
    recentTriage = [],
  } = data || {};

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white">
            Frontline Healthcare Gateway
          </span>
          <h1 className="text-xl sm:text-2xl font-bold mt-1">
            ASHA / ANM Coordination Workspace
          </h1>
          <p className="text-xs text-amber-100 mt-1">
            Empowering community health workers with digital registration, rule-based triage, and follow-up tracking.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/healthworker/register"
            className="inline-flex items-center gap-1.5 bg-white text-amber-800 text-xs font-semibold px-4 py-2.5 rounded-xl shadow transition-all hover:bg-amber-50"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Register New Patient</span>
          </Link>
          <Link
            to="/healthworker/triage"
            className="inline-flex items-center gap-1.5 bg-amber-900/40 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/20 transition-all hover:bg-amber-900/60"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Conduct Health Triage</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold">Registered Patients</span>
            <Users className="w-4 h-4 text-brand-500" />
          </div>
          <p className="text-2xl font-bold text-navy-900">{totalPatients}</p>
          <p className="text-[10px] text-gray-400">Total community records</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold">Today's Consultations</span>
            <Calendar className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-navy-900">{todayAppointments}</p>
          <p className="text-[10px] text-gray-400">Scheduled for doctor</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold">Pending Follow-Ups</span>
            <ClipboardList className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-navy-900">{pendingFollowUps}</p>
          <p className="text-[10px] text-gray-400">Maternal & chronic tasks</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold">High-Risk Patients</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-600">{attentionPatients.length}</p>
          <p className="text-[10px] text-gray-400">Flagged RED / YELLOW</p>
        </div>
      </div>

      {/* Grid: Attention Patients & Recent Triage Assessments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* High Risk Patients Needing Review */}
        <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-navy-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <span>Patients Requiring Urgent Attention</span>
            </h2>
            <Link to="/healthworker/patients" className="text-xs font-semibold text-brand-600 hover:underline">
              View All →
            </Link>
          </div>

          <div className="space-y-2.5">
            {attentionPatients.map((pat) => (
              <div key={pat._id} className="p-3 bg-surface-bg rounded-xl border border-surface-border flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-navy-900">{pat.name}</p>
                    <span className="font-mono text-[10px] text-gray-400">({pat.patientId})</span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {pat.age}y {pat.gender} • {pat.village} {pat.pregnancy?.isPregnant && '• 🤰 Pregnant'}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    pat.riskLevel === 'RED' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {pat.riskLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Triage Evaluations */}
        <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-navy-900 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-brand-500" />
              <span>Recent Health Assessments</span>
            </h2>
            <Link to="/healthworker/triage" className="text-xs font-semibold text-brand-600 hover:underline">
              New Triage →
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentTriage.length > 0 ? (
              recentTriage.map((trg) => (
                <div key={trg._id} className="p-3 bg-surface-bg rounded-xl border border-surface-border space-y-1.5 text-xs">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-dark-text">{trg.patientId?.name || 'Community Patient'}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      trg.finalLevel === 'RED' ? 'bg-red-100 text-red-800' :
                      trg.finalLevel === 'YELLOW' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {trg.finalLevel}
                    </span>
                  </div>
                  <p className="text-gray-600 text-[11px] line-clamp-1">
                    {trg.explanationEnglish}
                  </p>
                  <p className="text-brand-700 text-[10px] font-medium line-clamp-1">
                    🇮🇳 {trg.explanationHindi}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500">No triage assessments recorded yet.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

