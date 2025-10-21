import Complaint from '../models/Complaint.js';

export async function getSummary(req, res) {
    try {
        const [total, byStatusAgg, overdue] = await Promise.all([
            Complaint.countDocuments({}),
            Complaint.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } },
            ]),
            Complaint.countDocuments({ slaDeadline: { $ne: null, $lt: new Date() }, status: { $in: ['OPEN', 'IN_PROGRESS'] } }),
        ]);
        const byStatus = Object.fromEntries(byStatusAgg.map(s => [s._id, s.count]));
        return res.json({ total, byStatus, overdue });
    } catch (e) {
        return res.status(500).json({ message: 'Failed to fetch summary', details: e.message });
    }
}

export async function getCategories(req, res) {
    try {
        const data = await Complaint.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);
        return res.json({ categories: data });
    } catch (e) {
        return res.status(500).json({ message: 'Failed to fetch categories', details: e.message });
    }
}

export async function getHeatmap(req, res) {
    try {
        const points = await Complaint.aggregate([
            { $match: { 'location.lat': { $ne: null }, 'location.lng': { $ne: null } } },
            { $project: { lat: '$location.lat', lng: '$location.lng' } },
        ]);
        return res.json({ points });
    } catch (e) {
        return res.status(500).json({ message: 'Failed to fetch heatmap', details: e.message });
    }
}


