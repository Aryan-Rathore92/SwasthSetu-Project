import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../../api/endpoints';
import { BarChart3, Activity, PieChart as PieIcon, LineChart as LineIcon } from 'lucide-react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#109ECC', '#16A34A', '#F59E0B', '#DC2626', '#8B5CF6'];

export const DistrictAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await dashboardApi.getDistrict();
        if (res.data) setData(res.data);
      } catch (err) {
        console.error('Failed to load analytics:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-8 text-center text-xs text-gray-500">Synthesizing district health analytics...</div>;

  const { charts = {} } = data || {};
  const {
    consultationTrends = [],
    referralStatusData = [],
    appointmentStatusData = [],
    facilityWorkloads = [],
  } = charts;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy-900">District Healthcare Analytics & Population Metrics</h1>
        <p className="text-xs text-gray-500 mt-1">Aggregated operational performance and clinical trends across public health facilities.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Daily Consultation Trends */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-navy-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-500" />
            <span>Consultation Volume (Last 7 Days)</span>
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={consultationTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ borderRadius: '0.75rem', fontSize: '12px' }} />
                <Area type="monotone" dataKey="consultations" stroke="#109ECC" fill="#E0F3F9" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Facility Workload Comparison */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-navy-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-brand-500" />
            <span>Facility Patient Workload Comparison</span>
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={facilityWorkloads}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickFormatter={(v) => v.split(' ')[0]} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ borderRadius: '0.75rem', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#123B5D" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Referral Status Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-navy-900 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-brand-500" />
            <span>Referral Case Statuses</span>
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={referralStatusData} cx="50%" cy="50%" outerRadius={80} dataKey="count" label>
                  {referralStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '0.75rem', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Appointment Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-navy-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-brand-500" />
            <span>OPD Appointment States</span>
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appointmentStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ borderRadius: '0.75rem', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#16A34A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

