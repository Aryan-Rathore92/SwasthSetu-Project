import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  FileText,
  Stethoscope,
  Video,
  Calendar,
  GitBranch,
  Pill,
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Users,
  MapPin,
  Clock,
  HeartHandshake,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';

export const Landing = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: FileText,
      title: 'Digital Patient Records',
      description: 'Unified electronic health records connecting Sub-Centres to District Hospitals, preventing redundant checkups.',
    },
    {
      icon: Stethoscope,
      title: 'AI-Assisted Health Triage',
      description: 'Deterministic clinical rule engine with bilingual Hindi/English explanations, categorizing RED/YELLOW/GREEN urgency.',
    },
    {
      icon: Video,
      title: 'Doctor Teleconsultation',
      description: 'Seamless WebRTC video encounters powered by Jitsi Meet, bringing specialist doctors directly to remote villages.',
    },
    {
      icon: Calendar,
      title: 'Smart Appointment & Queue',
      description: 'Tokenized digital queue tracking with real-time updates for OPD consultations and telehealth visits.',
    },
    {
      icon: GitBranch,
      title: 'Facility Referral Tracking',
      description: 'Multi-tier referral workflow with timestamped milestones: Created, Accepted, Arrived, and Completed.',
    },
    {
      icon: Pill,
      title: 'Live Medicine Inventory',
      description: 'Search essential drugs across PHCs and Sub-Centres with map visualization and reorder stock alerts.',
    },
    {
      icon: AlertCircle,
      title: 'Emergency Assistance (SOS)',
      description: 'Rapid distress telemetry alerting nearby ambulances and emergency facility triage desks.',
    },
    {
      icon: BarChart3,
      title: 'District Healthcare Analytics',
      description: 'Comprehensive CMO command dashboard monitoring health trends, disease outbreaks, and facility workload.',
    },
  ];

  const steps = [
    { step: '01', title: 'Patient Registration', desc: 'ASHA worker registers patient with demographic & basic health profile in under 2 minutes.' },
    { step: '02', title: 'Health Assessment', desc: 'Vitals and symptoms recorded; triage engine categorizes clinical urgency with Hindi explanation.' },
    { step: '03', title: 'Doctor Consultation', desc: 'Medical officer reviews medical history, conducts consultation or video call, and prescribes medicines.' },
    { step: '04', title: 'Treatment or Referral', desc: 'Digital prescription issued; high-risk cases referred to specialized CHC or District Hospital.' },
    { step: '05', title: 'Follow-Up & Monitoring', desc: 'Frontline health worker conducts home visits for maternal & chronic follow-up care.' },
  ];

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-brand-50/50 via-white to-surface-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6 text-left"
            >

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900 tracking-tight leading-tight">
                Connecting Rural India to <span className="text-brand-500">Better Healthcare</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl">
                SwasthSetu connects patients, frontline health workers (ASHA/ANM), doctors, and healthcare facilities through one integrated digital coordination ecosystem.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-brand-500/20 transition-all hover:translate-y-[-1px]"
                >
                  <span>Get Started & Test Roles</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#features"
                  className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-dark-text font-semibold text-sm px-6 py-3.5 rounded-xl border border-surface-border shadow-sm transition-all"
                >
                  <span>Explore Features</span>
                </a>
              </div>

              {/* Quick Trust Badges */}
              <div className="pt-6 border-t border-gray-200/80 grid grid-cols-3 gap-4 text-left">
                <div>
                  <p className="text-xl font-bold text-navy-900">5 Roles</p>
                  <p className="text-xs text-gray-500 font-medium">Fully Connected</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-brand-500">100%</p>
                  <p className="text-xs text-gray-500 font-medium">Bilingual Support</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-emerald-600">FHIR R4</p>
                  <p className="text-xs text-gray-500 font-medium">Interoperable Demo</p>
                </div>
              </div>
            </motion.div>

            {/* Right Graphic / Interactive Preview Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-5"
            >
              <div className="bg-white rounded-2xl shadow-xl border border-surface-border p-6 space-y-4 relative">
                <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-brand-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-navy-900">Live Coordination Flow</p>
                      <p className="text-[10px] text-gray-500">Sitapur Health District</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                    Live Demo Ready
                  </span>
                </div>

                {/* Workflow Simulation Steps */}
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-xl flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                    <div>
                      <p className="font-semibold text-amber-900">Health Worker Registration</p>
                      <p className="text-amber-800/80 text-[11px]">Sunita Devi (ASHA) registered patient Rameshwar Yadav (54y, BP concern).</p>
                    </div>
                  </div>

                  <div className="p-3 bg-red-50/60 border border-red-200/70 rounded-xl flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-red-500 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                    <div>
                      <p className="font-semibold text-red-900">Deterministic Triage Engine</p>
                      <p className="text-red-800/80 text-[11px]">BP 162/104 flagged as RED priority with Hindi voice-ready explanation.</p>
                    </div>
                  </div>

                  <div className="p-3 bg-brand-50/60 border border-brand-200/70 rounded-xl flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-500 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                    <div>
                      <p className="font-semibold text-brand-900">Doctor Teleconsultation & Referral</p>
                      <p className="text-brand-800/80 text-[11px]">Dr. Alok Verma conducted video visit and generated PDF prescription.</p>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50/60 border border-emerald-200/70 rounded-xl flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">4</span>
                    <div>
                      <p className="font-semibold text-emerald-900">Facility Arrival & Closed Case</p>
                      <p className="text-emerald-800/80 text-[11px]">CHC Laharpur accepted referral; District dashboard metrics auto-updated.</p>
                    </div>
                  </div>
                </div>

                <Link
                  to="/login"
                  className="block w-full py-2.5 text-center text-xs font-semibold bg-navy-900 hover:bg-navy-800 text-white rounded-xl transition-colors"
                >
                  Test Demo Workflow Now →
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white border-t border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold tracking-wider text-brand-500 uppercase">Core Architecture</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
              End-to-End Solutions for Rural Healthcare
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              SwasthSetu tackles fragmented medical records, specialist shortages, and referral delays with eight connected modules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-surface-bg border border-surface-border hover:border-brand-300 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white border border-surface-border flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-sm">
                    <Icon className="w-6 h-6 text-brand-500" />
                  </div>
                  <h3 className="text-base font-bold text-navy-900 mb-2">{feat.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Timeline */}
      <section id="how-it-works" className="py-20 bg-surface-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold tracking-wider text-brand-500 uppercase">Step-by-Step Flow</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
              How SwasthSetu Coordinates Care
            </h2>
            <p className="text-sm text-gray-500">
              A synchronized 5-tier process ensuring continuous patient tracking from village to district hospital.
            </p>
          </div>

          {/* Timeline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-left">
            {steps.map((st, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm space-y-2 relative">
                <span className="text-2xl font-black text-brand-300">{st.step}</span>
                <h4 className="text-sm font-bold text-navy-900">{st.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simulated Impact Section */}
      <section className="py-16 bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div>
            <span className="text-xs font-bold tracking-wider text-brand-300 uppercase">Projected Rural Impact</span>
            <h3 className="text-2xl font-bold mt-1">Strengthening Public Health Continuity</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-xl mx-auto">
              Simulated demonstration indicators based on pilot coordination workflows in Sitapur district.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 bg-navy-800/80 rounded-2xl border border-navy-700">
              <p className="text-3xl font-extrabold text-brand-400">65%</p>
              <p className="text-xs text-gray-300 mt-1">Reduced Unnecessary Travel</p>
            </div>
            <div className="p-6 bg-navy-800/80 rounded-2xl border border-navy-700">
              <p className="text-3xl font-extrabold text-emerald-400">4x Faster</p>
              <p className="text-xs text-gray-300 mt-1">Specialist Consultation Access</p>
            </div>
            <div className="p-6 bg-navy-800/80 rounded-2xl border border-navy-700">
              <p className="text-3xl font-extrabold text-amber-400">100%</p>
              <p className="text-xs text-gray-300 mt-1">Referral Accountability Tracking</p>
            </div>
            <div className="p-6 bg-navy-800/80 rounded-2xl border border-navy-700">
              <p className="text-3xl font-extrabold text-brand-400">&lt; 2 min</p>
              <p className="text-xs text-gray-300 mt-1">Frontline Triage & Registration</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action — Role Quick Access */}
      <section className="py-16 bg-brand-50 border-t border-brand-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
              Try the 5-Role Live Demo
            </h2>
            <p className="text-sm text-gray-500 max-w-xl mx-auto">
              Click any role below to instantly sign in and explore the full portal — no registration required for demo accounts.
            </p>
          </div>

          {/* Role cards grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { title: 'ASHA Worker', phone: '9876543211', color: 'bg-amber-500', path: '/healthworker/dashboard' },
              { title: 'Doctor', phone: '9876543212', color: 'bg-brand-500', path: '/doctor/dashboard' },
              { title: 'Patient', phone: '9876543210', color: 'bg-emerald-600', path: '/patient/dashboard' },
              { title: 'Facility Admin', phone: '9876543213', color: 'bg-indigo-600', path: '/facility/dashboard' },
              { title: 'District CMO', phone: '9876543214', color: 'bg-purple-600', path: '/district/dashboard' },
            ].map((role) => (
              <Link
                key={role.path}
                to="/login"
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-surface-border hover:border-brand-300 hover:shadow-md transition-all text-center group"
              >
                <div className={`w-10 h-10 rounded-xl ${role.color} flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform`}>
                  {role.title[0]}
                </div>
                <p className="text-xs font-bold text-navy-900 group-hover:text-brand-600">{role.title}</p>
                <span className="text-[10px] text-gray-400 font-mono">{role.phone}</span>
              </Link>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-semibold text-sm px-8 py-3.5 rounded-xl shadow-md transition-all"
            >
              <span>Go to Login Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-white border-2 border-brand-500 text-brand-600 hover:bg-brand-50 font-semibold text-sm px-8 py-3.5 rounded-xl transition-all"
            >
              <span>Register as New Patient</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

