import mongoose from 'mongoose';

const referralTimelineSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['Created', 'Accepted', 'Arrived', 'Closed'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  facilityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility',
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  note: {
    type: String,
    default: '',
  },
});

const referralSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    fromFacilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      required: true,
    },
    toFacilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ['Routine', 'Urgent', 'Emergency'],
      default: 'Routine',
    },
    status: {
      type: String,
      enum: ['Created', 'Accepted', 'Arrived', 'Closed'],
      default: 'Created',
    },
    dueDate: {
      type: Date,
      required: true,
    },
    timeline: [referralTimelineSchema],
  },
  { timestamps: true }
);

referralSchema.index({ toFacilityId: 1, status: 1 });
referralSchema.index({ fromFacilityId: 1, status: 1 });
referralSchema.index({ patientId: 1 });

export const Referral = mongoose.model('Referral', referralSchema);

