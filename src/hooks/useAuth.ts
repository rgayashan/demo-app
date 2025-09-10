import { useAuth as useAuthContext } from '../contexts/AuthContext';
import { UserRole } from '../types';

/**
 * Custom hook for authentication functionality
 * Provides easy access to auth state and methods
 */
export const useAuth = useAuthContext;

/**
 * Hook for checking if user has specific permissions
 */
export const usePermissions = () => {
  const { hasPermission, user } = useAuth();

  return {
    canViewBorrowers: hasPermission('view_borrowers'),
    canEditBorrowers: hasPermission('edit_borrowers'),
    canRequestDocuments: hasPermission('request_documents'),
    canSendToValuer: hasPermission('send_to_valuer'),
    canApproveLoans: hasPermission('approve_loans'),
    canEscalateToCommittee: hasPermission('escalate_to_committee'),
    canViewBrokerStats: hasPermission('view_broker_stats'),
    canManageUsers: hasPermission('manage_users'),
    canViewAnalytics: hasPermission('view_analytics'),
    hasPermission,
    userPermissions: user?.permissions || [],
  };
};

/**
 * Hook for checking user roles
 */
export const useRoles = () => {
  const { hasRole, hasAnyRole, user } = useAuth();

  return {
    isBroker: hasRole('broker'),
    isAdmin: hasRole('admin'),
    isViewer: hasRole('viewer'),
    isBrokerOrAdmin: hasAnyRole(['broker', 'admin']),
    isAdminOrViewer: hasAnyRole(['admin', 'viewer']),
    hasRole,
    hasAnyRole,
    userRole: user?.role,
  };
};

/**
 * Hook for role-based access control
 */
export const useAccessControl = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const permissions = usePermissions();
  const roles = useRoles();

  return {
    isAuthenticated,
    user,
    isLoading,
    ...permissions,
    ...roles,
  };
};
