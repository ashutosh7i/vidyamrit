import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/UserModel";
import { UserRole } from "../configs/roles";

// Extend Express Request type to include our user
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export const roleMiddleware = (...allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;
        
        if (!user) {
            return res.status(401).json({ error: "Unauthorized - No user found" });
        }

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({ 
                error: "Forbidden - Insufficient permissions",
                // requiredRoles: allowedRoles,
                // userRole: user.role
            });
        }

        next();
    };
};