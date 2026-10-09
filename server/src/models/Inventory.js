import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    facilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      required: true,
    },
    medicineName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true, // e.g. Antibiotics, Analgesics, Maternal Health, Antidiabetic, Antihypertensive
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    reorderLevel: {
      type: Number,
      required: true,
      min: 0,
      default: 20,
    },
    unit: {
      type: String,
      default: 'Tablets', // Strips, Bottles, Vials, Sachets
    },
    batchNumber: {
      type: String,
      default: 'BATCH-2026',
    },
    expiryDate: {
      type: String,
      default: '2027-12-31',
    },
  },
  { timestamps: true }
);

inventorySchema.index({ facilityId: 1, medicineName: 1 }, { unique: true });
inventorySchema.index({ medicineName: 'text' });

export const Inventory = mongoose.model('Inventory', inventorySchema);

