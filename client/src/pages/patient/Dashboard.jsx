import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  GitBranch,
  FileText,
  Video,
  AlertCircle,
  Building2,
  Download,
  PlusCircle,
  Pill,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dashboardApi, teleApi } from '../../api/endpoints';
import { toast } from 'sonner';

export const PatientDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardApi.getPatient();
        if (res.data) setData(res.data);
      } catch (err) {
        console.error('Failed to load patient dashboard:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-xs text-gray-500">Loading patient healthcare dashboard...</div>;
  }

  const { patient, nextAppointment, recentAppointments = [], activeReferrals = [], prescriptions = [], followUps = [] } = data || {};

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-brand-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-500/30 text-brand-300">
            Digital Health Portal
          </span>
          <h1 className="text-xl sm:text-2xl font-bold mt-1">
            Namaste, {patient?.name || user?.name}!
          </h1>
          <p className="text-xs text-gray-300 mt-1">
            Village: <span className="font-semibold text-white">{patient?.village || 'Rampur Kalan'}</span> • District: {patient?.district || 'Sitapur'} • ID: {patient?.patientId || 'P-10001'}
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/patient/appointments"
            className="inline-flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Book Appointment</span>
          </Link>
          <Link
            to="/patient/medicines"
            className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/20 transition-all"
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Find Medicines</span>
          </Link>
        </div>
      </div>

      {/* Grid: Next Appointment & Active Referrals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Next Scheduled Appointment */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-surface-border p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-dark-text flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-500" />
              <span>Next Upcoming Consultation</span>
            </h2>
            {nextAppointment && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-brand-50 text-brand-600 border border-brand-200">
                Token #{nextAppointment.tokenNumber}
              </span>
            )}
          </div>

          {nextAppointment ? (
            <div className="p-4 bg-surface-bg rounded-xl border border-surface-border space-y-3">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <p className="text-sm font-bold text-navy-900">
                    Dr. {nextAppointment.doctorId?.name || 'Assigned Medical Officer'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {nextAppointment.department} • {nextAppointment.facilityId?.name}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    nextAppointment.status === 'Waiting' ? 'bg-amber-100 text-amber-800' :
                    nextAppointment.status === 'In Progress' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {nextAppointment.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 pt-2 border-t border-gray-200/60">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>{nextAppointment.appointmentDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>{nextAppointment.appointmentTime || '10:30 AM'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-gray-400" />
                  <span>Mode: {nextAppointment.mode}</span>
                </div>
              </div>

              {nextAppointment.mode === 'Online' && (
                <div className="pt-2">
                  <a
                    href={`https://meet.jit.si/${nextAppointment.teleRoomId || 'SwasthSetu-Demo'}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Video Consultation (Jitsi Meet)</span>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center bg-surface-bg rounded-xl border border-dashed border-gray-300">
              <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-gray-700">No appointments scheduled today</p>
              <p className="text-[11px] text-gray-500 mt-1">Book an appointment or visit your nearest Sub-Centre.</p>
              <Link to="/patient/appointments" className="inline-block mt-3 text-xs font-bold text-brand-600 hover:underline">
                Book a Slot →
              </Link>
            </div>
          )}
        </div>

        {/* Active Referrals Tracker Card */}
        <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-dark-text flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-brand-500" />
            <span>Active Hospital Referrals</span>
          </h2>

          {activeReferrals.length > 0 ? (
            <div className="space-y-3">
              {activeReferrals.map((ref) => (
                <div key={ref._id} className="p-3 bg-surface-bg rounded-xl border border-surface-border text-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-navy-900">{ref.toFacilityId?.name}</p>
                      <p className="text-[10px] text-gray-500">From: {ref.fromFacilityId?.name}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      {ref.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-[11px] line-clamp-2">
                    {ref.reason}
                  </p>
                  <p className="text-[10px] text-brand-600 font-semibold">
                    Priority: {ref.priority}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center bg-surface-bg rounded-xl border border-dashed border-gray-300 text-xs text-gray-500">
              No active referrals. Your healthcare is being managed locally.
            </div>
          )}
        </div>
      </div>

      {/* Recent Prescriptions & Encounters */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-dark-text flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-500" />
            <span>Recent Medical Prescriptions</span>
          </h2>
          <Link to="/patient/prescriptions" className="text-xs font-semibold text-brand-600 hover:underline">
            View All →
          </Link>
        </div>

        {prescriptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prescriptions.map((enc) => (
              <div key={enc._id} className="p-4 bg-surface-bg rounded-xl border border-surface-border text-xs space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-navy-900">{enc.diagnosis}</p>
                    <p className="text-[10px] text-gray-500">Dr. {enc.doctorId?.name || 'Medical Officer'} • {enc.facilityId?.name}</p>
                  </div>
                  <a
                    href={teleApi.getPdfDownloadUrl(enc._id)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-600 bg-white border border-brand-200 px-2 py-1 rounded-md shadow-2xs hover:bg-brand-50"
                  >
                    <Download className="w-3 h-3" />
                    <span>PDF Rx</span>
                  </a>
                </div>
                <div className="space-y-1 pt-1">
                  <p className="text-[11px] font-semibold text-gray-700">Prescribed Medicines:</p>
                  <ul className="list-disc list-inside text-[11px] text-gray-600 space-y-0.5">
                    {enc.medicines?.map((m, i) => (
                      <li key={i}>{m.name} - {m.dosage} ({m.frequency})</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500">No prescriptions found on record.</p>
        )}
      </div>
    </div>
  );
};

