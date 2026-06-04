import { useState, useEffect, Key, ReactElement, ReactNode, JSXElementConstructor, ReactPortal } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { recruiterCandidatesApi, type CandidateDetail } from '../../api/recruiterCandidates';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScheduleInterviewSheet } from '../calendar/ScheduleInterviewSheet';
import { 
  ArrowLeft,
  MessageCircle,
  Calendar,
  Send,
  Download,
  MapPin,
  Mail,
  Phone,
  Globe,
  GraduationCap,
  Crown,
  CheckCircle,
  User,
  Plus,
  Trash2,
  Settings,
  BarChart3,
  StickyNote,
  Bookmark,
  Clock} from 'lucide-react';
  import { AiOutlineLinkedin, AiFillGithub } from 'react-icons/ai';

interface RecruiterCandidateProfilePageProps {
  candidate?: any;
  onBack: () => void;
  onNavigate?: (view: string) => void;
  onUpdateStatus?: (candidateId: string, status: string) => void;
  onScheduleInterview?: (candidate: any, interviewData: any) => void;
  onSendMessage?: (candidate: any) => void;
  onSaveNotes?: (candidateId: string, notes: any[]) => void;
  availableJobs?: any[];
  setSelectedCandidate?: (candidate: any) => void;
}

// Type alias for map callback parameters
type QueueItem = string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined;
type IndexKey = Key | null | undefined;

function getStageCircleClass(completed: boolean, isActive: boolean): string {
  if (completed) {
    return 'bg-green-500 text-white';
  }
  if (isActive) {
    return 'bg-[#ff6b35] text-white';
  }
  return 'bg-gray-200 text-gray-400';
}

function getNoteBadgeClass(noteType: string): string {
  switch (noteType) {
    case 'positive':
      return 'border-green-500 text-green-700';
    case 'concern':
      return 'border-red-500 text-red-700';
    case 'technical':
      return 'border-blue-500 text-blue-700';
    case 'interview':
      return 'border-purple-500 text-purple-700';
    default:
      return 'border-gray-500 text-gray-700';
  }
}

interface ExperienceItem {
  title?: string;
  company?: string;
  location?: string;
  duration?: string;
  description?: string;
  achievements?: string[];
}

interface EducationItem {
  degree?: string;
  school?: string;
  year?: string;
  gpa?: string;
}

interface NoteItem {
  id: IndexKey;
  type: string;
  author: QueueItem;
  date: QueueItem;
  timestamp: QueueItem;
  content: QueueItem;
}

