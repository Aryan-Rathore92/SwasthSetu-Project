import mongoose from 'mongoose';
import { Emergency } from '../../models/Emergency.js';
import { Facility } from '../../models/Facility.js';
import { Patient } from '../../models/Patient.js';
import { AuditLog } from '../../models/AuditLog.js';
import { memoryStore } from '../../config/memoryStore.js';
import { emitToFacility, emitToDistrict } from '../../sockets/socketHandler.js';

export const createEmergencyAlert = async (req, res, next) => {
  try {
    const {
      patientId,
      reporterName,
      reporterPhone,
      address,
      village,
      district,
      lat,
      lng,
      severity = 'CRITICAL',
      notes = '',
      assignedFacilityId,
    } = req.body;

    let facilityId = assignedFacilityId;

    if (mongoose.connection.readyState === 1) {
      if (!facilityId) {
        const defaultFacility = await Facility.findOne({ type: { $in: ['District Hospital', 'CHC', 'PHC'] }, isActive: true });
        facilityId = defaultFacility ? defaultFacility._id : null;
      }

      const emergency = await Emergency.create({
        patientId: patientId || null,
        reporterName: reporterName || req.user?.name || 'Emergency Caller',
        reporterPhone: reporterPhone || req.user?.phone || '9999999999',
        location: { lat: lat ? Number(lat) : 28.6139, lng: lng ? Number(lng) : 77.2090, address: address || 'Rural Community Location', village: village || '', district: district || '' },
        assignedFacilityId: facilityId,
        severity,
        status: 'Alert Created',
        notes: notes || 'Immediate emergency medical assistance requested via SwasthSetu SOS.',
        timeline: [{ status: 'Alert Created', timestamp: new Date(), updatedBy: req.user?._id || 'portal', note: 'SOS triggered via mobile portal' }],
      });

      const populated = await Emergency.findById(emergency._id).populate('patientId', 'name patientId phone age gender village').populate('assignedFacilityId', 'name type phone district');
      emitToFacility(facilityId, 'emergency:new', populated);
      emitToDistrict('emergency:new', populated);
      return res.status(201).json({ success: true, message: 'Emergency SOS registered and dispatched to nearby healthcare facility.', data: populated });
    }

    // Memory Store Mode
    if (!facilityId) {
      facilityId = memoryStore.facilities[1]?._id || 'fac-002'; // CHC Laharpur
    }
    const assignedFac = memoryStore.facilities.find(f => f._id === facilityId);
    const pat = patientId ? memoryStore.patients.find(p => p._id === patientId || p.patientId === patientId) : null;

    const memEmergency = {
      _id: `emg-${Date.now()}`,
      patientId: pat,
      reporterName: reporterName || req.user?.name || 'Emergency Caller',
      reporterPhone: reporterPhone || req.user?.phone || '9999999999',
      location: { lat: lat ? Number(lat) : 28.6139, lng: lng ? Number(lng) : 77.2090, address: address || 'Rural Community Location', village: village || '', district: district || '' },
      assignedFacilityId: assignedFac,
      severity,
      status: 'Alert Created',
      notes: notes || 'Immediate emergency medical assistance requested via SwasthSetu SOS.',
      timeline: [{ status: 'Alert Created', timestamp: new Date(), updatedBy: req.user?._id || 'portal', note: 'SOS triggered via mobile portal' }],
      createdAt: new Date(),
    };

    memoryStore.emergencies.unshift(memEmergency);
    emitToFacility(facilityId, 'emergency:new', memEmergency);
    emitToDistrict('emergency:new', memEmergency);

    res.status(201).json({ success: true, message: 'Emergency SOS registered and dispatched to nearby healthcare facility.', data: memEmergency });
  } catch (err) {
    next(err);
  }
};

export const getEmergencies = async (req, res, next) => {
  try {
    const { facilityId, status } = req.query;

    if (mongoose.connection.readyState === 1) {
      const query = {};
      if (facilityId) query.assignedFacilityId = facilityId;
      if (status) query.status = status;
      const emergencies = await Emergency.find(query).populate('patientId', 'name patientId phone village riskLevel').populate('assignedFacilityId', 'name type phone district').sort({ createdAt: -1 });
      return res.json({ success: true, data: emergencies });
    }

    let emergencies = [...memoryStore.emergencies];
    if (facilityId) emergencies = emergencies.filter(e => e.assignedFacilityId?._id === facilityId || e.assignedFacilityId === facilityId);
    if (status) emergencies = emergencies.filter(e => e.status === status);
    res.json({ success: true, data: emergencies });
  } catch (err) {
    next(err);
  }
};

export const updateEmergencyStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note = '' } = req.body;

    if (mongoose.connection.readyState === 1) {
      const emergency = await Emergency.findById(id);
      if (!emergency) return res.status(404).json({ success: false, message: 'Emergency record not found' });
      emergency.status = status;
      emergency.timeline.push({ status, timestamp: new Date(), updatedBy: req.user._id, note });
      await emergency.save();
      const populated = await Emergency.findById(id).populate('patientId', 'name patientId phone').populate('assignedFacilityId', 'name type');
      emitToFacility(emergency.assignedFacilityId, 'emergency:update', populated);
      emitToDistrict('emergency:update', populated);
      return res.json({ success: true, message: `Emergency status updated to '${status}'`, data: populated });
    }

    const emg = memoryStore.emergencies.find(e => e._id === id);
    if (!emg) return res.status(404).json({ success: false, message: 'Emergency record not found' });
    emg.status = status;
    emg.timeline.push({ status, timestamp: new Date(), updatedBy: req.user, note });

    const facId = emg.assignedFacilityId?._id || emg.assignedFacilityId;
    emitToFacility(facId, 'emergency:update', emg);
    emitToDistrict('emergency:update', emg);

    res.json({ success: true, message: `Emergency status updated to '${status}'`, data: emg });
  } catch (err) {
    next(err);
  }
};

