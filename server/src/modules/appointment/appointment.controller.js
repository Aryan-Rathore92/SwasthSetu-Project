import mongoose from 'mongoose';
import { Appointment } from '../../models/Appointment.js';
import { Patient } from '../../models/Patient.js';
import { User } from '../../models/User.js';
import { Facility } from '../../models/Facility.js';
import { AuditLog } from '../../models/AuditLog.js';
import { memoryStore } from '../../config/memoryStore.js';
import { emitToFacility, emitToDoctor, emitToPatient } from '../../sockets/socketHandler.js';

export const createAppointment = async (req, res, next) => {
  try {
    const {
      patientId,
      doctorId,
      facilityId,
      department,
      appointmentDate,
      appointmentTime,
      mode = 'In-Person',
      reason = '',
    } = req.body;

    if (!patientId || !doctorId || !facilityId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        success: false,
        message: 'Missing required appointment fields (patient, doctor, facility, date, time)',
      });
    }

    let patient, doctor, facility;
    if (mongoose.connection.readyState === 1) {
      [patient, doctor, facility] = await Promise.all([
        Patient.findById(patientId),
        User.findById(doctorId),
        Facility.findById(facilityId),
      ]);
    } else {
      patient = memoryStore.patients.find(p => p._id === patientId || p.patientId === patientId);
      doctor = memoryStore.users.find(u => u._id === doctorId);
      facility = memoryStore.facilities.find(f => f._id === facilityId);
    }

    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    if (!facility) return res.status(404).json({ success: false, message: 'Facility not found' });

    let tokenNumber = 1;
    if (mongoose.connection.readyState === 1) {
      const countOnDate = await Appointment.countDocuments({ doctorId, appointmentDate });
      tokenNumber = countOnDate + 1;
    } else {
      const count = memoryStore.appointments.filter(a => (a.doctorId?._id === doctorId || a.doctorId === doctorId) && a.appointmentDate === appointmentDate).length;
      tokenNumber = count + 1;
    }

    const teleRoomId = mode === 'Online'
      ? `SwasthSetu-Room-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`
      : null;

    const aptData = {
      patientId,
      doctorId,
      facilityId,
      department: department || doctor.department || 'General Medicine',
      appointmentDate,
      appointmentTime,
      mode,
      tokenNumber,
      status: 'Scheduled',
      reason,
      teleRoomId,
      createdAt: new Date(),
    };

    if (mongoose.connection.readyState === 1) {
      const appointment = await Appointment.create(aptData);
      const populated = await Appointment.findById(appointment._id)
        .populate('patientId', 'name patientId phone age gender riskLevel village')
        .populate('doctorId', 'name department registrationNumber')
        .populate('facilityId', 'name type district');

      emitToFacility(facilityId, 'appointment:created', populated);
      emitToFacility(facilityId, 'queue:update', { facilityId, doctorId, appointmentDate });
      emitToDoctor(doctorId, 'appointment:created', populated);
      emitToPatient(patientId, 'appointment:created', populated);

      return res.status(201).json({
        success: true,
        message: `Appointment booked successfully! Token Number: #${tokenNumber}`,
        data: populated,
      });
    }

    // Memory Store Mode
    const memAppointment = {
      _id: `apt-${Date.now()}`,
      ...aptData,
      patientId: patient,
      doctorId: doctor,
      facilityId: facility,
    };
    memoryStore.appointments.unshift(memAppointment);

    emitToFacility(facilityId, 'appointment:created', memAppointment);
    emitToFacility(facilityId, 'queue:update', { facilityId, doctorId, appointmentDate });
    emitToDoctor(doctorId, 'appointment:created', memAppointment);
    emitToPatient(patientId, 'appointment:created', memAppointment);

    res.status(201).json({
      success: true,
      message: `Appointment booked successfully! Token Number: #${tokenNumber}`,
      data: memAppointment,
    });
  } catch (err) {
    next(err);
  }
};

