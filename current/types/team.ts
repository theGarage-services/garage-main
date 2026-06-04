// Team Management & Permissions Type Definitions

export type PermissionModule = 
  | 'jobs.create'
  | 'jobs.edit'
  | 'jobs.delete'
  | 'jobs.publish'
  | 'candidates.view'
  | 'candidates.contact'
  | 'candidates.rank'
  | 'candidates.move'
  | 'interviews.schedule'
  | 'interviews.manage'
  | 'team.invite'
  | 'team.remove'
  | 'team.edit'
  | 'analytics.view'
  | 'analytics.export'
  | 'messaging.send'
  | 'calendar.view'
  | 'calendar.manage'
  | 'settings.company'
  | 'settings.billing'
  | 'departments.create'
  | 'departments.manage';

export type RoleTemplate = 
  | 'full_recruiter' 
  | 'hiring_manager' 
  | 'hr_admin' 
  | 'interviewer' 
  | 'custom';

export interface Department {
  id: string;
  name: string;
  description?: string;
  color: string;
  memberIds: string[];
  createdAt: Date;
  createdBy: string;
}

export interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: 'master' | 'member';
  roleTemplate?: RoleTemplate;
  permissions: PermissionModule[];
  invitedBy: string;
  invitedAt: Date;
  status: 'pending' | 'active' | 'suspended';
  assignedJobs?: string[]; // Specific jobs they can access (empty = all jobs)
  departmentId?: string;
  lastActive?: Date;
  avatar?: string;
}

export interface ActivityLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  targetType: 'job' | 'candidate' | 'team' | 'settings' | 'department';
  targetId?: string;
  targetName?: string;
  details?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface OrganizationSettings {
  requireApprovalForJobs: boolean;
  allowMemberInvites: boolean;
  defaultMemberPermissions: PermissionModule[];
  notificationPreferences: {
    newApplications: boolean;
    teamActivity: boolean;
    systemUpdates: boolean;
  };
}

export interface Organization {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  industry?: string;
  size?: string;
  masterProfileId: string;
  subscriptionTier: 'basic' | 'premium' | 'enterprise';
  members: TeamMember[];
  departments: Department[];
  settings: OrganizationSettings;
  createdAt: Date;
  billingEmail?: string;
}

export interface PendingApproval {
  id: string;
  type: 'job_posting' | 'member_access_request';
  requestedBy: string;
  requestedByName: string;
  requestedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  details: any;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
}

// Role template configurations
export const ROLE_TEMPLATES: Record<RoleTemplate, {
  name: string;
  description: string;
  permissions: PermissionModule[];
  color: string;
}> = {
  full_recruiter: {
    name: 'Full Recruiter',
    description: 'Complete access to job and candidate management',
    color: '#3b82f6',
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
  },
  hiring_manager: {
    name: 'Hiring Manager',
    description: 'View and rank candidates, schedule interviews',
    color: '#8b5cf6',
    permissions: [
      'candidates.view',
      'candidates.rank',
      'interviews.schedule',
      'messaging.send',
      'calendar.view',
    ],
  },
  hr_admin: {
    name: 'HR Admin',
    description: 'Manage jobs and view analytics',
    color: '#ec4899',
    permissions: [
      'jobs.create',
      'jobs.edit',
      'jobs.publish',
      'candidates.view',
      'analytics.view',
      'analytics.export',
      'calendar.view',
    ],
  },
  interviewer: {
    name: 'Interviewer',
    description: 'Schedule and manage interviews only',
    color: '#14b8a6',
    permissions: [
      'candidates.view',
      'interviews.schedule',
      'calendar.view',
      'messaging.send',
    ],
  },
  custom: {
    name: 'Custom Role',
    description: 'Customized permissions',
    color: '#6b7280',
    permissions: [],
  },
};

// Permission categories for UI organization
export const PERMISSION_CATEGORIES = {
  'Job Management': [
    'jobs.create',
    'jobs.edit',
    'jobs.delete',
    'jobs.publish',
  ] as PermissionModule[],
  'Candidate Management': [
    'candidates.view',
    'candidates.contact',
    'candidates.rank',
    'candidates.move',
  ] as PermissionModule[],
  'Interview Management': [
    'interviews.schedule',
    'interviews.manage',
    'calendar.view',
    'calendar.manage',
  ] as PermissionModule[],
  'Team Management': [
    'team.invite',
    'team.remove',
    'team.edit',
  ] as PermissionModule[],
  'Analytics & Reports': [
    'analytics.view',
    'analytics.export',
  ] as PermissionModule[],
  'Communication': [
    'messaging.send',
  ] as PermissionModule[],
  'Settings & Departments': [
    'settings.company',
    'settings.billing',
    'departments.create',
    'departments.manage',
  ] as PermissionModule[],
};

export const PERMISSION_LABELS: Record<PermissionModule, string> = {
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
