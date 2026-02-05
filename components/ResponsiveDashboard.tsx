import { Card } from './ui/card';
import { Button } from './ui/button';
import { Users, Briefcase, Calendar, Target, Zap } from 'lucide-react';

interface DashboardStats {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}

interface ResponsiveDashboardProps {
  stats: DashboardStats[];
  children: React.ReactNode;
}

export function ResponsiveDashboard({ stats, children }: ResponsiveDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="xl:col-span-2 space-y-6">
          {children}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <QuickActionButton icon={<Briefcase className="h-4 w-4" />} label="Post New Job" />
              <QuickActionButton icon={<Users className="h-4 w-4" />} label="View Candidates" />
              <QuickActionButton icon={<Calendar className="h-4 w-4" />} label="Schedule Interview" />
              <QuickActionButton icon={<Target className="h-4 w-4" />} label="View Analytics" />
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <ActivityItem
                title="New application received"
                subtitle="Software Engineer at Google"
                time="2 hours ago"
                type="application"
              />
              <ActivityItem
                title="Interview scheduled"
                subtitle="John Doe - Frontend Developer"
                time="5 hours ago"
                type="interview"
              />
              <ActivityItem
                title="Job posted successfully"
                subtitle="Senior React Developer"
                time="1 day ago"
                type="job"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, change, trend, icon }: DashboardStats) {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';
  const trendIcon = trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→';

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-[#ff6b35]/10 rounded-lg">
          {icon}
        </div>
        <span className={`text-sm font-medium ${trendColor}`}>
          {trendIcon} {change}
        </span>
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm text-gray-600">{label}</p>
      </div>
    </Card>
  );
}

function QuickActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Button
      variant="ghost"
      className="w-full justify-start hover:bg-[#ff6b35]/10 hover:text-[#ff6b35]"
    >
      {icon}
      <span className="ml-2">{label}</span>
    </Button>
  );
}

function ActivityItem({ 
  title, 
  subtitle, 
  time, 
  type 
}: { 
  title: string; 
  subtitle: string; 
  time: string; 
  type: 'application' | 'interview' | 'job';
}) {
  const typeColors = {
    application: 'bg-blue-100 text-blue-700',
    interview: 'bg-green-100 text-green-700',
    job: 'bg-purple-100 text-purple-700',
  };

  const typeIcons = {
    application: <Briefcase className="h-3 w-3" />,
    interview: <Calendar className="h-3 w-3" />,
    job: <Zap className="h-3 w-3" />,
  };

  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className={`p-1.5 rounded-full ${typeColors[type]}`}>
        {typeIcons[type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500 truncate">{subtitle}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
}
