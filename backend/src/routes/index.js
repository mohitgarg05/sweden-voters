import express from 'express';
import barRoutes from './barRoutes.js';
import donationRoutes from './donationRoutes.js';
import authRoutes from './authRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/bars', barRoutes);
router.use('/donations', donationRoutes);

export default router;

