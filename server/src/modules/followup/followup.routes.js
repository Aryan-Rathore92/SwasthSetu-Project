import express from 'express';
import { getDueFollowUps, updateFollowUp } from './followup.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/due', getDueFollowUps);
router.patch('/:id', updateFollowUp);

export default router;

