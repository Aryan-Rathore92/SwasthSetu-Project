import mongoose from 'mongoose';

const facilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['Sub-Centre', 'PHC', 'CHC', 'Rural Hospital', 'District Hospital'],
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    block: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: '',
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    departments: [
      {
        type: String,
        trim: true,
      },
    ],
    services: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Facility = mongoose.model('Facility', facilitySchema);

