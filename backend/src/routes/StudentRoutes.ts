import { Router, RequestHandler } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { UserRole } from '../configs/roles';
import { createStudent, getStudents, getStudent, updateStudent, deleteStudent } from '../controllers/studentController';

// Cast handlers to standard express RequestHandler type
const handlers = {
    createStudent: createStudent as unknown as RequestHandler,
    getStudents: getStudents as unknown as RequestHandler,
    getStudent: getStudent as unknown as RequestHandler,
    updateStudent: updateStudent as unknown as RequestHandler,
    deleteStudent: deleteStudent as unknown as RequestHandler
};

const studentRouter = Router();

// School Admin Management Routes (Super Admin only)
studentRouter.use(authMiddleware, roleMiddleware(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.MENTOR));

studentRouter.post('/', handlers.createStudent);
studentRouter.get('/', handlers.getStudents);
studentRouter.get('/:uid', handlers.getStudent);
studentRouter.put('/:uid', handlers.updateStudent);
studentRouter.delete('/:uid', handlers.deleteStudent);

export default studentRouter;
