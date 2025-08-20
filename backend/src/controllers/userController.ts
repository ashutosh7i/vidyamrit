import { Response } from 'express';
import { AuthRequest } from '../types/auth';

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

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