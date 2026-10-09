import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { appointmentApi } from '../../api/endpoints';
import { Video, User, FileText, Stethoscope, Clock, ShieldCheck } from 'lucide-react';

export const DoctorTeleconsultation = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const appointmentId = queryParams.get('appointmentId');

  const [appointments, setAppointments] = useState([]);
  const [selectedApt, setSelectedApt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOnlineApts = async () => {
      try {
        const res = await appointmentApi.getAll({ mode: 'Online' });
        if (res.data && res.data.length > 0) {
          setAppointments(res.data);
          const current = appointmentId
            ? res.data.find(a => a._id === appointmentId) || res.data[0]
            : res.data[0];
          setSelectedApt(current);
        }
      } catch (err) {
        console.error('Failed to load teleconsultations:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOnlineApts();
  }, [appointmentId]);

  if (loading) return <div className="p-8 text-center text-xs text-gray-500">Loading teleconsultation room...</div>;

  const roomName = selectedApt?.teleRoomId || 'SwasthSetu-GeneralRoom-2026';
  const jitsiUrl = `https://meet.jit.si/${encodeURIComponent(roomName)}#config.prejoinPageEnabled=false&config.startWithAudioMuted=false`;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900">Virtual Teleconsultation Suite (Jitsi Meet)</h1>
          <p className="text-xs text-gray-500 mt-1">
            End-to-end encrypted video encounters connecting village patients to specialist doctors.
          </p>
        </div>

        {selectedApt && (
          <Link
            to={`/doctor/consultation?appointmentId=${selectedApt._id}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs rounded-xl shadow-xs"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Open Prescription Pad</span>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Jitsi Meet Video Frame (Left Col 8) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-surface-border shadow-sm p-3 min-h-[520px] flex flex-col">
          <div className="flex-1 w-full rounded-xl overflow-hidden bg-slate-900 relative">
            <iframe
              src={jitsiUrl}
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              className="w-full h-[520px] border-0 rounded-xl"
              title="SwasthSetu Teleconsultation"
            />
          </div>
          <div className="p-3 text-[11px] text-gray-500 flex justify-between items-center">
            <span>Secure Demonstration Meeting Room: <strong className="font-mono text-dark-text">{roomName}</strong></span>
            <span className="text-emerald-600 font-semibold">● Audio/Video Active</span>
          </div>
        </div>

        {/* Patient Context Sidebar (Right Col 4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-xs space-y-4 text-xs">
            <h2 className="font-bold text-navy-900 flex items-center gap-2 border-b border-surface-border pb-2.5">
              <User className="w-4 h-4 text-brand-500" />
              <span>Connected Patient Details</span>
            </h2>

            {selectedApt ? (
              <div className="space-y-3">
                <div>
                  <p className="font-bold text-navy-900 text-sm">{selectedApt.patientId?.name}</p>
                  <p className="text-gray-500 text-[11px]">
                    ID: {selectedApt.patientId?.patientId} • {selectedApt.patientId?.age}y {selectedApt.patientId?.gender}
                  </p>
                  <p className="text-gray-500 text-[11px]">
                    Village: {selectedApt.patientId?.village}
                  </p>
                </div>

                <div className="p-2.5 bg-surface-bg rounded-xl space-y-1">
                  <p className="font-semibold text-gray-700">Reason for Telehealth:</p>
                  <p className="text-gray-600 text-[11px]">{selectedApt.reason || 'General medical review'}</p>
                </div>

                <div className="p-2.5 bg-brand-50 rounded-xl space-y-1">
                  <p className="font-semibold text-brand-900">Known Clinical Profile:</p>
                  <p className="text-brand-800 text-[11px]">
                    Conditions: {selectedApt.patientId?.conditions?.join(', ') || 'None documented'}
                  </p>
                  <p className="text-brand-800 text-[11px]">
                    Allergies: {selectedApt.patientId?.allergies?.join(', ') || 'None documented'}
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    to={`/doctor/consultation?appointmentId=${selectedApt._id}`}
                    className="block w-full py-2 text-center bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors"
                  >
                    Finish Call & Sign Rx →
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No online patient selected.</p>
            )}
          </div>

          {/* List of other scheduled online calls */}
          <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-gray-900">Today's Other Teleconsultations</h3>
            <div className="space-y-2">
              {appointments.map((a) => (
                <button
                  key={a._id}
                  onClick={() => setSelectedApt(a)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                    selectedApt?._id === a._id ? 'border-brand-500 bg-brand-50/50' : 'border-surface-border bg-surface-bg/40'
                  }`}
                >
                  <p className="font-bold text-dark-text">{a.patientId?.name}</p>
                  <p className="text-[10px] text-gray-500">{a.appointmentTime} • Token #{a.tokenNumber}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

