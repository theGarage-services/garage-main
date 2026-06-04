export type UserRole = 'recruiter' | 'manager' | 'lead' | 'hiring-manager' | 'admin';

export interface Permissions {
  canCreateJobs: boolean;
  canApproveJobs: boolean;
  canAssignJobs: boolean;
  canSearchCandidates: boolean;
  canContactCandidates: boolean;
  canScheduleInterviews: boolean;
  canCreateUsers: boolean;
  canViewTeams: boolean;
  canViewAllTeams: boolean;
  canSetQuotas: boolean;
  canViewMarketTrends: boolean;
  canMakeStrategicDecisions: boolean;
  canAdjustTeamStructure: boolean;
  canGenerateTeamReports: boolean;
  canGenerateExecutiveReports: boolean;
  canGeneratePlacementReports: boolean;
  canMakeHiringDecisions: boolean;
  canReviewCandidates: boolean;
  canTrackCandidateProgress: boolean;
  canUpdateApplicationStatus: boolean;
}

export function usePermissions(userRole: UserRole): Permissions {
  return {
    // Job Creation - ONLY Regular Recruiter
    canCreateJobs: userRole === 'recruiter',

    // Job Approval - ONLY Manager (Admin also for system setup)
    canApproveJobs: ['admin', 'manager'].includes(userRole),

    // Assign Jobs - ONLY Manager
    canAssignJobs: ['admin', 'manager'].includes(userRole),

    // AI Candidate Search & Contact - ONLY Regular Recruiter
    canSearchCandidates: userRole === 'recruiter',
    canContactCandidates: userRole === 'recruiter',

    // Schedule Interviews - Regular Recruiter AND Hiring Manager
    canScheduleInterviews: ['recruiter', 'hiring-manager'].includes(userRole),

    // Create User Accounts - ONLY Admin
    canCreateUsers: userRole === 'admin',

    // Team Management - Manager and Lead
    canViewTeams: ['admin', 'lead', 'manager'].includes(userRole),
    canViewAllTeams: ['admin', 'lead'].includes(userRole),

    // Strategic Tools - ONLY Lead
    canSetQuotas: ['admin', 'lead'].includes(userRole),
    canViewMarketTrends: ['admin', 'lead'].includes(userRole),
    canMakeStrategicDecisions: ['admin', 'lead'].includes(userRole),
    canAdjustTeamStructure: ['admin', 'lead'].includes(userRole),

    // Reports
    canGenerateTeamReports: ['admin', 'manager'].includes(userRole),
    canGenerateExecutiveReports: ['admin', 'lead'].includes(userRole),
    canGeneratePlacementReports: userRole === 'recruiter',

    // Hiring Decisions - ONLY Hiring Manager
    canMakeHiringDecisions: userRole === 'hiring-manager',

    // Review Candidates - Hiring Manager and Manager (shortlists)
    canReviewCandidates: ['hiring-manager', 'manager'].includes(userRole),

    // Track Progress - ONLY Regular Recruiter
    canTrackCandidateProgress: userRole === 'recruiter',

    // Update Status - ONLY Regular Recruiter
    canUpdateApplicationStatus: userRole === 'recruiter'
  };
}
