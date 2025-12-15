import express from 'express';
import {
  createSwishPaymentIntent,
  createPayPalPaymentIntent,
  verifyPaymentStatus,
} from '../controllers/stripeController.js';

const router = express.Router();

// Create payment intent for Swish
router.post('/create-payment-intent', createSwishPaymentIntent);

// Create payment intent for PayPal
router.post('/create-paypal-payment-intent', createPayPalPaymentIntent);

// Verify payment status
router.get('/verify-payment/:paymentIntentId', verifyPaymentStatus);

export default router;
