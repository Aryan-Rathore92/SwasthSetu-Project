import mongoose from 'mongoose';

const followUpSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    assignedWorkerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    program: {
      type: String,
      enum: ['Maternal', 'Chronic Disease', 'Child Health', 'Missed Visit'],
      required: true,
    },
    dueDate: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Flagged for Doctor'],
      default: 'Pending',
    },
    notes: {
      type: String,
      default: '',
    },
    observations: {
      type: String,
      default: '',
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const FollowUp = mongoose.model('FollowUp', followUpSchema);

