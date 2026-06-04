import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Search, 
  Users, 
  TrendingUp, 
  Target,
  Building2,
  DollarSign,
  ArrowUpRight,
  ChevronRight,
  Award,
  BarChart3,
  Activity,
  CheckCircle,
  Briefcase,
  UserPlus,
  FileText,
  Calendar,
  MessageSquare,
  Settings,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  Send,
  Shield
} from 'lucide-react';
import { AppHeader } from './AppHeader';
import { Progress } from './ui/progress';
import { MiniCalendarWidget } from './MiniCalendarWidget';

interface UnifiedRecruiterDashboardProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
  user: any;
}

export function UnifiedRecruiterDashboard({ onNavigate, onLogout, user }: Readonly<UnifiedRecruiterDashboardProps>) {
  const userRole = user?.role || 'recruiter';
  
  // STRICT Role-based permissions - Based on exact requirements
  const permissions = {
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
    canUpdateApplicationStatus: userRole === 'recruiter',
  };

  // STRICT Role-based stats - Only show relevant metrics
  const getStats = () => {
    if (userRole === 'lead') {
      // LEAD - Strategic metrics only
      return [
        {
          title: 'Total Teams',
          value: '8',
          change: '+2 this quarter',
          icon: Users,
          trend: 'up',
          color: 'purple'
        },
        {
          title: 'Organization Hires',
          value: '156',
          change: '+23 this quarter',
          icon: Award,
          trend: 'up',
          color: 'green'
        },
        {
          title: 'Team Quotas Met',
          value: '75%',
          change: '+12% this month',
          icon: Target,
          trend: 'up',
          color: 'blue'
        },
        {
          title: 'Avg Time to Hire',
          value: '21d',
          change: '-3 days',
          icon: TrendingUp,
          trend: 'up',
          color: 'orange'
        }
      ];
    } else if (userRole === 'admin') {
      return [
        {
          title: 'Team Members',
          value: '24',
          change: '+3 this month',
          icon: Users,
          trend: 'up',
          color: 'purple'
        },
        {
          title: 'Active Jobs',
          value: '47',
          change: '+8 this week',
          icon: Briefcase,
          trend: 'up',
          color: 'blue'
        },
        {
          title: 'Total Candidates',
          value: '1,847',
          change: '+156 this week',
          icon: Activity,
          trend: 'up',
          color: 'green'
        },
        {
          title: 'This Month Hires',
          value: '18',
          change: '+5 vs last month',
          icon: Award,
          trend: 'up',
          color: 'orange'
        }
      ];
    } else if (userRole === 'manager') {
      return [
        {
          title: 'My Team',
          value: '8',
          change: 'recruiters',
          icon: Users,
          trend: 'up',
          color: 'purple'
        },
        {
          title: 'Team Jobs',
          value: '15',
          change: '3 pending approval',
          icon: Briefcase,
          trend: 'up',
          color: 'blue'
        },
        {
          title: 'Team Candidates',
          value: '342',
          change: '+42 this week',
          icon: Activity,
          trend: 'up',
          color: 'green'
        },
        {
          title: 'Team Hires',
          value: '6',
          change: 'this month',
          icon: Award,
          trend: 'up',
          color: 'orange'
        }
      ];
    } else if (userRole === 'hiring-manager') {
      return [
        {
          title: 'Assigned Jobs',
          value: '3',
          change: 'to review',
          icon: Briefcase,
          trend: 'up',
          color: 'blue'
        },
        {
          title: 'Candidates to Review',
          value: '24',
          change: '8 pending',
          icon: Users,
          trend: 'up',
          color: 'purple'
        },
        {
          title: 'Interviews Scheduled',
          value: '12',
          change: 'this week',
          icon: Calendar,
          trend: 'up',
          color: 'green'
        },
        {
          title: 'Offers Made',
          value: '2',
          change: 'this month',
          icon: CheckCircle,
          trend: 'up',
          color: 'orange'
        }
      ];
    } else {
      // Regular recruiter
      return [
        {
          title: 'My Active Jobs',
          value: '7',
          change: '2 new this week',
          icon: Briefcase,
          trend: 'up',
          color: 'blue'
        },
        {
          title: 'My Candidates',
          value: '89',
          change: '+12 this week',
          icon: Users,
          trend: 'up',
          color: 'purple'
        },
        {
          title: 'Interviews',
          value: '5',
          change: 'this week',
          icon: Calendar,
          trend: 'up',
          color: 'green'
        },
        {
          title: 'My Placements',
          value: '3',
          change: 'this month',
          icon: Award,
          trend: 'up',
          color: 'orange'
        }
      ];
    }
  };

  const stats = getStats();

  // Get color classes based on color name
  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      purple: 'bg-purple-100 text-purple-600',
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color] || 'bg-gray-100 text-gray-600';
  };

  // Recent activity based on role
  const getRecentActivity = () => {
    if (userRole === 'hiring-manager') {
      return [
        {
          id: '1',
          type: 'review',
          title: 'New candidate ready for review',
          candidate: 'Sarah Chen',
          position: 'Senior Engineer',
          time: '2 hours ago'
        },
        {
          id: '2',
          type: 'interview',
          title: 'Interview completed',
          candidate: 'Mike Wilson',
          position: 'Product Manager',
          time: '5 hours ago'
        },
        {
          id: '3',
          type: 'decision',
          title: 'Decision pending',
          candidate: 'Emma Davis',
          position: 'UX Designer',
          time: '1 day ago'
        }
      ];
    } else {
      return [
        {
          id: '1',
          type: 'candidate',
          title: 'New candidate added',
          candidate: 'Alex Martinez',
          position: 'Senior Engineer',
          time: '2 hours ago'
        },
        {
          id: '2',
          type: 'interview',
          title: 'Interview scheduled',
          candidate: 'Emma Wilson',
          position: 'Product Manager',
          time: '4 hours ago'
        },
        {
          id: '3',
          type: 'job',
          title: 'Job posting approved',
          candidate: 'UX Designer Role',
          position: 'Design Team',
          time: '1 day ago'
        }
      ];
    }
  };

  const recentActivity = getRecentActivity();

  // STRICT Quick actions based on role - ONLY show what they can do
  const getQuickActions = () => {
    if (userRole === 'recruiter') {
      // REGULAR RECRUITER - Execution tasks only
      return [
        { icon: PlusCircle, label: 'Create Job Posting', action: () => onNavigate('job-posting'), color: 'blue' },
        { icon: Search, label: 'AI Candidate Search', action: () => onNavigate('candidate-search'), color: 'green' },
        { icon: MessageSquare, label: 'Contact Candidates', action: () => onNavigate('recruiter-messages'), color: 'purple' },
        { icon: Calendar, label: 'Schedule Interviews', action: () => onNavigate('interview-calendar'), color: 'orange' },
        { icon: Activity, label: 'Track Progress', action: () => onNavigate('candidate-tracking'), color: 'blue' },
        { icon: Edit, label: 'Update Status', action: () => onNavigate('status-updates'), color: 'green' },
        { icon: FileText, label: 'Placement Reports', action: () => onNavigate('recruiter-stats'), color: 'purple' },
        { icon: Briefcase, label: 'View My Jobs', action: () => onNavigate('job-management'), color: 'orange' }
      ];
    } else if (userRole === 'manager') {
      // MANAGER - Team management and approval only, NO account creation, NO job creation or candidate search
      return [
        { icon: CheckCircle, label: 'Approve Job Postings', action: () => onNavigate('approval-queue'), color: 'green' },
        { icon: Send, label: 'Assign Jobs to Team', action: () => onNavigate('job-assignment'), color: 'blue' },
        { icon: BarChart3, label: 'Monitor Team Performance', action: () => onNavigate('team-performance'), color: 'orange' },
        { icon: Eye, label: 'Review Shortlists', action: () => onNavigate('candidate-shortlists'), color: 'green' },
        { icon: Users, label: 'My Team', action: () => onNavigate('team-management'), color: 'purple' },
        { icon: FileText, label: 'Team Reports', action: () => onNavigate('team-reports'), color: 'blue' },
        { icon: Target, label: 'Handle Escalations', action: () => onNavigate('escalations'), color: 'orange' },
        { icon: Briefcase, label: 'View All Jobs', action: () => onNavigate('job-management'), color: 'orange' }
      ];
    } else if (userRole === 'lead') {
      // LEAD - Strategic only, NO execution tasks
      return [
        { icon: Users, label: 'View All Teams', action: () => onNavigate('all-teams'), color: 'purple' },
        { icon: BarChart3, label: 'Team Performance Analytics', action: () => onNavigate('team-analytics'), color: 'green' },
        { icon: Target, label: 'Set Team Quotas', action: () => onNavigate('team-quotas'), color: 'blue' },
        { icon: TrendingUp, label: 'Hiring Metrics', action: () => onNavigate('hiring-metrics'), color: 'orange' },
        { icon: FileText, label: 'Executive Reports', action: () => onNavigate('executive-reports'), color: 'purple' },
        { icon: Building2, label: 'Adjust Team Structure', action: () => onNavigate('team-structure'), color: 'green' },
        { icon: DollarSign, label: 'Market Trends', action: () => onNavigate('market-trends'), color: 'blue' },
        { icon: Award, label: 'Strategic Decisions', action: () => onNavigate('strategic-decisions'), color: 'orange' }
      ];
    } else if (userRole === 'hiring-manager') {
      // HIRING MANAGER - Review and decide only, NO job creation or candidate search
      return [
        { icon: Briefcase, label: 'View Assigned Jobs', action: () => onNavigate('assigned-jobs'), color: 'blue' },
        { icon: Eye, label: 'Review Candidate Profiles', action: () => onNavigate('candidate-review'), color: 'green' },
        { icon: CheckCircle, label: 'Shortlist Candidates', action: () => onNavigate('candidate-shortlist'), color: 'purple' },
        { icon: Trash2, label: 'Reject Candidates', action: () => onNavigate('candidate-rejection'), color: 'orange' },
        { icon: Calendar, label: 'Schedule Interviews', action: () => onNavigate('interview-calendar'), color: 'blue' },
        { icon: MessageSquare, label: 'Interview Feedback', action: () => onNavigate('interview-feedback'), color: 'green' },
        { icon: Award, label: 'Make Hiring Decisions', action: () => onNavigate('hiring-decisions'), color: 'purple' },
        { icon: Activity, label: 'View Candidates', action: () => onNavigate('candidate-management'), color: 'orange' }
      ];
    } else {
      // ADMIN - Full system access
      return [
        { icon: UserPlus, label: 'Create User', action: () => onNavigate('create-user'), color: 'purple' },
        { icon: Briefcase, label: 'View All Jobs', action: () => onNavigate('job-management'), color: 'blue' },
        { icon: BarChart3, label: 'Analytics', action: () => onNavigate('recruiter-stats'), color: 'green' },
        { icon: Settings, label: 'Settings', action: () => onNavigate('account-settings'), color: 'orange' }
      ];
    }
  };

  const quickActions = getQuickActions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100">
      <AppHeader
        userRole={userRole === 'admin' ? 'admin' : 'recruiter'}
        user={user}
        currentView="homepage"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <div className="pt-16">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl text-white mb-2">
                  Welcome back, {user?.firstName || 'User'}!
                </h1>
                <p className="text-orange-100">
                  {user?.title || 'Recruiter'} • {user?.company || 'TechCorp Solutions'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-orange-100 mb-1">Your Role</div>
                <Badge className="bg-white text-[#ff6b35] text-lg px-4 py-2">
                  {userRole === 'hiring-manager' ? 'Hiring Manager' : 
                   userRole === 'lead' ? 'Lead Recruiter' :
                   userRole === 'manager' ? 'Manager' :
                   userRole === 'admin' ? 'Admin' : 'Recruiter'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              // Determine where to navigate based on stat title
              const getStatRoute = () => {
                if (stat.title.includes('Job')) return 'job-management';
                if (stat.title.includes('Candidate') || stat.title.includes('Review')) return 'candidate-management';
                if (stat.title.includes('Interview')) return 'interview-calendar';
                if (stat.title.includes('Team')) return 'team-management';
                return 'recruiter-stats';
              };
              
              return (
                <button
                  key={index}
                  onClick={() => onNavigate(getStatRoute())}
                  className="text-left"
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow h-full cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColorClasses(stat.color)}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="text-3xl font-medium text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600 mb-2">{stat.title}</div>
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <ArrowUpRight className="w-4 h-4" />
                      {stat.change}
                    </div>
                  </Card>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Role-Specific Info Banner */}
              {userRole === 'recruiter' && (
                <Card className={`p-4 ${user?.canPostWithoutApproval ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 ${user?.canPostWithoutApproval ? 'bg-green-100' : 'bg-blue-100'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Activity className={`w-5 h-5 ${user?.canPostWithoutApproval ? 'text-green-600' : 'text-blue-600'}`} />
                    </div>
                    <div>
                      <p className={`font-medium ${user?.canPostWithoutApproval ? 'text-green-900' : 'text-blue-900'}`}>
                        {user?.canPostWithoutApproval ? '✅ Trusted Recruiter Access' : 'Regular Recruiter Access'}
                      </p>
                      <p className={`text-sm ${user?.canPostWithoutApproval ? 'text-green-700' : 'text-blue-700'} mt-1`}>
                        {user?.canPostWithoutApproval 
                          ? 'You can create job postings, search candidates, and publish jobs directly without manager approval.'
                          : 'You can create job postings and search candidates. All job postings require manager approval before publishing.'}
                      </p>
                    </div>
                  </div>
                </Card>
              )}
              {userRole === 'hiring-manager' && (
                <Card className="p-4 bg-green-50 border-green-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-900">Hiring Manager Access</p>
                      <p className="text-sm text-green-700 mt-1">
                        You can review candidates, schedule interviews, and make final hiring decisions for your assigned positions.
                      </p>
                    </div>
                  </div>
                </Card>
              )}
              {userRole === 'manager' && (
                <Card className="p-4 bg-purple-50 border-purple-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-purple-900">Manager Access</p>
                      <p className="text-sm text-purple-700 mt-1">
                        You can approve job postings, assign jobs to your team, monitor team performance, and review candidate shortlists.
                      </p>
                    </div>
                  </div>
                </Card>
              )}
              {userRole === 'lead' && (
                <Card className="p-4 bg-orange-50 border-orange-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-orange-900">Lead Recruiter Access</p>
                      <p className="text-sm text-orange-700 mt-1">
                        You have strategic oversight: view all teams, set quotas, analyze metrics, and make strategic hiring decisions.
                      </p>
                    </div>
                  </div>
                </Card>
              )}
              {userRole === 'admin' && (
                <Card className="p-4 bg-red-50 border-red-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-red-900 mb-2">Enterprise Admin - Full System Control</p>
                      <p className="text-sm text-red-700 mb-3">
                        You are the only Admin. Only you can create user accounts and manage system settings.
                      </p>
                      <div className="bg-white rounded-lg p-3 border border-red-200">
                        <p className="text-xs font-medium text-red-900 mb-2">4 User Types You Can Create:</p>
                        <div className="grid grid-cols-2 gap-2 text-xs text-red-700">
                          <div>• <strong>Regular Recruiter</strong> - Execution</div>
                          <div>• <strong>Manager</strong> - Team & Approvals</div>
                          <div>• <strong>Lead</strong> - Strategic Oversight</div>
                          <div>• <strong>Hiring Manager</strong> - Review & Decide</div>
                        </div>
                        <p className="text-xs text-red-600 mt-2 italic">
                          Note: Cannot create additional Admins - only one per organization
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Quick Actions */}
              <Card className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={action.action}
                        className="h-auto py-4 flex flex-col items-center gap-2 hover:border-[#ff6b35] hover:text-[#ff6b35]"
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs text-center">{action.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
                  <Button variant="ghost" size="sm" onClick={() => onNavigate('job-management')}>
                    View All
                  </Button>
                </div>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <button
                      key={activity.id}
                      onClick={() => {
                        // Route based on activity type
                        if (activity.type === 'candidate' || activity.type === 'review') {
                          onNavigate('candidate-management');
                        } else if (activity.type === 'interview') {
                          onNavigate('interview-calendar');
                        } else {
                          onNavigate('job-management');
                        }
                      }}
                      className="w-full flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Activity className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 mb-1">{activity.title}</p>
                        <p className="text-sm text-gray-600">
                          {activity.candidate} • {activity.position}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </Card>

              {/* Conditional: Pending Approvals for Managers/Leads */}
              {permissions.canApproveJobs && (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Pending Approvals</h2>
                    <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                      3 Pending
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {[
                      { title: 'Senior Engineer Position', submitter: 'John Doe', time: '2 hours ago' },
                      { title: 'Product Manager Role', submitter: 'Sarah Chen', time: '5 hours ago' },
                      { title: 'UX Designer Position', submitter: 'Mike Wilson', time: '1 day ago' }
                    ].map((approval, idx) => (
                      <button
                        key={idx}
                        onClick={() => onNavigate('approval-queue')}
                        className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Briefcase className="w-5 h-5 text-blue-600" />
                          <div className="text-left">
                            <p className="font-medium text-gray-900">{approval.title}</p>
                            <p className="text-sm text-gray-600">Submitted by {approval.submitter}</p>
                            <p className="text-xs text-gray-500 mt-1">{approval.time}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </button>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => onNavigate('approval-queue')}
                  >
                    View All Approvals
                  </Button>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Calendar Widget */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Upcoming Interviews</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onNavigate('interview-calendar')}
                  >
                    View All
                  </Button>
                </div>
                <MiniCalendarWidget />
              </Card>

              {/* Performance Widget - Not for Hiring Managers */}
              {userRole !== 'hiring-manager' && (
                <Card className="p-6">
                  <h3 className="font-medium text-gray-900 mb-4">
                    {userRole === 'admin' || userRole === 'lead' ? 'Organization Performance' :
                     userRole === 'manager' ? 'Team Performance' : 'My Performance'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Monthly Target</span>
                        <span className="text-sm font-medium text-gray-900">75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Time to Hire</span>
                        <span className="text-sm font-medium text-green-600">-15%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Fill Rate</span>
                        <span className="text-sm font-medium text-gray-900">82%</span>
                      </div>
                      <Progress value={82} className="h-2" />
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
