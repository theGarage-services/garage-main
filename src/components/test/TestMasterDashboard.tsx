import { 
  Users, 
  Briefcase, 
  UserPlus, 
  TrendingUp, 
  Calendar,
  FileText,
  Settings,
  Crown,
  Activity,
  BarChart3,
  AlertCircle
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useTestPermissions } from '../../hooks/useTestPermissions';
import { MOCK_ORGANIZATION, MOCK_ACTIVITY_LOG, MOCK_JOBS, MOCK_PENDING_APPROVALS } from '@/utils/testMockData';

interface TestMasterDashboardProps {
  onNavigate: (page: string) => void;
}

interface PendingApprovalsAlertProps {
  count: number;
  onNavigate: (page: string) => void;
}

function PendingApprovalsAlert({ count, onNavigate }: Readonly<PendingApprovalsAlertProps>) {
  if (count === 0) return null;

  return (
    <Card className="mb-6 p-4 bg-amber-50 border-amber-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <div>
            <p className="text-sm">
              You have <span className="font-medium">{count}</span> pending approval{count > 1 ? 's' : ''}
            </p>
            <p className="text-xs text-gray-600">Review and respond to team requests</p>
          </div>
        </div>
        <Button size="sm" onClick={() => onNavigate('approvals')}>
          Review Now
        </Button>
      </div>
    </Card>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  iconBgClass: string;
  title: string;
  value: number | string;
  subtitle?: string;
  badge?: React.ReactNode;
  footer?: React.ReactNode;
  onClick?: () => void;
}

function StatCard({
  icon,
  iconBgClass,
  title,
  value,
  subtitle,
  badge,
  footer,
  onClick
}: Readonly<StatCardProps>) {
  return (
    <Card
      className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${iconBgClass} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
        {badge}
      </div>
      <h3 className="text-2xl mb-1">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
      {footer}
    </Card>
  );
}

export function TestMasterDashboard({ onNavigate }: Readonly<TestMasterDashboardProps>) {
  useTestPermissions();

  const stats = {
    totalMembers: MOCK_ORGANIZATION.members.filter(m => m.status === 'active').length,
    pendingInvites: MOCK_ORGANIZATION.members.filter(m => m.status === 'pending').length,
    activeJobs: MOCK_JOBS.filter(j => j.status === 'Active').length,
    totalApplicants: MOCK_JOBS.reduce((sum, job) => sum + job.applicants, 0),
    departments: MOCK_ORGANIZATION.departments.length,
    pendingApprovals: MOCK_PENDING_APPROVALS.filter(a => a.status === 'pending').length,
  };

  const recentActivity = MOCK_ACTIVITY_LOG.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header with Test Badge */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-lg flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl">Master Dashboard</h1>
              <p className="text-sm text-gray-600">Complete control and oversight</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className="bg-blue-500 text-white px-3 py-1">
              🧪 TEST SYSTEM
            </Badge>
            <Badge className="bg-gradient-to-r from-yellow-400 to-amber-600 text-white px-3 py-1">
              <Crown className="w-3 h-3 mr-1" />
              Master Profile
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <img 
            src={MOCK_ORGANIZATION.logo} 
            alt={MOCK_ORGANIZATION.name}
            className="w-8 h-8 rounded"
          />
          <span>{MOCK_ORGANIZATION.name}</span>
          <span>•</span>
          <span className="capitalize">{MOCK_ORGANIZATION.subscriptionTier} Plan</span>
        </div>
      </div>

      <PendingApprovalsAlert count={stats.pendingApprovals} onNavigate={onNavigate} />

      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Users className="w-6 h-6 text-blue-600" />}
          iconBgClass="bg-blue-100"
          title="Active Team Members"
          value={stats.totalMembers}
          badge={stats.pendingInvites > 0 ? <Badge variant="destructive">{stats.pendingInvites} pending</Badge> : undefined}
          footer={
            <div className="mt-3 flex -space-x-2">
              {MOCK_ORGANIZATION.members.slice(0, 4).map((member) => (
                <img
                  key={member.id}
                  src={member.avatar}
                  alt={member.name}
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              ))}
              {MOCK_ORGANIZATION.members.length > 4 && (
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs">
                  +{MOCK_ORGANIZATION.members.length - 4}
                </div>
              )}
            </div>
          }
          onClick={() => onNavigate('team')}
        />

        <StatCard
          icon={<Briefcase className="w-6 h-6 text-green-600" />}
          iconBgClass="bg-green-100"
          title="Active Job Postings"
          value={stats.activeJobs}
          subtitle={`${stats.totalApplicants} total applicants`}
          onClick={() => onNavigate('jobs')}
        />

        <StatCard
          icon={<FileText className="w-6 h-6 text-purple-600" />}
          iconBgClass="bg-purple-100"
          title="Departments"
          value={stats.departments}
          footer={
            <div className="mt-3 flex gap-1">
              {MOCK_ORGANIZATION.departments.slice(0, 3).map((dept) => (
                <div
                  key={dept.id}
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: dept.color }}
                />
              ))}
            </div>
          }
          onClick={() => onNavigate('departments')}
        />

        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-orange-600" />}
          iconBgClass="bg-orange-100"
          title="Success Rate"
          value="85%"
          subtitle="+12% from last month"
          onClick={() => onNavigate('analytics')}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl">Recent Activity</h2>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onNavigate('activity-log')}
            >
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-0">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Activity className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{activity.userName}</span>
                    {' '}
                    {activity.action.toLowerCase()}
                    {activity.targetName && (
                      <>
                        {' '}"<span className="font-medium">{activity.targetName}</span>"
                      </>
                    )}
                  </p>
                  {activity.details && (
                    <p className="text-xs text-gray-500 mt-1">{activity.details}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl">Quick Actions</h2>
          </div>

          <div className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => onNavigate('invite-member')}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Team Member
            </Button>

            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => onNavigate('post-job')}
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Post New Job
            </Button>

            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => onNavigate('departments')}
            >
              <FileText className="w-4 h-4 mr-2" />
              Manage Departments
            </Button>

            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => onNavigate('calendar')}
            >
              <Calendar className="w-4 h-4 mr-2" />
              View Calendar
            </Button>

            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => onNavigate('analytics')}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>

            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => onNavigate('activity-log')}
            >
              <Activity className="w-4 h-4 mr-2" />
              Activity Log
            </Button>

            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => onNavigate('settings')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Organization Settings
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-gray-500 mb-2">Organization Info</p>
            <div className="space-y-1 text-sm">
              <p className="text-gray-700">{MOCK_ORGANIZATION.name}</p>
              <p className="text-gray-500 text-xs">{MOCK_ORGANIZATION.industry}</p>
              <p className="text-gray-500 text-xs">{MOCK_ORGANIZATION.size}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
