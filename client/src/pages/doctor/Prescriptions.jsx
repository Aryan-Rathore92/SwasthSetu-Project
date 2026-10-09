import React, { useState, useEffect } from 'react';
import { teleApi, patientApi } from '../../api/endpoints';
import { FileText, Download, User, Calendar, Pill } from 'lucide-react';

export const DoctorPrescriptions = () => {
  const [encounters, setEncounters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const patientsRes = await patientApi.getAll();
        if (patientsRes.data && patientsRes.data.length > 0) {
          // Fetch timeline of patients to gather issued prescriptions
          const p1 = patientsRes.data[0];
          const timelineRes = await patientApi.getTimeline(p1._id);
          if (timelineRes.data) {
            setEncounters(timelineRes.data.encounters || []);
          }
        }
      } catch (err) {
        console.error('Failed to load doctor prescriptions:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  if (loading) return <div className="p-8 text-center text-xs text-gray-500">Loading prescription archive...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy-900">Digitally Issued Prescriptions Archive</h1>
        <p className="text-xs text-gray-500 mt-1">
          Historical record of signed clinical consultations and generated PDF prescriptions.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-surface-border text-gray-500 font-semibold">
            <tr>
              <th className="px-5 py-3.5">Date</th>
              <th className="px-5 py-3.5">Patient Name</th>
              <th className="px-5 py-3.5">Clinical Diagnosis</th>
              <th className="px-5 py-3.5">Prescribed Medicines</th>
              <th className="px-5 py-3.5">Follow-Up Date</th>
              <th className="px-5 py-3.5 text-right">Prescription PDF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {encounters.length > 0 ? (
              encounters.map((enc) => (
                <tr key={enc._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5 text-gray-500">
                    {new Date(enc.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-navy-900">
                    {enc.patientId?.name || 'Rameshwar Yadav'}
                  </td>
                  <td className="px-5 py-3.5 text-dark-text font-semibold">
                    {enc.diagnosis}
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">
                    {enc.medicines?.map(m => m.name).join(', ') || 'None'}
                  </td>
                  <td className="px-5 py-3.5 text-red-600 font-semibold">
                    {enc.followUpDate || 'None scheduled'}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <a
                      href={teleApi.getPdfDownloadUrl(enc._id)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold text-xs shadow-2xs transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download PDF</span>
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">
                  No consultation records found in archive.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

