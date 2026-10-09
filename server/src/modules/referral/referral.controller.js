import mongoose from 'mongoose';
import { Referral } from '../../models/Referral.js';
import { Patient } from '../../models/Patient.js';
import { Facility } from '../../models/Facility.js';
import { AuditLog } from '../../models/AuditLog.js';
import { memoryStore } from '../../config/memoryStore.js';
import { emitToFacility, emitToPatient } from '../../sockets/socketHandler.js';

export const createReferral = async (req, res, next) => {
  try {
    const {
      patientId,
      fromFacilityId,
      toFacilityId,
      department,
      reason,
      priority = 'Routine',
      notes = '',
      dueDays = 3,
    } = req.body;

    if (!patientId || !toFacilityId || !reason || !department) {
      return res.status(400).json({
        success: false,
        message: 'Missing required referral fields (patient, destination facility, department, reason)',
      });
    }

    const sourceFacilityId = fromFacilityId || req.user.facilityId?._id || req.user.facilityId;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Number(dueDays));

    const initialTimeline = [
      {
        status: 'Created',
        timestamp: new Date(),
        facilityId: sourceFacilityId,
        updatedBy: req.user._id,
        note: `Referral initiated: ${reason}`,
      },
    ];

    if (mongoose.connection.readyState === 1) {
      const referral = await Referral.create({
        patientId,
        fromFacilityId: sourceFacilityId,
        toFacilityId,
        doctorId: req.user._id,
        department,
        reason,
        priority,
        status: 'Created',
        dueDate,
        timeline: initialTimeline,
      });

      const populated = await Referral.findById(referral._id)
        .populate('patientId', 'name patientId phone age gender riskLevel village')
        .populate('fromFacilityId', 'name type district')
        .populate('toFacilityId', 'name type district')
        .populate('doctorId', 'name department');

      emitToFacility(toFacilityId, 'referral:update', populated);
      emitToFacility(sourceFacilityId, 'referral:update', populated);
      emitToPatient(patientId, 'referral:update', populated);

      return res.status(201).json({ success: true, message: 'Referral created and sent to destination facility', data: populated });
    }

    // Memory Store Mode
    const patient = memoryStore.patients.find(p => p._id === patientId || p.patientId === patientId);
    const toFac = memoryStore.facilities.find(f => f._id === toFacilityId);
    const fromFac = memoryStore.facilities.find(f => f._id === sourceFacilityId);

    const memReferral = {
      _id: `ref-${Date.now()}`,
      patientId: patient || { _id: patientId, name: 'Patient' },
      fromFacilityId: fromFac || { _id: sourceFacilityId, name: 'Source Facility' },
      toFacilityId: toFac || { _id: toFacilityId, name: 'Destination Facility' },
      doctorId: req.user,
      department,
      reason,
      priority,
      status: 'Created',
      dueDate,
      timeline: initialTimeline,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    memoryStore.referrals.unshift(memReferral);
    emitToFacility(toFacilityId, 'referral:update', memReferral);
    emitToFacility(sourceFacilityId, 'referral:update', memReferral);

    res.status(201).json({ success: true, message: 'Referral created and sent to destination facility', data: memReferral });
  } catch (err) {
    next(err);
  }
};

export const getReferrals = async (req, res, next) => {
  try {
    const { facilityId, patientId, status, priority, isOverdue } = req.query;

    if (mongoose.connection.readyState === 1) {
      const query = {};
      if (patientId) query.patientId = patientId;
      if (status) query.status = status;
      if (priority) query.priority = priority;

      if (facilityId) {
        query.$or = [{ toFacilityId: facilityId }, { fromFacilityId: facilityId }];
      } else if (req.user.role === 'facility_admin' && req.user.facilityId) {
        const facId = req.user.facilityId._id || req.user.facilityId;
        query.$or = [{ toFacilityId: facId }, { fromFacilityId: facId }];
      }

      if (isOverdue === 'true') {
        query.status = { $ne: 'Closed' };
        query.dueDate = { $lt: new Date() };
      }

      const referrals = await Referral.find(query)
        .populate('patientId', 'name patientId phone age gender riskLevel village conditions')
        .populate('fromFacilityId', 'name type district')
        .populate('toFacilityId', 'name type district')
        .populate('doctorId', 'name department')
        .sort({ createdAt: -1 });

      return res.json({ success: true, data: referrals });
    }

    let referrals = [...memoryStore.referrals];
    if (patientId) referrals = referrals.filter(r => r.patientId?._id === patientId || r.patientId === patientId || r.patientId?.patientId === patientId);
    if (status) referrals = referrals.filter(r => r.status === status);
    if (priority) referrals = referrals.filter(r => r.priority === priority);
    if (isOverdue === 'true') referrals = referrals.filter(r => r.status !== 'Closed' && new Date(r.dueDate) < new Date());

    res.json({ success: true, data: referrals });
  } catch (err) {
    next(err);
  }
};

