import mongoose from 'mongoose';
import { Roles } from '../configs/roles';

const UserSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: Date, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    aadharNo: { type: String, required: true },
    panNo: { type: String, required: true },
    role: { type: String, enum: Object.values(Roles), default: Roles.OPERATOR },
    updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
export default User;
