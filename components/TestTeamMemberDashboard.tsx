import { 
  Briefcase, 
  Calendar,
  Users,
  Lock,
  Mail,
  TrendingUp
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useTestPermissions } from '../hooks/useTestPermissions';
import { MOCK_ORGANIZATION, MOCK_JOBS, MOCK_CANDIDATES, MOCK_ACTIVITY_LOG } from '../utils/testMockData';
import { ROLE_TEMPLATES } from '../types/team';

interface TestTeamMemberDashboardProps {
  onNavigate: (page: string) => void;
}

export function TestTeamMemberDashboard({ onNavigate }: Readonly<TestTeamMemberDashboardProps>) {
  const { currentUser, hasPermission, canAccessJob } = useTestPermissions();
  
  // Find current member details
  const memberDetails = MOCK_ORGANIZATION.members.find(m => m.id === currentUser.id);
  const department = memberDetails?.departmentId 
    ? MOCK_ORGANIZATION.departments.find(d => d.id === memberDetails.departmentId)
    : null;

  // Filter data based on permissions
  const accessibleJobs = MOCK_JOBS.filter(job => canAccessJob(job.id));
  const myRecentActivity = MOCK_ACTIVITY_LOG.filter(a => a.userId === currentUser.id).slice(0, 5);

  const stats = {
    assignedJobs: accessibleJobs.length,
    myCandidates: hasPermission('candidates.view') ? MOCK_CANDIDATES.length : 0,
    myInterviews: hasPermission('calendar.view') ? 3 : 0,
  };

  const getRoleInfo = () => {
    if (!memberDetails?.roleTemplate || memberDetails.roleTemplate === 'custom') {
      return {
        name: 'Custom Role',
        color: '#6b7280',
        description: 'Custom permissions',
      };
    }
    return ROLE_TEMPLATES[memberDetails.roleTemplate];
  };

  const roleInfo = getRoleInfo();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <img
              src={memberDetails?.avatar}
              alt={memberDetails?.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h1 className="text-3xl">Welcome, {memberDetails?.name?.split(' ')[0]}</h1>
              <p className="text-sm text-gray-600">Your personalized dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className="bg-blue-500 text-white px-3 py-1">
              🧪 TEST SYSTEM
            </Badge>
            <Badge
              style={{ backgroundColor: roleInfo.color + '20', color: roleInfo.color }}
              className="px-3 py-1"
            >
              {roleInfo.name}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <img 
            src={MOCK_ORGANIZATION.logo} 
            alt={MOCK_ORGANIZATION.name}
            className="w-6 h-6 rounded"
          />
          <span>{MOCK_ORGANIZATION.name}</span>
          {department && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: department.color }}
                />
                <span>{department.name}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Restrictions Notice */}
      {currentUser.assignedJobs && currentUser.assignedJobs.length > 0 && (
        <Card className="mb-6 p-4 bg-amber-50 border-amber-200">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-900">Limited Access</p>
              <p className="text-xs text-amber-700">
                You have access to {currentUser.assignedJobs.length} specific job{currentUser.assignedJobs.length > 1 ? 's' : ''}. 
                Contact your administrator for additional access.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {hasPermission('jobs.create') || hasPermission('candidates.view') ? (
          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => hasPermission('candidates.view') && onNavigate('jobs')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl mb-1">{stats.assignedJobs}</h3>
            <p className="text-sm text-gray-600">
              {currentUser.assignedJobs?.length ? 'Assigned Jobs' : 'Active Jobs'}
            </p>
          </Card>
        ) : (
          <Card className="p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-gray-400" />
              </div>
            </div>
            <h3 className="text-2xl mb-1 text-gray-400">—</h3>
            <p className="text-sm text-gray-400">Job Access Restricted</p>
          </Card>
        )}

        {hasPermission('candidates.view') ? (
          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onNavigate('candidates')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl mb-1">{stats.myCandidates}</h3>
            <p className="text-sm text-gray-600">Candidates</p>
          </Card>
        ) : (
          <Card className="p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-gray-400" />
              </div>
            </div>
            <h3 className="text-2xl mb-1 text-gray-400">—</h3>
            <p className="text-sm text-gray-400">Candidate Access Restricted</p>
          </Card>
        )}

        {hasPermission('calendar.view') ? (
          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onNavigate('calendar')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl mb-1">{stats.myInterviews}</h3>
            <p className="text-sm text-gray-600">Upcoming Interviews</p>
          </Card>
        ) : (
          <Card className="p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-gray-400" />
              </div>
            </div>
            <h3 className="text-2xl mb-1 text-gray-400">—</h3>
            <p className="text-sm text-gray-400">Calendar Access Restricted</p>
          </Card>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Recent Activity */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-xl mb-6">My Recent Activity</h2>
          
          {myRecentActivity.length > 0 ? (
            <div className="space-y-4">
              {myRecentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      You {activity.action.toLowerCase()}
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
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No recent activity</p>
            </div>
          )}
        </Card>

        {/* Quick Access & Info */}
        <Card className="p-6">
          <h2 className="text-xl mb-6">Quick Access</h2>
          
          <div className="space-y-3">
            {hasPermission('candidates.view') && (
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => onNavigate('candidates')}
              >
                <Users className="w-4 h-4 mr-2" />
                View Candidates
              </Button>
            )}

            {hasPermission('calendar.view') && (
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => onNavigate('calendar')}
              >
                <Calendar className="w-4 h-4 mr-2" />
                My Calendar
              </Button>
            )}

            {hasPermission('messaging.send') && (
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => alert('Chat system')}
              >
                <Mail className="w-4 h-4 mr-2" />
                Messages
              </Button>
            )}
          </div>

          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-gray-500 mb-3">Your Permissions</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Active Permissions:</span>
                <Badge variant="outline">{currentUser.permissions.length}</Badge>
              </div>
              {department && (
                <div className="flex items-center justify-between text-sm">
                  <span>Department:</span>
                  <Badge
                    variant="outline"
                    style={{ borderColor: department.color, color: department.color }}
                  >
                    {department.name}
                  </Badge>
                </div>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4"
              onClick={() => alert('Request sent to administrator')}
            >
              <Mail className="w-4 h-4 mr-2" />
              Request Additional Access
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