export const getReferralById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const referral = await Referral.findById(id).populate('patientId').populate('fromFacilityId').populate('toFacilityId').populate('doctorId');
      if (!referral) return res.status(404).json({ success: false, message: 'Referral not found' });
      return res.json({ success: true, data: referral });
    }

    const ref = memoryStore.referrals.find(r => r._id === id);
    if (!ref) return res.status(404).json({ success: false, message: 'Referral not found' });
    res.json({ success: true, data: ref });
  } catch (err) {
    next(err);
  }
};

export const acceptReferral = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { note = 'Referral accepted by destination facility' } = req.body;

    if (mongoose.connection.readyState === 1) {
      const referral = await Referral.findById(id);
      if (!referral) return res.status(404).json({ success: false, message: 'Referral not found' });
      referral.status = 'Accepted';
      referral.timeline.push({ status: 'Accepted', timestamp: new Date(), facilityId: referral.toFacilityId, updatedBy: req.user._id, note });
      await referral.save();
      const populated = await Referral.findById(id).populate('patientId', 'name patientId phone').populate('fromFacilityId', 'name').populate('toFacilityId', 'name');
      emitToFacility(referral.fromFacilityId, 'referral:update', populated);
      emitToFacility(referral.toFacilityId, 'referral:update', populated);
      return res.json({ success: true, message: 'Referral accepted successfully', data: populated });
    }

    const ref = memoryStore.referrals.find(r => r._id === id);
    if (!ref) return res.status(404).json({ success: false, message: 'Referral not found' });
    ref.status = 'Accepted';
    ref.timeline.push({ status: 'Accepted', timestamp: new Date(), updatedBy: req.user, note });
    res.json({ success: true, message: 'Referral accepted successfully', data: ref });
  } catch (err) {
    next(err);
  }
};

export const markPatientArrived = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { note = 'Patient arrived at destination facility' } = req.body;

    if (mongoose.connection.readyState === 1) {
      const referral = await Referral.findById(id);
      if (!referral) return res.status(404).json({ success: false, message: 'Referral not found' });
      referral.status = 'Arrived';
      referral.timeline.push({ status: 'Arrived', timestamp: new Date(), facilityId: referral.toFacilityId, updatedBy: req.user._id, note });
      await referral.save();
      const populated = await Referral.findById(id).populate('patientId', 'name patientId phone').populate('fromFacilityId', 'name').populate('toFacilityId', 'name');
      emitToFacility(referral.fromFacilityId, 'referral:update', populated);
      emitToFacility(referral.toFacilityId, 'referral:update', populated);
      return res.json({ success: true, message: 'Patient arrival confirmed', data: populated });
    }

    const ref = memoryStore.referrals.find(r => r._id === id);
    if (!ref) return res.status(404).json({ success: false, message: 'Referral not found' });
    ref.status = 'Arrived';
    ref.timeline.push({ status: 'Arrived', timestamp: new Date(), updatedBy: req.user, note });
    res.json({ success: true, message: 'Patient arrival confirmed', data: ref });
  } catch (err) {
    next(err);
  }
};

export const closeReferral = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { note = 'Referral consultation completed and case closed' } = req.body;

    if (mongoose.connection.readyState === 1) {
      const referral = await Referral.findById(id);
      if (!referral) return res.status(404).json({ success: false, message: 'Referral not found' });
      referral.status = 'Closed';
      referral.timeline.push({ status: 'Closed', timestamp: new Date(), facilityId: referral.toFacilityId, updatedBy: req.user._id, note });
      await referral.save();
      const populated = await Referral.findById(id).populate('patientId', 'name patientId phone').populate('fromFacilityId', 'name').populate('toFacilityId', 'name');
      emitToFacility(referral.fromFacilityId, 'referral:update', populated);
      emitToFacility(referral.toFacilityId, 'referral:update', populated);
      return res.json({ success: true, message: 'Referral successfully completed and closed', data: populated });
    }

    const ref = memoryStore.referrals.find(r => r._id === id);
    if (!ref) return res.status(404).json({ success: false, message: 'Referral not found' });
    ref.status = 'Closed';
    ref.timeline.push({ status: 'Closed', timestamp: new Date(), updatedBy: req.user, note });
    res.json({ success: true, message: 'Referral successfully completed and closed', data: ref });
  } catch (err) {
    next(err);
  }
};

