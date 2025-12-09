import express from 'express';
import {
  createDonation,
  getDonations,
  getDonationById,
  getDonationStats,
} from '../controllers/donationController.js';

const router = express.Router();

router.post('/', createDonation);
router.get('/', getDonations);
router.get('/stats', getDonationStats);
router.get('/:id', getDonationById);

export default router;

