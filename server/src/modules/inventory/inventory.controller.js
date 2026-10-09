import mongoose from 'mongoose';
import { Inventory } from '../../models/Inventory.js';
import { Facility } from '../../models/Facility.js';
import { calculateDistanceKm } from '../../utils/distance.js';
import { AuditLog } from '../../models/AuditLog.js';
import { memoryStore } from '../../config/memoryStore.js';

export const searchMedicines = async (req, res, next) => {
  try {
    const { q, lat, lng, district } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({ success: false, message: 'Please provide a medicine name to search' });
    }

    const userLat = lat ? Number(lat) : null;
    const userLng = lng ? Number(lng) : null;

    if (mongoose.connection.readyState === 1) {
      const searchQuery = { medicineName: new RegExp(q.trim(), 'i'), quantity: { $gt: 0 } };
      const items = await Inventory.find(searchQuery).populate('facilityId').sort({ quantity: -1 });

      let results = items
        .filter(item => item.facilityId && item.facilityId.isActive)
        .map(item => {
          const fac = item.facilityId;
          let distanceKm = null;
          if (userLat && userLng && fac.location?.lat && fac.location?.lng) {
            distanceKm = calculateDistanceKm(userLat, userLng, fac.location.lat, fac.location.lng);
          }
          return {
            inventoryId: item._id,
            medicineName: item.medicineName,
            category: item.category,
            quantity: item.quantity,
            unit: item.unit,
            reorderLevel: item.reorderLevel,
            isLowStock: item.quantity <= item.reorderLevel,
            updatedAt: item.updatedAt,
            facility: { _id: fac._id, name: fac.name, type: fac.type, district: fac.district, address: fac.address, phone: fac.phone, location: fac.location },
            distanceKm,
          };
        });

      if (district) results = results.filter(r => r.facility.district.toLowerCase() === district.toLowerCase());
      if (userLat && userLng) results.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));

      return res.json({ success: true, query: q, totalResults: results.length, data: results });
    }

    // Memory Store Mode
    const searchRegex = new RegExp(q.trim(), 'i');
    let results = memoryStore.inventory
      .filter(item => searchRegex.test(item.medicineName) && item.quantity > 0)
      .map(item => {
        const fac = item.facilityId;
        let distanceKm = null;
        if (userLat && userLng && fac.location?.lat && fac.location?.lng) {
          distanceKm = calculateDistanceKm(userLat, userLng, fac.location.lat, fac.location.lng);
        }
        return {
          inventoryId: item._id,
          medicineName: item.medicineName,
          category: item.category,
          quantity: item.quantity,
          unit: item.unit,
          reorderLevel: item.reorderLevel,
          isLowStock: item.quantity <= item.reorderLevel,
          updatedAt: item.updatedAt,
          facility: { _id: fac._id, name: fac.name, type: fac.type, district: fac.district, address: fac.address, phone: fac.phone, location: fac.location },
          distanceKm,
        };
      });

    if (district) results = results.filter(r => r.facility.district.toLowerCase() === district.toLowerCase());
    if (userLat && userLng) results.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));

    res.json({ success: true, query: q, totalResults: results.length, data: results });
  } catch (err) {
    next(err);
  }
};

export const getInventory = async (req, res, next) => {
  try {
    const { facilityId, category, lowStockOnly } = req.query;

    let targetFacilityId = facilityId;
    if (!targetFacilityId && req.user.role === 'facility_admin' && req.user.facilityId) {
      targetFacilityId = req.user.facilityId._id || req.user.facilityId;
    }

    if (mongoose.connection.readyState === 1) {
      const query = {};
      if (targetFacilityId) query.facilityId = targetFacilityId;
      if (category) query.category = category;
      let items = await Inventory.find(query).populate('facilityId', 'name type district').sort({ medicineName: 1 });
      if (lowStockOnly === 'true') items = items.filter(item => item.quantity <= item.reorderLevel);
      return res.json({ success: true, data: items });
    }

    let items = [...memoryStore.inventory];
    if (targetFacilityId) items = items.filter(i => (i.facilityId?._id === targetFacilityId || i.facilityId === targetFacilityId));
    if (category) items = items.filter(i => i.category === category);
    if (lowStockOnly === 'true') items = items.filter(i => i.quantity <= i.reorderLevel);

    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

export const addInventoryItem = async (req, res, next) => {
  try {
    const { facilityId, medicineName, category, quantity, reorderLevel, unit } = req.body;
    const facId = facilityId || req.user.facilityId?._id || req.user.facilityId;

    if (!facId || !medicineName || !category || quantity === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required inventory fields' });
    }

    if (Number(quantity) < 0) {
      return res.status(400).json({ success: false, message: 'Quantity cannot be negative' });
    }

    if (mongoose.connection.readyState === 1) {
      const item = await Inventory.findOneAndUpdate(
        { facilityId: facId, medicineName: medicineName.trim() },
        { category, quantity: Number(quantity), reorderLevel: Number(reorderLevel || 20), unit: unit || 'Tablets' },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return res.status(201).json({ success: true, message: 'Inventory item added/updated successfully', data: item });
    }

    const fac = memoryStore.facilities.find(f => f._id === facId);
    let item = memoryStore.inventory.find(i => (i.facilityId?._id === facId || i.facilityId === facId) && i.medicineName.toLowerCase() === medicineName.trim().toLowerCase());

    if (item) {
      item.quantity = Number(quantity);
      item.reorderLevel = Number(reorderLevel || item.reorderLevel);
      item.updatedAt = new Date();
    } else {
      item = {
        _id: `inv-${Date.now()}`,
        facilityId: fac || { _id: facId, name: 'Healthcare Facility' },
        medicineName: medicineName.trim(),
        category,
        quantity: Number(quantity),
        reorderLevel: Number(reorderLevel || 20),
        unit: unit || 'Tablets',
        updatedAt: new Date(),
      };
      memoryStore.inventory.push(item);
    }

    res.status(201).json({ success: true, message: 'Inventory item added/updated successfully', data: item });
  } catch (err) {
    next(err);
  }
};

export const updateInventoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity, reorderLevel } = req.body;

    if (quantity !== undefined && Number(quantity) < 0) {
      return res.status(400).json({ success: false, message: 'Quantity cannot be negative' });
    }

    if (mongoose.connection.readyState === 1) {
      const updateFields = {};
      if (quantity !== undefined) updateFields.quantity = Number(quantity);
      if (reorderLevel !== undefined) updateFields.reorderLevel = Number(reorderLevel);
      const item = await Inventory.findByIdAndUpdate(id, updateFields, { new: true });
      if (!item) return res.status(404).json({ success: false, message: 'Inventory item not found' });
      return res.json({ success: true, message: 'Stock updated successfully', data: item });
    }

    const item = memoryStore.inventory.find(i => i._id === id);
    if (!item) return res.status(404).json({ success: false, message: 'Inventory item not found' });

    if (quantity !== undefined) item.quantity = Number(quantity);
    if (reorderLevel !== undefined) item.reorderLevel = Number(reorderLevel);
    item.updatedAt = new Date();

    res.json({ success: true, message: 'Stock updated successfully', data: item });
  } catch (err) {
    next(err);
  }
};

