import mongoose from 'mongoose';
import { Patient } from '../../models/Patient.js';
import { Encounter } from '../../models/Encounter.js';
import { Triage } from '../../models/Triage.js';
import { Appointment } from '../../models/Appointment.js';
import { Referral } from '../../models/Referral.js';
import { AuditLog } from '../../models/AuditLog.js';
import { memoryStore } from '../../config/memoryStore.js';

export const createPatient = async (req, res, next) => {
  try {
    const {
      name,
      age,
      gender,
      phone,
      village,
      district,
      address,
      conditions,
      allergies,
      pregnancy,
      emergencyContact,
      demoAbhaId,
      consentForSharing,
    } = req.body;

    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const patientId = `P-${randomDigits}`;

    const parsedConditions = conditions ? (Array.isArray(conditions) ? conditions : conditions.split(',').map(s => s.trim())) : [];
    const parsedAllergies = allergies ? (Array.isArray(allergies) ? allergies : allergies.split(',').map(s => s.trim())) : [];

    const patientData = {
      patientId,
      name,
      age: Number(age),
      gender,
      phone,
      village,
      district,
      address: address || '',
      conditions: parsedConditions,
      allergies: parsedAllergies,
      pregnancy: pregnancy || { isPregnant: false },
      emergencyContact: emergencyContact || { name: '', phone: '', relation: '' },
      demoAbhaId: demoAbhaId || `ABHA-DEMO-${Math.floor(1000 + Math.random() * 9000)}`,
      consentForSharing: consentForSharing !== undefined ? consentForSharing : true,
      registeredBy: req.user?._id || null,
      registeredAtFacility: req.user?.facilityId || null,
      riskLevel: 'GREEN',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (mongoose.connection.readyState === 1) {
      const newPatient = await Patient.create(patientData);
      await AuditLog.create({
        action: 'PATIENT_REGISTERED',
        entityType: 'Patient',
        entityId: newPatient._id.toString(),
        performedBy: req.user?._id || null,
        details: { patientId, name, village },
      });
      return res.status(201).json({
        success: true,
        message: 'Patient registered successfully in healthcare database',
        data: newPatient,
      });
    }

    // Memory Store Mode
    const memoryPatient = {
      _id: `pat-${Date.now()}`,
      ...patientData,
      registeredBy: req.user,
    };
    memoryStore.patients.unshift(memoryPatient);

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully in healthcare database',
      data: memoryPatient,
    });
  } catch (err) {
    next(err);
  }
};

export const getPatients = async (req, res, next) => {
  try {
    const { search, village, riskLevel, limit = 50, page = 1 } = req.query;

    if (mongoose.connection.readyState === 1) {
      const query = {};
      if (village) query.village = new RegExp(village, 'i');
      if (riskLevel) query.riskLevel = riskLevel;
      if (search) {
        query.$or = [
          { name: new RegExp(search, 'i') },
          { patientId: new RegExp(search, 'i') },
          { phone: new RegExp(search, 'i') },
          { village: new RegExp(search, 'i') },
        ];
      }
      const skip = (Number(page) - 1) * Number(limit);
      const [patients, total] = await Promise.all([
        Patient.find(query)
          .populate('registeredBy', 'name role')
          .populate('registeredAtFacility', 'name type')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit)),
        Patient.countDocuments(query),
      ]);
      return res.json({
        success: true,
        data: patients,
        pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
      });
    }

    // Memory Store Mode
    let patients = [...memoryStore.patients];
    if (village) patients = patients.filter(p => p.village.toLowerCase().includes(village.toLowerCase()));
    if (riskLevel) patients = patients.filter(p => p.riskLevel === riskLevel);
    if (search) {
      const s = search.toLowerCase();
      patients = patients.filter(p =>
        p.name.toLowerCase().includes(s) ||
        p.patientId.toLowerCase().includes(s) ||
        p.phone.includes(s) ||
        p.village.toLowerCase().includes(s)
      );
    }

    res.json({
      success: true,
      data: patients,
      pagination: { total: patients.length, page: 1, pages: 1 },
    });
  } catch (err) {
    next(err);
  }
};

export const getPatientById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      let patient = null;
      if (id.startsWith('P-')) {
        patient = await Patient.findOne({ patientId: id })
          .populate('registeredBy', 'name role')
          .populate('registeredAtFacility', 'name type district');
      } else {
        patient = await Patient.findById(id)
          .populate('registeredBy', 'name role')
          .populate('registeredAtFacility', 'name type district');
      }
      if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
      return res.json({ success: true, data: patient });
    }

    const patient = memoryStore.patients.find(p => p._id === id || p.patientId === id);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
    res.json({ success: true, data: patient });
  } catch (err) {
    next(err);
  }
};