export const getAppointments = async (req, res, next) => {
  try {
    const { patientId, doctorId, facilityId, date, status } = req.query;

    if (mongoose.connection.readyState === 1) {
      const query = {};
      if (patientId) query.patientId = patientId;
      if (doctorId) query.doctorId = doctorId;
      if (facilityId) query.facilityId = facilityId;
      if (date) query.appointmentDate = date;
      if (status) query.status = status;

      const appointments = await Appointment.find(query)
        .populate('patientId', 'name patientId phone age gender riskLevel village')
        .populate('doctorId', 'name department registrationNumber')
        .populate('facilityId', 'name type district')
        .sort({ appointmentDate: 1, tokenNumber: 1 });

      return res.json({ success: true, data: appointments });
    }

    let appointments = [...memoryStore.appointments];
    if (patientId) appointments = appointments.filter(a => a.patientId?._id === patientId || a.patientId === patientId || a.patientId?.patientId === patientId);
    if (doctorId) appointments = appointments.filter(a => a.doctorId?._id === doctorId || a.doctorId === doctorId);
    if (facilityId) appointments = appointments.filter(a => a.facilityId?._id === facilityId || a.facilityId === facilityId);
    if (date) appointments = appointments.filter(a => a.appointmentDate === date);
    if (status) appointments = appointments.filter(a => a.status === status);

    res.json({ success: true, data: appointments });
  } catch (err) {
    next(err);
  }
};

export const getAppointmentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const appointment = await Appointment.findById(id)
        .populate('patientId')
        .populate('doctorId', 'name department registrationNumber phone')
        .populate('facilityId', 'name type district phone address');
      if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
      return res.json({ success: true, data: appointment });
    }

    const appointment = memoryStore.appointments.find(a => a._id === id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};

export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Scheduled', 'Waiting', 'In Progress', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status: ${status}` });
    }

    if (mongoose.connection.readyState === 1) {
      const appointment = await Appointment.findById(id);
      if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
      appointment.status = status;
      await appointment.save();
      const populated = await Appointment.findById(id).populate('patientId', 'name patientId phone riskLevel').populate('doctorId', 'name department').populate('facilityId', 'name');
      emitToFacility(appointment.facilityId, 'queue:update', { facilityId: appointment.facilityId, doctorId: appointment.doctorId, appointmentId: appointment._id, status });
      emitToDoctor(appointment.doctorId, 'queue:update', { appointmentId: appointment._id, status });
      emitToPatient(appointment.patientId, 'appointment:updated', populated);
      return res.json({ success: true, message: `Appointment status updated to '${status}'`, data: populated });
    }

    const apt = memoryStore.appointments.find(a => a._id === id);
    if (!apt) return res.status(404).json({ success: false, message: 'Appointment not found' });
    apt.status = status;

    const facId = apt.facilityId?._id || apt.facilityId;
    const docId = apt.doctorId?._id || apt.doctorId;
    const patId = apt.patientId?._id || apt.patientId;

    emitToFacility(facId, 'queue:update', { facilityId: facId, doctorId: docId, appointmentId: apt._id, status });
    emitToDoctor(docId, 'queue:update', { appointmentId: apt._id, status });
    emitToPatient(patId, 'appointment:updated', apt);

    res.json({ success: true, message: `Appointment status updated to '${status}'`, data: apt });
  } catch (err) {
    next(err);
  }
};

export const getFacilityLiveQueue = async (req, res, next) => {
  try {
    const { facilityId } = req.params;
    const { doctorId, date } = req.query;
    const queryDate = date || new Date().toISOString().split('T')[0];

    if (mongoose.connection.readyState === 1) {
      const query = {
        facilityId,
        appointmentDate: queryDate,
        status: { $in: ['Scheduled', 'Waiting', 'In Progress'] },
      };
      if (doctorId) query.doctorId = doctorId;
      const queue = await Appointment.find(query)
        .populate('patientId', 'name patientId phone age gender riskLevel village conditions')
        .populate('doctorId', 'name department')
        .sort({ status: -1, tokenNumber: 1 });
      return res.json({ success: true, data: queue });
    }

    const queue = memoryStore.appointments.filter(a => {
      const fId = a.facilityId?._id || a.facilityId;
      const isFac = fId === facilityId || true; // In local demo display queue
      const isDate = a.appointmentDate === queryDate;
      const isStatus = ['Scheduled', 'Waiting', 'In Progress'].includes(a.status);
      return isFac && isDate && isStatus;
    });

    res.json({ success: true, data: queue });
  } catch (err) {
    next(err);
  }
};

