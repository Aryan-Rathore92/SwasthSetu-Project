import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { appointmentApi } from '../../api/endpoints';
import { ClipboardList, Stethoscope, Video, CheckCircle2, Clock, Play } from 'lucide-react';
import { toast } from 'sonner';

export const DoctorQueue = () => {
  const { user } = useAuth();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadQueue = async () => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const res = await appointmentApi.getAll({
        doctorId: user?._id,
        date: todayStr,
      });
      if (res.data) setQueue(res.data);
    } catch (err) {
      console.error('Failed to load doctor queue:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, [user]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await appointmentApi.updateStatus(id, newStatus);
      toast.success(`Patient queue status changed to '${newStatus}'`);
      loadQueue();
    } catch (err) {
      toast.error('Failed to update status: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900">Live Consultation Queue</h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time OPD tokens and scheduled telehealth sessions for Dr. {user?.name}.
          </p>
        </div>
        <button
          onClick={loadQueue}
          className="self-start sm:self-auto px-4 py-2 text-xs font-semibold bg-white border border-surface-border rounded-xl text-gray-700 hover:bg-surface-bg"
        >
          🔄 Refresh Queue
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-surface-border text-gray-500 font-semibold">
              <tr>
                <th className="px-5 py-3.5">Token</th>
                <th className="px-5 py-3.5">Patient Details</th>
                <th className="px-5 py-3.5">Time & Mode</th>
                <th className="px-5 py-3.5">Triage Urgency</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">Loading live patient queue...</td>
                </tr>
              ) : queue.length > 0 ? (
                queue.map((apt) => (
                  <tr key={apt._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="w-7 h-7 rounded-lg bg-brand-50 text-brand-700 font-bold flex items-center justify-center border border-brand-200">
                        #{apt.tokenNumber}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-navy-900">{apt.patientId?.name}</p>
                      <p className="text-[11px] text-gray-500">
                        {apt.patientId?.age}y {apt.patientId?.gender} • {apt.patientId?.village || 'Rampur Kalan'}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-dark-text">{apt.appointmentTime || '10:30 AM'}</p>
                      <p className="text-[11px] text-gray-500">{apt.mode}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        apt.patientId?.riskLevel === 'RED' ? 'bg-red-100 text-red-800 border border-red-200' :
                        apt.patientId?.riskLevel === 'YELLOW' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {apt.patientId?.riskLevel || 'GREEN'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        apt.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                        apt.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      {apt.status !== 'In Progress' && apt.status !== 'Completed' && (
                        <button
                          onClick={() => handleUpdateStatus(apt._id, 'In Progress')}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg font-semibold text-[11px] hover:bg-blue-100"
                        >
                          Call Next
                        </button>
                      )}

                      <Link
                        to={`/doctor/consultation?appointmentId=${apt._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-navy-900 hover:bg-navy-800 text-white rounded-lg font-semibold text-[11px] transition-colors"
                      >
                        <Stethoscope className="w-3 h-3" />
                        <span>Examine & Rx</span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No consultations scheduled in today's OPD queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

