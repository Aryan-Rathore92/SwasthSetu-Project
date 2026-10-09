import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['patient', 'health_worker', 'doctor', 'facility_admin', 'district_admin'],
    },
    facilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      default: null,
    },
    department: {
      type: String,
      default: null,
    },
    registrationNumber: {
      type: String,
      default: null,
    },
    language: {
      type: String,
      enum: ['en', 'hi'],
      default: 'en',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);

