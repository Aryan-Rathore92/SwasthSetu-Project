import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/endpoints';
import {
  Building2,
  Users,
  Activity,
  AlertTriangle,
  GitBranch,
  Pill,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#109ECC', '#16A34A', '#F59E0B', '#DC2626', '#8B5CF6'];

export const DistrictDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDistrictData = async () => {
      try {
        const res = await dashboardApi.getDistrict();
        if (res.data) setData(res.data);
      } catch (err) {
        console.error('Failed to load district dashboard:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDistrictData();
  }, []);

  if (loading) return <div className="p-8 text-center text-xs text-gray-500">Loading district administration metrics...</div>;

  const { metrics = {}, charts = {}, facilitiesList = [], recentReferrals = [] } = data || {};
  const { consultationTrends = [], referralStatusData = [], facilityWorkloads = [] } = charts;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Executive Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-navy-900 to-navy-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300">
            District CMO Command Centre
          </span>
          <h1 className="text-xl sm:text-2xl font-bold mt-1">
            Sitapur District Healthcare Administration
          </h1>
          <p className="text-xs text-gray-300 mt-1">
            Unified telemetry monitoring Sub-Centres, PHCs, CHCs, and District Hospital operations.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/district/analytics"
            className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow transition-all"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Deep Dive Analytics</span>
          </Link>
          <Link
            to="/district/reports"
            className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/20 transition-all"
          >
            <span>FHIR Export & Reports</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
        <div className="bg-white p-3.5 rounded-xl border border-surface-border shadow-2xs">
          <span className="text-[11px] text-gray-500 font-medium">Total Citizens</span>
          <p className="text-xl font-bold text-navy-900 mt-1">{metrics.totalPatients || 45}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-surface-border shadow-2xs">
          <span className="text-[11px] text-gray-500 font-medium">Healthcare Units</span>
          <p className="text-xl font-bold text-brand-600 mt-1">{metrics.totalFacilities || 7}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-surface-border shadow-2xs">
          <span className="text-[11px] text-gray-500 font-medium">Medical Officers</span>
          <p className="text-xl font-bold text-emerald-600 mt-1">{metrics.totalDoctors || 4}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-surface-border shadow-2xs">
          <span className="text-[11px] text-gray-500 font-medium">Today's Visits</span>
          <p className="text-xl font-bold text-navy-900 mt-1">{metrics.todayConsultations || 8}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-surface-border shadow-2xs">
          <span className="text-[11px] text-gray-500 font-medium">Open Referrals</span>
          <p className="text-xl font-bold text-blue-600 mt-1">{metrics.pendingReferrals || 3}</p>
        </div>
        <div className="bg-red-50 p-3.5 rounded-xl border border-red-200 shadow-2xs">
          <span className="text-[11px] text-red-700 font-bold">Overdue Referrals</span>
          <p className="text-xl font-bold text-red-700 mt-1">{metrics.overdueReferrals || 1}</p>
        </div>
        <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 shadow-2xs">
          <span className="text-[11px] text-amber-800 font-bold">Stock Warnings</span>
          <p className="text-xl font-bold text-amber-800 mt-1">{metrics.lowStockFacilities || 3}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-surface-border shadow-2xs">
          <span className="text-[11px] text-gray-500 font-medium">Emergency SOS</span>
          <p className="text-xl font-bold text-red-600 mt-1">{metrics.openEmergencies || 1}</p>
        </div>
      </div>

      {/* Visual Analytics Charts using Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Daily Consultation Trend (Col 8) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-surface-border shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-navy-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-500" />
              <span>District Consultation Trends (Past 7 Days)</span>
            </h2>
            <span className="text-[10px] text-gray-400">Total Primary + Telehealth Encounters</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={consultationTrends}>
                <defs>
                  <linearGradient id="colorConsult" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#109ECC" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#109ECC" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ borderRadius: '0.75rem', fontSize: '12px' }} />
                <Area type="monotone" dataKey="consultations" stroke="#109ECC" strokeWidth={2.5} fillOpacity={1} fill="url(#colorConsult)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Referral Status Distribution (Col 4) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-surface-border shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-navy-900 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-brand-500" />
            <span>Referral Status Distribution</span>
          </h2>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={referralStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {referralStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '0.75rem', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600">
            {referralStatusData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                <span>{d.name}: {d.count}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Facility Directory & Overdue Referrals Table */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold text-navy-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-500" />
            <span>Participating Public Health Facilities (Sitapur District Network)</span>
          </h2>
          <Link to="/district/facilities" className="text-xs font-semibold text-brand-600 hover:underline">
            View All Details →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-surface-border text-gray-500 font-semibold">
              <tr>
                <th className="px-5 py-3.5">Facility Name</th>
                <th className="px-5 py-3.5">Tier Category</th>
                <th className="px-5 py-3.5">Block / Location</th>
                <th className="px-5 py-3.5">Official Code</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {facilitiesList.slice(0, 5).map((fac) => (
                <tr key={fac._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-navy-900">
                    {fac.name}
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">
                    {fac.type}
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">
                    {fac.block || 'Sadar'}, Sitapur
                  </td>
                  <td className="px-5 py-3.5 font-mono text-gray-500">
                    {fac.code}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Operational
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

