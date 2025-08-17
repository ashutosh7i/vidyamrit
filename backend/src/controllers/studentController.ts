import { Response } from 'express';
import { auth } from '../configs/firebaseAdmin';
import User from '../models/UserModel';
import { UserRole } from '../configs/roles';
import { AuthRequest } from '../types/auth';

import { Request } from 'express';
import { CreateUserRequest, UpdateUserRequest, UserParams } from '../types/requests';

export const createStudent = async (
    req: AuthRequest<{}, {}, CreateUserRequest>,
    res: Response
) => {
    let firebaseUser = null;

    try {
        const { name, email, password, schoolId } = req.body;
        const userSchoolId = req.user && req.user.role !== UserRole.SUPER_ADMIN ? req.user.schoolId : schoolId;

        if (!userSchoolId) {
            return res.status(400).json({ error: "School ID is required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Create Firebase user
        firebaseUser = await auth.createUser({
            email,
            password,
            displayName: name,
        });
        
        try {
            // Create MongoDB user
            const user = new User({
                uid: firebaseUser.uid,
                name,
                email: firebaseUser.email,
                role: UserRole.STUDENT,
                schoolId: userSchoolId,
            });

            await user.save();

            const populatedUser = await user.populate('schoolId', 'name');

            res.status(201).json({
                id: populatedUser._id,
                name: populatedUser.name,
                email: populatedUser.email,
                role: populatedUser.role,
                schoolId: populatedUser.schoolId
            });
        } catch (mongoError) {
            // If MongoDB save fails, clean up Firebase user
            if (firebaseUser) {
                try {
                    await auth.deleteUser(firebaseUser.uid);
                    console.log(`Cleaned up: Firebase user ${firebaseUser.uid} deleted due to MongoDB error`);
                } catch (deleteErr) {
                    console.error("Failed to delete Firebase user during cleanup:", deleteErr);
                }
            }
            throw mongoError;
        }
    } catch (error: any) {
        console.error('Error in student creation:', error);
        if (error?.code === 'auth/email-already-exists') {
            return res.status(400).json({ error: "Email already exists in Firebase" });
        }
        res.status(500).json({ error: "Failed to create student" });
    }
};

export const getStudents = async (
    req: AuthRequest<{}, {}, {}>,
    res: Response
) => {
    try {
        const { schoolId } = req.query;
        const filter: any = { role: UserRole.STUDENT };
        
        // If not super admin, only show students from user's school
        if (req.user && req.user.role !== UserRole.SUPER_ADMIN) {
            filter.schoolId = req.user.schoolId;
        } else if (schoolId) {
            filter.schoolId = schoolId;
        }

        const students = await User.find(filter)
            .select('-__v')
            .populate('schoolId', 'name');

        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: "Failed to fetch students" });
    }
};

export const getStudent = async (
    req: AuthRequest<UserParams>,
    res: Response
) => {
    try {
        const { uid } = req.params;
        const query: any = { 
            uid, 
            role: UserRole.STUDENT 
        };

        // If not super admin, only allow fetching students from same school
        if (req.user && req.user.role !== UserRole.SUPER_ADMIN) {
            query.schoolId = req.user.schoolId;
        }

        const student = await User.findOne(query)
            .select('-__v')
            .populate('schoolId', 'name');

        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.json(student);
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ error: "Failed to fetch student" });
    }
};

export const updateStudent = async (
    req: AuthRequest<UserParams, {}, UpdateUserRequest>,
    res: Response
) => {
    try {
        const { uid } = req.params;
        const { name, email } = req.body;

        const query: any = { uid, role: UserRole.STUDENT };
        if (req.user && req.user.role !== UserRole.SUPER_ADMIN) {
            query.schoolId = req.user.schoolId;
        }

        // Find the student first
        const student = await User.findOne(query);
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        // Update in Firebase first
        const updateData: { displayName?: string; email?: string } = {};
        if (name) updateData.displayName = name;
        if (email) updateData.email = email;

        if (Object.keys(updateData).length > 0) {
            await auth.updateUser(uid, updateData);
        }

        // Then update in MongoDB
        const updatedUser = await User.findOneAndUpdate(
            { uid },
            { 
                ...(name && { name }),
                ...(email && { email })
            },
            { new: true }
        ).populate('schoolId', 'name');

        if (!updatedUser) {
            throw new Error("User not found after update");
        }

        res.json({
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            schoolId: updatedUser.schoolId
        });

    } catch (error: any) {
        console.error('Error updating student:', error);
        if (error?.code === 'auth/email-already-exists') {
            return res.status(400).json({ error: "Email already exists" });
        }
        res.status(500).json({ error: "Failed to update student" });
    }
};

export const deleteStudent = async (
    req: AuthRequest<UserParams>,
    res: Response
) => {
    try {
        const { uid } = req.params;
        const query: any = { uid, role: UserRole.STUDENT };
        
        if (req.user && req.user.role !== UserRole.SUPER_ADMIN) {
            query.schoolId = req.user.schoolId;
        }

        // Delete from MongoDB first
        const deletedUser = await User.findOneAndDelete(query);
        if (!deletedUser) {
            return res.status(404).json({ error: "Student not found" });
        }

        // Then delete from Firebase
        await auth.deleteUser(uid);

        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ error: "Failed to delete student" });
    }
};
