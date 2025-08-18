import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { UserRole } from '../types/user';

const roleHierarchy: Record<UserRole, UserRole[]> = {
    super_admin: ['super_admin', 'school_admin', 'mentor'],
    school_admin: ['school_admin', 'mentor'],
    mentor: ['mentor']
};

export const useRoleAccess = () => {
    const { user } = useContext(AuthContext) || {};

    const hasAccess = (requiredRole: UserRole): boolean => {
        if (!user) return false;
        return roleHierarchy[user.role]?.includes(requiredRole) || false;
    };

    const canAccessRoles = (): UserRole[] => {
        if (!user) return [];
        return roleHierarchy[user.role] || [];
    };

    return {
        hasAccess,
        canAccessRoles,
        currentRole: user?.role
    };
};
