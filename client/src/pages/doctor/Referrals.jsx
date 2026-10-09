import React, { useState, useEffect } from 'react';
import { referralApi, facilityApi, patientApi } from '../../api/endpoints';
import { GitBranch, Plus, Building2, User, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export const DoctorReferrals = () => {
  const [referrals, setReferrals] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    patientId: '',
    toFacilityId: '',
    department: 'Cardiology',
    reason: '',
    priority: 'Urgent',
    notes: '',
  });

  const loadData = async () => {
    try {
      const [refRes, facRes, patRes] = await Promise.all([
        referralApi.getAll(),
        facilityApi.getAll(),
        patientApi.getAll(),
      ]);

      if (refRes.data) setReferrals(refRes.data);
      if (facRes.data) {
        setFacilities(facRes.data);
        if (facRes.data.length > 0) setFormData(p => ({ ...p, toFacilityId: facRes.data[0]._id }));
      }
      if (patRes.data) {
        setPatients(patRes.data);
        if (patRes.data.length > 0) setFormData(p => ({ ...p, patientId: patRes.data[0]._id }));
      }
    } catch (err) {
      console.error('Failed to load doctor referrals:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateReferral = async (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.toFacilityId || !formData.reason.trim()) {
      toast.error('Please fill in patient, facility, and clinical reason');
      return;
    }

    setSubmitting(true);
    try {
      await referralApi.create({
        patientId: formData.patientId,
        toFacilityId: formData.toFacilityId,
        department: formData.department,
        reason: formData.reason,
        priority: formData.priority,
        notes: formData.notes,
      });

      toast.success('Patient referral dispatched to destination facility!');
      setCreateModalOpen(false);
      setFormData(prev => ({ ...prev, reason: '', notes: '' }));
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to create referral');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-xs text-gray-500">Loading referral management...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900">Multi-Tier Healthcare Referral Network</h1>
          <p className="text-xs text-gray-500 mt-1">
            Seamless patient transfer from Primary Health Centres to CHCs and District Hospitals.
          </p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Initiate Clinical Referral</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {referrals.map((ref) => (
          <div key={ref._id} className="bg-white rounded-2xl border border-surface-border p-5 shadow-xs space-y-3 text-xs">
            <div className="flex justify-between items-start">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                ref.priority === 'Emergency' ? 'bg-red-100 text-red-800' :
                ref.priority === 'Urgent' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {ref.priority} Priority
              </span>

              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                ref.status === 'Closed' ? 'bg-emerald-100 text-emerald-800' :
                ref.status === 'Arrived' ? 'bg-indigo-100 text-indigo-800' :
                ref.status === 'Accepted' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {ref.status}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-navy-900 text-sm">{ref.patientId?.name || 'Patient'}</h3>
              <p className="text-[11px] text-gray-500">
                To: <span className="font-semibold text-dark-text">{ref.toFacilityId?.name}</span> ({ref.department})
              </p>
            </div>

            <p className="p-2.5 bg-surface-bg rounded-xl text-gray-700 leading-relaxed">
              {ref.reason}
            </p>

            {/* Timeline Progress */}
            <div className="pt-2 border-t border-surface-border text-[11px] text-gray-500 space-y-1">
              <p className="font-semibold text-gray-700">Audit Milestones:</p>
              {ref.timeline?.map((tl, i) => (
                <div key={i} className="flex items-center gap-1.5 text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                  <span>{tl.status} - {new Date(tl.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Referral Creation Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-navy-900 border-b border-surface-border pb-3">
              Initiate Patient Referral to Higher Facility
            </h3>

            <form onSubmit={handleCreateReferral} className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Select Patient *</label>
                <select
                  required
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  className="w-full px-3 py-2 border border-surface-border rounded-lg"
                >
                  {patients.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.patientId}) - {p.village}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Destination Facility *</label>
                <select
                  required
                  value={formData.toFacilityId}
                  onChange={(e) => setFormData({ ...formData, toFacilityId: e.target.value })}
                  className="w-full px-3 py-2 border border-surface-border rounded-lg"
                >
                  {facilities.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.name} ({f.type}) - {f.district}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Specialized Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-surface-border rounded-lg"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Obstetrics & Gynaecology">Obstetrics & Gynaecology</option>
                    <option value="General Surgery">General Surgery</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pulmonology / ICU">Pulmonology / ICU</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Clinical Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-surface-border rounded-lg"
                  >
                    <option value="Routine">Routine (3-5 days)</option>
                    <option value="Urgent">Urgent (24-48 hours)</option>
                    <option value="Emergency">Emergency (Immediate transfer)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Reason for Referral *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Uncontrolled blood pressure needing ECG & Specialist review..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-surface-border rounded-lg"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold shadow-xs disabled:opacity-50"
                >
                  {submitting ? 'Transmitting...' : 'Send Referral Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

