import Complaint from '../models/Complaint.js';
import Department from '../models/Department.js';

function computeSlaDeadline(hours) {
    const now = new Date();
    const ms = (hours || 72) * 60 * 60 * 1000;
    return new Date(now.getTime() + ms);
}

export async function createComplaint(req, res) {
    try {
        const { title, description, category, priority, location, attachments, reporter, assignedDepartmentId } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({ message: 'title, description and category are required' });
        }

        // Use user-selected department if provided, otherwise auto-find by category
        let deptId = assignedDepartmentId;
        let slaHours = 72;
        
        if (assignedDepartmentId) {
            const dept = await Department.findById(assignedDepartmentId).lean();
            if (dept) slaHours = dept.slaPolicyHours || 72;
        } else {
            const department = await Department.findOne({ categoriesHandled: category }).lean();
            deptId = department?._id;
            slaHours = department?.slaPolicyHours || 72;
        }

        const complaint = await Complaint.create({
            title,
            description,
            category,
            priority,
            location,
            attachments,
            createdBy: req.user?.id || null,
            reporterSnapshot: reporter, // {name, phone, email}
            assignedDepartmentId: deptId,
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

export async function getComplaintDetail(req, res) {
    try {
        const c = await Complaint.findById(req.params.id).populate('assignedTo', 'name email').populate('assignedDepartmentId', 'name');
        if (!c) return res.status(404).json({ message: 'Not found' });
        return res.json({ complaint: c });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch complaint' });
    }
}

export async function updateComplaintStatus(req, res) {
    try {
        const { status, note, assignedTo } = req.body;
        const c = await Complaint.findById(req.params.id);
        if (!c) return res.status(404).json({ message: 'Not found' });
        const from = c.status;
        if (status) c.status = status;
        if (assignedTo) c.assignedTo = assignedTo;
        c.statusHistory.push({ from, to: c.status, note, by: req.user?.id });
        if (c.status === 'RESOLVED') c.resolutionTime = new Date();
        await c.save();
        return res.json({ complaint: c });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to update complaint' });
    }
}


