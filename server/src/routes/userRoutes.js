import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { listUsers } from '../controllers/userController.js';

const router = Router();

// Admin and staff can list users; citizens cannot
router.get('/', requireAuth, requireRole('admin', 'staff'), listUsers);

export default router;


