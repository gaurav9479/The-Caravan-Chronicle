import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['citizen', 'staff', 'admin'], default: 'citizen' },
        departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
        profile: {
            avatarUrl: { type: String },
            phone: { type: String },
            address: {
                line1: { type: String },
                line2: { type: String },
                city: { type: String },
                state: { type: String },
                zip: { type: String },
            },
            bio: { type: String },
        },
    },
    { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

UserSchema.pre('save', async function hashPassword(next) {
    if (!this.isModified('password')) return next();
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
});

UserSchema.methods.comparePassword = function comparePassword(candidate) {
    return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model('User', UserSchema);
export default User;


