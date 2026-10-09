import React, { useState, useEffect } from 'react';
import { medicineApi } from '../../api/endpoints';
import { Pill, Search, MapPin, Building2, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix default leaflet marker icon in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export const FindMedicine = () => {
  const [query, setQuery] = useState('Paracetamol');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState('Sitapur');

  const defaultCenter = [27.5684, 80.6829]; // Sitapur coordinates

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await medicineApi.search({
        q: query.trim(),
        lat: defaultCenter[0],
        lng: defaultCenter[1],
        district: selectedDistrict,
      });
      if (res.data) setResults(res.data);
    } catch (err) {
      console.error('Medicine search failed:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-navy-900">Rural Medicine Availability & Pharmacy Locator</h1>
        <p className="text-xs text-gray-500 mt-1">
          Real-time verified stock availability across Sub-Centres, PHCs, and District Hospitals.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="bg-white p-4 rounded-2xl border border-surface-border shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search medicine name (e.g. Paracetamol, Amlodipine, IFA, ORS, Metformin)"
            className="w-full pl-10 pr-3 py-2.5 text-xs border border-surface-border rounded-xl focus:outline-none focus:border-brand-500"
          />
        </div>

        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="px-3 py-2.5 text-xs border border-surface-border rounded-xl focus:outline-none focus:border-brand-500 bg-white"
        >
          <option value="Sitapur">District: Sitapur</option>
          <option value="">All Health Districts</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
        >
          {loading ? 'Searching...' : 'Locate Medicine'}
        </button>
      </form>

      {/* Map & List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Results List (Left Col 5) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-xs font-bold text-gray-900">
              {results.length} Facilities with Available Stock
            </p>
            <span className="text-[10px] text-gray-400">Sorted by distance</span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {results.length > 0 ? (
              results.map((item) => (
                <div key={item.inventoryId} className="bg-white p-4 rounded-2xl border border-surface-border shadow-xs space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-navy-900">{item.facility?.name}</h3>
                      <p className="text-[10px] text-gray-500">
                        {item.facility?.type} • {item.facility?.district}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.isLowStock ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.isLowStock ? 'Low Stock' : 'In Stock'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 text-brand-600 font-bold">
                      <Pill className="w-3.5 h-3.5" />
                      <span>{item.quantity} {item.unit || 'Units'} Available</span>
                    </div>
                    {item.distanceKm !== null && (
                      <span className="text-gray-500 font-semibold text-[11px]">
                        📍 ~{item.distanceKm} km away
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] text-gray-400 pt-1 border-t border-surface-border flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Last Stock Audit: {new Date(item.updatedAt).toLocaleDateString('en-IN')}</span>
                  </p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-surface-border text-xs text-gray-500">
                No facilities found with active stock for "{query}".
              </div>
            )}
          </div>
        </div>

        {/* Leaflet OpenStreetMap (Right Col 7) */}
        <div className="lg:col-span-7 bg-white p-3 rounded-2xl border border-surface-border shadow-sm min-h-[450px] flex flex-col">
          <div className="flex-1 w-full h-[450px] rounded-xl overflow-hidden relative">
            <MapContainer
              center={defaultCenter}
              zoom={11}
              scrollWheelZoom={false}
              className="w-full h-full rounded-xl"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {results.map((item) => {
                const loc = item.facility?.location;
                if (!loc || !loc.lat || !loc.lng) return null;
                return (
                  <Marker key={item.inventoryId} position={[loc.lat, loc.lng]}>
                    <Popup>
                      <div className="text-xs p-1 space-y-1">
                        <p className="font-bold text-navy-900">{item.facility?.name}</p>
                        <p className="text-[10px] text-gray-500">{item.facility?.type}</p>
                        <p className="text-brand-600 font-bold">
                          Stock: {item.quantity} {item.unit}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-2">
            OpenStreetMap geospatial visualization of healthcare inventory across Sitapur District.
          </p>
        </div>

      </div>
    </div>
  );
};

