import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { RoleGuard, PermissionGuard } from './RoleGuard';
import { useAccessControl } from '../../hooks/useAuth';

/**
 * Demo component showing different access control features
 */
export const AccessControlDemo: React.FC = () => {
  const { user, isBroker, isAdmin, isViewer, canApproveLoans, canManageUsers } = useAccessControl();

  return (
    <Card className="lg:col-span-12">
      <CardHeader>
        <CardTitle>Access Control Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current User Info */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Current User</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-blue-700">Role:</span>
              <Badge variant="secondary">{user?.role}</Badge>
            </div>
            <div className="mt-2">
              <span className="text-sm text-blue-700">Permissions:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {user?.permissions.map((permission) => (
                  <Badge key={permission} variant="outline" className="text-xs">
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Role-based Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Broker Content */}
            <RoleGuard roles={['broker']}>
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Broker Dashboard</h4>
                  <p className="text-sm text-green-700">
                    This content is only visible to brokers. You can view and edit borrowers, 
                    request documents, and send to valuers.
                  </p>
                </CardContent>
              </Card>
            </RoleGuard>

            {/* Admin Content */}
            <RoleGuard roles={['admin']}>
              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Admin Panel</h4>
                  <p className="text-sm text-purple-700">
                    This content is only visible to admins. You have full access including 
                    loan approvals, user management, and analytics.
                  </p>
                </CardContent>
              </Card>
            </RoleGuard>

            {/* Viewer Content */}
            <RoleGuard roles={['viewer']}>
              <Card className="border-gray-200 bg-gray-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Read-Only View</h4>
                  <p className="text-sm text-gray-700">
                    This content is only visible to viewers. You have read-only access 
                    to borrowers and broker statistics.
                  </p>
                </CardContent>
              </Card>
            </RoleGuard>
          </div>

          {/* Permission-based Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Loan Approval Permission */}
            <PermissionGuard permissions={['approve_loans']}>
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-red-900 mb-2">Loan Approval</h4>
                  <p className="text-sm text-red-700">
                    You have permission to approve loans. This is typically restricted to admins.
                  </p>
                </CardContent>
              </Card>
            </PermissionGuard>

            {/* User Management Permission */}
            <PermissionGuard permissions={['manage_users']}>
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-orange-900 mb-2">User Management</h4>
                  <p className="text-sm text-orange-700">
                    You have permission to manage users. This is typically restricted to admins.
                  </p>
                </CardContent>
              </Card>
            </PermissionGuard>
          </div>

          {/* Conditional Content Based on Hooks */}
          <div className="space-y-2">
            <h4 className="font-semibold">Access Control Status</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div className={`p-2 rounded ${isBroker ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                Is Broker: {isBroker ? 'Yes' : 'No'}
              </div>
              <div className={`p-2 rounded ${isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'}`}>
                Is Admin: {isAdmin ? 'Yes' : 'No'}
              </div>
              <div className={`p-2 rounded ${isViewer ? 'bg-gray-100 text-gray-800' : 'bg-gray-100 text-gray-600'}`}>
                Is Viewer: {isViewer ? 'Yes' : 'No'}
              </div>
              <div className={`p-2 rounded ${canApproveLoans ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'}`}>
                Can Approve: {canApproveLoans ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
