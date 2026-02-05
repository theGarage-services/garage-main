import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { MiniCalendarWidget } from './MiniCalendarWidget';
import { 
  Plus, 
  Users, 
  Briefcase, 
  Calendar, 
  TrendingUp, 
  Eye,
  ArrowUpRight,
  ChevronRight,
  BarChart3,
  Coffee
} from 'lucide-react';
import { AppHeader } from './AppHeader';

interface IndividualMemberDashboardProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
  user: any;
}

export function IndividualMemberDashboard({ onNavigate, onLogout, user }: Readonly<IndividualMemberDashboardProps>) {
  // Check if user is admin - admins should not see job posting features
  const isAdmin = user?.isInstitutionAdmin || user?.isInstitutionCreator;
  
  // Mock notification count - in a real app, this would come from props or API

  // Personal stats for the current recruiter
  const stats = [
    {
      title: 'My Job Postings',
      value: '8',
      change: '+2 this month',
      icon: Briefcase,
      trend: 'up'
    },
    {
      title: 'My Candidates',
      value: '156',
      change: '+15 this week',
      icon: Users,
      trend: 'up'
    },
    {
      title: 'My Interviews',
      value: '12',
      change: '+3 this week',
      icon: Calendar,
      trend: 'up'
    },
    {
      title: 'Coffee Chats',
      value: '24',
      change: '+6 this month',
      icon: Coffee,
      trend: 'up'
    }
  ];

  // Mock data for recent job postings by this recruiter
  const recentJobPostings = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'Toronto, ON',
      postedDate: '2 days ago',
      status: 'active',
      views: 847,
      applications: 23,
      interviews: 5,
      hires: 1
    },
    {
      id: '2', 
      title: 'Product Manager',
      department: 'Product',
      location: 'Remote',
      postedDate: '1 week ago',
      status: 'active',
      views: 632,
      applications: 18,
      interviews: 3,
      hires: 0
    },
    {
      id: '3',
      title: 'UX Designer',
      department: 'Design',
      location: 'Vancouver, BC',
      postedDate: '3 days ago', 
      status: 'active',
      views: 421,
      applications: 12,
      interviews: 2,
      hires: 0
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100">
      <AppHeader
        userRole="recruiter"
        user={user}
        currentView="homepage"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2 text-gray-900">
            Welcome back, {user?.firstName || 'Recruiter'}! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your hiring pipeline today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            const gradients = [
              'from-[#ff6b35] to-[#ff8c42]',
              'from-blue-500 to-blue-600',
              'from-purple-500 to-purple-600',
              'from-green-500 to-green-600'
            ];
            return (
              <Card key={index} className="p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white to-gray-50 border-0 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${gradients[index]} rounded-xl flex items-center justify-center shadow-lg`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="text-3xl font-semibold mb-1 text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600 mb-2">{stat.title}</div>
                <div className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full inline-block">{stat.change}</div>
              </Card>
            );
          })}
        </div>

        {/* Main Dashboard Content */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="group p-6 bg-gradient-to-br from-[#ff6b35] to-[#ff8c42] text-white hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden"
                  onClick={() => onNavigate('candidate-management')}>
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-7 h-7" />
                  </div>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Manage Candidates</h3>
                <p className="text-sm opacity-90 leading-relaxed">Review applications and manage your talent pipeline with AI-powered insights</p>
              </div>
            </Card>

            <Card className="group p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden"
                  onClick={() => onNavigate('job-management')}>
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Briefcase className="w-7 h-7" />
                  </div>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Job Postings</h3>
                <p className="text-sm opacity-90 leading-relaxed">Create, edit and manage your job listings with smart recommendations</p>
              </div>
            </Card>

            <Card className="group p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden"
                  onClick={() => onNavigate('recruiter-stats')}>
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="w-7 h-7" />
                  </div>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
                <h3 className="text-lg font-semibold mb-2">My Stats</h3>
                <p className="text-sm opacity-90 leading-relaxed">
                  View your performance metrics, KPIs, and recruiting insights
                </p>
              </div>
            </Card>
          </div>

          {/* Recent Activity & Calendar */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Job Postings */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg text-gray-900 mb-1">Recent Job Postings</h3>
                  <p className="text-sm text-gray-600">Your most recent job postings and their analytics</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#ff6b35] rounded-full animate-pulse"></div>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Live Stats
                  </Badge>
                </div>
              </div>
              
              {recentJobPostings.length > 0 ? (
                <div className="space-y-4">
                  {recentJobPostings.map((job) => (
                    <div key={job.id} className="p-4 bg-gradient-to-r from-gray-50 to-orange-50 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-orange-100">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-medium text-gray-900">{job.title}</div>
                          <div className="text-sm text-gray-600">{job.department} • {job.location}</div>
                          <div className="text-xs text-gray-500 mt-1">Posted {job.postedDate}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-medium text-[#ff6b35]">{job.views}</div>
                          <div className="text-xs text-gray-500">views</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                        <div className="text-center p-2 bg-white rounded-lg">
                          <div className="font-medium text-gray-900">{job.applications}</div>
                          <div className="text-xs text-gray-500">Applications</div>
                        </div>
                        <div className="text-center p-2 bg-white rounded-lg">
                          <div className="font-medium text-gray-900">{job.interviews}</div>
                          <div className="text-xs text-gray-500">Interviews</div>
                        </div>
                        <div className="text-center p-2 bg-white rounded-lg">
                          <div className="font-medium text-gray-900">{job.hires}</div>
                          <div className="text-xs text-gray-500">Hires</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {job.status === 'active' ? 'Active' : 'Draft'}
                        </Badge>
                        <Button size="sm" className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white">
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">No Job Postings Yet</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    {isAdmin 
                      ? 'Job postings will appear here when team members create them' 
                      : 'Create your first job posting to start attracting candidates'}
                  </p>
                  {!isAdmin && (
                    <Button 
                      onClick={() => onNavigate('job-posting')}
                      className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Job Posting
                    </Button>
                  )}
                </div>
              )}
              
              {recentJobPostings.length > 0 && (
                <div className="mt-6 text-center">
                  <Button 
                    variant="outline" 
                    onClick={() => onNavigate('job-management')}
                    className="w-full border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35] hover:text-white"
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    View All Job Postings
                  </Button>
                </div>
              )}
            </Card>

            {/* Interview Calendar */}
            <MiniCalendarWidget />
          </div>


        </div>
      </div>
    </div>
  );
}