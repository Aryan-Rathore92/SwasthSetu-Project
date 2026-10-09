import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { appointmentApi, teleApi, aiApi, patientApi } from '../../api/endpoints';
import {
  Stethoscope,
  Sparkles,
  Plus,
  Trash2,
  Download,
  CheckCircle2,
  FileText,
  User,
  Activity,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';

export const DoctorConsultation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const appointmentId = queryParams.get('appointmentId');

  const [appointment, setAppointment] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [completedEncounter, setCompletedEncounter] = useState(null);

  // Clinical Form State
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [observations, setObservations] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  // Medicines Array
  const [medicines, setMedicines] = useState([
    { name: 'Paracetamol 500mg', dosage: '500mg', frequency: '1-0-1 (Twice daily)', duration: '5 Days', instructions: 'After food' },
  ]);

  useEffect(() => {
    const loadData = async () => {
      if (!appointmentId) {
        // If none provided in query param, fetch first scheduled appointment
        const aptsRes = await appointmentApi.getAll();
        if (aptsRes.data && aptsRes.data.length > 0) {
          const firstApt = aptsRes.data[0];
          setAppointment(firstApt);
          setPatient(firstApt.patientId);
          setChiefComplaint(firstApt.reason || '');
        }
        setLoading(false);
        return;
      }

      try {
        const res = await appointmentApi.getById(appointmentId);
        if (res.data) {
          setAppointment(res.data);
          setPatient(res.data.patientId);
          setChiefComplaint(res.data.reason || '');
        }
      } catch (err) {
        console.error('Failed to load consultation appointment:', err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [appointmentId]);

  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      { name: '', dosage: '500mg', frequency: '1-0-0', duration: '5 Days', instructions: 'After meals' },
    ]);
  };

  const handleRemoveMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleGenerateAiSummary = async () => {
    if (!patient) return;
    setAiLoading(true);
    try {
      const res = await aiApi.getSummary(patient._id);
      if (res.data) {
        setAiSummary(res.data);
        toast.success('AI Medical Summary synthesized from electronic encounters!');
      }
    } catch (err) {
      toast.error('AI summary generation failed: ' + err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCompleteConsultation = async (e) => {
    e.preventDefault();
    if (!diagnosis.trim()) {
      toast.error('Please enter a clinical diagnosis');
      return;
    }

    setCompleting(true);
    try {
      const res = await teleApi.completeWithPrescription(appointment._id, {
        chiefComplaint,
        observations,
        diagnosis,
        medicines: medicines.filter(m => m.name.trim() !== ''),
        notes,
        followUpDate: followUpDate || null,
      });

      toast.success('Consultation finished and e-prescription created!');
      setCompletedEncounter(res.data);
    } catch (err) {
      toast.error(err.message || 'Failed to complete consultation');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-xs text-gray-500">Loading patient encounter...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-navy-900">Clinical Consultation Workbench</h1>
            {appointment && (
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
                Token #{appointment.tokenNumber}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Patient: <span className="font-semibold text-dark-text">{patient?.name}</span> ({patient?.age}y {patient?.gender}, {patient?.village}) • Patient ID: <span className="font-mono text-brand-600 font-bold">{patient?.patientId}</span>
          </p>
        </div>

        <button
          onClick={handleGenerateAiSummary}
          disabled={aiLoading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold text-xs shadow-xs hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{aiLoading ? 'Synthesizing...' : 'Generate AI Patient Summary'}</span>
        </button>
      </div>

      {/* AI Summary Banner if generated */}
      {aiSummary && (
        <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 p-5 rounded-2xl border border-purple-200 text-xs space-y-2">
          <div className="flex items-center gap-2 text-purple-900 font-bold">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>AI-Assisted Medical Context Summary (Clinical Decision Support)</span>
          </div>
          <p className="text-gray-800 leading-relaxed font-medium">{aiSummary.overview}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-gray-700">
            <p><span className="font-semibold">Chronic Conditions:</span> {aiSummary.chronicConditions}</p>
            <p><span className="font-semibold">Allergies:</span> {aiSummary.knownAllergies}</p>
            <p><span className="font-semibold">Medications:</span> {aiSummary.currentMedications}</p>
          </div>
          <p className="text-[10px] text-purple-700 italic pt-1 border-t border-purple-200">
            * {aiSummary.clinicalNotice}
          </p>
        </div>
      )}

      {/* Completion Modal / Banner */}
      {completedEncounter ? (
        <div className="bg-white p-8 rounded-2xl border border-surface-border shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-navy-900">Consultation Finished Successfully!</h2>
          <p className="text-xs text-gray-600">
            Diagnosis: <span className="font-semibold text-dark-text">{completedEncounter.diagnosis}</span> • E-Prescription issued with demo security watermark.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <a
              href={teleApi.getPdfDownloadUrl(completedEncounter.encounterId)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold text-xs shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Download Printable Prescription (PDF)</span>
            </a>
            <button
              onClick={() => navigate('/doctor/queue')}
              className="px-5 py-2.5 border border-gray-300 rounded-xl font-semibold text-xs text-gray-700 hover:bg-gray-50"
            >
              Return to Queue
            </button>
          </div>
        </div>
      ) : (
        /* Clinical Consultation Form */
        <form onSubmit={handleCompleteConsultation} className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-border shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Chief Complaint *</label>
              <input
                type="text"
                required
                placeholder="e.g. Severe headache, persistent cough"
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Clinical Diagnosis *</label>
              <input
                type="text"
                required
                placeholder="e.g. Essential Stage 1 Hypertension"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">Clinical Observations & Physical Examination</label>
              <textarea
                rows={2}
                placeholder="BP, Heart sounds, Chest auscultation, systemic findings..."
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Medicines Prescription Builder */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center border-b border-surface-border pb-2">
              <h2 className="text-sm font-bold text-navy-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-brand-500" />
                <span>Prescription Drugs & Dosages</span>
              </h2>
              <button
                type="button"
                onClick={handleAddMedicine}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-lg border border-brand-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Drug</span>
              </button>
            </div>

            <div className="space-y-2">
              {medicines.map((med, idx) => (
                <div key={idx} className="p-3 bg-surface-bg rounded-xl border border-surface-border grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs items-center">
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      placeholder="Medicine name"
                      value={med.name}
                      onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-surface-border rounded-lg bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Dosage (500mg)"
                      value={med.dosage}
                      onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-surface-border rounded-lg bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Frequency (1-0-1)"
                      value={med.frequency}
                      onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-surface-border rounded-lg bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Duration (5 Days)"
                      value={med.duration}
                      onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-surface-border rounded-lg bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Instructions"
                      value={med.instructions}
                      onChange={(e) => handleMedicineChange(idx, 'instructions', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-surface-border rounded-lg bg-white"
                    />
                    {medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicine(idx)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs pt-2">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Lifestyle Advice & Instructions</label>
              <textarea
                rows={2}
                placeholder="Dietary instructions, salt restriction, rest advice..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Recommended Follow-Up Date</label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-surface-border flex justify-end gap-3">
            <button
              type="submit"
              disabled={completing}
              className="inline-flex items-center gap-2 px-8 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs rounded-xl shadow-md transition-colors disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{completing ? 'Issuing Prescription...' : 'Complete Encounter & Sign Prescription'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

