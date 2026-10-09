import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { patientApi, teleApi } from '../../api/endpoints';
import { FileText, Download, Calendar, Pill, Stethoscope, Building } from 'lucide-react';

export const PatientPrescriptions = () => {
  const { user } = useAuth();
  const [encounters, setEncounters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const patientsRes = await patientApi.getAll({ search: user?.phone });
        if (patientsRes.data && patientsRes.data.length > 0) {
          const p = patientsRes.data[0];
          const timelineRes = await patientApi.getTimeline(p._id);
          if (timelineRes.data) {
            setEncounters(timelineRes.data.encounters || []);
          }
        }
      } catch (err) {
        console.error('Failed to load prescriptions:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, [user]);

  if (loading) return <div className="p-8 text-center text-xs text-gray-500">Loading verified prescriptions...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900">E-Prescriptions & Medical Orders</h1>
          <p className="text-xs text-gray-500 mt-1">
            Official digitally signed doctor prescriptions with downloadable demo PDFs.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {encounters.length} Active Records
        </span>
      </div>

      {encounters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {encounters.map((enc) => (
            <div key={enc._id} className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs space-y-4">
              <div className="flex justify-between items-start border-b border-surface-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-navy-900">{enc.diagnosis}</h3>
                  <p className="text-xs text-gray-500">
                    Dr. {enc.doctorId?.name || 'Medical Officer'} • {enc.facilityId?.name}
                  </p>
                </div>
                <span className="text-[11px] text-gray-400 font-mono">
                  {new Date(enc.createdAt).toLocaleDateString('en-IN')}
                </span>
              </div>

              {/* Medicine Table */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-700">Prescribed Dosages:</p>
                <div className="space-y-1.5">
                  {enc.medicines?.map((m, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-surface-bg border border-surface-border flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <p className="font-bold text-dark-text">{m.name}</p>
                        <p className="text-[11px] text-gray-500">{m.dosage} • {m.frequency}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                          {m.duration}
                        </span>
                        <p className="text-[10px] text-gray-400 mt-0.5">{m.instructions || 'After meals'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {enc.notes && (
                <p className="text-xs text-gray-600 bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/50">
                  <span className="font-semibold text-amber-900">Lifestyle Advice:</span> {enc.notes}
                </p>
              )}

              {enc.followUpDate && (
                <p className="text-xs font-semibold text-red-600">
                  Follow-Up Review Date: {enc.followUpDate}
                </p>
              )}

              <div className="pt-2 border-t border-surface-border flex justify-end">
                <a
                  href={teleApi.getPdfDownloadUrl(enc._id)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold text-xs shadow-xs transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Clean PDF Rx</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-surface-border text-xs text-gray-500">
          No medical prescriptions found on record.
        </div>
      )}
    </div>
  );
};

