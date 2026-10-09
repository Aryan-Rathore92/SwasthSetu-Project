import React, { useState, useEffect } from 'react';
import { medicineApi } from '../../api/endpoints';
import { Pill, Plus, AlertTriangle, CheckCircle2, Edit2, Search } from 'lucide-react';
import { toast } from 'sonner';

export const FacilityInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    medicineName: '',
    category: 'Analgesics / Antipyretic',
    quantity: 100,
    reorderLevel: 25,
    unit: 'Tablets',
  });

  const loadInventory = async () => {
    try {
      const res = await medicineApi.getInventory();
      if (res.data) setInventory(res.data);
    } catch (err) {
      console.error('Failed to load inventory:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (Number(formData.quantity) < 0) {
      toast.error('Inventory quantity cannot be negative');
      return;
    }

    setSubmitting(true);
    try {
      if (editingItem) {
        await medicineApi.updateInventory(editingItem._id, {
          quantity: Number(formData.quantity),
          reorderLevel: Number(formData.reorderLevel),
        });
        toast.success(`Stock updated for ${editingItem.medicineName}`);
      } else {
        await medicineApi.addInventory(formData);
        toast.success(`Medicine ${formData.medicineName} added to inventory!`);
      }
      setModalOpen(false);
      setEditingItem(null);
      loadInventory();
    } catch (err) {
      toast.error(err.message || 'Failed to save inventory item');
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({
      medicineName: item.medicineName,
      category: item.category,
      quantity: item.quantity,
      reorderLevel: item.reorderLevel,
      unit: item.unit,
    });
    setModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900">Pharmacy & Drug Inventory Management</h1>
          <p className="text-xs text-gray-500 mt-1">Real-time essential medicine stock tracking and automated reorder replenishment.</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setFormData({ medicineName: '', category: 'Analgesics / Antipyretic', quantity: 100, reorderLevel: 25, unit: 'Tablets' });
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Stock Entry</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-surface-border text-gray-500 font-semibold">
            <tr>
              <th className="px-5 py-3.5">Medicine Name</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Available Stock</th>
              <th className="px-5 py-3.5">Reorder Level</th>
              <th className="px-5 py-3.5">Stock Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">Loading stock inventory records...</td>
              </tr>
            ) : inventory.length > 0 ? (
              inventory.map((item) => {
                const isLow = item.quantity <= item.reorderLevel;
                return (
                  <tr key={item._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-navy-900">
                      {item.medicineName}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">
                      {item.category}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-dark-text">
                      {item.quantity} {item.unit || 'units'}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">
                      {item.reorderLevel} {item.unit || 'units'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        isLow ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {isLow ? 'Low Stock Warning' : 'Adequate Supply'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => openEdit(item)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-gray-700 font-semibold rounded-lg text-[11px] transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Update Qty</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">No inventory items recorded.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit / Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-navy-900 border-b border-surface-border pb-3">
              {editingItem ? `Update Stock for ${editingItem.medicineName}` : 'Add Medicine to Inventory'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              {!editingItem && (
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Medicine Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Paracetamol 500mg"
                    value={formData.medicineName}
                    onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
                    className="w-full px-3 py-2 border border-surface-border rounded-lg"
                  />
                </div>
              )}

              {!editingItem && (
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-surface-border rounded-lg"
                  >
                    <option value="Analgesics / Antipyretic">Analgesics / Antipyretic</option>
                    <option value="Antihypertensive">Antihypertensive</option>
                    <option value="Antidiabetic">Antidiabetic</option>
                    <option value="Antibiotics">Antibiotics</option>
                    <option value="Maternal Health">Maternal Health (IFA)</option>
                    <option value="Electrolytes">Electrolytes (ORS)</option>
                    <option value="Antihistamine">Antihistamine</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Available Quantity *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-surface-border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Reorder Alert Level *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.reorderLevel}
                    onChange={(e) => setFormData({ ...formData, reorderLevel: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-surface-border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-xs disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Stock Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

