import express from 'express';
import {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  getPatientTimeline,
} from './patient.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createPatient);
router.get('/', getPatients);
router.get('/:id', getPatientById);
router.patch('/:id', updatePatient);
router.get('/:id/timeline', getPatientTimeline);

export default router;

