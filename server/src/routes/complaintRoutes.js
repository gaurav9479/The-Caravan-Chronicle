import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { createComplaint } from '../controllers/complaintController.js';

const router = Router();

// List complaints (placeholder for now)
router.get('/', requireAuth, (_req, res) => res.json([]));

// Create complaint
router.post('/', requireAuth, createComplaint);

export default router;


