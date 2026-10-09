import mongoose from 'mongoose';
import { Triage } from '../../models/Triage.js';
import { Patient } from '../../models/Patient.js';
import { evaluateTriageRules } from './triage.engine.js';
import { generateTriageExplanation } from './triage.ai.js';
import { AuditLog } from '../../models/AuditLog.js';
import { memoryStore } from '../../config/memoryStore.js';

export const evaluateTriage = async (req, res, next) => {
  try {
    const {
      patientId,
      symptoms = [],
      symptomDuration,
      vitals = {},
      pregnancyConcern = false,
      additionalObservations = '',
    } = req.body;

    if (!patientId) {
      return res.status(400).json({ success: false, message: 'patientId is required' });
    }

    let patient = null;
    if (mongoose.connection.readyState === 1) {
      patient = await Patient.findById(patientId);
    } else {
      patient = memoryStore.patients.find(p => p._id === patientId || p.patientId === patientId);
    }

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    // 1. Evaluate deterministic rules
    const ruleEvaluation = evaluateTriageRules({
      symptoms,
      vitals,
      pregnancyConcern,
      additionalObservations,
    });

    const ruleLevel = ruleEvaluation.ruleLevel;
    const finalLevel = ruleLevel; // Strict safety rule: AI cannot alter deterministic urgency

    // 2. Generate bilingual explanation
    const { explanationEnglish, explanationHindi } = await generateTriageExplanation({
      ruleLevel,
      symptoms,
      vitals,
      triggeredRules: ruleEvaluation.triggeredRules,
      pregnancyConcern,
    });

    // 3. Persist triage assessment
    const triageData = {
      patientId: patient._id,
      createdBy: req.user._id,
      symptoms,
      symptomDuration: symptomDuration || '1-3 days',
      vitals,
      pregnancyConcern,
      additionalObservations,
      ruleLevel,
      finalLevel,
      triggeredRules: ruleEvaluation.triggeredRules,
      explanationEnglish,
      explanationHindi,
      nextSteps: ruleEvaluation.nextSteps,
      requiresHumanReview: true,
      disclaimer: 'Hackathon demonstration decision support only. Not a certified diagnostic device.',
      createdAt: new Date(),
    };

    if (mongoose.connection.readyState === 1) {
      const triageRecord = await Triage.create(triageData);
      const riskPriority = { GREEN: 1, YELLOW: 2, RED: 3 };
      if (riskPriority[finalLevel] > (riskPriority[patient.riskLevel] || 1)) {
        patient.riskLevel = finalLevel;
        await patient.save();
      }
      await AuditLog.create({
        action: 'TRIAGE_ASSESSMENT_COMPLETED',
        entityType: 'Triage',
        entityId: triageRecord._id.toString(),
        performedBy: req.user._id,
        details: { patientId: patient._id, finalLevel },
      });
    } else {
      const memTriage = { _id: `trg-${Date.now()}`, ...triageData, createdBy: req.user };
      memoryStore.triageRecords.unshift(memTriage);
      patient.riskLevel = finalLevel;
    }

    res.status(201).json({
      success: true,
      message: 'Health assessment completed and triaged successfully',
      data: {
        triageId: `trg-${Date.now()}`,
        patientId: patient._id,
        patientName: patient.name,
        ruleLevel,
        finalLevel,
        triggeredRules: ruleEvaluation.triggeredRules,
        explanationEnglish,
        explanationHindi,
        nextSteps: ruleEvaluation.nextSteps,
        requiresHumanReview: true,
        disclaimer: triageData.disclaimer,
        createdAt: new Date(),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getPatientTriageHistory = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    if (mongoose.connection.readyState === 1) {
      const records = await Triage.find({ patientId }).populate('createdBy', 'name role').sort({ createdAt: -1 });
      return res.json({ success: true, data: records });
    }

    const records = memoryStore.triageRecords.filter(t => t.patientId === patientId || t.patientId?._id === patientId);
    res.json({ success: true, data: records });
  } catch (err) {
    next(err);
  }
};

