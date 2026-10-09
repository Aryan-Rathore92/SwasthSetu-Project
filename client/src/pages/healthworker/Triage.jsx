import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { patientApi, triageApi } from '../../api/endpoints';
import { Stethoscope, AlertTriangle, CheckCircle2, ShieldAlert, HeartPulse, Activity, Globe } from 'lucide-react';
import { toast } from 'sonner';

export const HealthWorkerTriage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialPatientId = queryParams.get('patientId') || '';

  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(initialPatientId);
  const [loading, setLoading] = useState(false);
  const [triageResult, setTriageResult] = useState(null);

  // Vitals & Symptoms Form
  const [formData, setFormData] = useState({
    symptoms: 'Fever, Severe headache, Blurred vision',
    symptomDuration: '2 days',
    temperature: '101.4',
    bpSystolic: '158',
    bpDiastolic: '98',
    spo2: '94',
    bloodSugar: '140',
    pulse: '88',
    pregnancyConcern: false,
    additionalObservations: '',
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await patientApi.getAll();
        if (res.data) {
          setPatients(res.data);
          if (!selectedPatientId && res.data.length > 0) {
            setSelectedPatientId(res.data[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to load patients for triage:', err.message);
      }
    };
    fetchPatients();
  }, []);

  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (!selectedPatientId) {
      toast.error('Please select a patient to assess');
      return;
    }

    setLoading(true);
    try {
      const res = await triageApi.evaluate({
        patientId: selectedPatientId,
        symptoms: formData.symptoms.split(',').map(s => s.trim()).filter(Boolean),
        symptomDuration: formData.symptomDuration,
        vitals: {
          temperature: formData.temperature ? Number(formData.temperature) : undefined,
          bpSystolic: formData.bpSystolic ? Number(formData.bpSystolic) : undefined,
          bpDiastolic: formData.bpDiastolic ? Number(formData.bpDiastolic) : undefined,
          spo2: formData.spo2 ? Number(formData.spo2) : undefined,
          bloodSugar: formData.bloodSugar ? Number(formData.bloodSugar) : undefined,
          pulse: formData.pulse ? Number(formData.pulse) : undefined,
        },
        pregnancyConcern: formData.pregnancyConcern,
        additionalObservations: formData.additionalObservations,
      });

      setTriageResult(res.data);
      toast.success(`Triage Evaluation Completed: ${res.data?.finalLevel} Priority`);
    } catch (err) {
      toast.error(err.message || 'Triage evaluation failed');
    } finally {
      setLoading(false);
    }
  };

  const selectedPatient = patients.find(p => p._id === selectedPatientId);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-navy-900">Health Assessment & Rule-Based Triage Engine</h1>
        <p className="text-xs text-gray-500 mt-1">
          Frontline demonstration clinical scoring and bilingual AI-assisted decision support.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Assessment Input Form (Left Col 7) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-2xl border border-surface-border shadow-xs space-y-5">
          <form onSubmit={handleEvaluate} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Select Patient *</label>
              <select
                required
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
              >
                {patients.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.patientId}) - {p.village} ({p.age}y {p.gender})
                  </option>
                ))}
              </select>
            </div>

            {selectedPatient && (
              <div className="p-3 bg-surface-bg rounded-xl border border-surface-border flex items-center justify-between">
                <div>
                  <p className="font-bold text-dark-text">{selectedPatient.name}</p>
                  <p className="text-[11px] text-gray-500">
                    Known: {selectedPatient.conditions?.join(', ') || 'No known conditions'}
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                  Current: {selectedPatient.riskLevel}
                </span>
              </div>
            )}

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Symptoms (comma separated) *</label>
              <input
                type="text"
                required
                placeholder="e.g. High fever, Shortness of breath, Chest pain"
                value={formData.symptoms}
                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Duration of Symptoms</label>
              <select
                value={formData.symptomDuration}
                onChange={(e) => setFormData({ ...formData, symptomDuration: e.target.value })}
                className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
              >
                <option value="Few hours">Few hours</option>
                <option value="1-2 days">1-2 days</option>
                <option value="3-5 days">3-5 days</option>
                <option value="More than a week">More than a week</option>
              </select>
            </div>

            {/* Vitals Form */}
            <div className="pt-2">
              <p className="font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-brand-500" />
                <span>Recorded Clinical Vitals</span>
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Temp (°F)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 98.6"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">BP Systolic (mmHg)</label>
                  <input
                    type="number"
                    placeholder="e.g. 120"
                    value={formData.bpSystolic}
                    onChange={(e) => setFormData({ ...formData, bpSystolic: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">BP Diastolic (mmHg)</label>
                  <input
                    type="number"
                    placeholder="e.g. 80"
                    value={formData.bpDiastolic}
                    onChange={(e) => setFormData({ ...formData, bpDiastolic: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">SpO2 (%)</label>
                  <input
                    type="number"
                    placeholder="e.g. 98"
                    value={formData.spo2}
                    onChange={(e) => setFormData({ ...formData, spo2: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Blood Sugar (mg/dL)</label>
                  <input
                    type="number"
                    placeholder="e.g. 110"
                    value={formData.bloodSugar}
                    onChange={(e) => setFormData({ ...formData, bloodSugar: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Pulse Rate (bpm)</label>
                  <input
                    type="number"
                    placeholder="e.g. 72"
                    value={formData.pulse}
                    onChange={(e) => setFormData({ ...formData, pulse: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.pregnancyConcern}
                  onChange={(e) => setFormData({ ...formData, pregnancyConcern: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded"
                />
                <span>Patient is pregnant or antenatal status is involved</span>
              </label>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Additional Observations / Danger Signs</label>
              <textarea
                rows={2}
                placeholder="Note any visible edema, cyanosis, mental alertness changes..."
                value={formData.additionalObservations}
                onChange={(e) => setFormData({ ...formData, additionalObservations: e.target.value })}
                className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              {loading ? 'Evaluating Rules & AI Explanations...' : 'Evaluate & Score Clinical Triage'}
            </button>
          </form>
        </div>

        {/* Evaluation Output Card (Right Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-sm font-bold text-navy-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-500" />
            <span>Triage Output & Next Steps</span>
          </h2>

          {triageResult ? (
            <div className={`p-6 rounded-2xl border shadow-sm space-y-4 text-xs ${
              triageResult.finalLevel === 'RED' ? 'bg-red-50/70 border-red-200' :
              triageResult.finalLevel === 'YELLOW' ? 'bg-amber-50/70 border-amber-200' :
              'bg-emerald-50/70 border-emerald-200'
            }`}>
              {/* Level Header Badge */}
              <div className="flex items-center justify-between border-b pb-3 border-gray-200/60">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Urgency Category</span>
                  <h3 className={`text-base font-extrabold ${
                    triageResult.finalLevel === 'RED' ? 'text-red-700' :
                    triageResult.finalLevel === 'YELLOW' ? 'text-amber-700' : 'text-emerald-700'
                  }`}>
                    {triageResult.finalLevel === 'RED' ? 'RED — URGENT CLINICAL ATTENTION' :
                     triageResult.finalLevel === 'YELLOW' ? 'YELLOW — NEEDS TIMELY REVIEW' :
                     'GREEN — ROUTINE FOLLOW-UP'}
                  </h3>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-xs ${
                  triageResult.finalLevel === 'RED' ? 'bg-red-600' :
                  triageResult.finalLevel === 'YELLOW' ? 'bg-amber-500' : 'bg-emerald-600'
                }`}>
                  {triageResult.finalLevel[0]}
                </div>
              </div>

              {/* Triggered Rules */}
              <div>
                <p className="font-bold text-gray-800 mb-1">Triggered Clinical Rules:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-0.5">
                  {triageResult.triggeredRules?.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              {/* English Explanation */}
              <div className="bg-white p-3 rounded-xl border border-surface-border space-y-1">
                <p className="font-bold text-navy-900 flex items-center gap-1.5">
                  <span>English Summary for Care Team:</span>
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {triageResult.explanationEnglish}
                </p>
              </div>

              {/* Hindi Explanation */}
              <div className="bg-white p-3 rounded-xl border border-surface-border space-y-1">
                <p className="font-bold text-navy-900 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-brand-500" />
                  <span>सरल हिंदी विवरण (मरीज व परिजन हेतु):</span>
                </p>
                <p className="text-gray-800 font-medium leading-relaxed">
                  {triageResult.explanationHindi}
                </p>
              </div>

              {/* Prescribed Next Steps */}
              <div>
                <p className="font-bold text-gray-800 mb-1">Recommended Action Protocol:</p>
                <ul className="list-decimal list-inside text-gray-700 space-y-1">
                  {triageResult.nextSteps?.map((ns, i) => (
                    <li key={i}>{ns}</li>
                  ))}
                </ul>
              </div>

              {/* Safety Disclaimer */}
              <p className="text-[10px] text-gray-500 italic pt-2 border-t border-gray-200/60">
                * {triageResult.disclaimer}
              </p>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-300 text-xs text-gray-500 space-y-2">
              <Stethoscope className="w-8 h-8 text-gray-400 mx-auto" />
              <p className="font-semibold text-gray-700">Awaiting Assessment Submission</p>
              <p className="text-[11px] text-gray-500">Record symptoms and vitals on the left to evaluate clinical priority.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

