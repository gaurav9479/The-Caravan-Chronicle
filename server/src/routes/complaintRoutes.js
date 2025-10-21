import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { createComplaint, getMyComplaints, getComplaintDetail, updateComplaintStatus } from '../controllers/complaintController.js';

const router = Router();

// List complaints (placeholder for now)
router.get('/mine', requireAuth, getMyComplaints);
router.get('/:id', requireAuth, getComplaintDetail);
router.patch('/:id/status', requireAuth, updateComplaintStatus);

// Create complaint
router.post('/', requireAuth, createComplaint);

export default router;


