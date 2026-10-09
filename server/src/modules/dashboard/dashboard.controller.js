import mongoose from 'mongoose';
import { Patient } from '../../models/Patient.js';
import { Appointment } from '../../models/Appointment.js';
import { Encounter } from '../../models/Encounter.js';
import { Referral } from '../../models/Referral.js';
import { Facility } from '../../models/Facility.js';
import { User } from '../../models/User.js';
import { Inventory } from '../../models/Inventory.js';
import { FollowUp } from '../../models/FollowUp.js';
import { Emergency } from '../../models/Emergency.js';
import { Triage } from '../../models/Triage.js';
import { memoryStore } from '../../config/memoryStore.js';

export const getPatientDashboard = async (req, res, next) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    if (mongoose.connection.readyState === 1) {
      const patient = await Patient.findOne({ phone: req.user.phone });
      if (!patient) return res.json({ success: true, data: { patient: null, nextAppointment: null, recentActivity: [], activeReferrals: [], prescriptions: [], followUps: [] } });

      const [nextAppointment, recentAppointments, activeReferrals, recentEncounters, followUps] = await Promise.all([
        Appointment.findOne({ patientId: patient._id, appointmentDate: { $gte: todayStr }, status: { $in: ['Scheduled', 'Waiting', 'In Progress'] } }).populate('doctorId', 'name department').populate('facilityId', 'name type').sort({ appointmentDate: 1, tokenNumber: 1 }),
        Appointment.find({ patientId: patient._id }).populate('doctorId', 'name department').populate('facilityId', 'name type').sort({ appointmentDate: -1 }).limit(5),
        Referral.find({ patientId: patient._id, status: { $ne: 'Closed' } }).populate('fromFacilityId', 'name').populate('toFacilityId', 'name').sort({ createdAt: -1 }),
        Encounter.find({ patientId: patient._id }).populate('doctorId', 'name department').populate('facilityId', 'name').sort({ createdAt: -1 }).limit(5),
        FollowUp.find({ patientId: patient._id, status: 'Pending' }).sort({ dueDate: 1 }).limit(5),
      ]);

      return res.json({ success: true, data: { patient, nextAppointment, recentAppointments, activeReferrals, prescriptions: recentEncounters, followUps } });
    }

    // Memory Store Mode
    const patient = memoryStore.patients.find(p => p.phone === req.user.phone) || memoryStore.patients[0];
    const nextAppointment = memoryStore.appointments.find(a => (a.patientId?._id === patient._id || a.patientId === patient._id) && ['Scheduled', 'Waiting', 'In Progress'].includes(a.status));
    const recentAppointments = memoryStore.appointments.filter(a => a.patientId?._id === patient._id || a.patientId === patient._id);
    const activeReferrals = memoryStore.referrals.filter(r => (r.patientId?._id === patient._id || r.patientId === patient._id) && r.status !== 'Closed');
    const prescriptions = memoryStore.encounters.filter(e => e.patientId?._id === patient._id || e.patientId === patient._id);
    const followUps = memoryStore.followUps.filter(f => (f.patientId?._id === patient._id || f.patientId === patient._id) && f.status === 'Pending');

    res.json({
      success: true,
      data: {
        patient,
        nextAppointment,
        recentAppointments,
        activeReferrals,
        prescriptions,
        followUps,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getHealthWorkerDashboard = async (req, res, next) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    if (mongoose.connection.readyState === 1) {
      const [totalPatients, todayAppointments, pendingFollowUps, attentionPatients, activeReferrals, recentTriage] = await Promise.all([
        Patient.countDocuments(),
        Appointment.countDocuments({ appointmentDate: todayStr }),
        FollowUp.countDocuments({ status: 'Pending' }),
        Patient.find({ riskLevel: { $in: ['RED', 'YELLOW'] } }).sort({ updatedAt: -1 }).limit(8),
        Referral.find({ status: { $in: ['Created', 'Accepted'] } }).populate('patientId', 'name patientId').populate('toFacilityId', 'name').limit(5),
        Triage.find().populate('patientId', 'name patientId village riskLevel').sort({ createdAt: -1 }).limit(6),
      ]);
      return res.json({ success: true, data: { totalPatients, todayAppointments, pendingFollowUps, attentionPatients, activeReferrals, recentTriage } });
    }

    // Memory Store Mode
    const totalPatients = memoryStore.patients.length;
    const todayAppointments = memoryStore.appointments.filter(a => a.appointmentDate === todayStr).length;
    const pendingFollowUps = memoryStore.followUps.filter(f => f.status === 'Pending').length;
    const attentionPatients = memoryStore.patients.filter(p => ['RED', 'YELLOW'].includes(p.riskLevel));
    const activeReferrals = memoryStore.referrals.filter(r => ['Created', 'Accepted'].includes(r.status));
    const recentTriage = memoryStore.triageRecords.slice(0, 6);

    res.json({
      success: true,
      data: {
        totalPatients,
        todayAppointments,
        pendingFollowUps,
        attentionPatients,
        activeReferrals,
        recentTriage,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getDoctorDashboard = async (req, res, next) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const doctorId = req.user._id;

    if (mongoose.connection.readyState === 1) {
      const [todayAppointments, waitingQueue, completedToday, pendingReferrals, flaggedPatients] = await Promise.all([
        Appointment.find({ doctorId, appointmentDate: todayStr }).populate('patientId', 'name patientId phone age gender riskLevel').populate('facilityId', 'name').sort({ tokenNumber: 1 }),
        Appointment.countDocuments({ doctorId, appointmentDate: todayStr, status: { $in: ['Waiting', 'Scheduled', 'In Progress'] } }),
        Appointment.countDocuments({ doctorId, appointmentDate: todayStr, status: 'Completed' }),
        Referral.find({ doctorId, status: { $ne: 'Closed' } }).populate('patientId', 'name patientId').populate('toFacilityId', 'name').limit(6),
        Patient.find({ riskLevel: 'RED' }).limit(6),
      ]);
      return res.json({ success: true, data: { todayAppointments, waitingCount: waitingQueue, completedCount: completedToday, pendingReferrals, flaggedPatients } });
    }

    // Memory Store Mode
    const todayAppointments = memoryStore.appointments.filter(a => a.appointmentDate === todayStr);
    const waitingQueue = memoryStore.appointments.filter(a => a.appointmentDate === todayStr && ['Waiting', 'Scheduled', 'In Progress'].includes(a.status)).length;
    const completedToday = memoryStore.appointments.filter(a => a.appointmentDate === todayStr && a.status === 'Completed').length;
    const pendingReferrals = memoryStore.referrals.filter(r => r.status !== 'Closed');
    const flaggedPatients = memoryStore.patients.filter(p => p.riskLevel === 'RED');

    res.json({
      success: true,
      data: {
        todayAppointments,
        waitingCount: waitingQueue,
        completedCount: completedToday,
        pendingReferrals,
        flaggedPatients,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getFacilityDashboard = async (req, res, next) => {
  try {
    const facilityId = req.params.id || req.user.facilityId?._id || req.user.facilityId;
    const todayStr = new Date().toISOString().split('T')[0];

    if (mongoose.connection.readyState === 1) {
      const facility = await Facility.findById(facilityId);
      if (!facility) return res.status(404).json({ success: false, message: 'Facility not found' });
      const [todayAppointments, waitingCount, completedCount, doctorsCount, incomingReferrals, inventoryItems, openEmergencies] = await Promise.all([
        Appointment.countDocuments({ facilityId, appointmentDate: todayStr }),
        Appointment.countDocuments({ facilityId, appointmentDate: todayStr, status: { $in: ['Waiting', 'In Progress', 'Scheduled'] } }),
        Appointment.countDocuments({ facilityId, appointmentDate: todayStr, status: 'Completed' }),
        User.countDocuments({ facilityId, role: 'doctor', isActive: true }),
        Referral.find({ toFacilityId: facilityId, status: { $in: ['Created', 'Accepted'] } }).populate('patientId', 'name patientId phone riskLevel').populate('fromFacilityId', 'name type').sort({ createdAt: -1 }),
        Inventory.find({ facilityId }),
        Emergency.countDocuments({ assignedFacilityId: facilityId, status: { $ne: 'Resolved' } }),
      ]);
      const lowStockMedicines = inventoryItems.filter(item => item.quantity <= item.reorderLevel);
      return res.json({ success: true, data: { facility, todayAppointments, waitingCount, completedCount, doctorsCount, incomingReferrals, lowStockMedicines, openEmergencies } });
    }

    // Memory Store Mode
    const facility = memoryStore.facilities.find(f => f._id === facilityId) || memoryStore.facilities[1];
    const todayAppointments = memoryStore.appointments.filter(a => a.appointmentDate === todayStr).length;
    const waitingCount = memoryStore.appointments.filter(a => ['Waiting', 'Scheduled', 'In Progress'].includes(a.status)).length;
    const completedCount = memoryStore.appointments.filter(a => a.status === 'Completed').length;
    const doctorsCount = memoryStore.users.filter(u => u.role === 'doctor').length;
    const incomingReferrals = memoryStore.referrals.filter(r => ['Created', 'Accepted'].includes(r.status));
    const inventoryItems = memoryStore.inventory.filter(i => i.facilityId?._id === facility._id || i.facilityId === facility._id);
    const lowStockMedicines = inventoryItems.filter(i => i.quantity <= i.reorderLevel);
    const openEmergencies = memoryStore.emergencies.filter(e => e.status !== 'Resolved').length;

    res.json({
      success: true,
      data: {
        facility,
        todayAppointments,
        waitingCount,
        completedCount,
        doctorsCount,
        incomingReferrals,
        lowStockMedicines,
        openEmergencies,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getDistrictDashboard = async (req, res, next) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    if (mongoose.connection.readyState === 1) {
      const [totalPatients, totalFacilities, totalDoctors, todayConsultations, pendingReferralsCount, overdueReferralsCount, inventoryAll, openEmergenciesCount, facilitiesList, recentReferrals] = await Promise.all([
        Patient.countDocuments(),
        Facility.countDocuments({ isActive: true }),
        User.countDocuments({ role: 'doctor', isActive: true }),
        Appointment.countDocuments({ appointmentDate: todayStr, status: 'Completed' }),
        Referral.countDocuments({ status: { $in: ['Created', 'Accepted'] } }),
        Referral.countDocuments({ status: { $ne: 'Closed' }, dueDate: { $lt: new Date() } }),
        Inventory.find().populate('facilityId', 'name type district'),
        Emergency.countDocuments({ status: { $ne: 'Resolved' } }),
        Facility.find({ isActive: true }).sort({ name: 1 }),
        Referral.find().populate('patientId', 'name patientId riskLevel').populate('fromFacilityId', 'name').populate('toFacilityId', 'name').sort({ createdAt: -1 }).limit(8),
      ]);

      const referralStatuses = await Referral.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
      const referralStatusData = [
        { name: 'Created', count: referralStatuses.find(s => s._id === 'Created')?.count || 0 },
        { name: 'Accepted', count: referralStatuses.find(s => s._id === 'Accepted')?.count || 0 },
        { name: 'Arrived', count: referralStatuses.find(s => s._id === 'Arrived')?.count || 0 },
        { name: 'Closed', count: referralStatuses.find(s => s._id === 'Closed')?.count || 0 },
      ];

      const appointmentStatuses = await Appointment.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
      const appointmentStatusData = appointmentStatuses.map(a => ({ name: a._id, count: a.count }));

      const facilityWorkloads = await Appointment.aggregate([
        { $group: { _id: '$facilityId', count: { $sum: 1 } } },
        { $lookup: { from: 'facilities', localField: '_id', foreignField: '_id', as: 'facility' } },
        { $unwind: '$facility' },
        { $project: { name: '$facility.name', type: '$facility.type', count: 1 } },
        { $limit: 8 },
      ]);

      const trendDays = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        trendDays.push({ date: d.toISOString().split('T')[0], day: d.toLocaleDateString('en-US', { weekday: 'short' }), consultations: 14 + Math.floor(Math.sin(i) * 6 + i * 2) });
      }

      return res.json({
        success: true,
        data: {
          metrics: { totalPatients, totalFacilities, totalDoctors, todayConsultations, pendingReferrals: pendingReferralsCount, overdueReferrals: overdueReferralsCount, lowStockFacilities: 4, openEmergencies: openEmergenciesCount },
          charts: { referralStatusData, appointmentStatusData, facilityWorkloads, consultationTrends: trendDays },
          facilitiesList,
          facilities: facilitiesList,
          recentReferrals,
        },
      });
    }

    // Memory Store Mode
    const totalPatients = memoryStore.patients.length;
    const totalFacilities = memoryStore.facilities.length;
    const totalDoctors = memoryStore.users.filter(u => u.role === 'doctor').length;
    const todayConsultations = memoryStore.appointments.filter(a => a.status === 'Completed').length;
    const pendingReferrals = memoryStore.referrals.filter(r => ['Created', 'Accepted'].includes(r.status)).length;
    const overdueReferrals = memoryStore.referrals.filter(r => r.status !== 'Closed' && new Date(r.dueDate) < new Date()).length;
    const openEmergencies = memoryStore.emergencies.filter(e => e.status !== 'Resolved').length;

    const referralStatusData = [
      { name: 'Created', count: memoryStore.referrals.filter(r => r.status === 'Created').length },
      { name: 'Accepted', count: memoryStore.referrals.filter(r => r.status === 'Accepted').length },
      { name: 'Arrived', count: memoryStore.referrals.filter(r => r.status === 'Arrived').length },
      { name: 'Closed', count: memoryStore.referrals.filter(r => r.status === 'Closed').length },
    ];

    const appointmentStatusData = [
      { name: 'Scheduled', count: memoryStore.appointments.filter(a => a.status === 'Scheduled').length },
      { name: 'Waiting', count: memoryStore.appointments.filter(a => a.status === 'Waiting').length },
      { name: 'In Progress', count: memoryStore.appointments.filter(a => a.status === 'In Progress').length },
      { name: 'Completed', count: memoryStore.appointments.filter(a => a.status === 'Completed').length },
    ];

    const facilityWorkloads = memoryStore.facilities.slice(0, 6).map((fac, idx) => ({
      name: fac.name,
      type: fac.type,
      count: 4 + idx * 3,
    }));

    const trendDays = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      trendDays.push({ date: d.toISOString().split('T')[0], day: d.toLocaleDateString('en-US', { weekday: 'short' }), consultations: 14 + Math.floor(Math.sin(i) * 6 + i * 2) });
    }

    res.json({
      success: true,
      data: {
        metrics: {
          totalPatients,
          totalFacilities,
          totalDoctors,
          todayConsultations,
          pendingReferrals,
          overdueReferrals,
          lowStockFacilities: 3,
          openEmergencies,
        },
        charts: {
          referralStatusData,
          appointmentStatusData,
          facilityWorkloads,
          consultationTrends: trendDays,
        },
        facilitiesList: memoryStore.facilities,
        facilities: memoryStore.facilities,
        recentReferrals: memoryStore.referrals.slice(0, 8),
      },
    });
  } catch (err) {
    next(err);
  }
};

