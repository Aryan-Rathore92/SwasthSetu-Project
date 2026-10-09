import mongoose from 'mongoose';
import { Appointment } from '../../models/Appointment.js';
import { Patient } from '../../models/Patient.js';
import { Encounter } from '../../models/Encounter.js';
import { User } from '../../models/User.js';
import { Facility } from '../../models/Facility.js';
import { AuditLog } from '../../models/AuditLog.js';
import { memoryStore } from '../../config/memoryStore.js';
import { generatePrescriptionPdf } from '../../utils/pdfGenerator.js';
import { emitToFacility, emitToPatient, emitToDoctor } from '../../sockets/socketHandler.js';

export const startTeleconsultation = async (req, res, next) => {
  try {
    const { appointmentId } = req.body;

    if (mongoose.connection.readyState === 1) {
      const appointment = await Appointment.findById(appointmentId).populate('patientId').populate('doctorId').populate('facilityId');
      if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
      if (!appointment.teleRoomId) {
        appointment.teleRoomId = `SwasthSetu-Room-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
      }
      appointment.status = 'In Progress';
      await appointment.save();
      emitToFacility(appointment.facilityId._id, 'queue:update', { appointmentId: appointment._id, status: 'In Progress' });
      emitToPatient(appointment.patientId._id, 'appointment:updated', appointment);
      return res.json({ success: true, data: { appointmentId: appointment._id, roomId: appointment.teleRoomId, patient: appointment.patientId, doctor: appointment.doctorId, facility: appointment.facilityId, status: appointment.status } });
    }

    const apt = memoryStore.appointments.find(a => a._id === appointmentId);
    if (!apt) return res.status(404).json({ success: false, message: 'Appointment not found' });
    if (!apt.teleRoomId) {
      apt.teleRoomId = `SwasthSetu-Room-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
    }
    apt.status = 'In Progress';
    res.json({ success: true, data: { appointmentId: apt._id, roomId: apt.teleRoomId, patient: apt.patientId, doctor: apt.doctorId, facility: apt.facilityId, status: apt.status } });
  } catch (err) {
    next(err);
  }
};

export const getTeleconsultationDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const appointment = await Appointment.findById(id).populate('patientId').populate('doctorId', 'name department registrationNumber phone').populate('facilityId', 'name type district');
      if (!appointment) return res.status(404).json({ success: false, message: 'Teleconsultation not found' });
      return res.json({ success: true, data: appointment });
    }

    const appointment = memoryStore.appointments.find(a => a._id === id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Teleconsultation not found' });
    res.json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};

export const createPrescriptionAndComplete = async (req, res, next) => {
  try {
    const { id } = req.params; // appointmentId
    const {
      chiefComplaint,
      symptoms = [],
      observations = '',
      diagnosis,
      medicines = [],
      notes = '',
      followUpDate = null,
    } = req.body;

    let appointment, patient, doctor, facility;

    if (mongoose.connection.readyState === 1) {
      appointment = await Appointment.findById(id);
      if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
      [patient, doctor, facility] = await Promise.all([
        Patient.findById(appointment.patientId),
        User.findById(appointment.doctorId),
        Facility.findById(appointment.facilityId),
      ]);
      const encounter = await Encounter.create({
        patientId: patient._id,
        doctorId: doctor._id,
        facilityId: facility._id,
        appointmentId: appointment._id,
        chiefComplaint: chiefComplaint || diagnosis || 'Routine Consultation',
        symptoms,
        observations,
        diagnosis: diagnosis || 'Clinical evaluation completed',
        medicines,
        notes,
        followUpDate,
      });
      appointment.status = 'Completed';
      await appointment.save();
      emitToFacility(facility._id, 'queue:update', { appointmentId: appointment._id, status: 'Completed' });
      emitToPatient(patient._id, 'appointment:updated', appointment);
      emitToDoctor(doctor._id, 'queue:update', { appointmentId: appointment._id, status: 'Completed' });
      return res.status(201).json({
        success: true,
        message: 'Consultation completed and e-prescription generated successfully!',
        data: { encounterId: encounter._id, appointmentId: appointment._id, diagnosis: encounter.diagnosis, medicines: encounter.medicines, followUpDate: encounter.followUpDate },
      });
    }

    // Memory Store Mode
    appointment = memoryStore.appointments.find(a => a._id === id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    patient = appointment.patientId;
    doctor = appointment.doctorId;
    facility = appointment.facilityId;

    const memEncounter = {
      _id: `enc-${Date.now()}`,
      patientId: patient,
      doctorId: doctor,
      facilityId: facility,
      appointmentId: appointment._id,
      chiefComplaint: chiefComplaint || diagnosis || 'Routine Consultation',
      symptoms,
      observations,
      diagnosis: diagnosis || 'Clinical evaluation completed',
      medicines,
      notes,
      followUpDate,
      createdAt: new Date(),
    };

    memoryStore.encounters.unshift(memEncounter);
    appointment.status = 'Completed';

    res.status(201).json({
      success: true,
      message: 'Consultation completed and e-prescription generated successfully!',
      data: { encounterId: memEncounter._id, appointmentId: appointment._id, diagnosis: memEncounter.diagnosis, medicines: memEncounter.medicines, followUpDate: memEncounter.followUpDate },
    });
  } catch (err) {
    next(err);
  }
};

export const downloadPrescriptionPdf = async (req, res, next) => {
  try {
    const { encounterId } = req.params;
    let encounter = null;

    if (mongoose.connection.readyState === 1) {
      encounter = await Encounter.findById(encounterId).populate('patientId').populate('doctorId', 'name department registrationNumber phone').populate('facilityId', 'name type district address phone');
    } else {
      encounter = memoryStore.encounters.find(e => e._id === encounterId);
    }

    if (!encounter) {
      return res.status(404).json({ success: false, message: 'Encounter prescription not found' });
    }

    const doc = generatePrescriptionPdf({
      patient: encounter.patientId,
      doctor: encounter.doctorId,
      facility: encounter.facilityId,
      diagnosis: encounter.diagnosis,
      medicines: encounter.medicines,
      notes: encounter.notes,
      followUpDate: encounter.followUpDate,
      encounterDate: encounter.createdAt || new Date(),
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Prescription_${encounter.patientId?.patientId || 'DEMO'}_${encounter._id}.pdf"`
    );

    doc.pipe(res);
    doc.end();
  } catch (err) {
    next(err);
  }
};

