import express from 'express';
import {
  verifyPaymentStatus,
  createCardCheckoutSession,
} from '../controllers/stripeController.js';

const router = express.Router();

// Create checkout session for Card payment (redirects to Stripe)
router.post('/create-card-checkout-session', createCardCheckoutSession);

// Verify payment status
router.get('/verify-payment/:paymentIntentId', verifyPaymentStatus);

export default router;
