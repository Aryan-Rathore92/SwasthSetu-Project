import mongoose from 'mongoose';

const triageSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    symptoms: [
      {
        type: String,
        required: true,
      },
    ],
    symptomDuration: {
      type: String,
      default: '1-3 days',
    },
    vitals: {
      temperature: { type: Number }, // Celsius or Fahrenheit e.g. 101.5
      bpSystolic: { type: Number },
      bpDiastolic: { type: Number },
      spo2: { type: Number }, // percentage e.g. 94
      bloodSugar: { type: Number }, // mg/dL
      pulse: { type: Number }, // bpm
    },
    pregnancyConcern: {
      type: Boolean,
      default: false,
    },
    additionalObservations: {
      type: String,
      default: '',
    },
    ruleLevel: {
      type: String,
      enum: ['RED', 'YELLOW', 'GREEN'],
      required: true,
    },
    finalLevel: {
      type: String,
      enum: ['RED', 'YELLOW', 'GREEN'],
      required: true,
    },
    triggeredRules: [
      {
        type: String,
      },
    ],
    explanationEnglish: {
      type: String,
      required: true,
    },
    explanationHindi: {
      type: String,
      required: true,
    },
    nextSteps: [
      {
        type: String,
      },
    ],
    requiresHumanReview: {
      type: Boolean,
      default: true,
    },
    disclaimer: {
      type: String,
      default: 'Hackathon demonstration decision support only. Not a certified diagnostic device.',
    },
  },
  { timestamps: true }
);

export const Triage = mongoose.model('Triage', triageSchema);

