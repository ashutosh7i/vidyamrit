import express from "express";
import logger from '../utils/logger';
import userRoutes from "./UserRoutes";
import superAdminRouter from "./SuperAdminRoutes";
import schoolRouter from "./SchoolRoutes";
import schoolAdminRouter from "./SchoolAdminRoutes";
import mentorRouter from "./MentorRoutes";
import studentRouter from "./StudentRoutes";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get('/', (req, res) => {
    logger.info('Accessed root route');
    res.json({ message: 'Welcome to the API' });
});

router.use(authMiddleware);

router.use('/users', userRoutes);
router.use('/super-admin', superAdminRouter);
router.use('/schools', schoolRouter);
router.use('/school-admins', schoolAdminRouter);
router.use('/mentors', mentorRouter);
router.use('/students', studentRouter);

export default router;