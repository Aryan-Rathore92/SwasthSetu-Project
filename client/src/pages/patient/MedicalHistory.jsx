import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { patientApi, teleApi } from '../../api/endpoints';
import { FileText, Download, Calendar, Stethoscope, Building2, User, Pill, Activity } from 'lucide-react';

export const MedicalHistory = () => {
  const { user } = useAuth();
  const [timeline, setTimeline] = useState([]);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const patientsRes = await patientApi.getAll({ search: user?.phone });
        if (patientsRes.data && patientsRes.data.length > 0) {
          const p = patientsRes.data[0];
          setPatient(p);
          const timelineRes = await patientApi.getTimeline(p._id);
          if (timelineRes.data) {
            setTimeline(timelineRes.data.timelineEvents || []);
          }
        }
      } catch (err) {
        console.error('Failed to load medical history:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  if (loading) return <div className="p-8 text-center text-xs text-gray-500">Loading electronic health record history...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900">Chronological Medical History</h1>
          <p className="text-xs text-gray-500 mt-1">
            Complete cross-facility electronic encounters for <span className="font-semibold text-dark-text">{patient?.name}</span> ({patient?.patientId})
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
          Consent-Verified Data Access
        </span>
      </div>

      {timeline.length > 0 ? (
        <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {timeline.map((evt, idx) => {
            const isEncounter = evt.type === 'ENCOUNTER';
            const isTriage = evt.type === 'TRIAGE';
            const isReferral = evt.type === 'REFERRAL';

            return (
              <div key={idx} className="relative space-y-2">
                {/* Timeline Node Dot */}
                <span className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-4 border-white shadow-xs ${
                  isEncounter ? 'bg-brand-500' : isTriage ? 'bg-amber-500' : 'bg-purple-600'
                }`} />

                <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1 border-b border-surface-border pb-2.5">
                    <div>
                      <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isEncounter ? 'bg-brand-50 text-brand-700' : isTriage ? 'bg-amber-50 text-amber-700' : 'bg-purple-50 text-purple-700'
                      }`}>
                        {evt.type}
                      </span>
                      <h3 className="text-sm font-bold text-navy-900 mt-1">{evt.title}</h3>
                    </div>
                    <span className="text-[11px] text-gray-400 font-mono">
                      {new Date(evt.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>

                  {/* Encounter Details */}
                  {isEncounter && (
                    <div className="space-y-3 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600">
                        <p><span className="font-semibold text-gray-700">Facility:</span> {evt.facility || 'Primary Health Centre'}</p>
                        <p><span className="font-semibold text-gray-700">Consultant:</span> Dr. {evt.doctor || 'Medical Officer'}</p>
                      </div>

                      {evt.data?.observations && (
                        <div className="p-2.5 bg-surface-bg rounded-lg">
                          <p className="font-semibold text-gray-700">Clinical Observations:</p>
                          <p className="text-gray-600 mt-0.5">{evt.data.observations}</p>
                        </div>
                      )}

                      {evt.data?.medicines && evt.data.medicines.length > 0 && (
                        <div>
                          <p className="font-semibold text-gray-700 mb-1">Prescribed Medicines:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {evt.data.medicines.map((m, mIdx) => (
                              <div key={mIdx} className="p-2 rounded-lg border border-surface-border bg-slate-50 flex items-center justify-between">
                                <div>
                                  <p className="font-bold text-dark-text">{m.name}</p>
                                  <p className="text-[10px] text-gray-500">{m.dosage} • {m.frequency}</p>
                                </div>
                                <span className="text-[10px] text-gray-400">{m.duration}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-2 flex justify-end">
                        <a
                          href={teleApi.getPdfDownloadUrl(evt.data._id)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold text-xs shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Formal Prescription (PDF)</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Triage Details */}
                  {isTriage && (
                    <div className="space-y-2 text-xs text-gray-600">
                      <p><span className="font-semibold">Conducted by:</span> {evt.performedBy || 'Health Worker'}</p>
                      <p className="p-2.5 bg-amber-50 rounded-lg text-amber-900 font-medium">
                        {evt.data?.explanationEnglish}
                      </p>
                    </div>
                  )}

                  {/* Referral Details */}
                  {isReferral && (
                    <div className="space-y-2 text-xs text-gray-600">
                      <p><span className="font-semibold">Transferred From:</span> {evt.from} → <span className="font-semibold">To:</span> {evt.to}</p>
                      <p className="p-2.5 bg-purple-50 rounded-lg text-purple-900 font-medium">
                        {evt.data?.reason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-surface-border shadow-xs space-y-2">
          <FileText className="w-8 h-8 text-gray-400 mx-auto" />
          <p className="text-xs font-semibold text-gray-700">No medical encounters recorded yet</p>
          <p className="text-[11px] text-gray-500">Your health records will automatically appear here once consults take place.</p>
        </div>
      )}
    </div>
  );
};

