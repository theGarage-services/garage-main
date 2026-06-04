import React, { useState, useEffect } from 'react';
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
  Target,
  Star,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowUpDown} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner';
import { Toaster } from '../ui/sonner';
import { ScheduleInterviewSheet } from '../calendar/ScheduleInterviewSheet';
import { AppHeader } from '../layout/AppHeader';
import {
  Candidate,
  recruiterCandidatesApi
} from '../../api/recruiterCandidates';

// Status badge helper - extracted to reduce component complexity
const getStatusBadge = (status: string) => {
  const statusStyles: Record<string, string> = {
    'application-submitted': 'bg-blue-100 text-blue-800',
    'under-review': 'bg-blue-100 text-blue-800',
    'consideration-sent': 'bg-purple-100 text-purple-800',
    'consideration-accepted': 'bg-indigo-100 text-indigo-800',
    'phone-screening': 'bg-cyan-100 text-cyan-800',
    'technical-interview': 'bg-teal-100 text-teal-800',
    'final-interview': 'bg-emerald-100 text-emerald-800',
    'reference-check': 'bg-lime-100 text-lime-800',
    'offer-extended': 'bg-orange-100 text-orange-800',
    'offer-accepted': 'bg-green-100 text-green-800',
    'offer-rejected': 'bg-red-100 text-red-800',
    'rejected': 'bg-red-100 text-red-800',
    'withdrawn': 'bg-gray-100 text-gray-800'
  };

  const statusLabels: Record<string, string> = {
    'application-submitted': 'Applied',
    'under-review': 'Applied',
    'consideration-sent': 'Invited',
    'consideration-accepted': 'Accepted Invitation',
    'phone-screening': 'Phone Screen',
    'technical-interview': 'Technical Interview',
    'final-interview': 'Final Interview',
    'reference-check': 'Reference Check',
    'offer-extended': 'Offer Pending',
    'offer-accepted': 'Offer Accepted',
    'offer-rejected': 'Offer Rejected',
    'rejected': 'Not Considered',
    'withdrawn': 'Withdrawn'
  };

  const style = statusStyles[status] || '';
  const label = statusLabels[status] || status;

  return style ? <Badge className={style}>{label}</Badge> : <Badge>{label}</Badge>;
};

// Source badge helper - extracted to reduce component complexity
const getSourceBadge = (source: string) => {
  const sourceStyles: Record<string, string> = {
    'Direct Apply': 'border-blue-300 text-blue-700',
    'AI-Recommended': 'border-purple-300 text-purple-700',
    'LinkedIn': 'border-cyan-300 text-cyan-700',
    'Referral': 'border-green-300 text-green-700'
  };

  const style = sourceStyles[source];
  return style ? <Badge variant="outline" className={style}>{source}</Badge> : <Badge variant="outline">{source}</Badge>;
};

// Extracted component to display candidates based on view mode
interface CandidatesDisplayProps {
  loading: boolean;
  filteredCandidates: Candidate[];
  viewMode: 'list' | 'grid' | 'table';
  selectedCandidateIds: string[];
  onToggleSelect: (id: string) => void;
  onViewProfile: (candidate: Candidate) => void;
  onSendMessage: (candidate: Candidate) => void;
  onScheduleInterview: (candidate: Candidate) => void;
  onDownloadResume: (id: string, name: string) => void;
}

const CandidatesDisplay: React.FC<CandidatesDisplayProps> = ({
  loading,
  filteredCandidates,
  viewMode,
  selectedCandidateIds,
  onToggleSelect,
  onViewProfile,
  onSendMessage,
  onScheduleInterview,
  onDownloadResume
}) => {
  if (loading) {
    return (
      <Card className="p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b35] mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Loading candidates...</h3>
          <p className="text-gray-600">
            Please wait while we fetch your candidate data.
          </p>
        </div>
      </Card>
    );
  }

  if (filteredCandidates.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No candidates found</h3>
          <p className="text-gray-600">
            Try adjusting your filters to see more candidates.
          </p>
        </div>
      </Card>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-3">
        {filteredCandidates.map((candidate) => (
          <CandidateListCard
            key={candidate.id}
            candidate={candidate}
            isSelected={selectedCandidateIds.includes(candidate.id)}
            onToggleSelect={() => onToggleSelect(candidate.id)}
            onViewProfile={() => onViewProfile(candidate)}
            onSendMessage={() => onSendMessage(candidate)}
            onScheduleInterview={() => onScheduleInterview(candidate)}
            onDownloadResume={() => onDownloadResume(candidate.id, candidate.name)}
          />
        ))}
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCandidates.map((candidate) => (
          <CandidateGridCard
            key={candidate.id}
            candidate={candidate}
            isSelected={selectedCandidateIds.includes(candidate.id)}
            onToggleSelect={() => onToggleSelect(candidate.id)}
            onViewProfile={() => onViewProfile(candidate)}
            onSendMessage={() => onSendMessage(candidate)}
            onScheduleInterview={() => onScheduleInterview(candidate)}
          />
        ))}
      </div>
    );
  }

  // Table view
  return (
    <CandidateTableView
      candidates={filteredCandidates}
      selectedCandidateIds={selectedCandidateIds}
      onToggleSelect={onToggleSelect}
      onViewProfile={onViewProfile}
      onSendMessage={onSendMessage}
      onScheduleInterview={onScheduleInterview}
    />
  );
};

