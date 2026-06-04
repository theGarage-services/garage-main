import { useState, useEffect, Key, ReactElement, ReactNode, JSXElementConstructor, ReactPortal } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScheduleInterviewSheet } from './ScheduleInterviewSheet';
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
  FileText,
  Github,
  Linkedin,
  BarChart3,
  StickyNote,
  Eye,
  Bookmark} from 'lucide-react';

interface RecruiterCandidateProfilePageProps {
  candidate: any;
  onBack: () => void;
  onNavigate?: (view: string) => void;
  onUpdateStatus?: (candidateId: string, status: string) => void;
  onScheduleInterview?: (candidate: any, interviewData: any) => void;
  onSendMessage?: (candidate: any) => void;
  onSaveNotes?: (candidateId: string, notes: any[]) => void;
  availableJobs?: any[];
  setSelectedCandidate?: (candidate: any) => void;
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
  // Handle null candidate case
  if (!candidate) {
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
            <h2 className="text-xl text-gray-900 mb-2">No Candidate Selected</h2>
            <p className="text-gray-600">Please select a candidate to view their profile.</p>
          </div>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState('overview');
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState('general');
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    if (candidate?.notes) {
      setNotes(candidate.notes);
    }
  }, [candidate]);

  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showInterviewDialog, setShowInterviewDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [newStatus, setNewStatus] = useState(candidate?.applicationStatus || 'under-review');
  const [messageContent, setMessageContent] = useState('');

  // Enhanced candidate data
  const enhancedCandidate = {
    id: candidate?.id || '1',
    name: candidate?.name || 'Sarah Chen',
    email: candidate?.email || 'sarah.chen@email.com',
    phone: candidate?.phone || '+1 (555) 123-4567',
    title: candidate?.title || 'Senior Software Engineer',
    currentCompany: candidate?.currentCompany || 'TechCorp Inc.',
    location: candidate?.location || 'Toronto, ON',
    experience: candidate?.experience || '5+ years',
    avatar: candidate?.avatar || 'SC',
    matchScore: candidate?.matchScore || 94,
    applicationStatus: candidate?.applicationStatus || 'under-review',
    appliedDate: candidate?.appliedDate || '2024-01-20',
    lastActivity: candidate?.lastActivity || '2 hours ago',
    salary: candidate?.salary || '$120,000 - $160,000',
    
    // Professional details
    summary: candidate?.summary || 'Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Passionate about building scalable applications and leading high-performing teams.',
    
    skills: candidate?.skills || ['React', 'TypeScript', 'Node.js', 'AWS', 'Python', 'PostgreSQL', 'Docker'],
    
    education: candidate?.education || [
      {
        degree: 'Bachelor of Computer Science',
        school: 'University of Toronto',
        year: '2020',
        gpa: '3.8/4.0'
      }
    ],
    
    experience_detailed: candidate?.experience_detailed || [
      {
        title: 'Senior Software Engineer',
        company: 'TechCorp Inc.',
        duration: 'Jan 2022 - Present',
        location: 'Toronto, ON',
        description: 'Led development of customer-facing web applications serving 100k+ users. Implemented microservices architecture reducing system latency by 40%.',
        achievements: [
          'Built and deployed 5 major features that increased user engagement by 25%',
          'Mentored 3 junior developers and conducted technical interviews',
          'Reduced application load time by 60% through optimization'
        ]
      },
      {
        title: 'Software Engineer',
        company: 'StartupXYZ',
        duration: 'Jun 2020 - Dec 2021',
        location: 'Vancouver, BC',
        description: 'Full-stack development of SaaS platform. Collaborated with product team to define technical requirements.',
        achievements: [
          'Developed core authentication and authorization system',
          'Implemented real-time chat functionality using WebSockets'
        ]
      }
    ],
    
    // theGarage specific metrics
    queueMetrics: candidate?.queueMetrics || {
      currentQueues: ['Senior Software Engineer', 'Full Stack Developer'],
      queueRankings: [2, 5],
      totalApplications: 47,
      responseRate: 68,
      interviewRate: 23,
      successfulPlacements: 3
    },
    
    // Hiring process
    hiringStages: candidate?.hiringStages || [
      { name: 'application-submitted', completed: true, date: '2024-01-20' },
      { name: 'under-review', completed: true, date: '2024-01-21' },
      { name: 'phone-screening', completed: false, date: null },
      { name: 'technical-interview', completed: false, date: null },
      { name: 'final-interview', completed: false, date: null },
      { name: 'reference-check', completed: false, date: null },
      { name: 'offer-extended', completed: false, date: null }
    ],
    
    // Social links
    socialLinks: candidate?.socialLinks || {
      linkedin: 'linkedin.com/in/sarahchen',
      github: 'github.com/sarahchen',
      portfolio: 'sarahchen.dev'
    },
    
    // Premium status
    isPremium: candidate?.isPremium || true,
    premiumTier: candidate?.premiumTier || 'Professional'
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
                    <Linkedin className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-600">{enhancedCandidate.socialLinks.linkedin}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Github className="w-4 h-4 text-gray-700" />
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
                          <span className="text-gray-900">{new Date(enhancedCandidate.appliedDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Activity:</span>
                          <span className="text-gray-900">{enhancedCandidate.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg text-gray-900 mb-3">Current Queues</h4>
                      <div className="space-y-2">
                        {enhancedCandidate.queueMetrics.currentQueues.map((queue: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined, index: Key | null | undefined) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                            <span className="text-sm text-gray-700">{queue}</span>
                            <Badge variant="outline" className="text-[#ff6b35] border-[#ff6b35]">
                              #{enhancedCandidate.queueMetrics.queueRankings[index as number]}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Skills */}
                <Card className="p-6">
                  <h3 className="text-xl text-gray-900 mb-4">Technical Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {enhancedCandidate.skills.map((skill: any, index: any) => (
                      <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </Card>

                {/* Hiring Progress */}
                <Card className="p-6">
                  <h3 className="text-xl text-gray-900 mb-6">Hiring Progress</h3>
                  <div className="space-y-4">
                    {enhancedCandidate.hiringStages.map((stage: { completed: any; name: string; date: string | number | Date; }, index: Key | null | undefined) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          stage.completed ? 'bg-green-500 text-white' : 
                          enhancedCandidate.applicationStatus === stage.name ? 'bg-[#ff6b35] text-white' :
                          'bg-gray-200 text-gray-400'
                        }`}>
                          {stage.completed ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <span className="text-xs font-medium">{(index as number) + 1}</span>
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
                  <div className="space-y-8">
                    {enhancedCandidate.experience_detailed.map((exp: { title: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; company: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; location: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; duration: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; description: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; achievements: any[]; }, index: Key | null | undefined) => (
                      <div key={index}>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">{exp.title}</h4>
                            <p className="text-[#ff6b35] font-medium">{exp.company}</p>
                            <p className="text-sm text-gray-600">{exp.location} • {exp.duration}</p>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{exp.description}</p>
                        
                        <div>
                          <h5 className="text-sm font-medium text-gray-900 mb-2">Key Achievements:</h5>
                          <ul className="list-disc list-inside space-y-1">
                            {exp.achievements.map((achievement: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined, i: Key | null | undefined) => (
                              <li key={i} className="text-sm text-gray-700">{achievement}</li>
                            ))}
                          </ul>
                        </div>
                        
                        {(index as number) < enhancedCandidate.experience_detailed.length - 1 && (
                          <Separator className="mt-8" />
                        )}
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl text-gray-900 mb-6">Education</h3>
                  <div className="space-y-4">
                    {enhancedCandidate.education.map((edu: { degree: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; school: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; year: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; gpa: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }, index: Key | null | undefined) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <GraduationCap className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                          <p className="text-gray-600">{edu.school}</p>
                          <p className="text-sm text-gray-500">{edu.year} • GPA: {edu.gpa}</p>
                        </div>
                      </div>
                    ))}
                  </div>
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
                    {notes.map((note: { id: Key | null | undefined; type: string; author: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; date: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; timestamp: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; content: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => (
                      <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                note.type === 'positive' ? 'border-green-500 text-green-700' :
                                note.type === 'concern' ? 'border-red-500 text-red-700' :
                                note.type === 'technical' ? 'border-blue-500 text-blue-700' :
                                note.type === 'interview' ? 'border-purple-500 text-purple-700' :
                                'border-gray-500 text-gray-700'
                              }`}
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
                  <div className="space-y-6">
                    {/* Mock timeline data */}
                    {[
                      { type: 'status', content: 'Status updated to Under Review', date: '2024-01-21', time: '2:30 PM', icon: Settings },
                      { type: 'note', content: 'Added interview note: "Strong technical background"', date: '2024-01-21', time: '1:15 PM', icon: StickyNote },
                      { type: 'application', content: 'Applied for Senior Software Engineer position', date: '2024-01-20', time: '4:45 PM', icon: FileText },
                      { type: 'profile', content: 'Profile viewed by Mike Chen', date: '2024-01-20', time: '10:20 AM', icon: Eye }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900">{item.content}</p>
                          <p className="text-sm text-gray-500">{item.date} at {item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="text-lg text-gray-900 mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Profile Completeness</span>
                          <span className="text-sm font-medium">95%</span>
                        </div>
                        <Progress value={95} className="h-2" />
                      </div>
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
                      {enhancedCandidate.queueMetrics.currentQueues.map((queue: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined, index: Key | null | undefined) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">{queue}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Rank</span>
                            <Badge className="bg-[#ff6b35] text-white">
                              #{enhancedCandidate.queueMetrics.queueRankings[index as number]}
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
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}