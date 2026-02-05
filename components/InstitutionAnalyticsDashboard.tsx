import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import {
  ArrowLeft,
  Users,
  Briefcase,
  Target,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  BarChart3,
  Video,
  Mail,
  Download,
  RefreshCw,
  Crown,
  Eye} from 'lucide-react';

interface InstitutionAnalyticsDashboardProps {
  institution: any;
  user: any;
  onBack: () => void;
  onMemberClick: (member: any) => void;
}

export function InstitutionAnalyticsDashboard({ 
  institution, 
  onBack, 
  onMemberClick 
}: Readonly<InstitutionAnalyticsDashboardProps>) {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Mock analytics data - in real app this would come from API
  const analyticsData = {
    overview: {
      totalMembers: 12,
      activeMembers: 10,
      pendingInvites: 2,
      totalHires: 45,
      totalInterviews: 127,
      totalJobPostings: 23,
      averageHireTime: 18,
      hiringSuccessRate: 73
    },
    trends: {
      hiresThisMonth: { value: 8, change: 25, trend: 'up' },
      interviewsThisMonth: { value: 23, change: 15, trend: 'up' },
      applicationsThisMonth: { value: 156, change: 8, trend: 'up' },
      responseRate: { value: 67, change: -3, trend: 'down' }
    },
    departments: [
      { name: 'Engineering', members: 5, hires: 18, interviews: 52, jobPostings: 8 },
      { name: 'Sales', members: 3, hires: 12, interviews: 34, jobPostings: 6 },
      { name: 'Marketing', members: 2, hires: 8, interviews: 23, jobPostings: 4 },
      { name: 'Operations', members: 2, hires: 7, interviews: 18, jobPostings: 5 }
    ],
    topPerformers: [
      {
        id: '1',
        name: 'Sarah Johnson',
        title: 'Senior Recruiter',
        department: 'Engineering',
        hires: 12,
        interviews: 34,
        successRate: 85,
        responseTime: '2.3h',
        avatar: 'SJ'
      },
      {
        id: '2',
        name: 'Mike Chen',
        title: 'Talent Acquisition Lead',
        department: 'Sales',
        hires: 10,
        interviews: 28,
        successRate: 78,
        responseTime: '3.1h',
        avatar: 'MC'
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        title: 'Recruiter',
        department: 'Marketing',
        hires: 8,
        interviews: 21,
        successRate: 72,
        responseTime: '4.2h',
        avatar: 'ER'
      }
    ],
    recentActivity: [
      {
        id: '1',
        type: 'hire',
        member: 'Sarah Johnson',
        description: 'Successfully hired Senior Frontend Developer',
        time: '2 hours ago',
        icon: CheckCircle,
        color: 'text-green-600'
      },
      {
        id: '2',
        type: 'interview',
        member: 'Mike Chen',
        description: 'Completed interview with Product Manager candidate',
        time: '4 hours ago',
        icon: Video,
        color: 'text-blue-600'
      },
      {
        id: '3',
        type: 'application',
        member: 'Emily Rodriguez',
        description: 'Received 5 new applications for Marketing Specialist',
        time: '6 hours ago',
        icon: Mail,
        color: 'text-orange-600'
      },
      {
        id: '4',
        type: 'job_post',
        member: 'Sarah Johnson',
        description: 'Posted new Senior Backend Developer position',
        time: '1 day ago',
        icon: Briefcase,
        color: 'text-purple-600'
      }
    ]
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? <ArrowUp className="w-4 h-4 text-green-600" /> : <ArrowDown className="w-4 h-4 text-red-600" />;
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-medium text-gray-900">Institution Analytics</h1>
                  <p className="text-sm text-gray-500">{institution?.name || 'Tech Corp'}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Hires</p>
                <p className="text-3xl font-medium text-gray-900">{analyticsData.overview.totalHires}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(analyticsData.trends.hiresThisMonth.trend)}
                  <span className={`text-sm ${getTrendColor(analyticsData.trends.hiresThisMonth.trend)}`}>
                    {analyticsData.trends.hiresThisMonth.change}% this month
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Interviews</p>
                <p className="text-3xl font-medium text-gray-900">{analyticsData.overview.totalInterviews}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(analyticsData.trends.interviewsThisMonth.trend)}
                  <span className={`text-sm ${getTrendColor(analyticsData.trends.interviewsThisMonth.trend)}`}>
                    {analyticsData.trends.interviewsThisMonth.change}% this month
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Video className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Members</p>
                <p className="text-3xl font-medium text-gray-900">{analyticsData.overview.activeMembers}</p>
                <p className="text-sm text-gray-500">of {analyticsData.overview.totalMembers} total</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-3xl font-medium text-gray-900">{analyticsData.overview.hiringSuccessRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(analyticsData.trends.responseRate.trend)}
                  <span className={`text-sm ${getTrendColor(analyticsData.trends.responseRate.trend)}`}>
                    {Math.abs(analyticsData.trends.responseRate.change)}% vs last month
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="members">Team Members</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Top Performers */}
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performers</h3>
                <div className="space-y-4">
                  {analyticsData.topPerformers.map((performer, index) => (
                    <div 
                      key={performer.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => onMemberClick(performer)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                            {performer.avatar}
                          </div>
                          {index === 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                              <Crown className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{performer.name}</h4>
                          <p className="text-sm text-gray-600">{performer.title}</p>
                          <p className="text-xs text-gray-500">{performer.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-900">{performer.hires}</span>
                            <span className="text-gray-500"> hires</span>
                          </div>
                          <div>
                            <span className="font-medium text-green-600">{performer.successRate}%</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Avg response: {performer.responseTime}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Performance Metrics */}
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Key Metrics</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Hiring Success Rate</span>
                      <span className="text-sm font-medium text-gray-900">{analyticsData.overview.hiringSuccessRate}%</span>
                    </div>
                    <Progress value={analyticsData.overview.hiringSuccessRate} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Average Time to Hire</span>
                      <span className="text-sm font-medium text-gray-900">{analyticsData.overview.averageHireTime} days</span>
                    </div>
                    <Progress value={(30 - analyticsData.overview.averageHireTime) / 30 * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Member Activity Rate</span>
                      <span className="text-sm font-medium text-gray-900">{Math.round(analyticsData.overview.activeMembers / analyticsData.overview.totalMembers * 100)}%</span>
                    </div>
                    <Progress value={analyticsData.overview.activeMembers / analyticsData.overview.totalMembers * 100} className="h-2" />
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-medium text-gray-900">{analyticsData.overview.totalJobPostings}</p>
                        <p className="text-sm text-gray-600">Active Job Postings</p>
                      </div>
                      <div>
                        <p className="text-2xl font-medium text-gray-900">{analyticsData.trends.applicationsThisMonth.value}</p>
                        <p className="text-sm text-gray-600">Applications This Month</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="departments" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Department Performance</h3>
              <div className="grid gap-4">
                {analyticsData.departments.map((dept) => (
                  <div key={dept.name} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{dept.name}</h4>
                      <Badge variant="secondary">{dept.members} members</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <p className="text-lg font-medium text-green-600">{dept.hires}</p>
                        <p className="text-gray-600">Hires</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-medium text-blue-600">{dept.interviews}</p>
                        <p className="text-gray-600">Interviews</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-medium text-purple-600">{dept.jobPostings}</p>
                        <p className="text-gray-600">Job Postings</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Team Member Summary</h3>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-4">
                {analyticsData.topPerformers.map((member) => (
                  <div 
                    key={member.id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md cursor-pointer transition-all"
                    onClick={() => onMemberClick(member)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                          {member.avatar}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{member.name}</h4>
                          <p className="text-sm text-gray-600">{member.title}</p>
                          <p className="text-xs text-gray-500">{member.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <p className="font-medium text-green-600">{member.hires}</p>
                          <p className="text-gray-500">Hires</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-blue-600">{member.interviews}</p>
                          <p className="text-gray-500">Interviews</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-orange-600">{member.successRate}%</p>
                          <p className="text-gray-500">Success Rate</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {analyticsData.recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${activity.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.member}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}