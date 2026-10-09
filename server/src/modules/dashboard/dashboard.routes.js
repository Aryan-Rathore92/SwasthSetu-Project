import express from 'express';
import {
  getPatientDashboard,
  getHealthWorkerDashboard,
  getDoctorDashboard,
  getFacilityDashboard,
  getDistrictDashboard,
} from './dashboard.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/patient', getPatientDashboard);
router.get('/health-worker', getHealthWorkerDashboard);
router.get('/doctor', getDoctorDashboard);
router.get('/facility/:id', getFacilityDashboard);
router.get('/district', getDistrictDashboard);

export default router;

