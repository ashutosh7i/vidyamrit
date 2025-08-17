import { Request, Response } from 'express';

export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        // Don't send sensitive information
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            schoolId: user.schoolId
        };

        res.json(userResponse);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};
