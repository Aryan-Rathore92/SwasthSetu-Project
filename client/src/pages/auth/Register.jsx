import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  User,
  Phone,
  MapPin,
  Calendar,
  Heart,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/endpoints';
import { toast } from 'sonner';

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

const UP_DISTRICTS = [
  'Sitapur', 'Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Prayagraj', 'Meerut',
  'Bareilly', 'Aligarh', 'Moradabad', 'Gorakhpur', 'Unnao', 'Hardoi', 'Rae Bareli',
];

export const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState(1); // 1 = personal info, 2 = success
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    age: '',
    gender: '',
    village: '',
    district: 'Sitapur',
    address: '',
  });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.phone || form.phone.length !== 10 || !/^\d+$/.test(form.phone))
      errs.phone = 'Enter a valid 10-digit phone number';
    if (!form.age || Number(form.age) < 1 || Number(form.age) > 120)
      errs.age = 'Enter a valid age (1-120)';
    if (!form.gender) errs.gender = 'Please select gender';
    if (!form.village.trim()) errs.village = 'Village / town name is required';
    return errs;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const res = await authApi.register(form);
      if (res.success && res.data?.token) {
        // Auto-login by storing token and user
        localStorage.setItem('swasthsetu_token', res.data.token);
        localStorage.setItem('swasthsetu_user', JSON.stringify(res.data.user));
        toast.success(res.message || `Welcome, ${form.name}! Account created successfully.`);
        setStep(2);
        // Redirect to patient dashboard after brief success screen
        setTimeout(() => navigate('/patient/dashboard'), 2000);
      }
    } catch (err) {
      if (err.message?.includes('already exists')) {
        toast.error('This phone number is already registered. Please login instead.');
      } else {
        toast.error(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border border-surface-border shadow-xl p-10 max-w-md w-full text-center space-y-5"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-navy-900">Registration Successful!</h2>
            <p className="text-sm text-gray-500 mt-2">
              Welcome to SwasthSetu, <strong>{form.name}</strong>! Redirecting you to your patient portal...
            </p>
          </div>
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col">
      {/* Top Banner */}
      <div className="bg-white border-b border-surface-border px-4 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-navy-900 flex items-center justify-center">
            <Activity className="w-5 h-5 text-brand-500" />
          </div>
          <span className="text-lg font-bold text-navy-900">
            Swasth<span className="text-brand-500">Setu</span>
          </span>
        </Link>
        <Link to="/login" className="text-xs font-semibold text-gray-600 hover:text-brand-600">
          Already have an account? <span className="text-brand-600 underline">Sign In</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-xl space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Free Patient Registration
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
              Create Your Health Account
            </h1>
            <p className="text-sm text-gray-500">
              Register once and access doctors, prescriptions, and health records anywhere across Sitapur district.
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-surface-border shadow-md p-6 sm:p-8"
          >
            <form onSubmit={handleRegister} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={set('name')}
                    placeholder="e.g. Ramesh Patel"
                    className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 ${errors.name ? 'border-red-400' : 'border-surface-border'}`}
                  />
                </div>
                {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={set('phone')}
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 ${errors.phone ? 'border-red-400' : 'border-surface-border'}`}
                  />
                </div>
                {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
                <p className="text-[11px] text-gray-400 mt-1">This mobile number will be your login ID.</p>
              </div>

              {/* Age & Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={form.age}
                      onChange={set('age')}
                      min="1"
                      max="120"
                      placeholder="Age in years"
                      className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 ${errors.age ? 'border-red-400' : 'border-surface-border'}`}
                    />
                  </div>
                  {errors.age && <p className="text-[11px] text-red-500 mt-1">{errors.age}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.gender}
                    onChange={set('gender')}
                    className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 bg-white ${errors.gender ? 'border-red-400' : 'border-surface-border'}`}
                  >
                    <option value="">Select...</option>
                    {GENDER_OPTIONS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  {errors.gender && <p className="text-[11px] text-red-500 mt-1">{errors.gender}</p>}
                </div>
              </div>

              {/* Village */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Village / Town <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={form.village}
                    onChange={set('village')}
                    placeholder="e.g. Rampur Kalan"
                    className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 ${errors.village ? 'border-red-400' : 'border-surface-border'}`}
                  />
                </div>
                {errors.village && <p className="text-[11px] text-red-500 mt-1">{errors.village}</p>}
              </div>

              {/* District & Address (optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">District</label>
                  <select
                    value={form.district}
                    onChange={set('district')}
                    className="w-full px-3 py-2.5 text-sm border border-surface-border rounded-xl focus:outline-none focus:border-brand-500 bg-white"
                  >
                    {UP_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Address (optional)</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={set('address')}
                    placeholder="House no. / street..."
                    className="w-full px-3 py-2.5 text-sm border border-surface-border rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Consent */}
              <div className="bg-brand-50 border border-brand-200 rounded-xl p-3 text-xs text-brand-800 flex items-start gap-2">
                <Heart className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span>
                  By registering, you consent to sharing your health information with authorised healthcare workers and doctors within the SwasthSetu demonstration network.
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold rounded-xl shadow-md shadow-brand-500/20 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating your account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Free Patient Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="text-brand-600 font-semibold hover:underline">
                  Sign in here
                </Link>
              </p>
            </form>
          </motion.div>

          {/* Disclaimer */}
          <p className="text-center text-[11px] text-gray-400">
            🔒 SwasthSetu Hackathon Demo — Not a certified medical service. For real emergencies, call <strong>108</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

