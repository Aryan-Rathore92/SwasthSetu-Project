import mongoose from 'mongoose';
import { Patient } from '../../models/Patient.js';
import { Encounter } from '../../models/Encounter.js';
import { Triage } from '../../models/Triage.js';
import { Referral } from '../../models/Referral.js';
import { generatePatientSummary } from '../triage/triage.ai.js';
import { memoryStore } from '../../config/memoryStore.js';

export const getAiPatientSummary = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    let patient = null;
    let encounters = [];
    let triageRecords = [];
    let referrals = [];

    if (mongoose.connection.readyState === 1) {
      patient = await Patient.findById(patientId);
      if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
      [encounters, triageRecords, referrals] = await Promise.all([
        Encounter.find({ patientId }).populate('doctorId', 'name').sort({ createdAt: -1 }),
        Triage.find({ patientId }).sort({ createdAt: -1 }),
        Referral.find({ patientId }).populate('toFacilityId', 'name').sort({ createdAt: -1 }),
      ]);
    } else {
      patient = memoryStore.patients.find(p => p._id === patientId || p.patientId === patientId);
      if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
      encounters = memoryStore.encounters.filter(e => e.patientId?._id === patient._id || e.patientId === patient._id);
      triageRecords = memoryStore.triageRecords.filter(t => t.patientId?._id === patient._id || t.patientId === patient._id);
      referrals = memoryStore.referrals.filter(r => r.patientId?._id === patient._id || r.patientId === patient._id);
    }

    const summary = await generatePatientSummary({
      patient,
      encounters,
      triageRecords,
      referrals,
    });

    res.json({
      success: true,
      message: 'AI medical summary generated successfully',
      data: summary,
    });
  } catch (err) {
    next(err);
  }
};

