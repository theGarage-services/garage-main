import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Users,
  Briefcase,
  Target,
  Clock,
  Star,
  Activity,
  Calendar,
  Zap,
  UserCheck,
  Globe,
  Download,
  Share2,
  RefreshCw,
  Play,
  Pause,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { RecruiterProfileDropdown } from './RecruiterProfileDropdown';

interface MetricsDashboardProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
  user: any;
  onLogout: () => void;
}

export function MetricsDashboard({ onBack, onNavigate, user, onLogout }: Readonly<MetricsDashboardProps>) {
  const [activeTab, setActiveTab] = useState('real-time');
  const [timeRange, setTimeRange] = useState('30d');
  const [isLive, setIsLive] = useState(true);

  // Real-time metrics
  const realtimeMetrics = {
    activeUsers: 3247,
    onlineRecruiters: 456,
    activeJobs: 8934,
    pendingApplications: 2156,
    scheduledInterviews: 89,
    newSignups: 67,
    messagesExchanged: 1423,
    successfulMatches: 23
  };

  // Performance metrics with trends
  const performanceMetrics = [
    {
      title: 'Application Success Rate',
      value: '28.4%',
      change: '+2.3%',
      trend: 'up',
      icon: Target,
      color: 'from-green-500 to-green-600',
      description: 'Job seekers getting hired'
    },
    {
      title: 'Average Time to Hire',
      value: '16.2 days',
      change: '-3.1 days',
      trend: 'up',
      icon: Clock,
      color: 'from-blue-500 to-blue-600',
      description: 'From application to offer'
    },
    {
      title: 'Recruiter Efficiency',
      value: '89.7%',
      change: '+5.2%',
      trend: 'up',
      icon: Zap,
      color: 'from-purple-500 to-purple-600',
      description: 'Successful placements'
    },
    {
      title: 'Platform Satisfaction',
      value: '4.8/5.0',
      change: '+0.2',
      trend: 'up',
      icon: Star,
      color: 'from-orange-500 to-orange-600',
      description: 'User ratings'
    }
  ];

  // Compact activity chart data
  const activityData = [
    { hour: '00', applications: 12, views: 89, messages: 23 },
    { hour: '04', applications: 8, views: 45, messages: 12 },
    { hour: '08', applications: 45, views: 234, messages: 78 },
    { hour: '12', applications: 67, views: 456, messages: 123 },
    { hour: '16', applications: 89, views: 567, messages: 156 },
    { hour: '20', applications: 34, views: 234, messages: 67 }
  ];

  // Queue performance data
  const queueMetrics = [
    { name: 'Software Engineering', candidates: 4567, fill_rate: 85, avg_time: 14, growth: 12 },
    { name: 'Data Science', candidates: 2890, fill_rate: 78, avg_time: 18, growth: 23 },
    { name: 'Product Management', candidates: 1934, fill_rate: 82, avg_time: 16, growth: 8 },
    { name: 'Design', candidates: 1456, fill_rate: 91, avg_time: 12, growth: 15 },
    { name: 'Marketing', candidates: 1234, fill_rate: 76, avg_time: 20, growth: 5 }
  ];

  // Geographic performance (simplified)
  const geographicMetrics = [
    { region: 'Toronto', jobs: 15234, fill_rate: 87, color: 'bg-blue-500' },
    { region: 'Vancouver', jobs: 8456, fill_rate: 83, color: 'bg-green-500' },
    { region: 'Montreal', jobs: 6789, fill_rate: 79, color: 'bg-purple-500' },
    { region: 'Calgary', jobs: 4567, fill_rate: 81, color: 'bg-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <button
                  onClick={onBack}
                  className="p-2 text-gray-600 hover:text-[#ff6b35] transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-medium text-gray-900">Metrics Dashboard</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-sm text-gray-600">{isLive ? 'Live Data' : 'Paused'}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLive(!isLive)}
                  className="ml-2"
                >
                  {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              </div>
              
              <RecruiterProfileDropdown 
                onNavigate={onNavigate}
                onLogout={onLogout}
                user={user}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-medium text-gray-900 mb-2">Platform Metrics</h1>
              <p className="text-gray-600">Real-time analytics and performance insights</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-fit grid-cols-4">
              <TabsTrigger value="real-time" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Real-Time
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="queues" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Queues
              </TabsTrigger>
              <TabsTrigger value="geographic" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Geographic
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              {(['24h', '7d', '30d'] as const).map((period) => (
                <Button
                  key={period}
                  variant={timeRange === period ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange(period)}
                  className={timeRange === period ? 'bg-[#ff6b35] hover:bg-[#e55a2b]' : ''}
                >
                  {period === '24h' ? '24 Hours' : period === '7d' ? '7 Days' : '30 Days'}
                </Button>
              ))}
            </div>
          </div>

          <TabsContent value="real-time" className="space-y-6">
            {/* Real-time Activity Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-medium text-gray-900">{realtimeMetrics.activeUsers.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Active Users</div>
                  </div>
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-medium text-gray-900">{realtimeMetrics.onlineRecruiters}</div>
                    <div className="text-sm text-gray-600">Online Recruiters</div>
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-medium text-gray-900">{realtimeMetrics.activeJobs.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Active Jobs</div>
                  </div>
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-medium text-gray-900">{realtimeMetrics.scheduledInterviews}</div>
                    <div className="text-sm text-gray-600">Interviews Today</div>
                  </div>
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-orange-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Compact Activity Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">24-Hour Activity</h3>
              <div className="h-24 flex items-end justify-between gap-2">
                {activityData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex gap-1 mb-2">
                      <div 
                        className="bg-blue-500 rounded-t flex-1"
                        style={{ height: `${(data.applications / 100) * 60}px` }}
                        title={`${data.applications} applications`}
                      ></div>
                      <div 
                        className="bg-green-500 rounded-t flex-1"
                        style={{ height: `${(data.views / 600) * 60}px` }}
                        title={`${data.views} job views`}
                      ></div>
                      <div 
                        className="bg-orange-500 rounded-t flex-1"
                        style={{ height: `${(data.messages / 200) * 60}px` }}
                        title={`${data.messages} messages`}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600">{data.hour}:00</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-gray-600">Applications</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-gray-600">Job Views</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span className="text-gray-600">Messages</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {performanceMetrics.map((metric, index) => {
                const IconComponent = metric.icon;
                const isPositive = metric.trend === 'up';
                return (
                  <Card key={index} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        <span className="text-sm font-medium">{metric.change}</span>
                      </div>
                    </div>
                    <div className="text-2xl font-medium text-gray-900 mb-1">{metric.value}</div>
                    <div className="text-sm font-medium text-gray-900 mb-1">{metric.title}</div>
                    <div className="text-xs text-gray-500">{metric.description}</div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="queues" className="space-y-6">
            {/* Queue Performance */}
            <div className="grid gap-4">
              {queueMetrics.map((queue, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{queue.name}</h3>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-600">{queue.candidates.toLocaleString()} candidates</span>
                          <span className="text-gray-600">{queue.avg_time} days avg</span>
                          <div className="flex items-center gap-1 text-green-600">
                            <TrendingUp className="w-3 h-3" />
                            <span>+{queue.growth}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Fill Rate</span>
                            <span className="font-medium">{queue.fill_rate}%</span>
                          </div>
                          <Progress value={queue.fill_rate} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="geographic" className="space-y-6">
            {/* Geographic Distribution */}
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Regional Performance</h3>
              <div className="space-y-4">
                {geographicMetrics.map((region, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">{region.region}</span>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">{region.fill_rate}% fill rate</div>
                        <div className="text-sm text-gray-600">{region.jobs.toLocaleString()} jobs</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${region.color}`}
                        style={{ width: `${region.fill_rate}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}