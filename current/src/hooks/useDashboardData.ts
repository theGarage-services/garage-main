import {
  Users,
  TrendingUp,
  Target,
  Award,
  Briefcase,
  Activity,
  Calendar,
  CheckCircle,
  PlusCircle,
  Search,
  MessageSquare,
  Edit,
  FileText,
  BarChart3,
  Eye,
  Send,
  Building2,
  DollarSign,
  UserPlus,
  Settings,
  Trash2
} from 'lucide-react';

export type UserRole = 'recruiter' | 'manager' | 'lead' | 'hiring-manager' | 'admin';

export interface StatItem {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: 'up' | 'down';
  color: 'purple' | 'blue' | 'green' | 'orange';
}

export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  candidate: string;
  position: string;
  time: string;
}

export interface QuickAction {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  action: () => void;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

export function useDashboardData(userRole: UserRole, onNavigate: (view: string) => void) {
  const getStats = (): StatItem[] => {
    const statsByRole: Record<UserRole, StatItem[]> = {
      lead: [
        { title: 'Total Teams', value: '8', change: '+2 this quarter', icon: Users, trend: 'up', color: 'purple' },
        { title: 'Organization Hires', value: '156', change: '+23 this quarter', icon: Award, trend: 'up', color: 'green' },
        { title: 'Team Quotas Met', value: '75%', change: '+12% this month', icon: Target, trend: 'up', color: 'blue' },
        { title: 'Avg Time to Hire', value: '21d', change: '-3 days', icon: TrendingUp, trend: 'up', color: 'orange' }
      ],
      admin: [
        { title: 'Team Members', value: '24', change: '+3 this month', icon: Users, trend: 'up', color: 'purple' },
        { title: 'Active Jobs', value: '47', change: '+8 this week', icon: Briefcase, trend: 'up', color: 'blue' },
        { title: 'Total Candidates', value: '1,847', change: '+156 this week', icon: Activity, trend: 'up', color: 'green' },
        { title: 'This Month Hires', value: '18', change: '+5 vs last month', icon: Award, trend: 'up', color: 'orange' }
      ],
      manager: [
        { title: 'My Team', value: '8', change: 'recruiters', icon: Users, trend: 'up', color: 'purple' },
        { title: 'Team Jobs', value: '15', change: '3 pending approval', icon: Briefcase, trend: 'up', color: 'blue' },
        { title: 'Team Candidates', value: '342', change: '+42 this week', icon: Activity, trend: 'up', color: 'green' },
        { title: 'Team Hires', value: '6', change: 'this month', icon: Award, trend: 'up', color: 'orange' }
      ],
      'hiring-manager': [
        { title: 'Assigned Jobs', value: '3', change: 'to review', icon: Briefcase, trend: 'up', color: 'blue' },
        { title: 'Candidates to Review', value: '24', change: '8 pending', icon: Users, trend: 'up', color: 'purple' },
        { title: 'Interviews Scheduled', value: '12', change: 'this week', icon: Calendar, trend: 'up', color: 'green' },
        { title: 'Offers Made', value: '2', change: 'this month', icon: CheckCircle, trend: 'up', color: 'orange' }
      ],
      recruiter: [
        { title: 'My Active Jobs', value: '7', change: '2 new this week', icon: Briefcase, trend: 'up', color: 'blue' },
        { title: 'My Candidates', value: '89', change: '+12 this week', icon: Users, trend: 'up', color: 'purple' },
        { title: 'Interviews', value: '5', change: 'this week', icon: Calendar, trend: 'up', color: 'green' },
        { title: 'My Placements', value: '3', change: 'this month', icon: Award, trend: 'up', color: 'orange' }
      ]
    };

    return statsByRole[userRole] || statsByRole.recruiter;
  };

  const getRecentActivity = (): ActivityItem[] => {
    if (userRole === 'hiring-manager') {
      return [
        { id: '1', type: 'review', title: 'New candidate ready for review', candidate: 'Sarah Chen', position: 'Senior Engineer', time: '2 hours ago' },
        { id: '2', type: 'interview', title: 'Interview completed', candidate: 'Mike Wilson', position: 'Product Manager', time: '5 hours ago' },
        { id: '3', type: 'decision', title: 'Decision pending', candidate: 'Emma Davis', position: 'UX Designer', time: '1 day ago' }
      ];
    }
    return [
      { id: '1', type: 'candidate', title: 'New candidate added', candidate: 'Alex Martinez', position: 'Senior Engineer', time: '2 hours ago' },
      { id: '2', type: 'interview', title: 'Interview scheduled', candidate: 'Emma Wilson', position: 'Product Manager', time: '4 hours ago' },
      { id: '3', type: 'job', title: 'Job posting approved', candidate: 'UX Designer Role', position: 'Design Team', time: '1 day ago' }
    ];
  };

  const getQuickActions = (): QuickAction[] => {
    const actionsByRole: Record<UserRole, QuickAction[]> = {
      recruiter: [
        { icon: PlusCircle, label: 'Create Job Posting', action: () => onNavigate('job-posting'), color: 'blue' },
        { icon: Search, label: 'AI Candidate Search', action: () => onNavigate('candidate-search'), color: 'green' },
        { icon: MessageSquare, label: 'Contact Candidates', action: () => onNavigate('recruiter-messages'), color: 'purple' },
        { icon: Calendar, label: 'Schedule Interviews', action: () => onNavigate('interview-calendar'), color: 'orange' },
        { icon: Activity, label: 'Track Progress', action: () => onNavigate('candidate-tracking'), color: 'blue' },
        { icon: Edit, label: 'Update Status', action: () => onNavigate('status-updates'), color: 'green' },
        { icon: FileText, label: 'Placement Reports', action: () => onNavigate('recruiter-stats'), color: 'purple' },
        { icon: Briefcase, label: 'View My Jobs', action: () => onNavigate('job-management'), color: 'orange' }
      ],
      manager: [
        { icon: CheckCircle, label: 'Approve Job Postings', action: () => onNavigate('approval-queue'), color: 'green' },
        { icon: Send, label: 'Assign Jobs to Team', action: () => onNavigate('job-assignment'), color: 'blue' },
        { icon: BarChart3, label: 'Monitor Team Performance', action: () => onNavigate('team-performance'), color: 'orange' },
        { icon: Eye, label: 'Review Shortlists', action: () => onNavigate('candidate-shortlists'), color: 'green' },
        { icon: Users, label: 'My Team', action: () => onNavigate('team-management'), color: 'purple' },
        { icon: FileText, label: 'Team Reports', action: () => onNavigate('team-reports'), color: 'blue' },
        { icon: Target, label: 'Handle Escalations', action: () => onNavigate('escalations'), color: 'orange' },
        { icon: Briefcase, label: 'View All Jobs', action: () => onNavigate('job-management'), color: 'orange' }
      ],
      lead: [
        { icon: Users, label: 'View All Teams', action: () => onNavigate('all-teams'), color: 'purple' },
        { icon: BarChart3, label: 'Team Performance Analytics', action: () => onNavigate('team-analytics'), color: 'green' },
        { icon: Target, label: 'Set Team Quotas', action: () => onNavigate('team-quotas'), color: 'blue' },
        { icon: TrendingUp, label: 'Hiring Metrics', action: () => onNavigate('hiring-metrics'), color: 'orange' },
        { icon: FileText, label: 'Executive Reports', action: () => onNavigate('executive-reports'), color: 'purple' },
        { icon: Building2, label: 'Adjust Team Structure', action: () => onNavigate('team-structure'), color: 'green' },
        { icon: DollarSign, label: 'Market Trends', action: () => onNavigate('market-trends'), color: 'blue' },
        { icon: Award, label: 'Strategic Decisions', action: () => onNavigate('strategic-decisions'), color: 'orange' }
      ],
      'hiring-manager': [
        { icon: Briefcase, label: 'View Assigned Jobs', action: () => onNavigate('assigned-jobs'), color: 'blue' },
        { icon: Eye, label: 'Review Candidate Profiles', action: () => onNavigate('candidate-review'), color: 'green' },
        { icon: CheckCircle, label: 'Shortlist Candidates', action: () => onNavigate('candidate-shortlist'), color: 'purple' },
        { icon: Trash2, label: 'Reject Candidates', action: () => onNavigate('candidate-rejection'), color: 'orange' },
        { icon: Calendar, label: 'Schedule Interviews', action: () => onNavigate('interview-calendar'), color: 'blue' },
        { icon: MessageSquare, label: 'Interview Feedback', action: () => onNavigate('interview-feedback'), color: 'green' },
        { icon: Award, label: 'Make Hiring Decisions', action: () => onNavigate('hiring-decisions'), color: 'purple' },
        { icon: Activity, label: 'View Candidates', action: () => onNavigate('candidate-management'), color: 'orange' }
      ],
      admin: [
        { icon: UserPlus, label: 'Create User', action: () => onNavigate('create-user'), color: 'purple' },
        { icon: Briefcase, label: 'View All Jobs', action: () => onNavigate('job-management'), color: 'blue' },
        { icon: BarChart3, label: 'Analytics', action: () => onNavigate('recruiter-stats'), color: 'green' },
        { icon: Settings, label: 'Settings', action: () => onNavigate('account-settings'), color: 'orange' }
      ]
    };

    return actionsByRole[userRole] || actionsByRole.recruiter;
  };

  const getRoleDisplayName = (): string => {
    const displayNames: Record<UserRole, string> = {
      'hiring-manager': 'Hiring Manager',
      lead: 'Lead Recruiter',
      manager: 'Manager',
      admin: 'Admin',
      recruiter: 'Recruiter'
    };
    return displayNames[userRole] || 'Recruiter';
  };

  return {
    stats: getStats(),
    recentActivity: getRecentActivity(),
    quickActions: getQuickActions(),
    roleDisplayName: getRoleDisplayName()
  };
}
