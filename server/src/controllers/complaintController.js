import Complaint from '../models/Complaint.js';
import Department from '../models/Department.js';

function computeSlaDeadline(hours) {
    const now = new Date();
    const ms = (hours || 72) * 60 * 60 * 1000;
    return new Date(now.getTime() + ms);
}

export async function createComplaint(req, res) {
    try {
        const { title, description, category, priority, location, attachments, reporter } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({ message: 'title, description and category are required' });
        }

        // Find department by category match
        const department = await Department.findOne({ categoriesHandled: category }).lean();

        const slaHours = department?.slaPolicyHours || 72;
        const complaint = await Complaint.create({
            title,
            description,
            category,
            priority,
            location,
            attachments,
            createdBy: req.user?.id || null,
            reporterSnapshot: reporter, // {name, phone, email}
            assignedDepartmentId: department?._id,
            slaDeadline: computeSlaDeadline(slaHours),
            statusHistory: [
                { from: null, to: 'OPEN', note: 'Complaint created', by: req.user?.id || null },
            ],
        });

        return res.status(201).json({ complaint });
    } catch (err) {
        console.error('createComplaint error', err);
        return res.status(500).json({ message: 'Failed to create complaint' });
    }
}

export async function getMyComplaints(req, res) {
    try {
        const list = await Complaint.find({ createdBy: req.user?.id }).sort({ createdAt: -1 }).limit(50);
        return res.json({ complaints: list });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch complaints' });
    }
}


