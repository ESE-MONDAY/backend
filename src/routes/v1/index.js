import express from 'express';
import movieRoutes from '../movieRoutes.js';
import authRoutes from '../authRoutes.js';
import watchlistRoutes from '../watchlistRoutes.js';

const router = express.Router();

router.use('/movies', movieRoutes);
router.use('/auth', authRoutes);
router.use('/watchlist', watchlistRoutes);

export default router;