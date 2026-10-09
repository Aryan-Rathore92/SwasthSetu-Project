import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dashboardApi, emergencyApi } from '../../api/endpoints';
import {
  Building2,
  Calendar,
  Users,
  CheckCircle2,
  GitBranch,
  Pill,
  AlertTriangle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';

export const FacilityDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const facId = user?.facility?._id || user?.facilityId?._id || user?.facilityId || 'fac-002';
      const res = await dashboardApi.getFacility(facId);
      if (res.data) setData(res.data);
    } catch (err) {
      console.error('Failed to load facility dashboard:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [user]);

  if (loading) return <div className="p-8 text-center text-xs text-gray-500">Loading facility operational data...</div>;

  const {
    facility,
    todayAppointments = 0,
    waitingCount = 0,
    completedCount = 0,
    doctorsCount = 0,
    incomingReferrals = [],
    lowStockMedicines = [],
    openEmergencies = 0,
  } = data || {};

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-navy-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white">
            Facility Administration Portal
          </span>
          <h1 className="text-xl sm:text-2xl font-bold mt-1">
            {facility?.name || 'Community Health Centre'}
          </h1>
          <p className="text-xs text-indigo-200 mt-1">
            Tier: <span className="font-semibold text-white">{facility?.type || 'CHC'}</span> • Block: {facility?.block || 'Laharpur'} • District: {facility?.district || 'Sitapur'}
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/facility/inventory"
            className="inline-flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow transition-all"
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Manage Inventory</span>
          </Link>
          <Link
            to="/facility/referrals"
            className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/20 transition-all"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Review Incoming Referrals</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold">Today's Appointments</span>
            <Calendar className="w-4 h-4 text-brand-500" />
          </div>
          <p className="text-2xl font-bold text-navy-900">{todayAppointments}</p>
          <p className="text-[10px] text-gray-400">Total facility OPD registrations</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold">Doctors on Duty</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-navy-900">{doctorsCount || 2}</p>
          <p className="text-[10px] text-gray-400">Active medical staff</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold">Incoming Referrals</span>
            <GitBranch className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-600">{incomingReferrals.length}</p>
          <p className="text-[10px] text-gray-400">Transferred from Sub-Centres/PHCs</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold">Low-Stock Warnings</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600">{lowStockMedicines.length}</p>
          <p className="text-[10px] text-gray-400">Medicines below reorder level</p>
        </div>
      </div>

      {/* Grid: Incoming Referrals & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Incoming Referrals Card */}
        <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-navy-900 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-brand-500" />
              <span>Incoming Transfer Referrals Requiring Action</span>
            </h2>
            <Link to="/facility/referrals" className="text-xs font-semibold text-brand-600 hover:underline">
              Manage All →
            </Link>
          </div>

          <div className="space-y-3">
            {incomingReferrals.length > 0 ? (
              incomingReferrals.map((ref) => (
                <div key={ref._id} className="p-3.5 bg-surface-bg rounded-xl border border-surface-border flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-navy-900">{ref.patientId?.name}</p>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        {ref.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      From: {ref.fromFacilityId?.name} • Priority: <span className="font-semibold text-red-600">{ref.priority}</span>
                    </p>
                    <p className="text-[11px] text-gray-600 line-clamp-1 mt-0.5">{ref.reason}</p>
                  </div>

                  <Link
                    to="/facility/referrals"
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-[11px] transition-colors"
                  >
                    Accept
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 text-center py-6">No pending incoming referrals.</p>
            )}
          </div>
        </div>

        {/* Low Stock Medicine Alert Card */}
        <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-navy-900 flex items-center gap-2">
              <Pill className="w-4 h-4 text-amber-500" />
              <span>Pharmacy Stock Depletion Warnings</span>
            </h2>
            <Link to="/facility/inventory" className="text-xs font-semibold text-brand-600 hover:underline">
              Restock →
            </Link>
          </div>

          <div className="space-y-2.5">
            {lowStockMedicines.length > 0 ? (
              lowStockMedicines.map((item) => (
                <div key={item._id} className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/70 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-amber-950">{item.medicineName}</p>
                    <p className="text-[10px] text-amber-800">Category: {item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600 text-sm">
                      {item.quantity} {item.unit || 'units'}
                    </p>
                    <p className="text-[10px] text-gray-500">Reorder Level: {item.reorderLevel}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 text-center py-6">All registered medicines are sufficiently stocked.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

