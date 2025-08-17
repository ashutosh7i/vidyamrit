import { Router } from 'express';
import { getCurrentUser } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { registerUser } from '../controllers/authController';

const userRouter = Router();

// Common user routes (profile, auth)
userRouter.get('/me', authMiddleware, getCurrentUser);
userRouter.post('/register', authMiddleware, registerUser);

export default userRouter;
    