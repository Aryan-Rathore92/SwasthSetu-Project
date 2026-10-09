import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { patientApi } from '../../api/endpoints';
import { User, Phone, MapPin, AlertCircle, ShieldCheck, Heart, Save } from 'lucide-react';
import { toast } from 'sonner';

export const PatientProfile = () => {
  const { user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    gender: 'Male',
    village: '',
    district: 'Sitapur',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    conditions: '',
    allergies: '',
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await patientApi.getAll({ search: user?.phone });
        if (res.data && res.data.length > 0) {
          const p = res.data[0];
          setPatient(p);
          setFormData({
            name: p.name || '',
            phone: p.phone || '',
            age: p.age || '',
            gender: p.gender || 'Male',
            village: p.village || '',
            district: p.district || 'Sitapur',
            address: p.address || '',
            emergencyContactName: p.emergencyContact?.name || '',
            emergencyContactPhone: p.emergencyContact?.phone || '',
            conditions: p.conditions ? p.conditions.join(', ') : '',
            allergies: p.allergies ? p.allergies.join(', ') : '',
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patient) return;
    setSaving(true);
    try {
      await patientApi.update(patient._id, {
        name: formData.name,
        age: Number(formData.age),
        gender: formData.gender,
        village: formData.village,
        district: formData.district,
        address: formData.address,
        emergencyContact: {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
        },
        conditions: formData.conditions.split(',').map(s => s.trim()).filter(Boolean),
        allergies: formData.allergies.split(',').map(s => s.trim()).filter(Boolean),
      });
      toast.success('Patient profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-xs text-gray-500">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900">Patient Electronic Health Profile</h1>
          <p className="text-xs text-gray-500 mt-1">
            Permanent Health Identifier: <span className="font-mono font-bold text-brand-600">{patient?.patientId || 'P-10001'}</span>
          </p>
        </div>

        {/* Demo ABHA Tag */}
        <div className="p-3 bg-brand-50 border border-brand-200 rounded-xl text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-brand-700">
            <ShieldCheck className="w-4 h-4" />
            <span>Demo ABHA Reference:</span>
          </div>
          <p className="font-mono text-dark-text font-semibold">{patient?.demoAbhaId || 'ABHA-DEMO-9821-4432'}</p>
          <p className="text-[10px] text-gray-500 italic">*Not a verified government identifier (Demo only)</p>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-border shadow-sm space-y-6">
        <h2 className="text-sm font-bold text-navy-900 border-b border-surface-border pb-3">Personal & Contact Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Mobile Number</label>
            <input
              type="text"
              disabled
              value={formData.phone}
              className="w-full px-3 py-2 bg-gray-50 border border-surface-border rounded-lg text-gray-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Age (Years)</label>
            <input
              type="number"
              required
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Village / Gram</label>
            <input
              type="text"
              required
              value={formData.village}
              onChange={(e) => setFormData({ ...formData, village: e.target.value })}
              className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">District</label>
            <input
              type="text"
              required
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block font-semibold text-gray-700 mb-1">Residential Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <h2 className="text-sm font-bold text-navy-900 border-b border-surface-border pb-3 pt-4">Clinical Observations & Allergies</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Known Chronic Conditions (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. Hypertension, Diabetes, Asthma"
              value={formData.conditions}
              onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
              className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Drug Allergies (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. Penicillin, Sulfa drugs"
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Emergency Contact Person</label>
            <input
              type="text"
              value={formData.emergencyContactName}
              onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
              className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Emergency Contact Phone</label>
            <input
              type="tel"
              value={formData.emergencyContactPhone}
              onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
              className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Health Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

