import mongoose from 'mongoose';

const encounterSchema = new mongoose.Schema(
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
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null,
    },
    chiefComplaint: {
      type: String,
      required: true,
    },
    symptoms: [
      {
        type: String,
      },
    ],
    observations: {
      type: String,
      default: '',
    },
    diagnosis: {
      type: String,
      required: true,
    },
    medicines: [
      {
        name: { type: String, required: true },
        dosage: { type: String, required: true }, // e.g. 500mg
        frequency: { type: String, required: true }, // e.g. 1-0-1 (Twice daily)
        duration: { type: String, required: true }, // e.g. 5 days
        instructions: { type: String, default: 'After meals' },
      },
    ],
    notes: {
      type: String,
      default: '',
    },
    followUpDate: {
      type: String, // YYYY-MM-DD
      default: null,
    },
    prescriptionPdfPath: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export const Encounter = mongoose.model('Encounter', encounterSchema);

