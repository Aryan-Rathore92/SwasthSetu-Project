import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  Phone,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Stethoscope,
  HeartHandshake,
  Building,
  BarChart,
  Loader2,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const DEMO_ROLES = [
  {
    role: 'health_worker',
    title: 'ASHA / Health Worker',
    subtitle: 'Sunita Sharma',
    phone: '9876543211',
    icon: HeartHandshake,
    color: 'bg-amber-500',
    border: 'border-amber-200 hover:border-amber-400',
    bg: 'hover:bg-amber-50',
  },
  {
    role: 'doctor',
    title: 'Medical Officer',
    subtitle: 'Dr. Alok Verma',
    phone: '9876543212',
    icon: Stethoscope,
    color: 'bg-brand-500',
    border: 'border-brand-200 hover:border-brand-400',
    bg: 'hover:bg-brand-50',
  },
  {
    role: 'patient',
    title: 'Rural Patient',
    subtitle: 'Rameshwar Yadav',
    phone: '9876543210',
    icon: UserCheck,
    color: 'bg-emerald-600',
    border: 'border-emerald-200 hover:border-emerald-400',
    bg: 'hover:bg-emerald-50',
  },
  {
    role: 'facility_admin',
    title: 'Facility Admin',
    subtitle: 'Rajendra Kumar',
    phone: '9876543213',
    icon: Building,
    color: 'bg-indigo-600',
    border: 'border-indigo-200 hover:border-indigo-400',
    bg: 'hover:bg-indigo-50',
  },
  {
    role: 'district_admin',
    title: 'District CMO',
    subtitle: 'Dr. S. K. Awasthi',
    phone: '9876543214',
    icon: BarChart,
    color: 'bg-purple-600',
    border: 'border-purple-200 hover:border-purple-400',
    bg: 'hover:bg-purple-50',
  },
];

export const Login = () => {
  const { login, getDashboardPathForRole } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState(null);

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!phone) {
      toast.error('Please enter your registered phone number');
      return;
    }
    if (!otp || otp.length < 6) {
      toast.error('Please enter the 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      const user = await login(phone, otp);
      toast.success(`Welcome, ${user.name}!`);
      navigate(getDashboardPathForRole(user.role));
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
      setActiveRole(null);
    }
  };

  const loginAsRole = async (btn) => {
    setActiveRole(btn.role);
    setPhone(btn.phone);
    setOtp('123456');
    setLoading(true);
    try {
      const user = await login(btn.phone, '123456');
      toast.success(`Signed in as ${user.name}`);
      navigate(getDashboardPathForRole(user.role));
    } catch (err) {
      toast.error(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
      setActiveRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-surface-border px-4 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-navy-900 flex items-center justify-center">
            <Activity className="w-5 h-5 text-brand-500" />
          </div>
          <span className="text-lg font-bold text-navy-900">
            Swasth<span className="text-brand-500">Setu</span>
          </span>
        </Link>
        <Link
          to="/register"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
        >
          <UserPlus className="w-4 h-4" />
          New Patient? Register Free
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-lg space-y-6">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2"
          >
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
              Healthcare Portal Login
            </h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Demo Mode Active • OTP: <span className="font-mono font-black">123456</span>
            </div>
          </motion.div>

          {/* 1-Click Demo Roles */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-2xl border border-surface-border shadow-md p-5 space-y-3"
          >
            <div>
              <p className="text-xs font-bold text-gray-900">⚡ 1-Click Demo Login</p>
              <p className="text-[11px] text-gray-500">Click any role to instantly sign in and explore that portal:</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DEMO_ROLES.map((btn) => {
                const Icon = btn.icon;
                const isActive = activeRole === btn.role && loading;
                return (
                  <button
                    key={btn.role}
                    type="button"
                    disabled={loading}
                    onClick={() => loginAsRole(btn)}
                    className={`flex items-center gap-3 p-3 rounded-xl border bg-white ${btn.border} ${btn.bg} text-left transition-all group disabled:opacity-60`}
                  >
                    <div className={`w-9 h-9 rounded-xl ${btn.color} text-white flex items-center justify-center shrink-0`}>
                      {isActive ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 group-hover:text-navy-900">{btn.title}</p>
                      <p className="text-[10px] text-gray-500">{btn.subtitle} • {btn.phone}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 ml-auto" />
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-surface-border" />
            <span className="text-xs text-gray-400 font-medium">or sign in manually</span>
            <div className="flex-1 h-px bg-surface-border" />
          </div>

          {/* Manual Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-surface-border shadow-md p-6"
          >
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Registered Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={10}
                    placeholder="Enter your 10-digit phone number"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-surface-border rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* OTP — always visible */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  OTP Verification Code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    placeholder="Enter OTP"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-surface-border rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 font-mono tracking-widest"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Demo OTP is <span className="font-mono font-bold text-brand-600">123456</span> — pre-filled for you.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-navy-900 hover:bg-navy-800 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                {loading && !activeRole ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Register link */}
          <p className="text-center text-xs text-gray-500">
            New patient?{' '}
            <Link to="/register" className="text-brand-600 font-semibold hover:underline">
              Create a free account
            </Link>
            {' '}•{' '}
            <Link to="/" className="text-gray-400 hover:text-gray-600">Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
