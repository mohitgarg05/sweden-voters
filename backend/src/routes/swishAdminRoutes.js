import express from 'express';
import Donation from '../models/Donation.js';
import Bar from '../models/Bar.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Mark a Swish donation as completed and update the bar value
router.patch('/:id/complete', authenticate, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    if (donation.paymentMethod !== 'swish') {
      return res.status(400).json({ error: 'Only Swish donations can be completed via this endpoint' });
    }

    if (donation.swishStatus === 'completed') {
      return res.status(400).json({ error: 'Swish donation is already marked as completed' });
    }

    const bar = await Bar.findById(donation.barId);
    if (!bar) {
      return res.status(404).json({ error: 'Bar not found for this donation' });
    }

    // Mark as completed and update bar value
    donation.swishStatus = 'completed';
    await donation.save();

    bar.currentValue += donation.amount;
    await bar.save();

    res.json({
      donation,
      bar,
    });
  } catch (error) {
    console.error('Error completing Swish donation:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;


