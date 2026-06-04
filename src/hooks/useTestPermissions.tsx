import { useCallback, createContext, ReactNode } from 'react';
import { PermissionModule } from '../types/team';

// Mock implementation for testing - replace with actual permission logic
const MOCK_PERMISSIONS: PermissionModule[] = [
  'jobs',
  'candidates',
  'interviews',
  'analytics'
];

interface TestPermissionsContextType {
  hasPermission: (permission: PermissionModule) => boolean;
  hasAnyPermission: (permissions: PermissionModule[]) => boolean;
  canAccessJob: (jobId: string) => boolean;
  permissions: PermissionModule[];
  currentUser: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    permissions: string[];
    assignedJobs?: string[];
  };
}

const TestPermissionsContext = createContext<TestPermissionsContextType | undefined>(undefined);

interface TestPermissionsProviderProps {
  children: ReactNode;
}

// Internal implementation
function useTestPermissionsImpl(): TestPermissionsContextType {
  const hasPermission = useCallback((permission: PermissionModule): boolean => {
    return MOCK_PERMISSIONS.includes(permission);
  }, []);

  const hasAnyPermission = useCallback((permissions: PermissionModule[]): boolean => {
    return permissions.some(p => MOCK_PERMISSIONS.includes(p));
  }, []);

  // Mock current user for testing
  const currentUser = {
    id: 'user-1',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    role: 'member',
    permissions: ['jobs', 'candidates', 'interviews', 'analytics']
  };

  const canAccessJob = useCallback((jobId: string): boolean => {
    // Mock implementation - all jobs are accessible in test mode
    // eslint-disable-next-line no-console
    console.log('Checking access for job:', jobId);
    return true;
  }, []);

  return {
    hasPermission,
    hasAnyPermission,
    canAccessJob,
    permissions: MOCK_PERMISSIONS,
    currentUser
  };
}

export function TestPermissionsProvider({ children }: Readonly<TestPermissionsProviderProps>) {
  const value = useTestPermissionsImpl();
  return (
    <TestPermissionsContext.Provider value={value}>
      {children}
    </TestPermissionsContext.Provider>
  );
}

export function useTestPermissions(): TestPermissionsContextType {
  return useTestPermissionsImpl();
}
