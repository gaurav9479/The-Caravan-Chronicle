import User from '../models/User.js';

export async function listUsers(req, res) {
    try {
        const { role, departmentId } = req.query;
        const filter = {};
        if (role) filter.role = role;
        if (departmentId) filter.departmentId = departmentId;
        const users = await User.find(filter).select('_id name email role departmentId staff');
        return res.json({ users });
    } catch (e) {
        return res.status(500).json({ message: 'Failed to list users', details: e.message });
    }
}


