import express from 'express';
import {
  searchMedicines,
  getInventory,
  addInventoryItem,
  updateInventoryItem,
} from './inventory.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = express.Router();

// Search is accessible to all authenticated users
router.get('/search', authenticate, searchMedicines);

// Inventory management
router.get('/', authenticate, getInventory);
router.post('/', authenticate, addInventoryItem);
router.patch('/:id', authenticate, updateInventoryItem);

export default router;

