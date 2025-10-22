import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { listUsers, getUserById } from '../controllers/userController.js';

const router = Router();

// Admin and staff can list users; citizens cannot
router.get('/', requireAuth, requireRole('admin', 'staff'), listUsers);
router.get('/:id', requireAuth, getUserById);

export default router;