// List card component
interface CandidateCardProps {
  candidate: Candidate;
  isSelected: boolean;
  onToggleSelect: () => void;
  onViewProfile: () => void;
  onSendMessage: () => void;
  onScheduleInterview: () => void;
  onDownloadResume: () => void;
}

// Grid card component (simpler version without download)
interface GridCardProps {
  candidate: Candidate;
  isSelected: boolean;
  onToggleSelect: () => void;
  onViewProfile: () => void;
  onSendMessage: () => void;
  onScheduleInterview: () => void;
}

const CandidateListCard: React.FC<CandidateCardProps> = ({
  candidate,
  isSelected,
  onToggleSelect,
  onViewProfile,
  onSendMessage,
  onScheduleInterview,
  onDownloadResume
}) => (
  <Card className="p-4 hover:shadow-md transition-shadow">
    <div className="flex items-start gap-4">
      <div className="pt-1">
        <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} />
      </div>
      <Avatar className="h-12 w-12">
        <AvatarImage src={candidate.avatar || undefined} />
        <AvatarFallback className="bg-[#ff6b35] text-white">
          {candidate.name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="font-semibold text-lg">{candidate.name}</h4>
            <p className="text-gray-600">{candidate.title}</p>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {candidate.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {candidate.experience}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {candidate.email}
              </span>
              {candidate.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {candidate.phone}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              {getStatusBadge(candidate.status)}
              {getSourceBadge(candidate.source)}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">{candidate.matchScore}%</span>
              <span>match</span>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-gray-500 mb-2">
            Applied to: {candidate.jobsApplied.map(j => j.jobTitle).join(', ')}
          </p>
          {candidate.skills && candidate.skills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {candidate.skills.slice(0, 5).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {candidate.skills.length > 5 && (
                <Badge variant="secondary" className="text-xs">
                  +{candidate.skills.length - 5} more
                </Badge>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t">
          <div className="text-sm text-gray-500">
            Applied {new Date(candidate.appliedDate).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onViewProfile}>
              <Eye className="h-4 w-4 mr-1" />
              View Profile
            </Button>
            <Button variant="outline" size="sm" onClick={onSendMessage}>
              <MessageSquare className="h-4 w-4 mr-1" />
              Message
            </Button>
            <Button variant="outline" size="sm" onClick={onScheduleInterview}>
              <Calendar className="h-4 w-4 mr-1" />
              Schedule
            </Button>
            <Button variant="outline" size="sm" onClick={onDownloadResume}>
              <FileDown className="h-4 w-4 mr-1" />
              Resume
            </Button>
          </div>
        </div>
      </div>
    </div>
  </Card>
);

const CandidateGridCard: React.FC<GridCardProps> = ({
  candidate,
  isSelected,
  onToggleSelect,
  onViewProfile,
  onSendMessage,
  onScheduleInterview
}) => (
  <Card className="p-4 hover:shadow-md transition-shadow">
    <div className="flex items-start gap-3 mb-3">
      <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} />
      <Avatar className="h-10 w-10">
        <AvatarImage src={candidate.avatar || undefined} />
        <AvatarFallback className="bg-[#ff6b35] text-white text-sm">
          {candidate.name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold truncate">{candidate.name}</h4>
        <p className="text-sm text-gray-600 truncate">{candidate.title}</p>
      </div>
    </div>
    <div className="space-y-2 mb-3">
      <div className="flex items-center gap-1 text-sm text-gray-500">
        <MapPin className="h-3 w-3" />
        <span className="truncate">{candidate.location}</span>
      </div>
      <div className="flex items-center gap-1 text-sm text-gray-500">
        <Star className="h-3 w-3 text-yellow-500" />
        <span>{candidate.matchScore}% match</span>
      </div>
      <div className="flex items-center gap-2">
        {getStatusBadge(candidate.status)}
        {getSourceBadge(candidate.source)}
      </div>
    </div>
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" className="flex-1" onClick={onViewProfile}>
        <Eye className="h-4 w-4 mr-1" />
        View
      </Button>
      <Button variant="outline" size="sm" onClick={onSendMessage}>
        <MessageSquare className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={onScheduleInterview}>
        <Calendar className="h-4 w-4" />
      </Button>
    </div>
  </Card>
);

// Table view component
interface TableViewProps {
  candidates: Candidate[];
  selectedCandidateIds: string[];
  onToggleSelect: (id: string) => void;
  onViewProfile: (candidate: Candidate) => void;
  onSendMessage: (candidate: Candidate) => void;
  onScheduleInterview: (candidate: Candidate) => void;
}

const CandidateTableView: React.FC<TableViewProps> = ({
  candidates,
  selectedCandidateIds,
  onToggleSelect,
  onViewProfile,
  onSendMessage,
  onScheduleInterview
}) => (
  <div className="border rounded-lg overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left">
              <Checkbox
                checked={selectedCandidateIds.length === candidates.length && candidates.length > 0}
                onCheckedChange={() => {
                  if (selectedCandidateIds.length === candidates.length) {
                    candidates.forEach(c => onToggleSelect(c.id));
                  } else {
                    candidates.forEach(c => {
                      if (!selectedCandidateIds.includes(c.id)) {
                        onToggleSelect(c.id);
                      }
                    });
                  }
                }}
              />
            </th>
            <th className="px-4 py-3 text-left font-medium">Candidate</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Match</th>
            <th className="px-4 py-3 text-left font-medium">Applied</th>
            <th className="px-4 py-3 text-left font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {candidates.map((candidate) => (
            <tr key={candidate.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <Checkbox
                  checked={selectedCandidateIds.includes(candidate.id)}
                  onCheckedChange={() => onToggleSelect(candidate.id)}
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
                    <p className="font-medium">{candidate.name}</p>
                    <p className="text-sm text-gray-500">{candidate.title}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">{getStatusBadge(candidate.status)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{candidate.matchScore}%</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {new Date(candidate.appliedDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewProfile(candidate)}
                    title="View Profile"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSendMessage(candidate)}
                    title="Send Message"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onScheduleInterview(candidate)}
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
);

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

  // API data state
  const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    applied: 0,
    interviewing: 0,
    offers: 0,
    hired: 0,
    not_considered: 0,
    withdrawn: 0
  });
  const [metrics, setMetrics] = useState({
    total_candidates: 0,
    active_in_pipeline: 0,
    total_hired: 0,
    avg_match_score: 0
  });
  const [jobs, setJobs] = useState<Array<{id: string; title: string; department: string}>>([]);
  const [loading, setLoading] = useState(true);

  // Fetch candidates data from API
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await recruiterCandidatesApi.fetchAllCandidates({
          search: searchQuery || undefined,
          jobId: selectedJob === 'all' ? undefined : selectedJob,
          source: selectedSource === 'all' ? undefined : selectedSource,
          status: activeTab === 'all' ? undefined : activeTab,
          sortBy: sortBy
        });
        setAllCandidates(data.candidates);
        setStatusCounts(data.status_counts);
        setMetrics(data.metrics);
      } catch (error) {
        console.error('Error fetching candidates:', error);
        toast.error('Failed to load candidates');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [searchQuery, selectedJob, selectedSource, activeTab, sortBy]);

  // Fetch jobs for filter dropdown
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsData = await recruiterCandidatesApi.fetchRecruiterJobs();
        setJobs(jobsData);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  // Using real API data from useEffect hooks above

  // Jobs for filter dropdown from API
  const uniqueJobs = jobs;

  // API handles filtering and sorting - just use allCandidates directly
  const filteredCandidates = allCandidates;

  // Metrics from API
  const totalCandidates = metrics.total_candidates;
  const activeInPipeline = metrics.active_in_pipeline;
  const avgMatchScore = metrics.avg_match_score;

  // Tab counts from API
  const appliedCount = statusCounts.applied;
  const interviewingCount = statusCounts.interviewing;
  const offersCount = statusCounts.offers;
  const hiredCount = statusCounts.hired;
  const notConsideredCount = statusCounts.not_considered;
  const withdrawnCount = statusCounts.withdrawn;

  // Handler functions
  const handleViewProfile = (candidate: Candidate) => {
    setGlobalSelectedCandidate?.(candidate);
    onNavigate(`/recruiter/candidates/${candidate.id}`);
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
    recruiterCandidatesApi.exportToCSV(filteredCandidates);
    toast.success(`Exported ${filteredCandidates.length} candidates to CSV`);
  };

  const handleDownloadResume = async (candidateId: string, candidateName: string) => {
    try {
      await recruiterCandidatesApi.downloadCandidateResume(candidateId, candidateName);
      toast.success('Resume downloaded successfully');
    } catch (error: any) {
      console.error('Error downloading resume:', error);
      toast.error(error.message || 'Failed to download resume');
    }
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
        <CandidatesDisplay
          loading={loading}
          filteredCandidates={filteredCandidates}
          viewMode={viewMode}
          selectedCandidateIds={selectedCandidateIds}
          onToggleSelect={toggleSelectCandidate}
          onViewProfile={handleViewProfile}
          onSendMessage={handleSendMessage}
          onScheduleInterview={handleScheduleInterview}
          onDownloadResume={handleDownloadResume}
        />
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