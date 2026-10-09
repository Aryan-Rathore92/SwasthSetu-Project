import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientApi } from '../../api/endpoints';
import { UserPlus, CheckCircle2, ShieldCheck, HeartPulse, User, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export const RegisterPatient = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [createdPatient, setCreatedPatient] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Female',
    phone: '',
    village: 'Rampur Kalan',
    district: 'Sitapur',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    conditions: '',
    allergies: '',
    isPregnant: false,
    trimester: 1,
    consentForSharing: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.phone || !formData.village) {
      toast.error('Please fill in all mandatory fields');
      return;
    }

    setLoading(true);
    try {
      const res = await patientApi.create({
        name: formData.name.trim(),
        age: Number(formData.age),
        gender: formData.gender,
        phone: formData.phone.trim(),
        village: formData.village.trim(),
        district: formData.district.trim(),
        address: formData.address.trim(),
        conditions: formData.conditions ? formData.conditions.split(',').map(s => s.trim()).filter(Boolean) : [],
        allergies: formData.allergies ? formData.allergies.split(',').map(s => s.trim()).filter(Boolean) : [],
        pregnancy: {
          isPregnant: formData.isPregnant,
          trimester: formData.isPregnant ? Number(formData.trimester) : null,
        },
        emergencyContact: {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
          relation: formData.emergencyContactRelation,
        },
        consentForSharing: formData.consentForSharing,
      });

      toast.success(`Patient registered successfully! ID: ${res.data?.patientId}`);
      setCreatedPatient(res.data);
    } catch (err) {
      toast.error(err.message || 'Failed to register patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-navy-900">Frontline Community Patient Registration</h1>
        <p className="text-xs text-gray-500 mt-1">
          Create permanent electronic health record in SwasthSetu database for rural citizens.
        </p>
      </div>

      {createdPatient ? (
        <div className="bg-white p-8 rounded-2xl border border-surface-border shadow-sm text-center space-y-5">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-navy-900">Patient Successfully Enrolled!</h2>
            <p className="text-xs text-gray-500">Record safely persisted in central healthcare registry.</p>
          </div>

          <div className="max-w-md mx-auto p-4 bg-surface-bg rounded-xl border border-surface-border text-left space-y-2 text-xs">
            <p><span className="font-semibold text-gray-700">Patient Name:</span> {createdPatient.name}</p>
            <p><span className="font-semibold text-gray-700">Generated ID:</span> <span className="font-mono font-bold text-brand-600">{createdPatient.patientId}</span></p>
            <p><span className="font-semibold text-gray-700">Phone:</span> {createdPatient.phone}</p>
            <p><span className="font-semibold text-gray-700">Village:</span> {createdPatient.village}, {createdPatient.district}</p>
            <p><span className="font-semibold text-gray-700">Demo ABHA:</span> <span className="font-mono text-dark-text">{createdPatient.demoAbhaId}</span></p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setCreatedPatient(null);
                setFormData({
                  name: '',
                  age: '',
                  gender: 'Female',
                  phone: '',
                  village: 'Rampur Kalan',
                  district: 'Sitapur',
                  address: '',
                  emergencyContactName: '',
                  emergencyContactPhone: '',
                  emergencyContactRelation: '',
                  conditions: '',
                  allergies: '',
                  isPregnant: false,
                  trimester: 1,
                  consentForSharing: true,
                });
              }}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              Enroll Another Patient
            </button>
            <button
              onClick={() => navigate('/healthworker/triage')}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs"
            >
              Conduct Health Triage Now →
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-border shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-navy-900 border-b border-surface-border pb-3">1. Personal & Contact Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Parvati Devi"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Mobile Number *</label>
              <input
                type="tel"
                required
                placeholder="10-digit phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Age (Years) *</label>
              <input
                type="number"
                required
                min={0}
                max={120}
                placeholder="e.g. 28"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Gender *</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Village / Gram *</label>
              <input
                type="text"
                required
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">District *</label>
              <input
                type="text"
                required
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block font-semibold text-gray-700 mb-1">Detailed Address / Landmark</label>
              <input
                type="text"
                placeholder="Ward number, near school or panchayat bhawan"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <h2 className="text-sm font-bold text-navy-900 border-b border-surface-border pb-3 pt-2">2. Clinical Background & Maternal Health</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Existing Medical Conditions</label>
              <input
                type="text"
                placeholder="e.g. Hypertension, Diabetes, Asthma"
                value={formData.conditions}
                onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
                className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Known Drug Allergies</label>
              <input
                type="text"
                placeholder="e.g. Penicillin, Sulfa"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Pregnancy Toggle */}
            <div className="sm:col-span-2 p-4 bg-amber-50/60 rounded-xl border border-amber-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <p className="font-bold text-amber-900">Maternal Healthcare Check</p>
                <p className="text-[11px] text-amber-800">Is the patient currently pregnant?</p>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-amber-900">
                  <input
                    type="checkbox"
                    checked={formData.isPregnant}
                    onChange={(e) => setFormData({ ...formData, isPregnant: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>Yes, Pregnant</span>
                </label>
                {formData.isPregnant && (
                  <select
                    value={formData.trimester}
                    onChange={(e) => setFormData({ ...formData, trimester: Number(e.target.value) })}
                    className="px-2.5 py-1 text-xs border border-amber-300 rounded-lg bg-white"
                  >
                    <option value={1}>1st Trimester</option>
                    <option value={2}>2nd Trimester</option>
                    <option value={3}>3rd Trimester</option>
                  </select>
                )}
              </div>
            </div>
          </div>

          <h2 className="text-sm font-bold text-navy-900 border-b border-surface-border pb-3 pt-2">3. Emergency Contact & Consent</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Contact Name</label>
              <input
                type="text"
                placeholder="Family member"
                value={formData.emergencyContactName}
                onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                placeholder="10-digit mobile"
                value={formData.emergencyContactPhone}
                onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Relationship</label>
              <input
                type="text"
                placeholder="Spouse / Parent / Sibling"
                value={formData.emergencyContactRelation}
                onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
              <input
                type="checkbox"
                checked={formData.consentForSharing}
                onChange={(e) => setFormData({ ...formData, consentForSharing: e.target.checked })}
                className="w-4 h-4 text-brand-600 rounded"
              />
              <span>Patient verbal consent obtained for digital healthcare record sharing across registered Sub-Centres, PHCs, and District Hospitals.</span>
            </label>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-md transition-colors disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? 'Creating Record...' : 'Complete Patient Enrollment'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

