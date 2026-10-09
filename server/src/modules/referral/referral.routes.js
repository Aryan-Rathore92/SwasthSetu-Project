import express from 'express';
import {
  createReferral,
  getReferrals,
  getReferralById,
  acceptReferral,
  markPatientArrived,
  closeReferral,
} from './referral.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createReferral);
router.get('/', getReferrals);
router.get('/:id', getReferralById);
router.patch('/:id/accept', acceptReferral);
router.patch('/:id/arrived', markPatientArrived);
router.patch('/:id/close', closeReferral);

export default router;

