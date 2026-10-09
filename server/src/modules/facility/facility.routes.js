import express from 'express';
import { getFacilities, getFacilityById, getFacilityDoctors } from './facility.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getFacilities);
router.get('/:id', getFacilityById);
router.get('/:id/doctors', getFacilityDoctors);

export default router;

