import { useState, useMemo, createContext, useContext, ReactNode } from 'react';
import { PermissionModule } from '../types/team';

// Mock current user - In production, this would come from auth context
interface TestUser {
  id: string;
  role: 'master' | 'member';
  permissions: PermissionModule[];
  organizationId: string;
  assignedJobs?: string[];
  departmentId?: string;
}

// Context for test permissions
interface TestPermissionsContextType {
  currentUser: TestUser;
  setCurrentUser: (user: TestUser) => void;
  hasPermission: (permission: PermissionModule) => boolean;
  hasAnyPermission: (permissions: PermissionModule[]) => boolean;
  hasAllPermissions: (permissions: PermissionModule[]) => boolean;
  canAccessJob: (jobId: string) => boolean;
}

const TestPermissionsContext = createContext<TestPermissionsContextType | null>(null);

// Mock users for testing
export const MOCK_MASTER_USER: TestUser = {
  id: 'master-001',
  role: 'master',
  permissions: [], // Master has all permissions by default
  organizationId: 'org-001',
};

export const MOCK_FULL_RECRUITER: TestUser = {
  id: 'member-001',
  role: 'member',
  permissions: [
    'jobs.create',
    'jobs.edit',
    'jobs.delete',
    'jobs.publish',
    'candidates.view',
    'candidates.contact',
    'candidates.rank',
    'candidates.move',
    'interviews.schedule',
    'interviews.manage',
    'messaging.send',
    'calendar.view',
    'calendar.manage',
    'analytics.view',
  ],
  organizationId: 'org-001',
};

export const MOCK_HIRING_MANAGER: TestUser = {
  id: 'member-002',
  role: 'member',
  permissions: [
    'candidates.view',
    'candidates.rank',
    'interviews.schedule',
    'messaging.send',
    'calendar.view',
  ],
  organizationId: 'org-001',
  assignedJobs: ['job-001', 'job-002'], // Limited to specific jobs
  departmentId: 'dept-001',
};

export const MOCK_INTERVIEWER: TestUser = {
  id: 'member-003',
  role: 'member',
  permissions: [
    'candidates.view',
    'interviews.schedule',
    'calendar.view',
    'messaging.send',
  ],
  organizationId: 'org-001',
};

export const MOCK_HR_ADMIN: TestUser = {
  id: 'member-004',
  role: 'member',
  permissions: [
    'jobs.create',
    'jobs.edit',
    'jobs.publish',
    'candidates.view',
    'analytics.view',
    'analytics.export',
    'calendar.view',
  ],
  organizationId: 'org-001',
};

// Provider component
export function TestPermissionsProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [currentUser, setCurrentUser] = useState<TestUser>(MOCK_MASTER_USER);

  const hasPermission = (permission: PermissionModule): boolean => {
    // Master profile has all permissions
    if (currentUser.role === 'master') return true;
    
    // Check if user has the specific permission
    return currentUser.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: PermissionModule[]): boolean => {
    if (currentUser.role === 'master') return true;
    return permissions.some(permission => currentUser.permissions.includes(permission));
  };

  const hasAllPermissions = (permissions: PermissionModule[]): boolean => {
    if (currentUser.role === 'master') return true;
    return permissions.every(permission => currentUser.permissions.includes(permission));
  };

  const canAccessJob = (jobId: string): boolean => {
    // Master can access all jobs
    if (currentUser.role === 'master') return true;
    
    // If no assigned jobs specified, can access all
    if (!currentUser.assignedJobs || currentUser.assignedJobs.length === 0) return true;
    
    // Check if job is in assigned jobs
    return currentUser.assignedJobs.includes(jobId);
  };

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      canAccessJob,
    }),
    [currentUser, setCurrentUser, hasPermission, hasAnyPermission, hasAllPermissions, canAccessJob]
  );

  return (
    <TestPermissionsContext.Provider value={contextValue}>
      {children}
    </TestPermissionsContext.Provider>
  );
}

// Hook to use permissions
export function useTestPermissions() {
  const context = useContext(TestPermissionsContext);
  
  if (!context) {
    throw new Error('useTestPermissions must be used within TestPermissionsProvider');
  }
  
  return context;
}

// Utility function to check if user is master
export function useIsMaster() {
  const { currentUser } = useTestPermissions();
  return currentUser.role === 'master';
}

// Utility to get permission label
export function getPermissionLabel(permission: PermissionModule): string {
  const labels: Record<PermissionModule, string> = {
    'jobs.create': 'Create Jobs',
    'jobs.edit': 'Edit Jobs',
    'jobs.delete': 'Delete Jobs',
    'jobs.publish': 'Publish Jobs',
    'candidates.view': 'View Candidates',
    'candidates.contact': 'Contact Candidates',
    'candidates.rank': 'Rank Candidates',
    'candidates.move': 'Move Candidates',
    'interviews.schedule': 'Schedule Interviews',
    'interviews.manage': 'Manage Interviews',
    'team.invite': 'Invite Team Members',
    'team.remove': 'Remove Team Members',
    'team.edit': 'Edit Team Members',
    'analytics.view': 'View Analytics',
    'analytics.export': 'Export Analytics',
    'messaging.send': 'Send Messages',
    'calendar.view': 'View Calendar',
    'calendar.manage': 'Manage Calendar',
    'settings.company': 'Edit Company Settings',
    'settings.billing': 'Manage Billing',
    'departments.create': 'Create Departments',
    'departments.manage': 'Manage Departments',
  };
  
  return labels[permission] || permission;
}