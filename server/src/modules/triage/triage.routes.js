import express from 'express';
import { evaluateTriage, getPatientTriageHistory } from './triage.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/evaluate', evaluateTriage);
router.get('/patient/:patientId', getPatientTriageHistory);

export default router;

