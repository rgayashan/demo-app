import React, { ReactNode } from 'react';
import { useAccessControl } from '../../hooks/useAuth';
import { UserRole } from '../../types';

interface RoleGuardProps {
  children: ReactNode;
  roles: UserRole[];
  fallback?: ReactNode;
  requireAll?: boolean;
}

/**
 * RoleGuard component that conditionally renders content based on user roles
 * 
 * @param children - The content to render if user has required roles
 * @param roles - Array of roles that can see this content
 * @param fallback - Content to render if user doesn't have required roles
 * @param requireAll - If true, user must have ALL roles. If false, user needs ANY role
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  roles,
  fallback = null,
  requireAll = false,
}) => {
  const { hasAnyRole, hasRole } = useAccessControl();

  const hasAccess = requireAll 
    ? roles.every(role => hasRole(role))
    : hasAnyRole(roles);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

interface PermissionGuardProps {
  children: ReactNode;
  permissions: string[];
  fallback?: ReactNode;
  requireAll?: boolean;
}

/**
 * PermissionGuard component that conditionally renders content based on user permissions
 * 
 * @param children - The content to render if user has required permissions
 * @param permissions - Array of permissions required to see this content
 * @param fallback - Content to render if user doesn't have required permissions
 * @param requireAll - If true, user must have ALL permissions. If false, user needs ANY permission
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permissions,
  fallback = null,
  requireAll = false,
}) => {
  const { hasPermission } = useAccessControl();

  const hasAccess = requireAll
    ? permissions.every(permission => hasPermission(permission))
    : permissions.some(permission => hasPermission(permission));

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

/**
 * Higher-order component for role-based access control
 */
export const withRoleGuard = <P extends object>(
  Component: React.ComponentType<P>,
  roles: UserRole[],
  fallback?: ReactNode
) => {
  return (props: P) => (
    <RoleGuard roles={roles} fallback={fallback}>
      <Component {...props} />
    </RoleGuard>
  );
};

/**
 * Higher-order component for permission-based access control
 */
export const withPermissionGuard = <P extends object>(
  Component: React.ComponentType<P>,
  permissions: string[],
  fallback?: ReactNode
) => {
  return (props: P) => (
    <PermissionGuard permissions={permissions} fallback={fallback}>
      <Component {...props} />
    </PermissionGuard>
  );
};
