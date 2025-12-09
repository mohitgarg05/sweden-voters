import express from 'express';
import {
  getAllBars,
  getBarById,
  createBar,
  updateBar,
  deleteBar,
  getAllBarsAdmin,
} from '../controllers/barController.js';

const router = express.Router();

router.get('/', getAllBars);
router.get('/admin', getAllBarsAdmin);
router.get('/:id', getBarById);
router.post('/', createBar);
router.put('/:id', updateBar);
router.delete('/:id', deleteBar);

export default router;

