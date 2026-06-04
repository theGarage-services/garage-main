import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  LayoutList, 
  LayoutGrid, 
  Table as TableIcon,
  Eye,
  MessageSquare,
  Calendar,
  FileDown,
  Users,
  UserCheck,
  Briefcase,
  Target,
  Star,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowUpDown} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';
import { Toaster } from './ui/sonner';
import { ScheduleInterviewSheet } from './ScheduleInterviewSheet';
import { AppHeader } from './AppHeader';

interface Candidate {
  id: string;
  name: string;
  title: string;
  location: string;
  experience: string;
  avatar: string | null;
  status: string;
  appliedDate: string;
  lastUpdated: string;
  source: string;
  matchScore: number;
  email: string;
  phone: string;
  jobsApplied: Array<{
    jobId: string;
    jobTitle: string;
    department: string;
    appliedDate: string;
    status: string;
  }>;
  skills?: string[];
  resumeUrl?: string;
}

interface RecruiterCandidateManagementProps {
  user: any;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  setSelectedCandidate?: (candidate: any) => void;
}

export const RecruiterCandidateManagement: React.FC<RecruiterCandidateManagementProps> = ({
  user,
  onNavigate,
  onLogout,
  setSelectedCandidate: setGlobalSelectedCandidate
}) => {
  // View state
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'table'>('list');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');
  
  // Modal state - removed showStatusUpdate and showCandidateProfile since we navigate to separate pages
  const [showInterviewSheet, setShowInterviewSheet] = useState(false);
  const [interviewCandidate, setInterviewCandidate] = useState<Candidate | null>(null);
  
  // Bulk operations
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);

  // Mock data - All candidates across all jobs
  const allCandidates: Candidate[] = [
    {
      id: 'cand-1',
      name: 'Sarah Johnson',
      title: 'Senior Software Engineer',
      location: 'Toronto, ON',
      experience: '8 years',
      avatar: null,
      status: 'final-interview',
      appliedDate: '2024-01-15',
      lastUpdated: '2024-01-20',
      source: 'Direct Apply',
      matchScore: 95,
      email: 'sarah.j@email.com',
      phone: '+1 (416) 555-0101',
      skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
      jobsApplied: [
        {
          jobId: 'job-1',
          jobTitle: 'Senior Software Engineer',
          department: 'Engineering',
          appliedDate: '2024-01-15',
          status: 'final-interview'
        }
      ]
    },
    {
      id: 'cand-2',
      name: 'Michael Chen',
      title: 'Full Stack Developer',
      location: 'Vancouver, BC',
      experience: '5 years',
      avatar: null,
      status: 'technical-interview',
      appliedDate: '2024-01-14',
      lastUpdated: '2024-01-19',
      source: 'AI-Recommended',
      matchScore: 88,
      email: 'michael.c@email.com',
      phone: '+1 (604) 555-0102',
      skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
      jobsApplied: [
        {
          jobId: 'job-1',
          jobTitle: 'Senior Software Engineer',
          department: 'Engineering',
          appliedDate: '2024-01-14',
          status: 'technical-interview'
        },
        {
          jobId: 'job-2',
          jobTitle: 'Backend Developer',
          department: 'Engineering',
          appliedDate: '2024-01-16',
          status: 'under-review'
        }
      ]
    },
    {
      id: 'cand-3',
      name: 'Emily Rodriguez',
      title: 'Product Designer',
      location: 'Montreal, QC',
      experience: '6 years',
      avatar: null,
      status: 'offer-accepted',
      appliedDate: '2024-01-10',
      lastUpdated: '2024-01-22',
      source: 'LinkedIn',
      matchScore: 92,
      email: 'emily.r@email.com',
      phone: '+1 (514) 555-0103',
      skills: ['Figma', 'UI/UX', 'Design Systems', 'Prototyping'],
      jobsApplied: [
        {
          jobId: 'job-3',
          jobTitle: 'Senior Product Designer',
          department: 'Design',
          appliedDate: '2024-01-10',
          status: 'offer-accepted'
        }
      ]
    },
    {
      id: 'cand-4',
      name: 'David Kim',
      title: 'Data Scientist',
      location: 'Calgary, AB',
      experience: '4 years',
      avatar: null,
      status: 'phone-screening',
      appliedDate: '2024-01-18',
      lastUpdated: '2024-01-20',
      source: 'Referral',
      matchScore: 90,
      email: 'david.k@email.com',
      phone: '+1 (403) 555-0104',
      skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
      jobsApplied: [
        {
          jobId: 'job-4',
          jobTitle: 'Data Scientist',
          department: 'Data & Analytics',
          appliedDate: '2024-01-18',
          status: 'phone-screening'
        }
      ]
    },
    {
      id: 'cand-5',
      name: 'Jessica Martinez',
      title: 'Frontend Developer',
      location: 'Ottawa, ON',
      experience: '3 years',
      avatar: null,
      status: 'under-review',
      appliedDate: '2024-01-19',
      lastUpdated: '2024-01-19',
      source: 'Direct Apply',
      matchScore: 85,
      email: 'jessica.m@email.com',
      phone: '+1 (613) 555-0105',
      skills: ['React', 'JavaScript', 'CSS', 'Tailwind'],
      jobsApplied: [
        {
          jobId: 'job-1',
          jobTitle: 'Senior Software Engineer',
          department: 'Engineering',
          appliedDate: '2024-01-19',
          status: 'under-review'
        }
      ]
    },
    {
      id: 'cand-6',
      name: 'James Wilson',
      title: 'DevOps Engineer',
      location: 'Edmonton, AB',
      experience: '7 years',
      avatar: null,
      status: 'reference-check',
      appliedDate: '2024-01-12',
      lastUpdated: '2024-01-21',
      source: 'AI-Recommended',
      matchScore: 93,
      email: 'james.w@email.com',
      phone: '+1 (780) 555-0106',
      skills: ['Kubernetes', 'AWS', 'Terraform', 'CI/CD'],
      jobsApplied: [
        {
          jobId: 'job-5',
          jobTitle: 'Senior DevOps Engineer',
          department: 'Infrastructure',
          appliedDate: '2024-01-12',
          status: 'reference-check'
        }
      ]
    }
  ];

  // Get unique jobs for filter dropdown
  const uniqueJobs = useMemo(() => {
    const jobMap = new Map();
    allCandidates.forEach(candidate => {
      candidate.jobsApplied.forEach(job => {
        if (!jobMap.has(job.jobId)) {
          jobMap.set(job.jobId, {
            id: job.jobId,
            title: job.jobTitle,
            department: job.department
          });
        }
      });
    });
    return Array.from(jobMap.values());
  }, []);

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    let filtered = allCandidates;

    // Filter by status tab
    if (activeTab !== 'all') {
      switch (activeTab) {
        case 'applied':
          filtered = filtered.filter(c => 
            ['application-submitted', 'consideration-sent', 'consideration-accepted', 'pending-consideration', 'under-review'].includes(c.status)
          );
          break;
        case 'interviewing':
          filtered = filtered.filter(c => 
            ['phone-screening', 'technical-interview', 'final-interview', 'reference-check'].includes(c.status)
          );
          break;
        case 'offers':
          filtered = filtered.filter(c => 
            ['offer-extended', 'offer-accepted', 'offer-rejected'].includes(c.status)
          );
          break;
        case 'hired':
          filtered = filtered.filter(c => c.status === 'offer-accepted');
          break;
        case 'not-considered':
          filtered = filtered.filter(c => c.status === 'rejected');
          break;
        case 'withdrawn':
          filtered = filtered.filter(c => c.status === 'withdrawn');
          break;
      }
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by job
    if (selectedJob !== 'all') {
      filtered = filtered.filter(c => 
        c.jobsApplied.some(job => job.jobId === selectedJob)
      );
    }

    // Filter by source
    if (selectedSource !== 'all') {
      filtered = filtered.filter(c => c.source === selectedSource);
    }

    // Sort candidates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
        case 'date-asc':
          return new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime();
        case 'score-desc':
          return b.matchScore - a.matchScore;
        case 'score-asc':
          return a.matchScore - b.matchScore;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allCandidates, activeTab, searchQuery, selectedJob, selectedSource, sortBy]);

  // Calculate metrics
  const totalCandidates = allCandidates.length;
  const activeInPipeline = allCandidates.filter(c => 
    ['application-submitted', 'under-review', 'phone-screening', 'technical-interview', 
     'final-interview', 'reference-check', 'offer-extended'].includes(c.status)
  ).length;
  const totalHired = allCandidates.filter(c => c.status === 'offer-accepted').length;
  
  const avgMatchScore = Math.round(
    allCandidates.reduce((sum, c) => sum + c.matchScore, 0) / allCandidates.length
  );

  // Tab counts
  const appliedCount = allCandidates.filter(c => 
    ['application-submitted', 'consideration-sent', 'consideration-accepted', 'pending-consideration', 'under-review'].includes(c.status)
  ).length;
  const interviewingCount = allCandidates.filter(c => 
    ['phone-screening', 'technical-interview', 'final-interview', 'reference-check'].includes(c.status)
  ).length;
  const offersCount = allCandidates.filter(c => 
    ['offer-extended', 'offer-accepted', 'offer-rejected'].includes(c.status)
  ).length;
  const hiredCount = totalHired;
  const notConsideredCount = allCandidates.filter(c => c.status === 'rejected').length;
  const withdrawnCount = allCandidates.filter(c => c.status === 'withdrawn').length;

  // Helper functions
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

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'Direct Apply':
        return <Badge variant="outline" className="border-blue-300 text-blue-700">Direct Apply</Badge>;
      case 'AI-Recommended':
        return <Badge variant="outline" className="border-purple-300 text-purple-700">AI-Recommended</Badge>;
      case 'LinkedIn':
        return <Badge variant="outline" className="border-cyan-300 text-cyan-700">LinkedIn</Badge>;
      case 'Referral':
        return <Badge variant="outline" className="border-green-300 text-green-700">Referral</Badge>;
      default:
        return <Badge variant="outline">{source}</Badge>;
    }
  };

  const handleViewProfile = (candidate: Candidate) => {
    setGlobalSelectedCandidate?.(candidate);
    onNavigate('candidate-profile');
  };

  const handleSendMessage = (candidate: Candidate) => {
    setGlobalSelectedCandidate?.(candidate);
    onNavigate('recruiter-chat');
  };

  const handleScheduleInterview = (candidate: Candidate) => {
    setInterviewCandidate(candidate);
    setShowInterviewSheet(true);
  };

  const handleExport = () => {
    toast.success(`Exporting ${filteredCandidates.length} candidates to CSV...`);
  };

  const toggleSelectCandidate = (candidateId: string) => {
    setSelectedCandidateIds(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100">
      {/* Header */}
      <AppHeader
        userRole="recruiter"
        user={user}
        currentView="candidate-management"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      {/* Page Title & Controls Section */}
      <div className="pt-20 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] text-white pb-8 shadow-lg">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold mb-2">Candidate Management</h1>
              <p className="text-white/90">View and manage all candidates across all job postings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">
        {/* Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Candidates</p>
                <p className="text-2xl font-bold mt-1">{totalCandidates}</p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Pipeline</p>
                <p className="text-2xl font-bold mt-1">{activeInPipeline}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Hired</p>
                <p className="text-2xl font-bold mt-1">{hiredCount}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Match Score</p>
                <p className="text-2xl font-bold mt-1">{avgMatchScore}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </Card>
        </div>

        {/* Filters Bar */}
        <Card className="p-4">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, title, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Select value={selectedJob} onValueChange={setSelectedJob}>
                <SelectTrigger>
                  <SelectValue placeholder="All Jobs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  {uniqueJobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger>
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="Direct Apply">Direct Apply</SelectItem>
                  <SelectItem value="AI-Recommended">AI-Recommended</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="score-desc">Highest Score</SelectItem>
                  <SelectItem value="score-asc">Lowest Score</SelectItem>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <span className="text-sm text-gray-600">
            {filteredCandidates.length} of {totalCandidates} candidates
          </span>

          <div className="flex items-center gap-3">
            {/* View mode toggle */}
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <TableIcon className="h-4 w-4" />
              </Button>
            </div>

            <Button onClick={handleExport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Status Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="all">
              All ({totalCandidates})
            </TabsTrigger>
            <TabsTrigger value="applied">
              Applied ({appliedCount})
            </TabsTrigger>
            <TabsTrigger value="interviewing">
              Interviewing ({interviewingCount})
            </TabsTrigger>
            <TabsTrigger value="offers">
              Offers ({offersCount})
            </TabsTrigger>
            <TabsTrigger value="hired">
              Hired ({hiredCount})
            </TabsTrigger>
            <TabsTrigger value="not-considered">
              Not Considered ({notConsideredCount})
            </TabsTrigger>
            <TabsTrigger value="withdrawn">
              Withdrawn ({withdrawnCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Candidates Display */}
        {filteredCandidates.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No candidates found</h3>
              <p className="text-gray-600">
                Try adjusting your filters to see more candidates.
              </p>
            </div>
          </Card>
        ) : viewMode === 'list' ? (
          <div className="space-y-3">
            {filteredCandidates.map((candidate) => (
              <Card key={candidate.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  {/* Selection checkbox */}
                  <div className="pt-1">
                    <Checkbox
                      checked={selectedCandidateIds.includes(candidate.id)}
                      onCheckedChange={() => toggleSelectCandidate(candidate.id)}
                    />
                  </div>

                  {/* Avatar */}
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={candidate.avatar || undefined} />
                    <AvatarFallback className="bg-[#ff6b35] text-white">
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  {/* Main content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg">{candidate.name}</h3>
                        <p className="text-gray-600 text-sm">{candidate.title}</p>
                        
                        {/* Jobs applied to */}
                        <div className="mt-2 space-y-1">
                          {candidate.jobsApplied.map((job, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <Briefcase className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-700">
                                <span className="font-medium">{job.jobTitle}</span>
                                <span className="text-gray-500"> • {job.department}</span>
                              </span>
                            </div>
                          ))}
                          {candidate.jobsApplied.length > 1 && (
                            <Badge variant="outline" className="text-xs">
                              Applied to {candidate.jobsApplied.length} positions
                            </Badge>
                          )}
                        </div>

                        {/* Details row */}
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {candidate.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {candidate.experience}
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {candidate.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {candidate.phone}
                          </div>
                        </div>

                        {/* Skills */}
                        {candidate.skills && candidate.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {candidate.skills.slice(0, 4).map((skill, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {candidate.skills.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{candidate.skills.length - 4} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right side - Status, Score, Badges */}
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(candidate.status)}
                        {getSourceBadge(candidate.source)}
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-[#ff6b35] text-[#ff6b35]" />
                          <span className="font-semibold">{candidate.matchScore}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          Applied {new Date(candidate.appliedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewProfile(candidate)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Profile
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendMessage(candidate)}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleScheduleInterview(candidate)}
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Schedule
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Create and download a mock resume file
                          const resumeContent = `${candidate.name} - Resume\n\nContact Information:\nEmail: ${candidate.email}\nPhone: ${candidate.phone}\nLocation: ${candidate.location}\n\nExperience: ${candidate.experience}\nTitle: ${candidate.title}\n\nSkills: ${candidate.skills?.join(', ') || 'Not specified'}`;
                          const blob = new Blob([resumeContent], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${candidate.name.replace(/\s+/g, '_')}_Resume.txt`;
                          document.body.appendChild(a);
                          a.click();
                          a.remove();
                          URL.revokeObjectURL(url);
                          toast.success('Resume downloaded successfully');
                        }}
                      >
                        <FileDown className="h-4 w-4 mr-1" />
                        Resume
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCandidates.map((candidate) => (
              <Card key={candidate.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <Checkbox
                    checked={selectedCandidateIds.includes(candidate.id)}
                    onCheckedChange={() => toggleSelectCandidate(candidate.id)}
                  />
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={candidate.avatar || undefined} />
                    <AvatarFallback className="bg-[#ff6b35] text-white">
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{candidate.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{candidate.title}</p>
                  </div>
                </div>

                {/* Match score */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-[#ff6b35] text-[#ff6b35]" />
                    <span className="font-semibold">{candidate.matchScore}</span>
                  </div>
                  {getStatusBadge(candidate.status)}
                </div>

                {/* Job info */}
                <div className="space-y-2 mb-3">
                  {candidate.jobsApplied.slice(0, 2).map((job, idx) => (
                    <div key={idx} className="text-sm">
                      <div className="flex items-start gap-1">
                        <Briefcase className="h-3 w-3 text-gray-400 mt-0.5" />
                        <span className="text-gray-700 flex-1 line-clamp-2">{job.jobTitle}</span>
                      </div>
                    </div>
                  ))}
                  {candidate.jobsApplied.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{candidate.jobsApplied.length - 2} more
                    </Badge>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-1 text-xs text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{candidate.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {candidate.experience}
                  </div>
                </div>

                {/* Source badge */}
                <div className="mb-3">
                  {getSourceBadge(candidate.source)}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewProfile(candidate)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Profile
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendMessage(candidate)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleScheduleInterview(candidate)}
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : viewMode === 'table' ? (
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <Checkbox
                        checked={selectedCandidateIds.length === filteredCandidates.length && filteredCandidates.length > 0}
                        onCheckedChange={() => {
                          if (selectedCandidateIds.length === filteredCandidates.length) {
                            setSelectedCandidateIds([]);
                          } else {
                            setSelectedCandidateIds(filteredCandidates.map(c => c.id));
                          }
                        }}
                      />
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Candidate</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Job Applied</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Score</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Source</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Applied Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredCandidates.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={selectedCandidateIds.includes(candidate.id)}
                          onCheckedChange={() => toggleSelectCandidate(candidate.id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={candidate.avatar || undefined} />
                            <AvatarFallback className="bg-[#ff6b35] text-white text-xs">
                              {candidate.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{candidate.name}</div>
                            <div className="text-sm text-gray-600">{candidate.title}</div>
                            <div className="text-xs text-gray-500">{candidate.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          {candidate.jobsApplied.slice(0, 2).map((job, idx) => (
                            <div key={idx} className="text-sm">
                              {job.jobTitle}
                            </div>
                          ))}
                          {candidate.jobsApplied.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{candidate.jobsApplied.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(candidate.status)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-[#ff6b35] text-[#ff6b35]" />
                          <span className="font-semibold">{candidate.matchScore}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {getSourceBadge(candidate.source)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(candidate.appliedDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewProfile(candidate)}
                            title="View Profile"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSendMessage(candidate)}
                            title="Send Message"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleScheduleInterview(candidate)}
                            title="Schedule Interview"
                          >
                            <Calendar className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>



      {/* Schedule Interview Sheet */}
      <ScheduleInterviewSheet
        open={showInterviewSheet}
        onOpenChange={setShowInterviewSheet}
        candidate={interviewCandidate}
        onScheduled={() => {
          toast.success('Interview scheduled successfully!');
          // Handle interview scheduling logic here
        }}
        onExpandToFullscreen={(candidate) => {
          setShowInterviewSheet(false);
          setGlobalSelectedCandidate?.(candidate);
          onNavigate('interview-calendar');
        }}
      />

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};

export default RecruiterCandidateManagement;