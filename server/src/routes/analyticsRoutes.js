import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { getSummary, getCategories, getHeatmap } from '../controllers/analyticsController.js';

const router = Router();

// Admin-only for summary and categories
router.get('/summary', requireAuth, requireRole('admin'), getSummary);
router.get('/categories', requireAuth, requireRole('admin'), getCategories);

// Heatmap for admin (can relax later)
router.get('/heatmap', requireAuth, requireRole('admin'), getHeatmap);

export default router;