export const updatePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (mongoose.connection.readyState === 1) {
      const patient = await Patient.findByIdAndUpdate(id, updateData, { new: true });
      if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
      return res.json({ success: true, message: 'Patient record updated successfully', data: patient });
    }

    const idx = memoryStore.patients.findIndex(p => p._id === id || p.patientId === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Patient not found' });
    memoryStore.patients[idx] = { ...memoryStore.patients[idx], ...updateData, updatedAt: new Date() };

    res.json({ success: true, message: 'Patient record updated successfully', data: memoryStore.patients[idx] });
  } catch (err) {
    next(err);
  }
};

export const getPatientTimeline = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const patient = await Patient.findById(id);
      if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
      const [encounters, triageRecords, appointments, referrals] = await Promise.all([
        Encounter.find({ patientId: patient._id }).populate('doctorId', 'name department registrationNumber').populate('facilityId', 'name type district').sort({ createdAt: -1 }),
        Triage.find({ patientId: patient._id }).populate('createdBy', 'name role').sort({ createdAt: -1 }),
        Appointment.find({ patientId: patient._id }).populate('doctorId', 'name department').populate('facilityId', 'name type').sort({ appointmentDate: -1, createdAt: -1 }),
        Referral.find({ patientId: patient._id }).populate('fromFacilityId', 'name type').populate('toFacilityId', 'name type').populate('doctorId', 'name').sort({ createdAt: -1 }),
      ]);
      const timelineEvents = [
        ...encounters.map(e => ({ type: 'ENCOUNTER', title: `Clinical Consultation - ${e.diagnosis}`, date: e.createdAt, facility: e.facilityId?.name, doctor: e.doctorId?.name, data: e })),
        ...triageRecords.map(t => ({ type: 'TRIAGE', title: `Health Assessment (${t.finalLevel} Priority)`, date: t.createdAt, performedBy: t.createdBy?.name, data: t })),
        ...appointments.map(a => ({ type: 'APPOINTMENT', title: `Appointment (${a.status}) - Token #${a.tokenNumber}`, date: new Date(`${a.appointmentDate}T${a.appointmentTime || '10:00'}`), facility: a.facilityId?.name, doctor: a.doctorId?.name, data: a })),
        ...referrals.map(r => ({ type: 'REFERRAL', title: `Facility Referral (${r.status}) - ${r.priority}`, date: r.createdAt, from: r.fromFacilityId?.name, to: r.toFacilityId?.name, data: r })),
      ].sort((a, b) => new Date(b.date) - new Date(a.date));

      return res.json({ success: true, data: { patient, timelineEvents, encounters, triageRecords, appointments, referrals } });
    }

    // Memory Store Mode
    const patient = memoryStore.patients.find(p => p._id === id || p.patientId === id);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

    const encounters = memoryStore.encounters.filter(e => e.patientId?._id === patient._id || e.patientId === patient._id);
    const triageRecords = memoryStore.triageRecords.filter(t => t.patientId === patient._id || t.patientId?._id === patient._id);
    const appointments = memoryStore.appointments.filter(a => a.patientId?._id === patient._id || a.patientId === patient._id);
    const referrals = memoryStore.referrals.filter(r => r.patientId?._id === patient._id || r.patientId === patient._id);

    const timelineEvents = [
      ...encounters.map(e => ({ type: 'ENCOUNTER', title: `Clinical Consultation - ${e.diagnosis}`, date: e.createdAt, facility: e.facilityId?.name, doctor: e.doctorId?.name, data: e })),
      ...triageRecords.map(t => ({ type: 'TRIAGE', title: `Health Assessment (${t.finalLevel} Priority)`, date: t.createdAt, performedBy: t.createdBy?.name, data: t })),
      ...appointments.map(a => ({ type: 'APPOINTMENT', title: `Appointment (${a.status}) - Token #${a.tokenNumber}`, date: new Date(a.createdAt || Date.now()), facility: a.facilityId?.name, doctor: a.doctorId?.name, data: a })),
      ...referrals.map(r => ({ type: 'REFERRAL', title: `Facility Referral (${r.status}) - ${r.priority}`, date: r.createdAt, from: r.fromFacilityId?.name, to: r.toFacilityId?.name, data: r })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ success: true, data: { patient, timelineEvents, encounters, triageRecords, appointments, referrals } });
  } catch (err) {
    next(err);
  }
};

