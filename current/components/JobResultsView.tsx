import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  ArrowLeft, 
  Search, 
  Download, 
  List, 
  Columns, 
  User,
  Calendar,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  BarChart3,
  Eye,
  Mail,
  Phone
} from 'lucide-react';

interface JobResultsViewProps {
  job: any;
  onBack: () => void;
  onViewProfile?: (candidate: any) => void;
}

export function JobResultsView({ job, onBack, onViewProfile }: Readonly<JobResultsViewProps>) {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Mock candidates data for the job (simulating real-time data based on status updates)
  const allCandidates = [
    // Applied candidates
    {
      id: 'res-1',
      name: 'Sarah Chen',
      title: 'Senior Software Engineer',
      location: 'Toronto, ON',
      experience: '6 years',
      avatar: null,
      status: 'consideration-accepted',
      appliedDate: '2024-01-15',
      lastUpdated: '2024-01-18',
      source: 'AI-Recommended',
      matchScore: 92,
      email: 'sarah.chen@email.com',
      phone: '+1 (416) 555-0101'
    },
    {
      id: 'res-2',
      name: 'Marcus Johnson',
      title: 'Full Stack Developer',
      location: 'Vancouver, BC',
      experience: '5 years',
      avatar: null,
      status: 'application-submitted',
      appliedDate: '2024-01-16',
      lastUpdated: '2024-01-16',
      source: 'Direct Apply',
      matchScore: 88,
      email: 'marcus.j@email.com',
      phone: '+1 (604) 555-0102'
    },
    {
      id: 'res-3',
      name: 'Emma Rodriguez',
      title: 'Software Engineer',
      location: 'Montreal, QC',
      experience: '4 years',
      avatar: null,
      status: 'consideration-sent',
      appliedDate: '2024-01-14',
      lastUpdated: '2024-01-17',
      source: 'AI-Recommended',
      matchScore: 85,
      email: 'emma.r@email.com',
      phone: '+1 (514) 555-0103'
    },
    // Interviewing candidates
    {
      id: 'res-4',
      name: 'David Kim',
      title: 'Senior Developer',
      location: 'Calgary, AB',
      experience: '7 years',
      avatar: null,
      status: 'phone-screening',
      appliedDate: '2024-01-12',
      lastUpdated: '2024-01-19',
      source: 'Direct Apply',
      matchScore: 90,
      email: 'david.kim@email.com',
      phone: '+1 (403) 555-0104'
    },
    {
      id: 'res-5',
      name: 'Lisa Wang',
      title: 'Software Developer',
      location: 'Ottawa, ON',
      experience: '5 years',
      avatar: null,
      status: 'technical-interview',
      appliedDate: '2024-01-10',
      lastUpdated: '2024-01-20',
      source: 'AI-Recommended',
      matchScore: 87,
      email: 'lisa.wang@email.com',
      phone: '+1 (613) 555-0105'
    },
    {
      id: 'res-6',
      name: 'James Wilson',
      title: 'Full Stack Engineer',
      location: 'Edmonton, AB',
      experience: '6 years',
      avatar: null,
      status: 'final-interview',
      appliedDate: '2024-01-08',
      lastUpdated: '2024-01-21',
      source: 'Direct Apply',
      matchScore: 91,
      email: 'james.w@email.com',
      phone: '+1 (780) 555-0106'
    },
    // Offers - Pending
    {
      id: 'res-7',
      name: 'Michelle Zhang',
      title: 'Senior Software Engineer',
      location: 'Winnipeg, MB',
      experience: '8 years',
      avatar: null,
      status: 'offer-extended',
      appliedDate: '2024-01-05',
      lastUpdated: '2024-01-22',
      source: 'Direct Apply',
      matchScore: 94,
      email: 'michelle.z@email.com',
      phone: '+1 (204) 555-0107'
    },
    // Offers - Rejected by candidate
    {
      id: 'res-8',
      name: 'Ryan O\'Connor',
      title: 'Backend Developer',
      location: 'Halifax, NS',
      experience: '5 years',
      avatar: null,
      status: 'offer-rejected',
      appliedDate: '2024-01-06',
      lastUpdated: '2024-01-22',
      source: 'AI-Recommended',
      matchScore: 89,
      email: 'ryan.o@email.com',
      phone: '+1 (902) 555-0108'
    },
    // Offers - Accepted (also appears in Hired)
    {
      id: 'res-9',
      name: 'Taylor Smith',
      title: 'Full Stack Developer',
      location: 'Saskatoon, SK',
      experience: '6 years',
      avatar: null,
      status: 'offer-accepted',
      appliedDate: '2024-01-03',
      lastUpdated: '2024-01-23',
      source: 'Direct Apply',
      matchScore: 93,
      email: 'taylor.s@email.com',
      phone: '+1 (306) 555-0109'
    },
    // Offers - Accepted (also appears in Hired)
    {
      id: 'res-13',
      name: 'Casey Morgan',
      title: 'Senior Full Stack Engineer',
      location: 'Quebec City, QC',
      experience: '7 years',
      avatar: null,
      status: 'offer-accepted',
      appliedDate: '2024-01-04',
      lastUpdated: '2024-01-23',
      source: 'AI-Recommended',
      matchScore: 91,
      email: 'casey.m@email.com',
      phone: '+1 (418) 555-0113'
    },
    // Not Considered
    {
      id: 'res-10',
      name: 'Alex Patel',
      title: 'Junior Developer',
      location: 'St. John\'s, NL',
      experience: '2 years',
      avatar: null,
      status: 'rejected',
      appliedDate: '2024-01-11',
      lastUpdated: '2024-01-18',
      source: 'Direct Apply',
      matchScore: 62,
      email: 'alex.p@email.com',
      phone: '+1 (709) 555-0110'
    },
    {
      id: 'res-11',
      name: 'Jordan Lee',
      title: 'Software Engineer',
      location: 'Regina, SK',
      experience: '3 years',
      avatar: null,
      status: 'rejected',
      appliedDate: '2024-01-13',
      lastUpdated: '2024-01-19',
      source: 'AI-Recommended',
      matchScore: 68,
      email: 'jordan.l@email.com',
      phone: '+1 (306) 555-0111'
    },
    // Withdrawn
    {
      id: 'res-12',
      name: 'Morgan Brown',
      title: 'Full Stack Developer',
      location: 'Victoria, BC',
      experience: '4 years',
      avatar: null,
      status: 'withdrawn',
      appliedDate: '2024-01-09',
      lastUpdated: '2024-01-20',
      source: 'Direct Apply',
      matchScore: 84,
      email: 'morgan.b@email.com',
      phone: '+1 (250) 555-0112'
    }
  ];

  // Filter candidates by status
  const getFilteredCandidates = (tab: string) => {
    let filtered = allCandidates;

    switch (tab) {
      case 'applied':
        filtered = allCandidates.filter(c => 
          ['application-submitted', 'consideration-sent', 'consideration-accepted', 'pending-consideration', 'under-review'].includes(c.status)
        );
        break;
      case 'interviewing':
        filtered = allCandidates.filter(c => 
          ['phone-screening', 'technical-interview', 'final-interview', 'reference-check'].includes(c.status)
        );
        break;
      case 'offers':
        // Offers includes: pending (offer-extended), accepted (offer-accepted), and rejected (offer-rejected)
        filtered = allCandidates.filter(c => 
          ['offer-extended', 'offer-accepted', 'offer-rejected'].includes(c.status)
        );
        break;
      case 'hired':
        // Hired only shows accepted offers
        filtered = allCandidates.filter(c => c.status === 'offer-accepted');
        break;
      case 'not-considered':
        filtered = allCandidates.filter(c => c.status === 'rejected');
        break;
      case 'withdrawn':
        filtered = allCandidates.filter(c => c.status === 'withdrawn');
        break;
      default:
        filtered = allCandidates;
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const displayedCandidates = getFilteredCandidates(activeTab);

  // Calculate summary metrics
  const totalCandidates = allCandidates.length;
  const appliedCount = allCandidates.filter(c => 
    ['application-submitted', 'consideration-sent', 'consideration-accepted', 'pending-consideration', 'under-review'].includes(c.status)
  ).length;
  const interviewingCount = allCandidates.filter(c => 
    ['phone-screening', 'technical-interview', 'final-interview', 'reference-check'].includes(c.status)
  ).length;
  // Offers count includes pending, accepted, and rejected
  const offersCount = allCandidates.filter(c => 
    ['offer-extended', 'offer-accepted', 'offer-rejected'].includes(c.status)
  ).length;
  const hiredCount = allCandidates.filter(c => c.status === 'offer-accepted').length;
  const notConsideredCount = allCandidates.filter(c => c.status === 'rejected').length;
  const withdrawnCount = allCandidates.filter(c => c.status === 'withdrawn').length;

  // Conversion rate (Applied -> Hired)
  const conversionRate = appliedCount > 0 ? ((hiredCount / appliedCount) * 100).toFixed(1) : '0.0';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'application-submitted':
      case 'under-review':
        return <Badge className="bg-blue-100 text-blue-800">Applied</Badge>;
      case 'consideration-sent':
        return <Badge className="bg-purple-100 text-purple-800">Invited</Badge>;
      case 'consideration-accepted':
        return <Badge className="bg-indigo-100 text-indigo-800">Accepted Invitation</Badge>;
      case 'phone-screening':
        return <Badge className="bg-cyan-100 text-cyan-800">Phone Screen</Badge>;
      case 'technical-interview':
        return <Badge className="bg-teal-100 text-teal-800">Technical Interview</Badge>;
      case 'final-interview':
        return <Badge className="bg-emerald-100 text-emerald-800">Final Interview</Badge>;
      case 'reference-check':
        return <Badge className="bg-lime-100 text-lime-800">Reference Check</Badge>;
      case 'offer-extended':
        return <Badge className="bg-orange-100 text-orange-800">Offer Pending</Badge>;
      case 'offer-accepted':
        return <Badge className="bg-green-100 text-green-800">Offer Accepted</Badge>;
      case 'offer-rejected':
        return <Badge className="bg-red-100 text-red-800">Offer Rejected</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Not Considered</Badge>;
      case 'withdrawn':
        return <Badge className="bg-gray-100 text-gray-800">Withdrawn</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getDaysAgo = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 'Today' : `${diffDays}d ago`;
  };

  // Candidate Card Component
  const CandidateCard = ({ candidate }: { candidate: any }) => (
    <Card className="p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-orange-100 text-orange-700">
              {candidate.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg text-gray-900 mb-1">{candidate.name}</h3>
            <p className="text-gray-600 mb-2">{candidate.title}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
              <span className="flex items-center gap-1">
                📍 {candidate.location}
              </span>
              <span className="flex items-center gap-1">
                💼 {candidate.experience}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Applied {getDaysAgo(candidate.appliedDate)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Updated {getDaysAgo(candidate.lastUpdated)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          {getStatusBadge(candidate.status)}
          <div className="mt-2">
            <Badge variant="outline" className="text-xs">
              {candidate.source}
            </Badge>
          </div>
          {candidate.matchScore && (
            <div className="mt-2 text-xs text-gray-500">
              Match: {candidate.matchScore}%
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex gap-3 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Mail className="w-4 h-4" />
            {candidate.email}
          </span>
          <span className="flex items-center gap-1">
            <Phone className="w-4 h-4" />
            {candidate.phone}
          </span>
        </div>
        
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onViewProfile?.(candidate)}
          className="text-orange-600 border-orange-300 hover:bg-orange-50"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Profile
        </Button>
      </div>
    </Card>
  );

  // Kanban Column Component
  const KanbanColumn = ({ title, candidates, count }: { title: string; candidates: any[]; count: number }) => (
    <div className="bg-gray-50 rounded-lg p-4 min-w-[320px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-900">{title}</h3>
        <Badge variant="outline">{count}</Badge>
      </div>
      <div className="space-y-3">
        {candidates.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No candidates
          </div>
        ) : (
          candidates.map((candidate) => (
            <Card key={candidate.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-orange-100 text-orange-700 text-sm">
                    {candidate.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm text-gray-900 truncate">{candidate.name}</h4>
                  <p className="text-xs text-gray-600 truncate">{candidate.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {getStatusBadge(candidate.status)}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{getDaysAgo(candidate.appliedDate)}</span>
                {candidate.matchScore && (
                  <span className="text-orange-600">{candidate.matchScore}%</span>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button 
              variant="outline" 
              onClick={onBack}
              className="mb-4 text-gray-900 hover:text-[#ff6b35] hover:border-[#ff6b35] border-2"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Back to Job List</span>
            </Button>
            <h1 className="text-3xl text-gray-900 mb-2">Job Results</h1>
            <p className="text-gray-600">{job.title} - {job.location}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export Results
            </Button>
            <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-[#ff6b35] hover:bg-[#e55a2b]' : ''}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                onClick={() => setViewMode('kanban')}
                className={viewMode === 'kanban' ? 'bg-[#ff6b35] hover:bg-[#e55a2b]' : ''}
              >
                <Columns className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Candidates</p>
                <p className="text-2xl text-gray-900">{totalCandidates}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">In Pipeline</p>
                <p className="text-2xl text-gray-900">{appliedCount + interviewingCount}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Hired</p>
                <p className="text-2xl text-green-600">{hiredCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
                <p className="text-2xl text-orange-600">{conversionRate}%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
          </Card>
        </div>

        {/* Search */}
        <Card className="p-4 mb-6">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search candidates by name or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-white border border-gray-200">
            <TabsTrigger value="all">All ({totalCandidates})</TabsTrigger>
            <TabsTrigger value="applied">Applied ({appliedCount})</TabsTrigger>
            <TabsTrigger value="interviewing">Interviewing ({interviewingCount})</TabsTrigger>
            <TabsTrigger value="offers">Offers ({offersCount})</TabsTrigger>
            <TabsTrigger value="hired">Hired ({hiredCount})</TabsTrigger>
            <TabsTrigger value="not-considered">Not Considered ({notConsideredCount})</TabsTrigger>
            <TabsTrigger value="withdrawn">Withdrawn ({withdrawnCount})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {viewMode === 'list' ? (
              /* List View */
              <div className="space-y-4">
                {displayedCandidates.length === 0 ? (
                  <Card className="p-12 text-center">
                    <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg text-gray-900 mb-2">No candidates found</h3>
                    <p className="text-gray-600">
                      {searchQuery ? 'Try adjusting your search query' : 'No candidates in this category yet'}
                    </p>
                  </Card>
                ) : (
                  displayedCandidates.map((candidate) => (
                    <CandidateCard key={candidate.id} candidate={candidate} />
                  ))
                )}
              </div>
            ) : (
              /* Kanban View */
              <div className="overflow-x-auto pb-4">
                <div className="flex gap-4">
                  <KanbanColumn 
                    title="Applied" 
                    candidates={allCandidates.filter(c => 
                      ['application-submitted', 'consideration-sent', 'consideration-accepted', 'pending-consideration', 'under-review'].includes(c.status)
                    )}
                    count={appliedCount}
                  />
                  <KanbanColumn 
                    title="Interviewing" 
                    candidates={allCandidates.filter(c => 
                      ['phone-screening', 'technical-interview', 'final-interview', 'reference-check'].includes(c.status)
                    )}
                    count={interviewingCount}
                  />
                  <KanbanColumn 
                    title="Offers" 
                    candidates={allCandidates.filter(c => 
                      ['offer-extended', 'offer-accepted', 'offer-rejected'].includes(c.status)
                    )}
                    count={offersCount}
                  />
                  <KanbanColumn 
                    title="Hired" 
                    candidates={allCandidates.filter(c => c.status === 'offer-accepted')}
                    count={hiredCount}
                  />
                  <KanbanColumn 
                    title="Not Considered" 
                    candidates={allCandidates.filter(c => c.status === 'rejected')}
                    count={notConsideredCount}
                  />
                  <KanbanColumn 
                    title="Withdrawn" 
                    candidates={allCandidates.filter(c => c.status === 'withdrawn')}
                    count={withdrawnCount}
                  />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
