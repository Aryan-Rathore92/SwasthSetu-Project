import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    facilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    appointmentDate: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    appointmentTime: {
      type: String, // HH:MM
      required: true,
    },
    mode: {
      type: String,
      enum: ['In-Person', 'Online'],
      default: 'In-Person',
    },
    tokenNumber: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Waiting', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Scheduled',
    },
    reason: {
      type: String,
      default: '',
    },
    teleRoomId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

appointmentSchema.index({ doctorId: 1, appointmentDate: 1, tokenNumber: 1 });
appointmentSchema.index({ facilityId: 1, appointmentDate: 1, status: 1 });

export const Appointment = mongoose.model('Appointment', appointmentSchema);

