export type PermissionModule =
  | 'jobs'
  | 'jobs.create'
  | 'candidates'
  | 'candidates.view'
  | 'interviews'
  | 'analytics'
  | 'settings'
  | 'users'
  | 'billing'
  | 'integrations'
  | 'team.invite'
  | 'team.edit'
  | 'calendar.view'
  | 'departments.create'
  | 'departments.manage'
  | 'messaging.send';

export const PERMISSION_LABELS: Record<PermissionModule, string> = {
  jobs: 'Job Management',
  'jobs.create': 'Create Jobs',
  candidates: 'Candidate Management',
  'candidates.view': 'View Candidates',
  interviews: 'Interview Management',
  analytics: 'Analytics & Reports',
  settings: 'Team Settings',
  users: 'User Management',
  billing: 'Billing',
  integrations: 'Integrations',
  'team.invite': 'Invite Team Members',
  'team.edit': 'Edit Team Members',
  'calendar.view': 'View Calendar',
  'departments.create': 'Create Departments',
  'departments.manage': 'Manage Departments',
  'messaging.send': 'Send Messages'
};

export interface ActivityLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  targetType: 'job' | 'candidate' | 'team' | 'settings' | 'department';
  targetName?: string;
  details?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  color: string;
  memberCount: number;
  headId?: string;
  memberIds?: string[];
  createdAt?: string;
}

export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  role: string;
  permissions: string[];
  avatar?: string;
  status?: string;
  departmentId?: string;
  roleTemplate?: string;
  lastActive?: string;
  invitedAt?: string;
  assignedJobs?: string[];
}

export const PERMISSION_CATEGORIES: Record<string, PermissionModule[]> = {
  'Job Management': ['jobs', 'candidates', 'interviews'],
  'Administration': ['users', 'settings', 'billing'],
  'Analytics': ['analytics', 'integrations']
};

export interface RoleTemplate {
  id: string;
  name: string;
  description: string;
  permissions: PermissionModule[];
  color?: string;
}

export const ROLE_TEMPLATES: Record<string, RoleTemplate> = {
  admin: {
    id: 'admin',
    name: 'Administrator',
    description: 'Full access to all features',
    permissions: ['jobs', 'candidates', 'interviews', 'analytics', 'settings', 'users', 'billing', 'integrations'],
    color: '#ef4444'
  },
  recruiter: {
    id: 'recruiter',
    name: 'Recruiter',
    description: 'Manage jobs and candidates',
    permissions: ['jobs', 'candidates', 'interviews', 'analytics'],
    color: '#3b82f6'
  },
  viewer: {
    id: 'viewer',
    name: 'Viewer',
    description: 'View-only access',
    permissions: ['jobs', 'candidates', 'analytics'],
    color: '#10b981'
  },
  custom: {
    id: 'custom',
    name: 'Custom',
    description: 'Custom permissions',
    permissions: [],
    color: '#6b7280'
  }
};
