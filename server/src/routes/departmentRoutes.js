import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import Department from '../models/Department.js';

const router = Router();

router.get('/', requireAuth, async (_req, res) => {
  try {
    const items = await Department.find({}).select('_id name code categoriesHandled');
    return res.json({ departments: items });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to fetch departments' });
  }
});

export default router;


