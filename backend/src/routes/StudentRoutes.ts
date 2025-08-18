import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { UserRole } from '../configs/roles';
import { createStudent, getStudents, getStudent, updateStudent, deleteStudent } from '../controllers/studentController';

const studentRouter = Router();

// School Admin/Mentor Management Routes for Students
studentRouter.use(authMiddleware, roleMiddleware(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.MENTOR));

// Students are database records, no auth required for them
studentRouter.post('/', createStudent); // Create a student record
studentRouter.get('/', getStudents);    // Get all students (with optional schoolId filter)
studentRouter.get('/:id', getStudent);  // Get a single student by MongoDB _id
studentRouter.put('/:id', updateStudent); // Update student by MongoDB _id
studentRouter.delete('/:id', deleteStudent); // Delete student by MongoDB _id

export default studentRouter;