export function RecruiterCandidateProfilePage({
  candidate,
  onBack,
  onNavigate,
  onUpdateStatus,
  onScheduleInterview,
  onSendMessage,
  onSaveNotes,
  setSelectedCandidate
}: Readonly<RecruiterCandidateProfilePageProps>) {
  const { id: routeId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const jobIdFromRoute = searchParams.get('job_id') ?? undefined;
  const [candidateDetails, setCandidateDetails] = useState<CandidateDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState('general');
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    if (candidate?.notes) {
      setNotes(candidate.notes);
    }
  }, [candidate]);

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!routeId) {
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const fetchedCandidate = await recruiterCandidatesApi.fetchCandidateDetails(
          routeId,
          jobIdFromRoute
        );
        setCandidateDetails(fetchedCandidate);
      } catch (error: any) {
        setErrorMessage(error?.message || 'Unable to load candidate details');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchCandidate();
  }, [routeId, jobIdFromRoute]);

  useEffect(() => {
    if (candidateDetails?.status) {
      setNewStatus(candidateDetails.status);
    }
  }, [candidateDetails?.status]);

  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showInterviewDialog, setShowInterviewDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [newStatus, setNewStatus] = useState(candidateDetails?.status || candidate?.applicationStatus || 'under-review');
  const [messageContent, setMessageContent] = useState('');

  // Build safe candidate data from API response (no mock fallbacks)
  const source = candidateDetails || candidate;

  const stageOrder = [
    'application-submitted',
    'under-review',
    'phone-screening',
    'technical-interview',
    'final-interview',
    'reference-check',
    'offer-extended',
    'offer-accepted'
  ];

  const currentStatus = source?.status || source?.applicationStatus || 'applied';
  const currentStageIndex = stageOrder.indexOf(currentStatus);

  const hiringStages = stageOrder.map((name, index) => ({
    name,
    completed: index <= currentStageIndex,
    date: index === 0 ? source?.appliedDate || null : null,
  }));

  const enhancedCandidate = {
    id: source?.id || '',
    name: source?.name || 'Unknown Candidate',
    email: source?.email || '',
    phone: source?.phone || '',
    title: source?.title || '',
    currentCompany: source?.current_company || source?.currentCompany || '',
    location: source?.location || '',
    experience: source?.experience || '',
    avatar: source?.avatar || source?.profileImage || '',
    matchScore: source?.matchScore ?? 0,
    applicationStatus: currentStatus,
    appliedDate: source?.appliedDate || null,
    lastActivity: source?.lastActivity || null,
    salary: source?.salary || '',
    summary: source?.summary || '',
    skills: Array.isArray(source?.skills) ? source.skills : [],
    education: Array.isArray(source?.education) ? source.education : [],
    experience_detailed: Array.isArray(source?.experience_detailed) ? source.experience_detailed : [],
    socialLinks: source?.socialLinks || {},
    isPremium: source?.isPremium ?? false,
    premiumTier: source?.premiumTier || '',
    queueMetrics: source?.queueMetrics || null,
    hiringStages,
    jobsApplied: Array.isArray(source?.jobsApplied) ? source.jobsApplied : [],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'application-submitted': return 'bg-blue-100 text-blue-800';
      case 'under-review': return 'bg-yellow-100 text-yellow-800';
      case 'phone-screening': return 'bg-purple-100 text-purple-800';
      case 'technical-interview': return 'bg-orange-100 text-orange-800';
      case 'final-interview': return 'bg-green-100 text-green-800';
      case 'reference-check': return 'bg-indigo-100 text-indigo-800';
      case 'offer-extended': return 'bg-emerald-100 text-emerald-800';
      case 'offer-accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'withdrawn': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageDisplayName = (stage: string) => {
    return stage.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now().toString(),
        type: noteType,
        content: newNote.trim(),
        author: 'Current User', // In real app, this would be the logged-in user
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      const updatedNotes = [note, ...notes];
      setNotes(updatedNotes);
      onSaveNotes?.(enhancedCandidate.id, updatedNotes);
      setNewNote('');
      setNoteType('general');
    }
  };

  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((note: { id: string; }) => note.id !== noteId);
    setNotes(updatedNotes);
    onSaveNotes?.(enhancedCandidate.id, updatedNotes);
  };

  const handleStatusUpdate = () => {
    onUpdateStatus?.(enhancedCandidate.id, newStatus);
    setShowStatusDialog(false);
  };

  const handleSendMessage = () => {
    if (messageContent.trim()) {
      onSendMessage?.(enhancedCandidate);
      setShowMessageDialog(false);
      setMessageContent('');
    }
  };

  // Early return for loading or missing candidate
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b35] mx-auto mb-4" />
            <h2 className="text-xl text-gray-900 mb-2">Loading candidate profile</h2>
            <p className="text-gray-600">Fetching the latest candidate details from the backend.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!candidateDetails && !candidate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-gray-600 hover:text-[#ff6b35]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Candidates
            </Button>
          </div>
          <div className="text-center py-12">
            <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl text-gray-900 mb-2">Unable to load candidate profile</h2>
            <p className="text-gray-600 mb-4">
              {errorMessage || 'Please navigate from the candidate list or try again later.'}
            </p>
            {errorMessage && (
              <Button onClick={() => globalThis.location.reload()} className="bg-[#ff6b35] text-white">
                Retry
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="text-gray-600 hover:text-[#ff6b35]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Candidates
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <div>
              <h1 className="text-2xl text-gray-900">{enhancedCandidate.name}</h1>
              <p className="text-gray-600">{enhancedCandidate.title} at {enhancedCandidate.currentCompany}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(enhancedCandidate.applicationStatus)}>
              {getStageDisplayName(enhancedCandidate.applicationStatus)}
            </Badge>
            <Button
              variant="outline"
              className="border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35] hover:text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Resume
            </Button>
            <Button
              variant="outline"
              className="border-green-500 text-green-600 hover:bg-green-50"
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Quick Info & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="p-6">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarFallback className="bg-[#ff6b35] text-white text-xl">
                      {enhancedCandidate.avatar}
                    </AvatarFallback>
                  </Avatar>
                  {enhancedCandidate.isPremium && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Crown className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                
                <h2 className="text-xl text-gray-900 mb-1">{enhancedCandidate.name}</h2>
                <p className="text-gray-600 mb-2">{enhancedCandidate.title}</p>
                <p className="text-sm text-gray-500 mb-4">{enhancedCandidate.currentCompany}</p>
                
                {enhancedCandidate.isPremium && (
                  <Badge className="bg-yellow-100 text-yellow-800 mb-4">
                    <Crown className="w-3 h-3 mr-1" />
                    {enhancedCandidate.premiumTier}
                  </Badge>
                )}
                
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {enhancedCandidate.location}
                  </div>
                </div>

                <div className="text-center mb-4">
                  <div className="text-2xl font-semibold text-[#ff6b35] mb-1">
                    {enhancedCandidate.matchScore}%
                  </div>
                  <div className="text-sm text-gray-500">Match Score</div>
                  <Progress value={enhancedCandidate.matchScore} className="w-full h-2 mt-2" />
                </div>
              </div>

              {/* Primary Actions */}
              <div className="space-y-3">
                <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-[#ff6b35] hover:bg-[#e55a2b] text-white">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Message to {enhancedCandidate.name}</DialogTitle>
                      <DialogDescription>
                        Send a direct message to this candidate.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Type your message here..."
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        rows={6}
                      />
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleSendMessage}
                          className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white"
                          disabled={!messageContent.trim()}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowInterviewDialog(true)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Interview
                </Button>

                <ScheduleInterviewSheet
                  open={showInterviewDialog}
                  onOpenChange={setShowInterviewDialog}
                  candidate={enhancedCandidate}
                  onScheduled={(interviewData) => {
                    onScheduleInterview?.(enhancedCandidate, interviewData);
                  }}
                  onExpandToFullscreen={(candidate) => {
                    setShowInterviewDialog(false);
                    if (setSelectedCandidate) {
                      setSelectedCandidate(candidate);
                    }
                    onNavigate?.('interview-calendar');
                  }}
                />

                <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full border-blue-500 text-blue-600 hover:bg-blue-50">
                      <Settings className="w-4 h-4 mr-2" />
                      Update Status
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Application Status</DialogTitle>
                      <DialogDescription>
                        Update the hiring process status for {enhancedCandidate.name}.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Current Status</Label>
                        <Badge className={`mt-1 block w-fit ${getStatusColor(enhancedCandidate.applicationStatus)}`}>
                          {getStageDisplayName(enhancedCandidate.applicationStatus)}
                        </Badge>
                      </div>
                      
                      <div>
                        <Label>New Status</Label>
                        <Select value={newStatus} onValueChange={setNewStatus}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="application-submitted">Application Submitted</SelectItem>
                            <SelectItem value="under-review">Under Review</SelectItem>
                            <SelectItem value="phone-screening">Phone Screening</SelectItem>
                            <SelectItem value="technical-interview">Technical Interview</SelectItem>
                            <SelectItem value="final-interview">Final Interview</SelectItem>
                            <SelectItem value="reference-check">Reference Check</SelectItem>
                            <SelectItem value="offer-extended">Offer Extended</SelectItem>
                            <SelectItem value="offer-accepted">Offer Accepted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="withdrawn">Withdrawn</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button 
                        onClick={handleStatusUpdate}
                        className="w-full bg-[#ff6b35] hover:bg-[#e55a2b] text-white"
                      >
                        Update Status
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-6">
              <h3 className="text-lg text-gray-900 mb-4">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{enhancedCandidate.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{enhancedCandidate.phone}</span>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <AiOutlineLinkedin className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-600">{enhancedCandidate.socialLinks.linkedin}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <AiFillGithub className="w-4 h-4 text-gray-700" />
                    <span className="text-sm text-gray-700">{enhancedCandidate.socialLinks.github}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">{enhancedCandidate.socialLinks.portfolio}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            {enhancedCandidate.queueMetrics && (
              <Card className="p-6">
                <h3 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#ff6b35]" />
                  theGarage Metrics
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-semibold text-blue-700">{enhancedCandidate.queueMetrics.totalApplications}</div>
                      <div className="text-xs text-blue-600">Applications</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-semibold text-green-700">{enhancedCandidate.queueMetrics.responseRate}%</div>
                      <div className="text-xs text-green-600">Response Rate</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Interview Rate</span>
                      <span className="text-sm font-medium">{enhancedCandidate.queueMetrics.interviewRate}%</span>
                    </div>
                    <Progress value={enhancedCandidate.queueMetrics.interviewRate} className="h-2" />
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 bg-white border">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Professional Summary */}
                <Card className="p-6">
                  <h3 className="text-xl text-gray-900 mb-4">Professional Summary</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">{enhancedCandidate.summary}</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg text-gray-900 mb-3">Key Information</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Experience:</span>
                          <span className="text-gray-900">{enhancedCandidate.experience}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Expected Salary:</span>
                          <span className="text-gray-900">{enhancedCandidate.salary}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Applied:</span>
                          <span className="text-gray-900">
                            {enhancedCandidate.appliedDate
                              ? new Date(enhancedCandidate.appliedDate).toLocaleDateString()
                              : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Activity:</span>
                          <span className="text-gray-900">
                            {enhancedCandidate.lastActivity
                              ? new Date(enhancedCandidate.lastActivity).toLocaleDateString()
                              : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {enhancedCandidate.queueMetrics && (
                      <div>
                        <h4 className="text-lg text-gray-900 mb-3">Current Queues</h4>
                        <div className="space-y-2">
                          {enhancedCandidate.queueMetrics.currentQueues.map((queue: string, index: number) => (
                            <div key={queue} className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                              <span className="text-sm text-gray-700">{queue}</span>
                              <Badge variant="outline" className="text-[#ff6b35] border-[#ff6b35]">
                                #{enhancedCandidate.queueMetrics.queueRankings[index]}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Skills */}
                <Card className="p-6">
                  <h3 className="text-xl text-gray-900 mb-4">Technical Skills</h3>
                  {enhancedCandidate.skills.length === 0 ? (
                    <p className="text-gray-500">No skills recorded.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {enhancedCandidate.skills.map((skill: string) => (
                        <Badge key={String(skill)} variant="secondary" className="text-sm py-1 px-3">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Hiring Progress */}
                <Card className="p-6">
                  <h3 className="text-xl text-gray-900 mb-6">Hiring Progress</h3>
                  <div className="space-y-4">
                    {enhancedCandidate.hiringStages.map((stage: { completed: any; name: string; date: string | number | Date; }, index: number) => (
                      <div key={stage.name} className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          getStageCircleClass(stage.completed, enhancedCandidate.applicationStatus === stage.name)
                        }`}>
                          {stage.completed ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <span className="text-xs font-medium">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`font-medium ${
                              enhancedCandidate.applicationStatus === stage.name ? 'text-[#ff6b35]' : 'text-gray-700'
                            }`}>
                              {getStageDisplayName(stage.name)}
                            </span>
                            {stage.date && (
                              <span className="text-sm text-gray-500">
                                {new Date(stage.date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Experience Tab */}
              <TabsContent value="experience" className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-xl text-gray-900 mb-6">Work Experience</h3>
                  {enhancedCandidate.experience_detailed.length === 0 ? (
                    <p className="text-gray-500">No work experience recorded.</p>
                  ) : (
                  <div className="space-y-8">
                    {enhancedCandidate.experience_detailed.map((exp: ExperienceItem, index: number) => (
                      <div key={`${exp.title}-${index}`}>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">{exp.title}</h4>
                            <p className="text-[#ff6b35] font-medium">{exp.company}</p>
                            <p className="text-sm text-gray-600">{exp.location} • {exp.duration}</p>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{exp.description}</p>
                        
                        {exp.achievements && exp.achievements.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-900 mb-2">Key Achievements:</h5>
                            <ul className="list-disc list-inside space-y-1">
                              {exp.achievements.map((achievement: string) => (
                                <li key={achievement} className="text-sm text-gray-700">{achievement}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {index < enhancedCandidate.experience_detailed.length - 1 && (
                          <Separator className="mt-8" />
                        )}
                      </div>
                    ))}
                  </div>
                  )}
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl text-gray-900 mb-6">Education</h3>
                  {enhancedCandidate.education.length === 0 ? (
                    <p className="text-gray-500">No education recorded.</p>
                  ) : (
                    <div className="space-y-4">
                      {enhancedCandidate.education.map((edu: EducationItem) => (
                        <div key={`${edu.school}-${edu.degree}`} className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                            <p className="text-gray-600">{edu.school}</p>
                            <p className="text-sm text-gray-500">{edu.year} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes" className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-xl text-gray-900 mb-6">Recruiter Notes</h3>
                  
                  {/* Add New Note */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <Select value={noteType} onValueChange={setNoteType}>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="interview">Interview</SelectItem>
                            <SelectItem value="technical">Technical</SelectItem>
                            <SelectItem value="cultural">Cultural Fit</SelectItem>
                            <SelectItem value="concern">Concern</SelectItem>
                            <SelectItem value="positive">Positive</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex-1">
                          <Textarea
                            placeholder="Add a note about this candidate..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            rows={3}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button 
                          onClick={handleAddNote}
                          className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white"
                          disabled={!newNote.trim()}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Note
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Notes List */}
                  <div className="space-y-4">
                    {notes.map((note: NoteItem) => (
                      <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getNoteBadgeClass(note.type)}`}
                            >
                              {note.type}
                            </Badge>
                            <span className="text-sm text-gray-600">{note.author}</span>
                            <span className="text-sm text-gray-500">
                              {note.date} at {note.timestamp}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNote(note.id as string)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-gray-700">{note.content}</p>
                      </div>
                    ))}
                    
                    {notes.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <StickyNote className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>No notes yet. Add your first note above.</p>
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>

              {/* Timeline Tab */}
              <TabsContent value="timeline" className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-xl text-gray-900 mb-6">Activity Timeline</h3>
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>No timeline data available yet.</p>
                    <p className="text-sm mt-2">Activity will appear here as the candidate progresses through the hiring pipeline.</p>
                  </div>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                {enhancedCandidate.queueMetrics ? (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="p-6">
                        <h3 className="text-lg text-gray-900 mb-4">Performance Metrics</h3>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600">Response Rate</span>
                              <span className="text-sm font-medium">{enhancedCandidate.queueMetrics.responseRate}%</span>
                            </div>
                            <Progress value={enhancedCandidate.queueMetrics.responseRate} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600">Interview Success</span>
                              <span className="text-sm font-medium">{enhancedCandidate.queueMetrics.interviewRate}%</span>
                            </div>
                            <Progress value={enhancedCandidate.queueMetrics.interviewRate} className="h-2" />
                          </div>
                        </div>
                      </Card>

                      <Card className="p-6">
                        <h3 className="text-lg text-gray-900 mb-4">Queue Rankings</h3>
                        <div className="space-y-3">
                          {enhancedCandidate.queueMetrics.currentQueues.map((queue: string, index: number) => (
                            <div key={queue} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm font-medium text-gray-700">{queue}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Rank</span>
                                <Badge className="bg-[#ff6b35] text-white">
                                  #{enhancedCandidate.queueMetrics.queueRankings[index]}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>

                    <Card className="p-6">
                      <h3 className="text-lg text-gray-900 mb-4">Activity Summary</h3>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-semibold text-blue-700">{enhancedCandidate.queueMetrics.totalApplications}</div>
                          <div className="text-sm text-blue-600">Total Applications</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-semibold text-green-700">{Math.round(enhancedCandidate.queueMetrics.totalApplications * enhancedCandidate.queueMetrics.responseRate / 100)}</div>
                          <div className="text-sm text-green-600">Responses</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-semibold text-purple-700">{Math.round(enhancedCandidate.queueMetrics.totalApplications * enhancedCandidate.queueMetrics.interviewRate / 100)}</div>
                          <div className="text-sm text-purple-600">Interviews</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-semibold text-orange-700">{enhancedCandidate.queueMetrics.successfulPlacements}</div>
                          <div className="text-sm text-orange-600">Placements</div>
                        </div>
                      </div>
                    </Card>
                  </>
                ) : (
                  <Card className="p-12 text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg text-gray-900 mb-2">No Analytics Available</h3>
                    <p className="text-gray-600">Queue metrics are not available for this candidate.</p>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}