import mongoose from 'mongoose';

const emergencyTimelineSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['Alert Created', 'Acknowledged', 'In Progress', 'Resolved'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  note: {
    type: String,
    default: '',
  },
});

const emergencySchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      default: null,
    },
    reporterName: {
      type: String,
      required: true,
    },
    reporterPhone: {
      type: String,
      required: true,
    },
    location: {
      lat: { type: Number, default: 28.6139 },
      lng: { type: Number, default: 77.2090 },
      address: { type: String, required: true },
      village: { type: String, default: '' },
      district: { type: String, default: '' },
    },
    assignedFacilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      required: true,
    },
    severity: {
      type: String,
      enum: ['CRITICAL', 'URGENT', 'STANDARD'],
      default: 'CRITICAL',
    },
    status: {
      type: String,
      enum: ['Alert Created', 'Acknowledged', 'In Progress', 'Resolved'],
      default: 'Alert Created',
    },
    notes: {
      type: String,
      default: 'Demonstration SOS alert triggered by patient or frontline health worker.',
    },
    timeline: [emergencyTimelineSchema],
  },
  { timestamps: true }
);

export const Emergency = mongoose.model('Emergency', emergencySchema);

