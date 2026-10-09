import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/endpoints';
import { toast } from 'sonner';

export const Login = () => {
  const { t } = useTranslation();
  const { login, getDashboardPathForRole } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('9876543211'); // Defaults to health worker for standard presentation flow
  const [otp, setOtp] = useState('123456');
  const [otpSent, setOtpSent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [demoAccounts, setDemoAccounts] = useState([]);

  useEffect(() => {
    // Fetch demo accounts list from backend
    const fetchDemo = async () => {
      try {
        const res = await authApi.getDemoAccounts();
        if (res.data) setDemoAccounts(res.data);
      } catch (err) {
        console.warn('Could not fetch demo accounts:', err.message);
      }
    };
    fetchDemo();
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone) {
      toast.error('Please enter a valid mobile number');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.sendOtp(phone);
      setOtpSent(true);
      setOtp(res.demoOtp || '123456');
      toast.success(res.message || 'OTP sent successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!phone || !otp) {
      toast.error('Please provide phone number and OTP');
      return;
    }
    setLoading(true);
    try {
      const user = await login(phone, otp);
      toast.success(`Welcome back, ${user.name}!`);
      const targetPath = getDashboardPathForRole(user.role);
      navigate(targetPath);
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const selectDemoRole = async (account) => {
    setPhone(account.phone);
    setOtp('123456');
    setOtpSent(true);
    setLoading(true);
    try {
      const user = await login(account.phone, '123456');
      toast.success(`Logged in as ${user.name} (${user.role.replace('_', ' ')})`);
      navigate(getDashboardPathForRole(user.role));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const defaultDemoButtons = [
    { role: 'health_worker', title: 'Health Worker (ASHA)', phone: '9876543211', icon: HeartHandshake, color: 'bg-amber-500' },
    { role: 'doctor', title: 'Doctor / Medical Officer', phone: '9876543212', icon: Stethoscope, color: 'bg-brand-500' },
    { role: 'patient', title: 'Rural Patient', phone: '9876543210', icon: UserCheck, color: 'bg-emerald-600' },
    { role: 'facility_admin', title: 'Facility Admin (CHC)', phone: '9876543213', icon: Building, color: 'bg-indigo-600' },
    { role: 'district_admin', title: 'District Admin (CMO)', phone: '9876543214', icon: BarChart, color: 'bg-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center shadow-md">
            <Activity className="w-6 h-6 text-brand-500" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-navy-900">
            Swasth<span className="text-brand-500">Setu</span>
          </span>
        </Link>
        <h2 className="text-xl font-bold text-gray-900">
          Healthcare Portal Authentication
        </h2>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Hackathon Demo Mode Active • OTP: 123456</span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg space-y-6 px-4 sm:px-0">
        
        {/* Main Login Card */}
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl shadow-md border border-surface-border space-y-6">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Registered Mobile Number
              </label>
              <div className="relative rounded-xl border border-surface-border shadow-sm focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter 10-digit phone number"
                  className="block w-full pl-10 pr-24 py-2.5 text-xs text-dark-text rounded-xl focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="absolute inset-y-1 right-1 px-3 bg-slate-100 hover:bg-slate-200 text-gray-700 font-semibold text-[11px] rounded-lg transition-colors"
                >
                  {otpSent ? 'Resend' : 'Send OTP'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Verification Code (Demo OTP)
              </label>
              <div className="relative rounded-xl border border-surface-border shadow-sm focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <KeyRound className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 123456"
                  maxLength={6}
                  className="block w-full pl-10 pr-3 py-2.5 text-xs text-dark-text rounded-xl tracking-widest font-mono font-bold focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Demo OTP <span className="font-mono font-bold text-brand-600">123456</span> is pre-filled for convenience.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-md text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 transition-colors disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Protected Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Role Selector */}
          <div className="pt-6 border-t border-surface-border">
            <p className="text-xs font-bold text-gray-900 mb-1">
              🚀 1-Click Demo Account Quick Selector:
            </p>
            <p className="text-[11px] text-gray-500 mb-3">
              Click any role to test authentic end-to-end data coordination immediately:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {defaultDemoButtons.map((btn) => {
                const Icon = btn.icon;
                return (
                  <button
                    key={btn.role}
                    type="button"
                    onClick={() => selectDemoRole({ phone: btn.phone })}
                    disabled={loading}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl border border-surface-border hover:border-brand-500 bg-surface-bg/50 hover:bg-brand-50/40 text-left transition-all group"
                  >
                    <div className={`w-7 h-7 rounded-lg ${btn.color} text-white flex items-center justify-center shrink-0`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-gray-900 truncate group-hover:text-brand-600">
                        {btn.title}
                      </p>
                      <p className="text-[10px] text-gray-500 font-mono">
                        {btn.phone}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500">
          Need assistance? <Link to="/" className="text-brand-600 font-semibold hover:underline">Return to Home</Link>
        </p>
      </div>
    </div>
  );
};

