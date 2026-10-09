import express from 'express';
import { getAiPatientSummary } from '../patient/ai.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/summary/:patientId', getAiPatientSummary);

export default router;

