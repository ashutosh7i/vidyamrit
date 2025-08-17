import { Router } from 'express';
import { getSchools, getSchool, createSchool, updateSchool, deleteSchool } from '../controllers/schoolController';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { UserRole } from '../configs/roles';

const schoolRouter = Router();

// Get all schools
schoolRouter.get('/', roleMiddleware(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN), getSchools);

// Get single school
schoolRouter.get('/:id', roleMiddleware(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.MENTOR, UserRole.STUDENT), getSchool);

// Create school
schoolRouter.post('/', roleMiddleware(UserRole.SUPER_ADMIN), createSchool);

// Update school 
schoolRouter.put('/:id', roleMiddleware(UserRole.SUPER_ADMIN), updateSchool);

// Delete school
schoolRouter.delete('/:id', roleMiddleware(UserRole.SUPER_ADMIN), deleteSchool);

export default schoolRouter;
