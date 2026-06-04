// Mock jobs for testing
export const MOCK_JOBS = [
  { id: 'job-1', title: 'Senior Software Engineer', status: 'Active', applicants: 12, department: 'Engineering' },
  { id: 'job-2', title: 'Product Manager', status: 'Active', applicants: 8, department: 'Product' },
  { id: 'job-3', title: 'UX Designer', status: 'Closed', applicants: 15, department: 'Design' },
  { id: 'job-4', title: 'DevOps Engineer', status: 'Active', applicants: 5, department: 'Engineering' }
];

// Mock pending approvals for testing
export const MOCK_PENDING_APPROVALS = [
  { id: 'approval-1', type: 'job_posting', status: 'pending', requestedBy: 'Jane Smith', date: '2024-01-15' },
  { id: 'approval-2', type: 'budget_increase', status: 'pending', requestedBy: 'Bob Wilson', date: '2024-01-14' },
  { id: 'approval-3', type: 'new_position', status: 'approved', requestedBy: 'Alice Chen', date: '2024-01-10' }
];

// Mock candidates for testing
export const MOCK_CANDIDATES = [
  { id: 'cand-1', name: 'Alice Johnson', status: 'interview', jobId: 'job-1' },
  { id: 'cand-2', name: 'Bob Smith', status: 'screening', jobId: 'job-1' },
  { id: 'cand-3', name: 'Carol White', status: 'offer', jobId: 'job-2' },
  { id: 'cand-4', name: 'David Brown', status: 'applied', jobId: 'job-4' },
  { id: 'cand-5', name: 'Emma Davis', status: 'interview', jobId: 'job-2' }
];

// Mock activity log for testing
export const MOCK_ACTIVITY_LOG = [
  {
    id: '1',
    userId: 'master-1',
    userName: 'John Doe',
    action: 'Created job posting',
    targetType: 'job' as const,
    targetName: 'Senior Software Engineer',
    details: 'Posted in Engineering department',
    timestamp: new Date().toISOString(),
    metadata: { priority: 'high', budget: 150000 }
  },
  {
    id: '2',
    userId: 'admin-1',
    userName: 'Jane Smith',
    action: 'Updated candidate status',
    targetType: 'candidate' as const,
    targetName: 'Sarah Chen',
    details: 'Moved to interview stage',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    metadata: { score: 95, stage: 'technical' }
  },
  {
    id: '3',
    userId: 'member-1',
    userName: 'Bob Wilson',
    action: 'Modified team permissions',
    targetType: 'team' as const,
    details: 'Added new recruiter to hiring team',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    metadata: { role: 'recruiter', access: 'full' }
  },
  {
    id: '4',
    userId: 'master-1',
    userName: 'John Doe',
    action: 'Updated department settings',
    targetType: 'settings' as const,
    targetName: 'Engineering',
    details: 'Changed approval workflow',
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    metadata: { approvers: 2 }
  },
  {
    id: '5',
    userId: 'admin-1',
    userName: 'Jane Smith',
    action: 'Added new department',
    targetType: 'department' as const,
    targetName: 'Data Science',
    details: 'Created with 3 initial positions',
    timestamp: new Date(Date.now() - 345600000).toISOString(),
    metadata: { positions: 3, headcount: 12 }
  }
];

// Mock organization data for testing
export const MOCK_ORGANIZATION = {
  id: 'org-123',
  name: 'Test Organization',
  logo: 'https://via.placeholder.com/150',
  subscriptionTier: 'enterprise',
  industry: 'Technology',
  size: '50-100',
  members: [
    {
      id: 'master-1',
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'master',
      permissions: ['all'],
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      status: 'active',
      departmentId: 'dept-2',
      roleTemplate: 'admin',
      lastActive: '2024-01-15T10:30:00Z',
      invitedAt: '2023-12-01T00:00:00Z',
      assignedJobs: ['job-1', 'job-2']
    },
    {
      id: 'admin-1',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      role: 'admin',
      permissions: ['read', 'write', 'manage_users'],
      status: 'active',
      departmentId: 'dept-1',
      roleTemplate: 'admin',
      lastActive: '2024-01-14T16:45:00Z',
      invitedAt: '2023-11-15T00:00:00Z',
      assignedJobs: ['job-3']
    },
    {
      id: 'member-1',
      firstName: 'Bob',
      lastName: 'Wilson',
      email: 'bob.wilson@example.com',
      role: 'member',
      permissions: ['read'],
      status: 'pending',
      roleTemplate: 'viewer',
      invitedAt: '2024-01-10T00:00:00Z',
      assignedJobs: []
    }
  ],
  departments: [
    {
      id: 'dept-1',
      name: 'Engineering',
      description: 'Software development and infrastructure',
      color: '#3b82f6',
      memberCount: 12,
      headId: 'admin-1',
      memberIds: ['member-1', 'admin-1'],
      createdAt: '2024-01-15T00:00:00Z'
    },
    {
      id: 'dept-2',
      name: 'Sales',
      description: 'Business development and customer relations',
      color: '#ec4899',
      memberCount: 8,
      headId: 'master-1',
      memberIds: ['master-1'],
      createdAt: '2024-01-10T00:00:00Z'
    },
    {
      id: 'dept-3',
      name: 'Marketing',
      description: 'Brand and growth marketing',
      color: '#14b8a6',
      memberCount: 5,
      memberIds: [],
      createdAt: '2024-02-01T00:00:00Z'
    }
  ]
};
