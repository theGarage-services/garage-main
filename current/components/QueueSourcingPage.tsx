import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Search, 
  Users, 
  TrendingUp, 
  Eye,
  MessageCircle,
  Star,
  MapPin,
  Briefcase,
  Clock,
  Brain,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  ChevronRight,
  Database,
  Code,
  Rocket,
  Layers} from 'lucide-react';

interface QueueSourcingPageProps {
  onBack: () => void;
  user: any;
  onViewCandidate?: (candidate: any) => void;
  onMessageCandidate?: (candidate: any) => void;
}

export function QueueSourcingPage({ onBack, onViewCandidate, onMessageCandidate }: Readonly<QueueSourcingPageProps>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterQueue, setFilterQueue] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [ setSelectedQueue] = useState<any>(null);

  // Mock queue data with analytics
  const jobSeekerQueues = [
    {
      id: 'data-engineer',
      name: 'Data Engineer',
      description: 'Database architecture, ETL pipelines, and data warehousing specialists',
      icon: Database,
      color: 'from-blue-500 to-blue-600',
      totalCandidates: 1247,
      activeCandidates: 892,
      avgExperience: 4.2,
      avgRating: 4.3,
      topSkills: ['Python', 'SQL', 'Apache Spark', 'AWS', 'Docker'],
      salaryRange: '$85k - $140k',
      locations: ['Toronto', 'Vancouver', 'Montreal', 'Calgary'],
      growthRate: 18.5,
      lastUpdated: '2 minutes ago',
      weeklyGrowth: 23,
      topCandidates: [
        {
          id: '1',
          name: 'Alex Chen',
          avatar: 'AC',
          rating: 4.8,
          experience: '5+ years',
          location: 'Toronto, ON',
          skills: ['Python', 'Spark', 'AWS', 'Kafka'],
          match: 95,
          salary: '$125,000',
          lastActive: '1 hour ago'
        },
        {
          id: '2',
          name: 'Sarah Kumar',
          avatar: 'SK',
          rating: 4.6,
          experience: '6+ years',
          location: 'Vancouver, BC',
          skills: ['SQL', 'Python', 'GCP', 'Airflow'],
          match: 92,
          salary: '$130,000',
          lastActive: '3 hours ago'
        }
      ]
    },
    {
      id: 'senior-analyst',
      name: 'Senior Analyst',
      description: 'Business intelligence, data visualization, and strategic analysis experts',
      icon: BarChart3,
      color: 'from-green-500 to-green-600',
      totalCandidates: 889,
      activeCandidates: 634,
      avgExperience: 5.1,
      avgRating: 4.1,
      topSkills: ['Excel', 'SQL', 'Tableau', 'PowerBI', 'Python'],
      salaryRange: '$70k - $110k',
      locations: ['Toronto', 'Montreal', 'Ottawa', 'Calgary'],
      growthRate: 12.3,
      lastUpdated: '5 minutes ago',
      weeklyGrowth: 15,
      topCandidates: [
        {
          id: '3',
          name: 'Michael Brown',
          avatar: 'MB',
          rating: 4.7,
          experience: '7+ years',
          location: 'Toronto, ON',
          skills: ['Tableau', 'SQL', 'Python', 'PowerBI'],
          match: 89,
          salary: '$95,000',
          lastActive: '30 minutes ago'
        }
      ]
    },
    {
      id: 'machine-learning',
      name: 'Machine Learning Engineer',
      description: 'AI/ML model development, deployment, and optimization specialists',
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      totalCandidates: 567,
      activeCandidates: 423,
      avgExperience: 3.8,
      avgRating: 4.5,
      topSkills: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Kubernetes'],
      salaryRange: '$90k - $160k',
      locations: ['Toronto', 'Vancouver', 'Waterloo', 'Montreal'],
      growthRate: 28.7,
      lastUpdated: '1 minute ago',
      weeklyGrowth: 34,
      topCandidates: [
        {
          id: '4',
          name: 'Emily Zhang',
          avatar: 'EZ',
          rating: 4.9,
          experience: '4+ years',
          location: 'Toronto, ON',
          skills: ['PyTorch', 'Python', 'MLOps', 'AWS'],
          match: 96,
          salary: '$145,000',
          lastActive: '15 minutes ago'
        }
      ]
    },
    {
      id: 'product-analyst',
      name: 'Product Analyst',
      description: 'Product metrics, user behavior analysis, and growth optimization experts',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      totalCandidates: 723,
      activeCandidates: 512,
      avgExperience: 3.5,
      avgRating: 4.2,
      topSkills: ['Analytics', 'SQL', 'A/B Testing', 'Mixpanel', 'Python'],
      salaryRange: '$75k - $120k',
      locations: ['Toronto', 'Vancouver', 'Montreal', 'Kitchener'],
      growthRate: 15.8,
      lastUpdated: '4 minutes ago',
      weeklyGrowth: 19,
      topCandidates: [
        {
          id: '5',
          name: 'David Park',
          avatar: 'DP',
          rating: 4.4,
          experience: '3+ years',
          location: 'Vancouver, BC',
          skills: ['SQL', 'Python', 'Mixpanel', 'Tableau'],
          match: 87,
          salary: '$105,000',
          lastActive: '2 hours ago'
        }
      ]
    },
    {
      id: 'business-intelligence',
      name: 'Business Intelligence',
      description: 'Data warehousing, reporting, and business intelligence platform experts',
      icon: PieChart,
      color: 'from-indigo-500 to-indigo-600',
      totalCandidates: 945,
      activeCandidates: 701,
      avgExperience: 4.7,
      avgRating: 4,
      topSkills: ['SQL', 'PowerBI', 'Tableau', 'SSIS', 'Data Modeling'],
      salaryRange: '$80k - $125k',
      locations: ['Toronto', 'Calgary', 'Edmonton', 'Montreal'],
      growthRate: 9.2,
      lastUpdated: '7 minutes ago',
      weeklyGrowth: 12,
      topCandidates: [
        {
          id: '6',
          name: 'Jessica Wong',
          avatar: 'JW',
          rating: 4.5,
          experience: '5+ years',
          location: 'Calgary, AB',
          skills: ['PowerBI', 'SQL', 'SSRS', 'DAX'],
          match: 90,
          salary: '$115,000',
          lastActive: '45 minutes ago'
        }
      ]
    },
    {
      id: 'software-engineer',
      name: 'Software Engineer',
      description: 'Full-stack development, system architecture, and software engineering',
      icon: Code,
      color: 'from-emerald-500 to-emerald-600',
      totalCandidates: 2134,
      activeCandidates: 1678,
      avgExperience: 4.1,
      avgRating: 4.4,
      topSkills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
      salaryRange: '$90k - $150k',
      locations: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa'],
      growthRate: 22.1,
      lastUpdated: '1 minute ago',
      weeklyGrowth: 67,
      topCandidates: [
        {
          id: '7',
          name: 'Ryan Martinez',
          avatar: 'RM',
          rating: 4.8,
          experience: '4+ years',
          location: 'Montreal, QC',
          skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
          match: 94,
          salary: '$128,000',
          lastActive: '20 minutes ago'
        }
      ]
    }
  ];

  const filteredQueues = jobSeekerQueues.filter(queue => {
    const matchesSearch = queue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         queue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         queue.topSkills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterQueue === 'all' || queue.id === filterQueue;
    return matchesSearch && matchesFilter;
  });

  const totalCandidates = jobSeekerQueues.reduce((sum, queue) => sum + queue.totalCandidates, 0);
  const totalActive = jobSeekerQueues.reduce((sum, queue) => sum + queue.activeCandidates, 0);
  const avgGrowthRate = jobSeekerQueues.reduce((sum, queue) => sum + queue.growthRate, 0) / jobSeekerQueues.length;

  const locations = Array.from(new Set(jobSeekerQueues.flatMap(queue => queue.locations)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="mb-4 text-gray-600 hover:text-[#ff6b35]"
            >
              ← Back to Candidates
            </Button>
            <h1 className="text-3xl text-gray-900 mb-2">Queue Sourcing</h1>
            <p className="text-gray-600">
              Access theGarage job seeker queues and discover top talent
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <Activity className="w-3 h-3 mr-1" />
              Live Data
            </Badge>
          </div>
        </div>

        {/* Overall Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-white to-blue-50 border-0 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl mb-1 text-gray-900">{totalCandidates.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Candidates</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-white to-green-50 border-0 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl mb-1 text-gray-900">{totalActive.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Active Candidates</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-white to-purple-50 border-0 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl mb-1 text-gray-900">{avgGrowthRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Avg Growth Rate</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-white to-orange-50 border-0 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] rounded-xl flex items-center justify-center">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-orange-100 text-orange-800 text-xs">Live</Badge>
            </div>
            <div className="text-2xl mb-1 text-gray-900">{jobSeekerQueues.length}</div>
            <div className="text-sm text-gray-600">Active Queues</div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search queues, skills, or roles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterQueue} onValueChange={setFilterQueue}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by queue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Queues</SelectItem>
                  {jobSeekerQueues.map(queue => (
                    <SelectItem key={queue.id} value={queue.id}>{queue.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-gray-600">
              {filteredQueues.length} queue{filteredQueues.length === 1 ? '' : 's'} found
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
            <TabsTrigger value="overview">Queue Overview</TabsTrigger>
            <TabsTrigger value="candidates">Top Candidates</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              {filteredQueues.map((queue) => {
                const IconComponent = queue.icon;
                return (
                  <Card key={queue.id} className="p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        <div className={`w-16 h-16 bg-gradient-to-r ${queue.color} rounded-xl flex items-center justify-center shadow-lg`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl text-gray-900">{queue.name}</h3>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {queue.activeCandidates} active
                            </Badge>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4 text-green-500" />
                              <span className="text-sm text-green-600 font-medium">+{queue.growthRate}%</span>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mb-4">{queue.description}</p>
                          
                          <div className="grid md:grid-cols-3 gap-6 mb-4">
                            <div>
                              <div className="text-2xl text-gray-900 mb-1">
                                {queue.totalCandidates.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-600">Total Candidates</div>
                              <div className="text-xs text-green-600 mt-1">+{queue.weeklyGrowth} this week</div>
                            </div>
                            
                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-2xl text-gray-900">{queue.avgRating}</span>
                              </div>
                              <div className="text-sm text-gray-600">Avg Rating</div>
                              <div className="text-xs text-gray-500 mt-1">{queue.avgExperience} years exp</div>
                            </div>
                            
                            <div>
                              <div className="text-2xl text-gray-900 mb-1">{queue.salaryRange}</div>
                              <div className="text-sm text-gray-600">Salary Range</div>
                              <div className="text-xs text-gray-500 mt-1">CAD annually</div>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm text-gray-600 mb-2">Top Skills:</div>
                              <div className="flex flex-wrap gap-2">
                                {queue.topSkills.map((skill, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-sm text-gray-600 mb-2">Locations:</div>
                              <div className="flex flex-wrap gap-2">
                                {queue.locations.slice(0, 4).map((location, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {location}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Button 
                          size="sm" 
                          className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white"
                          onClick={() => setSelectedQueue(queue)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Candidates
                        </Button>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Analytics
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          Last updated {queue.lastUpdated}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            {queue.activeCandidates} active
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            {queue.growthRate}% growth
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="candidates">
            <div className="space-y-4">
              {filteredQueues.map((queue) => (
                <Card key={queue.id} className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-8 h-8 bg-gradient-to-r ${queue.color} rounded-lg flex items-center justify-center`}>
                      <queue.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg text-gray-900">{queue.name} - Top Candidates</h3>
                    <Badge variant="secondary">{queue.topCandidates.length} shown</Badge>
                  </div>
                  
                  <div className="space-y-4">
                    {queue.topCandidates.map((candidate) => (
                      <div key={candidate.id} className="p-4 bg-gradient-to-r from-gray-50 to-orange-50 rounded-xl border border-orange-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback className="bg-[#ff6b35] text-white">
                                {candidate.avatar}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h4 className="text-gray-900">{candidate.name}</h4>
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span className="text-sm text-gray-600">{candidate.rating}</span>
                                </div>
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                  {candidate.match}% match
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Briefcase className="w-4 h-4" />
                                  {candidate.experience}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {candidate.location}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  Active {candidate.lastActive}
                                </div>
                              </div>
                              
                              <div className="flex gap-2 mt-2">
                                {candidate.skills.slice(0, 3).map((skill, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="text-right mr-4">
                              <div className="text-lg text-gray-900">{candidate.salary}</div>
                              <div className="text-xs text-gray-500">Expected</div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => onViewCandidate?.(candidate)}
                                className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => onMessageCandidate?.(candidate)}
                              >
                                <MessageCircle className="w-3 h-3 mr-1" />
                                Message
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="text-center pt-4">
                      <Button 
                        variant="outline" 
                        className="border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35] hover:text-white"
                        onClick={() => setSelectedQueue(queue)}
                      >
                        <ChevronRight className="w-4 h-4 mr-2" />
                        View All {queue.activeCandidates} Candidates
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}