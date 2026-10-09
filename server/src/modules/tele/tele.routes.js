import express from 'express';
import {
  startTeleconsultation,
  getTeleconsultationDetails,
  createPrescriptionAndComplete,
  downloadPrescriptionPdf,
} from './tele.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = express.Router();

router.get('/prescription/:encounterId/pdf', downloadPrescriptionPdf);

router.use(authenticate);

router.post('/start', startTeleconsultation);
router.get('/:id', getTeleconsultationDetails);
router.post('/:id/prescription', createPrescriptionAndComplete);

export default router;

