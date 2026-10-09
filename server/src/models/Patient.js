import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
      max: 130,
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Other'],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    village: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      default: '',
    },
    conditions: [
      {
        type: String,
        trim: true,
      },
    ],
    allergies: [
      {
        type: String,
        trim: true,
      },
    ],
    pregnancy: {
      isPregnant: { type: Boolean, default: false },
      trimester: { type: Number, default: null },
      dueDate: { type: Date, default: null },
    },
    emergencyContact: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      relation: { type: String, default: '' },
    },
    riskLevel: {
      type: String,
      enum: ['GREEN', 'YELLOW', 'RED'],
      default: 'GREEN',
    },
    demoAbhaId: {
      type: String,
      default: null,
    },
    consentForSharing: {
      type: Boolean,
      default: true,
    },
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    registeredAtFacility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      default: null,
    },
  },
  { timestamps: true }
);

patientSchema.index({ name: 'text', village: 'text', phone: 'text' });

export const Patient = mongoose.model('Patient', patientSchema);

