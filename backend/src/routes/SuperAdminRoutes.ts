import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { UserRole } from '../configs/roles';
import { createSuperAdmin, getSuperAdmins,getSuperAdmin, updateSuperAdmin, deleteSuperAdmin } from '../controllers/superAdminController';

const superAdminRouter = Router();

// School Admin Management Routes (Super Admin only)
superAdminRouter.use(authMiddleware, roleMiddleware(UserRole.SUPER_ADMIN));

superAdminRouter.post('/', createSuperAdmin);
superAdminRouter.get('/', getSuperAdmins);
superAdminRouter.get('/:uid', getSuperAdmin);
superAdminRouter.put('/:uid', updateSuperAdmin);
superAdminRouter.delete('/:uid', deleteSuperAdmin);

export default superAdminRouter;
