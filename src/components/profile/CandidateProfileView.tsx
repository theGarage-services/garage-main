import { Key, useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { 
  ArrowLeft,
  MessageCircle,
  Calendar,
  Send,
  Download,
  MapPin,
  Clock,
  Mail,
  Phone,
  Globe,
  Award,
  Code,
  Crown,
  CheckCircle,
  ExternalLink,
  Zap
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface Achievement {
  name: string;
  description?: string;
}

interface Technology {
  name: string;
  level?: string;
}

interface Skill {
  name: string;
  level: number;
}

interface Education {
  degree: string;
  school: string;
  location: string;
  graduation: string;
  gpa: string | number;
  relevant: string[] | string;
}

interface Project {
  name: string;
  github?: string;
  live?: string;
  description: string;
  technologies: string[];
}

interface Certification {
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
}

interface Experience {
  title: string;
  company: string;
  location: string;
  duration: string;
  description: string;
  achievements: Achievement[];
  technologies: Technology[];
}

interface CandidateProfileViewProps {
  candidate: any;
  onBack: () => void;
  onStartChat: (candidate: any) => void;
  onScheduleChat: (candidate: any, scheduleData: any) => void;
  onSendConsideration: (candidate: any, jobId: string, message: string) => void;
  availableJobs?: any[];
}

export function CandidateProfileView({ 
  candidate, 
  onBack, 
  onStartChat, 
  onScheduleChat, 
  onSendConsideration,
  availableJobs = []
}: Readonly<CandidateProfileViewProps>) {
  const [showConsiderationDialog, setShowConsiderationDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [considerationMessage, setConsiderationMessage] = useState('');
  const [selectedJob, setSelectedJob] = useState('');
  const [scheduleData, setScheduleData] = useState({
    date: '',
    time: '',
    duration: '30',
    type: 'video',
    message: '',
    location: '',
    meetingLink: '',
    meetingPlatform: 'zoom'
  });

  // Enhanced candidate data with full profile information from backend
  const enhancedCandidate = {
    ...candidate,
    // Contact Information (from User model)
    email: candidate.user?.email || candidate.email || '',
    phone: candidate.phone || '',
    
    // Social Links (now stored in backend)
    linkedin: candidate.linkedin || '',
    github: candidate.github || '',
    portfolio: candidate.portfolio || '',
    website: candidate.website || '',
    
    // Professional Summary (bio from CandidateProfile)
    summary: candidate.bio || '',
    
    // Detailed Experience (from work_history JSON field)
    detailedExperience: candidate.work_history || [],
    
    // Education (from education JSON field)
    education: candidate.education || [],
    
    // Projects (now stored in backend)
    projects: candidate.projects || [],
    
    // Skills (converted from comma-separated string to array)
    // Backend stores: skills = "Python, SQL, React"
    // Frontend needs: skills array for display
    skillCategories: candidate.skills ? {
      'Skills': candidate.skills.split(',').map((skill: string) => ({
        name: skill.trim(),
        level: 80 // Default level since backend doesn't store levels
      }))
    } : { 'Skills': [] },

    // Certifications (now stored in backend)
    certifications: candidate.certifications || [],
    
    // theGarage specific data
    queueMetrics: candidate.queueMetrics || {
      currentQueues: ['Senior Software Engineer', 'Full Stack Developer', 'React Developer'],
      queueRankings: [2, 5, 1], // Rankings in respective queues
      totalApplications: 47,
      responseRate: 68,
      interviewRate: 23,
      successfulPlacements: 3
    },
    
    // Premium features
    premiumStatus: candidate.premiumStatus || {
      isPremium: true,
      tier: 'Professional',
      features: ['Priority Queue Placement', 'Direct Recruiter Chat', 'Advanced Analytics', 'Resume Optimization'],
      since: 'March 2024'
    }
  };

  const handleSendConsideration = () => {
    if (selectedJob && considerationMessage.trim()) {
      onSendConsideration(enhancedCandidate, selectedJob, considerationMessage);
      setShowConsiderationDialog(false);
      setConsiderationMessage('');
      setSelectedJob('');
    }
  };

  const handleScheduleChat = () => {
    if (scheduleData.date && scheduleData.time) {
      onScheduleChat(enhancedCandidate, scheduleData);
      setShowScheduleDialog(false);
      setScheduleData({
        date: '',
        time: '',
        duration: '30',
        type: 'video',
        message: '',
        location: '',
        meetingLink: '',
        meetingPlatform: 'zoom'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-gray-600 hover:text-[#ff6b35]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Candidates
          </Button>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35] hover:text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Resume
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Info Card */}
            <Card className="p-6">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarFallback className="bg-[#ff6b35] text-white text-2xl">
                      {enhancedCandidate.avatar}
                    </AvatarFallback>
                  </Avatar>
                  {enhancedCandidate.premiumStatus?.isPremium && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                
                <h1 className="text-2xl text-gray-900 mb-2">{enhancedCandidate.name}</h1>
                <p className="text-lg text-gray-600 mb-2">{enhancedCandidate.title}</p>
                <p className="text-gray-500 mb-4">{enhancedCandidate.company}</p>
                
                {enhancedCandidate.premiumStatus?.isPremium && (
                  <Badge className="bg-yellow-100 text-yellow-800 mb-4">
                    <Crown className="w-3 h-3 mr-1" />
                    {enhancedCandidate.premiumStatus.tier} Member
                  </Badge>
                )}
                
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {enhancedCandidate.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {typeof enhancedCandidate.experience === 'string' ? enhancedCandidate.experience : '5+ years'}
                  </div>
                </div>

                <div className="text-right mb-4">
                  <div className="text-3xl font-semibold text-[#ff6b35] mb-1">
                    {enhancedCandidate.matchScore || 94}%
                  </div>
                  <div className="text-sm text-gray-500">Match Score</div>
                  <Progress value={enhancedCandidate.matchScore || 94} className="w-full h-2 mt-2" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={() => onStartChat(enhancedCandidate)}
                  className="w-full bg-[#ff6b35] hover:bg-[#e55a2b] text-white"
                  disabled={!enhancedCandidate.premiumStatus?.isPremium}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start Chat
                  {!enhancedCandidate.premiumStatus?.isPremium && (
                    <Crown className="w-4 h-4 ml-2" />
                  )}
                </Button>
                
                <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      disabled={!enhancedCandidate.premiumStatus?.isPremium}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Chat
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Schedule Chat with {enhancedCandidate.name}</DialogTitle>
                      <DialogDescription>
                        Choose a date and time to schedule a chat with this candidate.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Date</Label>
                          <input
                            type="date"
                            value={scheduleData.date}
                            onChange={(e) => setScheduleData(prev => ({ ...prev, date: e.target.value }))}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div>
                          <Label>Time</Label>
                          <input
                            type="time"
                            value={scheduleData.time}
                            onChange={(e) => setScheduleData(prev => ({ ...prev, time: e.target.value }))}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Duration</Label>
                          <Select value={scheduleData.duration} onValueChange={(value: any) => setScheduleData(prev => ({ ...prev, duration: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="15">15 minutes</SelectItem>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="45">45 minutes</SelectItem>
                              <SelectItem value="60">1 hour</SelectItem>
                              <SelectItem value="90">90 minutes</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Type</Label>
                          <Select value={scheduleData.type} onValueChange={(value: any) => setScheduleData(prev => ({ ...prev, type: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="video">Video Call</SelectItem>
                              <SelectItem value="phone">Phone Call</SelectItem>
                              <SelectItem value="in-person">In Person</SelectItem>
                              <SelectItem value="chat">Text Chat</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      {/* Location/Meeting Details */}
                      {scheduleData.type === 'in-person' && (
                        <div>
                          <Label>Location</Label>
                          <Input
                            placeholder="Enter meeting location..."
                            value={scheduleData.location}
                            onChange={(e) => setScheduleData(prev => ({ ...prev, location: e.target.value }))}
                          />
                        </div>
                      )}
                      
                      {scheduleData.type === 'video' && (
                        <div className="space-y-4">
                          <div>
                            <Label>Meeting Platform</Label>
                            <Select value={scheduleData.meetingPlatform} onValueChange={(value: any) => setScheduleData(prev => ({ ...prev, meetingPlatform: value }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="zoom">Zoom</SelectItem>
                                <SelectItem value="teams">Microsoft Teams</SelectItem>
                                <SelectItem value="meet">Google Meet</SelectItem>
                                <SelectItem value="webex">Cisco Webex</SelectItem>
                                <SelectItem value="custom">Custom Link</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {scheduleData.meetingPlatform === 'custom' && (
                            <div>
                              <Label>Meeting Link</Label>
                              <Input
                                placeholder="https://..."
                                value={scheduleData.meetingLink}
                                onChange={(e) => setScheduleData(prev => ({ ...prev, meetingLink: e.target.value }))}
                              />
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div>
                        <Label>Message (Optional)</Label>
                        <Textarea
                          placeholder="Add a message about the chat purpose..."
                          value={scheduleData.message}
                          onChange={(e) => setScheduleData(prev => ({ ...prev, message: e.target.value }))}
                          rows={3}
                        />
                      </div>
                      
                      <Button 
                        onClick={handleScheduleChat}
                        className="w-full bg-[#ff6b35] hover:bg-[#e55a2b] text-white"
                        disabled={!scheduleData.date || !scheduleData.time}
                      >
                        Schedule Chat
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={showConsiderationDialog} onOpenChange={setShowConsiderationDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full border-blue-500 text-blue-600 hover:bg-blue-50">
                      <Send className="w-4 h-4 mr-2" />
                      Send Consideration
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Job Consideration</DialogTitle>
                      <DialogDescription>
                        Send a personalized job consideration request to this candidate.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Select Job Position</Label>
                        <Select value={selectedJob} onValueChange={setSelectedJob}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a job position..." />
                          </SelectTrigger>
                          <SelectContent>
                            {availableJobs.map((job) => (
                              <SelectItem key={job.id} value={job.id}>
                                {job.title} - {job.department}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Personal Message</Label>
                        <Textarea
                          placeholder="Hi [Name], I came across your profile and believe you'd be a great fit for our [Position] role. I'd love to discuss this opportunity with you..."
                          value={considerationMessage}
                          onChange={(e) => setConsiderationMessage(e.target.value)}
                          rows={5}
                        />
                      </div>
                      
                      <Button 
                        onClick={handleSendConsideration}
                        className="w-full bg-[#ff6b35] hover:bg-[#e55a2b] text-white"
                        disabled={!selectedJob || !considerationMessage.trim()}
                      >
                        Send Consideration Request
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{enhancedCandidate.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{enhancedCandidate.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-blue-600">{enhancedCandidate.website}</span>
                </div>
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-blue-600">{enhancedCandidate.linkedin}</span>
                </div>
              </div>
            </Card>

            {/* theGarage Queue Metrics */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#ff6b35]" />
                theGarage Metrics
              </h3>
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
                    <span className="text-sm text-gray-600">Interview Rate</span>
                    <span className="text-sm font-medium">{enhancedCandidate.queueMetrics.interviewRate}%</span>
                  </div>
                  <Progress value={enhancedCandidate.queueMetrics.interviewRate} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <div className="text-lg font-medium text-blue-700">{enhancedCandidate.queueMetrics.totalApplications}</div>
                    <div className="text-xs text-blue-600">Applications</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <div className="text-lg font-medium text-green-700">{enhancedCandidate.queueMetrics.successfulPlacements}</div>
                    <div className="text-xs text-green-600">Placements</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Professional Summary */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Professional Summary</h3>
              <p className="text-gray-700 leading-relaxed">{enhancedCandidate.summary}</p>
            </Card>

            {/* Experience */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-6">Work Experience</h3>
              <div className="space-y-6">
                {Array.isArray(enhancedCandidate.detailedExperience) && enhancedCandidate.detailedExperience.filter((exp: any): exp is Experience => exp).map((exp: Experience, index: Key | null | undefined) => (
                  <div key={index}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{exp.title}</h4>
                        <p className="text-[#ff6b35] font-medium">{exp.company}</p>
                        <p className="text-sm text-gray-600">{exp.location} • {exp.duration}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{exp.description}</p>
                    
                    <div className="mb-3">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Key Achievements:</h5>
                      <ul className="list-disc list-inside space-y-1">
                        {Array.isArray(exp.achievements) && exp.achievements.map((achievement: Achievement, i: Key | null | undefined) => (
                          <li key={i} className="text-sm text-gray-700">{achievement.name}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(exp.technologies) && exp.technologies.map((tech: Technology, i: Key | null | undefined) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tech.name}
                        </Badge>
                      ))}
                    </div>
                    
                    {(index as number) < enhancedCandidate.detailedExperience.length - 1 && (
                      <Separator className="mt-6" />
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Skills */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-6">Technical Skills</h3>
              <div className="space-y-6">
                {Object.entries(enhancedCandidate.skillCategories).map(([category, skills]) => (
                  <div key={category}>
                    <h4 className="font-medium text-gray-900 mb-3">{category}</h4>
                    <div className="space-y-3">
                      {Array.isArray(skills) && skills.map((skill: Skill, index: number) => (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-700">{skill.name}</span>
                            <span className="text-sm text-gray-500">{skill.level}%</span>
                          </div>
                          <Progress value={skill.level} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Education */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-6">Education</h3>
              {Array.isArray(enhancedCandidate.education) && enhancedCandidate.education.map((edu: Education, index: Key | null | undefined) => (
                <div key={index} className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                      <p className="text-[#ff6b35] font-medium">{edu.school}</p>
                      <p className="text-sm text-gray-600">{edu.location} • {edu.graduation}</p>
                    </div>
                    <Badge variant="secondary">GPA: {edu.gpa}</Badge>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600">Relevant Coursework: </span>
                    <span className="text-sm text-gray-700">{Array.isArray(edu.relevant) ? edu.relevant.join(', ') : edu.relevant}</span>
                  </div>
                </div>
              ))}
            </Card>

            {/* Projects */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-6">Projects</h3>
              <div className="space-y-4">
                {Array.isArray(enhancedCandidate.projects) && enhancedCandidate.projects.map((project: Project, index: Key | null | undefined) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{project.name}</h4>
                      <div className="flex gap-2">
                        {project.github && (
                          <Button size="sm" variant="outline" className="h-8 px-2">
                            <Code className="w-3 h-3" />
                          </Button>
                        )}
                        {project.live && (
                          <Button size="sm" variant="outline" className="h-8 px-2">
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(project.technologies) && project.technologies.map((tech: any, i: any) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Certifications */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-6">Certifications</h3>
              <div className="space-y-4">
                {Array.isArray(enhancedCandidate.certifications) && enhancedCandidate.certifications.map((cert: Certification, index: Key | null | undefined) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                    <Award className="w-8 h-8 text-green-600" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{cert.name}</h4>
                      <p className="text-sm text-gray-600">{cert.issuer} • {cert.date}</p>
                      <p className="text-xs text-gray-500">ID: {cert.credentialId}</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}