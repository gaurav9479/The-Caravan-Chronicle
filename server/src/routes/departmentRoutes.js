import { Router } from 'express';
import Department from '../models/Department.js';

const router = Router();

// Public endpoint for registration and complaint forms
router.get('/', async (_req, res) => {
    try {
        const items = await Department.find({}).select('_id name code categoriesHandled');
        return res.json({ departments: items });
    } catch (e) {
        return res.status(500).json({ message: 'Failed to fetch departments' });
    }
});

export default router;


