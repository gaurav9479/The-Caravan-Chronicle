import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Placeholder routes to keep server wiring consistent
router.get('/', requireAuth, (_req, res) => res.json([]));

export default router;

import { Router } from 'express';
import { createComplaint } from '../controllers/complaintController.js';

const router = Router();

// TODO: add auth middleware when available, e.g., requireAuth
router.post('/', createComplaint);

export default router;


