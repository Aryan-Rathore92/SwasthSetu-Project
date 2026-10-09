import express from 'express';
import {
  createEmergencyAlert,
  getEmergencies,
  updateEmergencyStatus,
} from './emergency.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = express.Router();

// Emergency SOS can be triggered without prior auth in acute distress
router.post('/sos', createEmergencyAlert);

router.use(authenticate);

router.get('/', getEmergencies);
router.patch('/:id/status', updateEmergencyStatus);

export default router;

