import { ReactNode } from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { Shield, Crown, AlertTriangle } from 'lucide-react';

interface AccessRestrictionProps {
  children: ReactNode;
  user: {
    role?: 'admin' | 'recruiter' | 'member';
    isInstitutionCreator?: boolean;
    permissions?: Record<string, boolean>;
  };
  requiredRole?: 'admin' | 'recruiter' | 'member';
  requiredPermission?: string;
  fallback?: ReactNode;
  showAlert?: boolean;
}

export function AccessRestriction({ 
  children, 
  user, 
  requiredRole = 'admin',
  requiredPermission,
  fallback,
  showAlert = true 
}: Readonly<AccessRestrictionProps>) {
  const userRole = user?.role || 'member';
  const isInstitutionCreator = user?.isInstitutionCreator || false;
  const userPermissions = user?.permissions || {};

  // Check role hierarchy: admin > recruiter > member
  const roleHierarchy = { admin: 3, recruiter: 2, member: 1 };
  const hasRequiredRole = (userRole in roleHierarchy) && roleHierarchy[userRole] >= roleHierarchy[requiredRole];

  // Institution creators have admin privileges
  const hasAdminAccess = userRole === 'admin' || isInstitutionCreator;

  // Check specific permission if provided
  const hasPermission = requiredPermission ? userPermissions[requiredPermission] : true;

  // Grant access if user has required role/permission or is institution creator
  const hasAccess = (hasRequiredRole && hasPermission) || (requiredRole === 'admin' && hasAdminAccess);

  if (hasAccess) {
    return <>{children}</>;
  }

  // Show custom fallback if provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Show access denied alert if enabled
  if (showAlert) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-700">
          <div className="flex items-center gap-2">
            {requiredRole === 'admin' ? <Crown className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
            <span>
              Access restricted. This feature requires {requiredRole} privileges
              {requiredPermission && ` and ${requiredPermission} permission`}.
            </span>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Return nothing if no alert should be shown
  return null;
}

// Convenience hook for checking access in components
export function useAccessControl(user: any) {
  const isAdmin = user?.role === 'admin' || user?.isInstitutionCreator;
  const isRecruiter = user?.role === 'recruiter' || isAdmin;
  const isMember = user?.role === 'member' || isRecruiter;

  const hasPermission = (permission: string) => {
    return user?.permissions?.[permission] || isAdmin;
  };

  const canManageTeam = hasPermission('canManageTeam');
  const canPostJobs = hasPermission('canPostJobs');
  const canViewCandidates = hasPermission('canViewCandidates');
  const canAccessAnalytics = hasPermission('canAccessAnalytics');
  const canManageInstitution = hasPermission('canManageInstitution');

  return {
    isAdmin,
    isRecruiter,
    isMember,
    hasPermission,
    canManageTeam,
    canPostJobs,
    canViewCandidates,
    canAccessAnalytics,
    canManageInstitution
  };
}