import { ReactNode } from 'react';
import { PermissionModule, PERMISSION_LABELS } from '@/types/team';
import { useTestPermissions } from '@/hooks/useTestPermissions';
import { TestAccessDenied } from '../test/TestAccessDenied';

interface PermissionGateProps {
  permission: PermissionModule | PermissionModule[];
  children: ReactNode;
  fallback?: ReactNode;
  feature?: string;
}

export function PermissionGate({ 
  permission, 
  children, 
  fallback,
  feature
}: Readonly<PermissionGateProps>) {
  const { hasPermission, hasAnyPermission } = useTestPermissions();
  
  const allowed = Array.isArray(permission) 
    ? hasAnyPermission(permission)
    : hasPermission(permission);
  
  if (!allowed) {
    if (fallback !== undefined) {
      return <>{fallback}</>;
    }
    
    const permissionLabel = Array.isArray(permission)
      ? permission.map(p => PERMISSION_LABELS[p]).join(' or ')
      : PERMISSION_LABELS[permission];
    
    return (
      <TestAccessDenied 
        feature={feature}
        requiredPermission={permissionLabel}
      />
    );
  }
  
  return <>{children}</>;
}
