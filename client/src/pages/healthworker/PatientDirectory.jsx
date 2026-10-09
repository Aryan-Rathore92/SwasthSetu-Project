import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { patientApi } from '../../api/endpoints';
import { Search, Filter, Stethoscope, Eye, Users, AlertTriangle, ShieldCheck } from 'lucide-react';

export const PatientDirectory = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [villageFilter, setVillageFilter] = useState('');

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await patientApi.getAll({
        search,
        riskLevel: riskFilter || undefined,
        village: villageFilter || undefined,
      });
      if (res.data) setPatients(res.data);
    } catch (err) {
      console.error('Failed to load patient directory:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [riskFilter, villageFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPatients();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900">Community Patient Directory</h1>
          <p className="text-xs text-gray-500 mt-1">
            Search and view records for registered citizens across participating villages.
          </p>
        </div>
        <Link
          to="/healthworker/register"
          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <span>Enroll New Patient</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-surface-border shadow-xs flex flex-col md:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID (e.g. P-10001), phone, or village..."
            className="w-full pl-10 pr-3 py-2 text-xs border border-surface-border rounded-xl focus:outline-none focus:border-brand-500"
          />
        </form>

        <div className="flex items-center gap-2">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-surface-border rounded-xl focus:outline-none focus:border-brand-500 bg-white"
          >
            <option value="">All Clinical Tiers</option>
            <option value="RED">RED - Urgent Attention</option>
            <option value="YELLOW">YELLOW - Review Needed</option>
            <option value="GREEN">GREEN - Routine</option>
          </select>

          <select
            value={villageFilter}
            onChange={(e) => setVillageFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-surface-border rounded-xl focus:outline-none focus:border-brand-500 bg-white"
          >
            <option value="">All Villages</option>
            <option value="Rampur Kalan">Rampur Kalan</option>
            <option value="Belahara">Belahara</option>
            <option value="Pipra">Pipra</option>
            <option value="Keshwapur">Keshwapur</option>
          </select>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-surface-border text-gray-500 font-semibold">
              <tr>
                <th className="px-5 py-3.5">Patient ID</th>
                <th className="px-5 py-3.5">Name & Demographics</th>
                <th className="px-5 py-3.5">Village / District</th>
                <th className="px-5 py-3.5">Contact Phone</th>
                <th className="px-5 py-3.5">Clinical Risk Tier</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">Loading patient directory records...</td>
                </tr>
              ) : patients.length > 0 ? (
                patients.map((pat) => (
                  <tr key={pat._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-brand-600">
                      {pat.patientId}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-navy-900">{pat.name}</p>
                      <p className="text-[11px] text-gray-500">
                        {pat.age} Yrs • {pat.gender} {pat.pregnancy?.isPregnant && '• 🤰 Pregnant'}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">
                      {pat.village}, {pat.district}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-gray-600">
                      {pat.phone}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        pat.riskLevel === 'RED' ? 'bg-red-100 text-red-800 border border-red-200' :
                        pat.riskLevel === 'YELLOW' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {pat.riskLevel}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <Link
                        to={`/healthworker/triage?patientId=${pat._id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg font-semibold text-[11px] border border-amber-200 transition-colors"
                      >
                        <Stethoscope className="w-3 h-3" />
                        <span>Triage</span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No matching patient records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

