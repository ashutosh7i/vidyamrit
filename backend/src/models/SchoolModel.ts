import mongoose, { Document } from 'mongoose';

export interface ISchool extends Document {
    name: string;
    address: string;
    principalName: string;
    email: string;
    phone: string;
    type: 'government' | 'private';
    city: string;
    state: string;
    pinCode: string;
    establishedYear: number;
    createdAt: Date;
    updatedAt: Date;
}

const SchoolSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    principalName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    type: { type: String, enum: ['government', 'private'], required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: String, required: true },
    establishedYear: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

const School = mongoose.model<ISchool>('School', SchoolSchema);
export default School;
