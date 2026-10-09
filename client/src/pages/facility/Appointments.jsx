import React, { useState, useEffect } from 'react';
import { appointmentApi } from '../../api/endpoints';
import { Calendar, Clock, User, CheckCircle2, Play } from 'lucide-react';
import { toast } from 'sonner';

export const FacilityAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    try {
      const res = await appointmentApi.getAll();
      if (res.data) setAppointments(res.data);
    } catch (err) {
      console.error('Failed to load facility appointments:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await appointmentApi.updateStatus(id, status);
      toast.success(`Status updated to '${status}'`);
      loadAppointments();
    } catch (err) {
      toast.error('Failed to update appointment: ' + err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-navy-900">Facility Appointments & OPD Queue Operations</h1>
          <p className="text-xs text-gray-500 mt-1">Manage physical patient flow, waiting tokens, and consultation states.</p>
        </div>
        <button
          onClick={loadAppointments}
          className="px-3.5 py-1.5 text-xs font-semibold bg-white border border-surface-border rounded-xl text-gray-700 hover:bg-surface-bg"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-surface-border text-gray-500 font-semibold">
            <tr>
              <th className="px-5 py-3.5">Token #</th>
              <th className="px-5 py-3.5">Patient Details</th>
              <th className="px-5 py-3.5">Doctor & Dept</th>
              <th className="px-5 py-3.5">Date & Time</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Operational Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">Loading facility appointments...</td>
              </tr>
            ) : appointments.length > 0 ? (
              appointments.map((apt) => (
                <tr key={apt._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
                      #{apt.tokenNumber}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-navy-900">{apt.patientId?.name}</p>
                    <p className="text-[11px] text-gray-500">{apt.patientId?.phone}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-dark-text">Dr. {apt.doctorId?.name}</p>
                    <p className="text-[11px] text-gray-500">{apt.department}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">
                    <p>{apt.appointmentDate}</p>
                    <p className="text-[11px] text-gray-400">{apt.appointmentTime} ({apt.mode})</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      apt.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                      apt.status === 'Waiting' ? 'bg-amber-100 text-amber-800' :
                      apt.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-1.5">
                    {apt.status === 'Scheduled' && (
                      <button
                        onClick={() => handleUpdateStatus(apt._id, 'Waiting')}
                        className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg font-semibold text-[11px] hover:bg-amber-100"
                      >
                        Check-in (Waiting)
                      </button>
                    )}
                    {apt.status === 'Waiting' && (
                      <button
                        onClick={() => handleUpdateStatus(apt._id, 'In Progress')}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg font-semibold text-[11px] hover:bg-blue-100"
                      >
                        Send to Doctor
                      </button>
                    )}
                    {apt.status === 'In Progress' && (
                      <button
                        onClick={() => handleUpdateStatus(apt._id, 'Completed')}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-semibold text-[11px] hover:bg-emerald-100"
                      >
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">No appointments scheduled for this facility.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

