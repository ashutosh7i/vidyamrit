import { Request, Response } from 'express';
import { auth } from '../configs/firebaseAdmin';
import User from '../models/UserModel';
import { UserRole } from '../configs/roles';
import logger from '../utils/logger';

function logWithUserInfo(message: string, user?: any) {
    if (user) {
        logger.info(`[User: ${user.email}] ${message}`);
    } else {
        logger.info(message);
    }
}

export const registerUser = async (req: Request, res: Response) => {
    let firebaseUser = null;

    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists in MongoDB by email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            logWithUserInfo("User already exists", existingUser);
            return res.status(400).json({ error: "User already exists" });
        }

        // Create Firebase user first
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
                role: role || UserRole.STUDENT, // Default to student if no role specified
            });

            await user.save();

            res.status(201).json({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        } catch (mongoError) {
            // If MongoDB save fails, clean up the Firebase user
            if (firebaseUser) {
                try {
                    await auth.deleteUser(firebaseUser.uid);
                    logWithUserInfo(`Cleaned up: Firebase user ${firebaseUser.uid} deleted due to MongoDB error`);
                } catch (deleteErr) {
                    logWithUserInfo("Failed to delete Firebase user during cleanup:", firebaseUser);
                }
            }
            throw mongoError; // Re-throw to be caught by outer catch
        }
    } catch (error: any) {
        logWithUserInfo('Error in user registration:', firebaseUser);
        res.status(500).json({ error: "Registration failed. Please try again." });
    }
};
