import express from 'express';
import {
  getAllBars,
  getBarById,
  createBar,
  updateBar,
  deleteBar,
  getAllBarsAdmin,
} from '../controllers/barController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllBars);
router.get('/admin', authenticate, getAllBarsAdmin);
router.get('/:id', getBarById);
router.post('/', authenticate, createBar);
router.put('/:id', authenticate, updateBar);
router.delete('/:id', authenticate, deleteBar);

export default router;

