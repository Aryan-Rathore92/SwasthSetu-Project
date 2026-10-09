import React, { useState, useEffect } from 'react';
import { facilityApi } from '../../api/endpoints';
import { Building2, Search, MapPin, Phone, CheckCircle2 } from 'lucide-react';

export const DistrictFacilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await facilityApi.getAll({ type: typeFilter || undefined });
        if (res.data) setFacilities(res.data);
      } catch (err) {
        console.error('Failed to load facilities:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFacilities();
  }, [typeFilter]);

  const filtered = facilities.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.district.toLowerCase().includes(search.toLowerCase()) ||
    (f.block && f.block.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy-900">District Healthcare Infrastructure Directory</h1>
        <p className="text-xs text-gray-500 mt-1">Multi-tier public healthcare institutions connected to SwasthSetu in Sitapur.</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-surface-border shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search facility name, block, or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-xs border border-surface-border rounded-xl focus:outline-none focus:border-brand-500"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 text-xs border border-surface-border rounded-xl focus:outline-none focus:border-brand-500 bg-white"
        >
          <option value="">All Tiers</option>
          <option value="District Hospital">District Hospital</option>
          <option value="CHC">CHC (Community Health Centre)</option>
          <option value="PHC">PHC (Primary Health Centre)</option>
          <option value="Sub-Centre">Sub-Centre (Health Post)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((fac) => (
          <div key={fac._id} className="bg-white rounded-2xl border border-surface-border p-5 shadow-xs space-y-3 text-xs">
            <div className="flex justify-between items-start">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                fac.type === 'District Hospital' ? 'bg-purple-100 text-purple-800' :
                fac.type === 'CHC' ? 'bg-indigo-100 text-indigo-800' :
                fac.type === 'PHC' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {fac.type}
              </span>
              <span className="font-mono text-[10px] text-gray-400 font-semibold">{fac.code}</span>
            </div>

            <div>
              <h3 className="font-bold text-navy-900 text-sm">{fac.name}</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Block: {fac.block || 'Sadar'} • District: {fac.district}
              </p>
            </div>

            <p className="text-gray-600 text-[11px]">
              📍 {fac.address}
            </p>

            <div className="pt-2 border-t border-surface-border space-y-1">
              <p className="font-semibold text-gray-700">Departments:</p>
              <div className="flex flex-wrap gap-1">
                {fac.departments?.slice(0, 3).map((d, i) => (
                  <span key={i} className="text-[10px] bg-slate-100 text-gray-600 px-2 py-0.5 rounded">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

