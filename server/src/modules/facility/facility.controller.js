import mongoose from 'mongoose';
import { Facility } from '../../models/Facility.js';
import { User } from '../../models/User.js';
import { memoryStore } from '../../config/memoryStore.js';

export const getFacilities = async (req, res, next) => {
  try {
    const { district, type } = req.query;

    if (mongoose.connection.readyState === 1) {
      const query = { isActive: true };
      if (district) query.district = new RegExp(district, 'i');
      if (type) query.type = type;
      const facilities = await Facility.find(query).sort({ type: 1, name: 1 });
      return res.json({ success: true, data: facilities });
    }

    let facilities = memoryStore.facilities.filter(f => f.isActive);
    if (district) facilities = facilities.filter(f => f.district.toLowerCase().includes(district.toLowerCase()));
    if (type) facilities = facilities.filter(f => f.type === type);

    res.json({ success: true, data: facilities });
  } catch (err) {
    next(err);
  }
};

export const getFacilityById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const facility = await Facility.findById(id);
      if (!facility) return res.status(404).json({ success: false, message: 'Facility not found' });
      return res.json({ success: true, data: facility });
    }

    const facility = memoryStore.facilities.find(f => f._id === id);
    if (!facility) return res.status(404).json({ success: false, message: 'Facility not found' });
    res.json({ success: true, data: facility });
  } catch (err) {
    next(err);
  }
};

export const getFacilityDoctors = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { department } = req.query;

    if (mongoose.connection.readyState === 1) {
      const query = { facilityId: id, role: 'doctor', isActive: true };
      if (department) query.department = department;
      const doctors = await User.find(query).select('-__v');
      return res.json({ success: true, data: doctors });
    }

    let doctors = memoryStore.users.filter(u => u.role === 'doctor' && u.isActive);
    doctors = doctors.filter(u => {
      const uFacId = u.facilityId?._id || u.facilityId;
      return uFacId === id || true; // In demo allow all available doctors
    });
    if (department) doctors = doctors.filter(u => u.department === department);

    res.json({ success: true, data: doctors });
  } catch (err) {
    next(err);
  }
};

