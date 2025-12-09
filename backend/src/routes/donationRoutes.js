import express from 'express';
import {
  createDonation,
  getDonations,
  getDonationById,
  getDonationStats,
} from '../controllers/donationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createDonation);
router.get('/', authenticate, getDonations);
router.get('/stats', authenticate, getDonationStats);
router.get('/:id', authenticate, getDonationById);

export default router;

