import { Request, Response } from 'express';
import { auth } from '../configs/firebaseAdmin';
import User from '../models/UserModel';
import { UserRole } from '../configs/roles';

export const createSuperAdmin = async (req: Request, res: Response) => {
    let firebaseUser = null;

    try {
        const { name, email, password } = req.body;

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
                role: UserRole.SUPER_ADMIN,
            });

            await user.save();

            res.status(201).json({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
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
        console.error('Error in super admin creation:', error);
        if (error?.code === 'auth/email-already-exists') {
            return res.status(400).json({ error: "Email already exists in Firebase" });
        }
        res.status(500).json({ error: "Failed to create super admin" });
    }
};

export const getSuperAdmins = async (req: Request, res: Response) => {
    try {
        const superAdmins = await User.find({ role: UserRole.SUPER_ADMIN })
            .select('-__v');

        res.json(superAdmins);
    } catch (error) {
        console.error('Error fetching super admins:', error);
        res.status(500).json({ error: "Failed to fetch super admins" });
    }
};

export const getSuperAdmin = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params;

        const superAdmin = await User.findOne({ 
            uid, 
            role: UserRole.SUPER_ADMIN 
        }).select('-__v');

        if (!superAdmin) {
            return res.status(404).json({ error: "Super admin not found" });
        }

        res.json(superAdmin);
    } catch (error) {
        console.error('Error fetching super admin:', error);
        res.status(500).json({ error: "Failed to fetch super admin" });
    }
};

export const updateSuperAdmin = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params;
        const { name, email } = req.body;

        // Find the super admin first
        const superAdmin = await User.findOne({ uid, role: UserRole.SUPER_ADMIN });
        if (!superAdmin) {
            return res.status(404).json({ error: "Super admin not found" });
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
        );

        if (!updatedUser) {
            throw new Error("User not found after update");
        }

        res.json({
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role
        });

    } catch (error: any) {
        console.error('Error updating super admin:', error);
        if (error?.code === 'auth/email-already-exists') {
            return res.status(400).json({ error: "Email already exists" });
        }
        res.status(500).json({ error: "Failed to update super admin" });
    }
};

export const deleteSuperAdmin = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params;

        // Delete from MongoDB first
        const deletedUser = await User.findOneAndDelete({ 
            uid,
            role: UserRole.SUPER_ADMIN 
        });
        
        if (!deletedUser) {
            return res.status(404).json({ error: "Super admin not found" });
        }

        // Then delete from Firebase
        await auth.deleteUser(uid);

        res.json({ message: "Super admin deleted successfully" });
    } catch (error) {
        console.error('Error deleting super admin:', error);
        res.status(500).json({ error: "Failed to delete super admin" });
    }
};
