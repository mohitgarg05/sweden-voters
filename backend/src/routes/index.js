import express from 'express';
import barRoutes from './barRoutes.js';
import donationRoutes from './donationRoutes.js';
import authRoutes from './authRoutes.js';
import stripeRoutes from './stripeRoutes.js';
import swishAdminRoutes from './swishAdminRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/bars', barRoutes);
router.use('/donations', donationRoutes);
router.use('/stripe', stripeRoutes);
router.use('/swish-admin', swishAdminRoutes);

export default router;

