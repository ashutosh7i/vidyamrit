import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { UserRole } from '../configs/roles';
import { createSchoolAdmin, getSchoolAdmins,getSchoolAdmin, updateSchoolAdmin, deleteSchoolAdmin } from '../controllers/schoolAdminController';

const schoolAdminRouter = Router();

// School Admin Management Routes (Super Admin only)
schoolAdminRouter.use(authMiddleware, roleMiddleware(UserRole.SUPER_ADMIN));

schoolAdminRouter.post('/', createSchoolAdmin);
schoolAdminRouter.get('/', getSchoolAdmins);
schoolAdminRouter.get('/:uid', getSchoolAdmin);
schoolAdminRouter.put('/:uid', updateSchoolAdmin);
schoolAdminRouter.delete('/:uid', deleteSchoolAdmin);

export default schoolAdminRouter;
