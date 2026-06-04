import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Search, Briefcase, ArrowRight, BarChart3, Users, Target, Zap } from 'lucide-react';
import { ResponsiveJobCard } from '../jobs/ResponsiveJobCard';
import { ResponsiveLayout } from '../layout/ResponsiveLayout';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  rank: string;
  postedTime: string;
  logo?: string;
  isFavorited: boolean;
  description: string;
  workModel: string;
  experienceLevel: string;
  companySize: string;
  companyIndustry: string;
}

interface ResponsiveHomepageProps {
  onNavigate: (view: string) => void;
  user?: any;
  onLogout?: () => void;
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'Google',
    location: 'Toronto, ON',
    salary: '$120k - $180k',
    type: 'Full-time',
    rank: 'Top 5%',
    postedTime: '2 days ago',
    logo: '/api/placeholder/40/40',
    isFavorited: false,
    description: 'Join our world-class engineering team to build products that impact billions of users.',
    workModel: 'Hybrid',
    experienceLevel: 'Senior',
    companySize: '10,000+',
    companyIndustry: 'Technology'
  },
  {
    id: '2',
    title: 'Frontend Developer',
    company: 'Meta',
    location: 'San Francisco, CA',
    salary: '$100k - $150k',
    type: 'Full-time',
    rank: 'Top 10%',
    postedTime: '1 week ago',
    logo: '/api/placeholder/40/40',
    isFavorited: true,
    description: 'Build amazing user experiences for billions of users across our family of apps.',
    workModel: 'Remote',
    experienceLevel: 'Mid-level',
    companySize: '10,000+',
    companyIndustry: 'Technology'
  },
  {
    id: '3',
    title: 'Product Designer',
    company: 'Apple',
    location: 'Cupertino, CA',
    salary: '$90k - $140k',
    type: 'Full-time',
    rank: 'Top 3%',
    postedTime: '3 days ago',
    logo: '/api/placeholder/40/40',
    isFavorited: false,
    description: 'Design beautiful and intuitive products that delight millions of customers.',
    workModel: 'On-site',
    experienceLevel: 'Senior',
    companySize: '10,000+',
    companyIndustry: 'Technology'
  }
];

const stats = [
  { label: 'Applications Sent', value: '47', change: '+12%', trend: 'up' as const, icon: <Briefcase className="h-5 w-5 text-[#ff6b35]" /> },
  { label: 'Profile Views', value: '234', change: '+8%', trend: 'up' as const, icon: <Users className="h-5 w-5 text-[#ff6b35]" /> },
  { label: 'Interview Rate', value: '32%', change: '+5%', trend: 'up' as const, icon: <Target className="h-5 w-5 text-[#ff6b35]" /> },
  { label: 'Queue Ranking', value: '#12', change: '+3', trend: 'up' as const, icon: <BarChart3 className="h-5 w-5 text-[#ff6b35]" /> },
];

export function ResponsiveHomepage({ onNavigate, user, onLogout }: Readonly<ResponsiveHomepageProps>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <ResponsiveLayout user={user} onLogout={onLogout} onNavigate={onNavigate}>
      <div className="space-y-6 lg:space-y-8">
        {/* Hero Section */}
        <section className="text-center py-8 lg:py-12">
          <div className="space-y-4 lg:space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              Find Your <span className="text-[#ff6b35]">Dream Job</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Discover opportunities that match your skills and aspirations. Join thousands of professionals who've found their perfect match.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto px-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search jobs, companies, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 text-base h-12 lg:h-14"
                />
                <Button className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 lg:h-12 px-4 lg:px-6">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-6 lg:py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="p-4 lg:p-6 text-center hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-2 lg:mb-3">
                  {stat.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-xs lg:text-sm text-gray-600">{stat.label}</p>
                  <p className="text-xs lg:text-sm text-green-600 font-medium">{stat.change}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-4 lg:py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <QuickActionCard
              icon={<Briefcase className="h-6 w-6" />}
              title="Browse Jobs"
              description="Find opportunities"
              onClick={() => onNavigate('tracker')}
            />
            <QuickActionCard
              icon={<Target className="h-6 w-6" />}
              title="My Queues"
              description="Track applications"
              onClick={() => onNavigate('my-queues')}
            />
            <QuickActionCard
              icon={<BarChart3 className="h-6 w-6" />}
              title="Analytics"
              description="View insights"
              onClick={() => onNavigate('analytics')}
            />
            <QuickActionCard
              icon={<Zap className="h-6 w-6" />}
              title="Quick Apply"
              description="Apply instantly"
              onClick={() => onNavigate('quick-apply')}
            />
          </div>
        </section>

        {/* Filters and View Toggle */}
        <section className="py-4 lg:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {['all', 'remote', 'hybrid', 'on-site'].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className="text-xs lg:text-sm"
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')}
                </Button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="hidden sm:flex"
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="hidden sm:flex"
              >
                List
              </Button>
            </div>
          </div>
        </section>

        {/* Jobs Grid/List */}
        <section className="py-4 lg:py-6">
          <div className="space-y-4 lg:space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl lg:text-2xl font-semibold">Recommended Jobs</h2>
              <Button variant="outline" size="sm" className="text-sm">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Jobs Display */}
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
              : "space-y-4"
            }>
              {mockJobs.map((job) => (
                <ResponsiveJobCard
                  key={job.id}
                  job={job}
                  compact={viewMode === 'grid'}
                  onApply={() => console.log('Apply to:', job.title)}
                  onSave={() => console.log('Save job:', job.title)}
                  onDetails={() => onNavigate('job-details')}
                />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center pt-6 lg:pt-8">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Load More Jobs
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-8 lg:py-12 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] rounded-2xl text-white text-center">
          <div className="space-y-4 lg:space-y-6 px-4 lg:px-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              Ready to Level Up Your Career?
            </h2>
            <p className="text-base lg:text-lg max-w-2xl mx-auto opacity-90">
              Join premium to unlock advanced features, unlimited applications, and personalized career coaching.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Upgrade to Premium
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-[#ff6b35]">
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </div>
    </ResponsiveLayout>
  );
}

function QuickActionCard({ 
  icon, 
  title, 
  description, 
  onClick 
}: Readonly<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  onClick: () => void;
}>) {
  return (
    <Card 
      className="p-4 lg:p-6 text-center hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer"
      onClick={onClick}
    >
      <div className="space-y-2 lg:space-y-3">
        <div className="flex justify-center text-[#ff6b35]">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-sm lg:text-base">{title}</h3>
          <p className="text-xs lg:text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </Card>
  );
}
