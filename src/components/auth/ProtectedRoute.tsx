import React, { ReactNode } from 'react';
import { useAccessControl } from '../../hooks/useAuth';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
  requiredPermissions?: string[];
  fallback?: ReactNode;
  redirectTo?: string;
}

/**
 * ProtectedRoute component that controls access based on authentication and authorization
 * 
 * @param children - The content to render if access is granted
 * @param requiredRoles - Array of roles that can access this route
 * @param requiredPermissions - Array of permissions required to access this route
 * @param fallback - Component to render if access is denied
 * @param redirectTo - URL to redirect to if access is denied (not implemented in this demo)
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
  requiredPermissions,
  fallback = <AccessDenied />,
}) => {
  const { isAuthenticated, isLoading, hasAnyRole, hasPermission } = useAccessControl();

  // Show loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Check authentication
  if (!isAuthenticated) {
    return <LoginRequired />;
  }

  // Check role requirements
  if (requiredRoles && !hasAnyRole(requiredRoles)) {
    return <>{fallback}</>;
  }

  // Check permission requirements
  if (requiredPermissions && !requiredPermissions.every(permission => hasPermission(permission))) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * Component shown when user is not authenticated
 */
const LoginRequired: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Authentication Required
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Please log in to access this page.
        </p>
      </div>
    </div>
  </div>
);

/**
 * Component shown when access is denied
 */
const AccessDenied: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 text-red-500">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Access Denied
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          You don't have permission to access this page.
        </p>
      </div>
    </div>
  </div>
);

/**
 * Loading spinner component
 */
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);
