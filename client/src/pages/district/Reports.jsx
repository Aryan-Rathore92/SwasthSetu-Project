import React, { useState } from 'react';
import api from '../../api/client';
import { FileText, Download, Code, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export const DistrictReports = () => {
  const [patientId, setPatientId] = useState('P-10001');
  const [fhirData, setFhirData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetchFhir = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      // Direct call to FHIR endpoint
      const res = await api.get(`/fhir/Patient/${patientId}`);
      setFhirData(res);
      toast.success(`FHIR R4 Patient resource generated for ${patientId}`);
    } catch (err) {
      toast.error('Failed to generate FHIR resource: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy-900">Health Interoperability & FHIR R4 Demonstration</h1>
        <p className="text-xs text-gray-500 mt-1">
          Export standardized HL7 FHIR R4 electronic health records for cross-platform interoperability.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-700 bg-brand-50 p-3 rounded-xl border border-brand-200">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>FHIR-Compatible Demonstration Export — Aligned with Indian ABDM health data standards.</span>
        </div>

        <form onSubmit={handleFetchFhir} className="flex flex-col sm:flex-row gap-3 pt-2">
          <input
            type="text"
            required
            placeholder="Enter Patient ID (e.g. P-10001)"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="flex-1 px-3 py-2 text-xs border border-surface-border rounded-xl focus:outline-none focus:border-brand-500 font-mono"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-xl font-semibold text-xs transition-colors disabled:opacity-50"
          >
            {loading ? 'Exporting FHIR JSON...' : 'Export FHIR R4 Patient Resource'}
          </button>
        </form>

        {fhirData && (
          <div className="pt-4 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-gray-700">HL7 FHIR R4 Compliant JSON Payload:</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(fhirData, null, 2));
                  toast.success('FHIR JSON copied to clipboard!');
                }}
                className="text-brand-600 font-bold hover:underline"
              >
                Copy JSON
              </button>
            </div>

            <pre className="p-4 bg-slate-900 text-emerald-400 rounded-xl text-[11px] overflow-x-auto max-h-96 font-mono border border-slate-800">
              {JSON.stringify(fhirData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

