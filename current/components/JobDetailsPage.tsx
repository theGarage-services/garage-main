import { useState } from 'react';
import { ArrowLeft, Share2, Paperclip, Smile, MessageCircle, Save, MapPin, Building, Clock, Users, Star, ExternalLink, Briefcase, Crown, Zap, Lock, Calendar, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ProfileDropdown } from './ProfileDropdown';
import { JobStatusBadge } from './JobStatusBadge';

interface JobDetailsPageProps {
  onBack: () => void;
  user?: any;
  onNavigate?: (view: string) => void;
  onLogout?: () => void;
  onJobApplication?: (job: any, method: string) => void;
  onNavigateToQueueDetail?: (queue: any) => void;
  fromTracker?: boolean; // Track if navigated from tracker
  job?: {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    type: string;
    rank?: string;
    postedTime?: string;
    logo?: string;
    description: string;
    requirements?: string[];
    benefits?: string[];
    skills?: string[];
    companySize?: string;
    companyIndustry?: string;
    workModel?: string;
    experienceLevel?: string;
    companyRating?: number;
    totalEmployees?: string;
    status?: 'application-received' | 'not-considered' | 'under-consideration' | 'interview-stage' | 'rejected' | 'offer'; // Application status from tracker
    recruiter?: {
      id: string;
      name: string;
      title: string;
      company: string;
      avatar: string;
      yearsExperience: number;
      contactInfo?: {
        email: string;
        phone: string;
      };
    };
    applicationMethod?: 'manual' | 'quick-apply' | 'recruiter-consideration';
    isApplied?: boolean;
    isSaved?: boolean;
    hasApplied?: boolean;
    applied?: boolean;
  };
}

export function JobDetailsPage({ onBack, user, onNavigate, onLogout, fromTracker = false, job }: Readonly<JobDetailsPageProps>) {
  const isPremium = user?.isPremium || false;
  const [selectedTab, setSelectedTab] = useState<'description' | 'company'>('description');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'recruiter',
      name: 'Jane Doe',
      avatar: null,
      content: 'Thank you for your application! I\'d love to schedule a quick call to discuss this role. Are you available this week?',
      timestamp: '2 hours ago',
      type: 'message'
    },
    {
      id: 2,
      sender: 'user',
      name: 'You',
      content: 'Looking forward to hearing from you!',
      timestamp: '1 day ago',
      type: 'message'
    }
  ]);

  // Mock job data if none provided
  const jobData = job || {
    id: '1',
    title: 'Data Engineer',
    company: 'Technology & Innovation - RBC',
    location: 'Toronto, ON',
    salary: '$100k - $150k',
    type: 'FT/Permanent',
    numberOfCandidates: 2,
    applicationMethod: 'manual', // Add this property to fix the TypeScript error
    logo: null, // Add logo property to fix TypeScript error
    status: 'application-received', // Add status property
    postedTime: 'Posted 1 day ago', // Add postedTime property
    workModel: 'On-site', // Add workModel property
    experienceLevel: 'Senior Level', // Add experienceLevel property
    rank: 'Top 10%', // Add rank property
    companySize: '164,000', // Add companySize property
    companyIndustry: 'Financial Services', // Add companyIndustry property
    companyRating: 4.5, // Add companyRating property
    hasApplied: false, // Add hasApplied property
    isApplied: false, // Add isApplied property
    benefits: ['Health insurance', '401(k) matching', 'Flexible work hours', 'Professional development'], // Add benefits property
    recruiter: { // Add recruiter property
      id: 'rec-1',
      name: 'Jane Doe',
      title: 'Senior Technical Recruiter',
      company: 'RBC',
      avatar: null,
      linkedinUrl: 'https://linkedin.com/in/jane-doe',
      yearsExperience: 6,
      contactInfo: {
        email: 'jane.doe@rbc.com',
        phone: '+1 (555) 123-4567'
      }
    },
    description: `Founded in 2010, Company ABC is a pioneering technology firm at the forefront of artificial intelligence and machine learning. Based in San Francisco with a global presence, our mission is to revolutionise business operations across various sectors through innovative solutions. We pride ourselves on a vibrant workplace culture that promotes diversity, creativity, and professional growth. Join us in shaping the future of technology.

About the data engineer role
Data engineers at [your company] develop, construct, test, and maintain architectures such as databases and large-scale processing systems. They also clean, manage, and optimise data from multiple sources.

Responsibilities
• Design and implement scalable and robust data pipelines to support analytics and data processing needs.
• Develop and maintain database architectures, including data lakes and data warehouses.
• Ensure data quality and consistency through data cleaning, transformation, and validation processes.
• Collaborate with data scientists and analysts to gather requirements and deliver data solutions that support business objectives.
• Optimise data retrieval and develop dashboards and reports for various user needs.
• Implement data security and privacy policies to comply with legal and regulatory requirements.

Qualifications and experience
• Bachelor's degree in computer science, engineering, or a related field.
• Proven experience with SQL and database management systems.
• Proficiency in programming languages such as Python, Java, or Scala.
• Experience with big data technologies such as Hadoop, Spark, or Kafka.
• Strong analytical and problem-solving skills.
• Familiarity with data modelling and ETL processes.

Skills
• Database management
• Programming and scripting
• Data architecture and modelling
• Data integration and ETL processes
• Analytical and problem-solving skills`,
    requirements: ['Bachelor\'s degree in computer science', 'SQL experience', 'Python/Java/Scala', 'Big data technologies'],
    skills: ['Data Analysis', 'Python', 'SQL', 'ETL'],
    applied: true,
    hiringStatus: {
      stage: 'interviewing',
      positionsFilled: 0,
      totalPositions: 2,
      applicationsCount: 87,
      interviewCount: 6,
      plannedInterviewCount: 12,
      customMessage: "Great response! We're actively interviewing candidates and expect to make offers by end of month.",
      isVisible: true,
      lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
    }
  };


  const [scheduledInterviews] = useState([
    {
      id: 1,
      title: 'Initial Screen',
      format: 'Microsoft Teams',
      details: 'Join Meeting',
      meetingUrl: 'https://teams.microsoft.com/l/meetup-join/19%3a...',
      date: 'Fri 21, Feb 2025',
      time: '11am - 11:30am',
      status: 'confirmed',
      type: 'interview',
      scheduledBy: 'Jane Doe'
    },
    {
      id: 2,
      title: 'Technical Discussion',
      format: 'Zoom',
      details: 'Join Meeting',
      meetingUrl: 'https://zoom.us/j/123456789',
      date: 'Mon 24, Feb 2025',
      time: '2pm - 3pm',
      status: 'pending',
      type: 'chat',
      scheduledBy: 'Alex Johnson'
    }
  ]);



  const handleJoinCall = (meetingUrl: string) => {
    window.open(meetingUrl, '_blank');
  };

  const handleSaveNotes = () => {
    // Mock save functionality
    console.log('Saving notes:', notes);
  };

  const handleSendMessage = () => {
    // Allow chat if user is premium OR if job was auto-applied (recruiter reached out first)
    const canChat = isPremium || jobData.applicationMethod === 'recruiter-consideration';
    
    if (!canChat) {
      alert('Upgrade to Premium to send messages to recruiters!');
      return;
    }
    
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'user',
        name: user ? `${user.firstName} ${user.lastName}` : 'You',
        avatar: user?.avatar || null,
        content: message,
        timestamp: 'Just now',
        type: 'message'
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      // Mock recruiter response after a delay
      setTimeout(() => {
        const recruiterResponse = {
          id: messages.length + 2,
          sender: 'recruiter',
          name: 'Jane Doe',
          avatar: null,
          content: 'Thanks for reaching out! I\'ll review your message and get back to you shortly.',
          timestamp: 'Just now',
          type: 'message'
        };
        setMessages(prev => [...prev, recruiterResponse]);
      }, 2000);
    }
  };

  function onJobApplication(_jobData: {
    id: string; title: string; company: string; location: string; salary: string; type: string; rank?: string; postedTime?: string; logo?: string; description: string; requirements?: string[]; benefits?: string[]; skills?: string[]; companySize?: string; companyIndustry?: string; workModel?: string; experienceLevel?: string; companyRating?: number; totalEmployees?: string; status?: "application-received" | "not-considered" | "under-consideration" | "interview-stage" | "rejected" | "offer"; // Application status from tracker
    // Application status from tracker
    recruiter?: {
      id: string;
      name: string;
      title: string;
      company: string;
      avatar: string;
      yearsExperience: number;
      contactInfo?: {
        email: string;
        phone: string;
      };
    }; applicationMethod?: "manual" | "quick-apply" | "recruiter-consideration"; isApplied?: boolean; isSaved?: boolean; hasApplied?: boolean; applied?: boolean;
  } | {
    id: string; title: string; company: string; location: string; salary: string; type: string; numberOfCandidates: number; applicationMethod: "manual"; // Add this property to fix the TypeScript error
    logo: null; // Add logo property to fix TypeScript error
    status: "application-received"; // Add status property
    postedTime: string; // Add postedTime property
    workModel: string; // Add workModel property
    experienceLevel: string; // Add experienceLevel property
    rank: string; // Add rank property
    companySize: string; // Add companySize property
    companyIndustry: string; // Add companyIndustry property
    companyRating: number; // Add companyRating property
    hasApplied: false; // Add hasApplied property
    isApplied: false; // Add isApplied property
    benefits: string[]; // Add benefits property
    recruiter: { // Add recruiter property
      id: string; name: string; title: string; company: string; avatar: null; linkedinUrl: string; yearsExperience: number; contactInfo: { email: string; phone: string; };
    }; description: string; requirements: string[]; skills: string[]; applied: true; hiringStatus: {
      stage: string; positionsFilled: number; totalPositions: number; applicationsCount: number; interviewCount: number; plannedInterviewCount: number; customMessage: string; isVisible: boolean; lastUpdated: string; // 2 hours ago
    };
  }, _arg1: string) {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      {/* Modern Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-lg shadow-gray-900/5">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="rounded-full hover:bg-gray-100 flex items-center gap-2 px-3 h-10"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {fromTracker ? 'Back to Tracker' : 'Back'}
                </span>
              </Button>
              <button 
                onClick={() => onNavigate?.('homepage')}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <span className="text-xl font-medium">
                  <span className="text-gray-900">the</span>
                  <span className="text-[#ff6b35]">Garage</span>
                </span>
              </button>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              <ProfileDropdown 
                onNavigate={onNavigate || (() => {})}
                onLogout={onLogout}
                isPremium={isPremium}
                userName={user ? `${user.firstName} ${user.lastName}` : "User"}
                userEmail={user?.email || "user@example.com"}
                userAvatar={user?.avatar}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Job Card */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  {/* Company Logo */}
                  <div className="flex-shrink-0">
                    {jobData.logo ? (
                      <ImageWithFallback 
                        src={jobData.logo} 
                        alt={jobData.company}
                        className="w-16 h-16 rounded-xl object-cover border border-gray-200" 
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-[#ff6b35] to-[#ff8c42] rounded-xl flex items-center justify-center">
                        <Building className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {/* Job Title and Company */}
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-semibold text-gray-900">{jobData.title}</h1>
                        <JobStatusBadge job={jobData} isPremium={isPremium} size="lg" />
                      </div>
                      {/* Application Status from Tracker */}
                      {fromTracker && jobData.status && (
                        <div className="mb-3">
                          <Badge className={`text-sm px-3 py-1 ${
                            jobData.status === 'application-received' ? 'bg-blue-100 text-blue-800' :
                            jobData.status === 'not-considered' ? 'bg-gray-100 text-gray-800' :
                            jobData.status === 'under-consideration' ? 'bg-yellow-100 text-yellow-800' :
                            jobData.status === 'interview-stage' ? 'bg-green-100 text-green-800' :
                            jobData.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            jobData.status === 'offer' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            Status: {jobData.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                          </Badge>
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-gray-600 mb-3">
                        <button 
                          onClick={() => onNavigate?.('company-profile')}
                          className="flex items-center gap-1 hover:text-[#ff6b35] transition-colors"
                        >
                          <Building className="w-4 h-4" />
                          <span className="font-medium underline decoration-dotted">{jobData.company}</span>
                        </button>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{jobData.location}</span>
                        </div>
                        {jobData.postedTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{jobData.postedTime}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Job Details Badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                        {jobData.salary}
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        {jobData.type}
                      </Badge>
                      {jobData.workModel && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                          {jobData.workModel}
                        </Badge>
                      )}
                      {jobData.experienceLevel && (
                        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                          {jobData.experienceLevel}
                        </Badge>
                      )}
                      {jobData.rank && (
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                          {jobData.rank}
                        </Badge>
                      )}
                    </div>

                    {/* Company Info */}
                    {(jobData.companySize || jobData.companyIndustry || jobData.companyRating) && (
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                        {jobData.companySize && (
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{jobData.companySize}</span>
                          </div>
                        )}
                        {jobData.companyIndustry && (
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            <span>{jobData.companyIndustry}</span>
                          </div>
                        )}
                        {jobData.companyRating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{jobData.companyRating}/5.0</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => onJobApplication?.(jobData, 'quick-apply')}
                        className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white px-6"
                      >
                        {jobData.hasApplied || jobData.isApplied ? 'Applied ✓' : 'Quick Apply'}
                      </Button>
                      <Button variant="outline" className="border-gray-300">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Requirements Section */}
            {jobData.requirements && jobData.requirements.length > 0 && (
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
                  <div className="space-y-2">
                    {jobData.requirements.map((req, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#ff6b35] rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{req}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Benefits Section */}
            {jobData.benefits && jobData.benefits.length > 0 && (
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits & Perks</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {jobData.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Job Description */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex gap-2 border-b border-gray-200">
                    <button
                      onClick={() => setSelectedTab('description')}
                      className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                        selectedTab === 'description'
                          ? 'border-[#ff6b35] text-[#ff6b35]'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Job Description
                    </button>
                    <button
                      onClick={() => setSelectedTab('company')}
                      className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                        selectedTab === 'company'
                          ? 'border-[#ff6b35] text-[#ff6b35]'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      About Company
                    </button>
                  </div>
                </div>
                
                <div className="prose prose-gray max-w-none">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {selectedTab === 'description' 
                      ? jobData.description 
                      : `Learn more about ${jobData.company} and what makes them a great place to work. Join a team that values innovation, growth, and making a meaningful impact in ${jobData.companyIndustry || 'the industry'}.`
                    }
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recruiter Contact */}
            {jobData.recruiter && (
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recruiter Contact</h3>
                  <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={jobData.recruiter.avatar || ''} />
                      <AvatarFallback>{jobData.recruiter.name?.split(' ').map(n => n[0]).join('') || ''}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{jobData.recruiter.name}</div>
                      <div className="text-sm text-gray-600">{jobData.recruiter.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{jobData.recruiter.yearsExperience} years experience</div>
                    </div>
                    <div className="flex gap-2">
                      {jobData.recruiter.contactInfo?.email && (
                        <Button size="sm" variant="outline" className="text-xs">
                          Email
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="text-xs">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        LinkedIn
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Application Status */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
                <div className="space-y-3">
                  {jobData.hasApplied || jobData.isApplied ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-green-800">Applied</span>
                        {jobData.applicationMethod && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            {jobData.applicationMethod === 'quick-apply' ? 'Quick Apply' : 
                             jobData.applicationMethod === 'manual' ? 'Manual' : 
                             'Recruiter Selected'}
                          </Badge>
                        )}
                      </div>
                      {!isPremium && jobData.applicationMethod === 'recruiter-consideration' && (
                        <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-xs text-blue-700">
                            <MessageCircle className="w-3 h-3 inline mr-1" />
                            <strong>Chat Enabled:</strong> This recruiter reached out to you first - you can message them even as a basic user!
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-600">Not Applied</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Scheduled Interviews & Chats */}
            {(jobData.hasApplied || jobData.isApplied) && scheduledInterviews.map((interview) => (
              <Card key={interview.id} className={`border shadow-sm ${
                interview.status === 'confirmed' 
                  ? 'bg-green-50 border-green-200' 
                  : interview.status === 'pending'
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-white border-gray-200'
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{interview.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${
                          interview.type === 'interview' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {interview.type === 'interview' ? 'Interview' : 'Chat Session'}
                        </Badge>
                        <Badge className={`text-xs ${
                          interview.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : interview.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {interview.status === 'confirmed' ? 'Confirmed' : 
                           interview.status === 'pending' ? 'Pending' : 'Scheduled'}
                        </Badge>
                      </div>
                    </div>
                    {interview.status === 'confirmed' && (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    )}
                    {interview.status === 'pending' && (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span className="font-medium">Format:</span>
                      <span>{interview.format}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Scheduled by:</span>
                      <span className="text-right">{interview.scheduledBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Date:</span>
                      <span>{interview.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Time:</span>
                      <span>{interview.time}</span>
                    </div>
                  </div>

                  {interview.status === 'confirmed' && (
                    <div className="space-y-2">
                      <Button 
                        onClick={() => handleJoinCall(interview.meetingUrl)}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Join {interview.format} Call
                      </Button>
                      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>Added to your theGarage calendar</span>
                      </div>
                      <p className="text-xs text-gray-500 text-center">
                        Click to join the meeting 5 minutes before start time
                      </p>
                    </div>
                  )}
                  
                  {interview.status === 'pending' && (
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        Waiting for recruiter confirmation. You'll receive a calendar invite once confirmed.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Recruiter Chat Section - Only for applied jobs */}
            {(jobData.hasApplied || jobData.isApplied) && (() => {
              // Determine if user can chat: Premium users can always chat, basic users can chat if auto-applied
              const canChat = isPremium || jobData.applicationMethod === 'recruiter-consideration';
              const isAutoApplied = jobData.applicationMethod === 'recruiter-consideration';
              
              return (
                <Card className={`shadow-lg relative overflow-hidden ${
                  canChat 
                    ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200' 
                    : 'bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200'
                }`}>
                  <div className="absolute top-2 right-2">
                    <Badge className={`text-white ${
                      canChat 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                        : 'bg-gradient-to-r from-[#ff6b35] to-[#ff8c42]'
                    }`}>
                      {canChat ? <CheckCircle className="w-3 h-3 mr-1" /> : <Crown className="w-3 h-3 mr-1" />}
                      {canChat ? 'Active' : 'Premium'}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        canChat 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                          : 'bg-gradient-to-r from-[#ff6b35] to-[#ff8c42]'
                      }`}>
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Chat with Recruiter</h3>
                        <p className="text-sm text-gray-600">
                          {canChat ? 'Connected with hiring team' : 'Direct communication with hiring team'}
                        </p>
                        {!isPremium && isAutoApplied && (
                          <p className="text-xs text-green-600 mt-1">
                            ✓ Chat enabled - Recruiter reached out to you
                          </p>
                        )}
                      </div>
                    </div>

                    {!canChat && (
                      <div className="bg-white/60 rounded-lg p-4 mb-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Zap className="w-4 h-4 text-[#ff6b35]" />
                            <span>Instant messaging with recruiters</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="w-4 h-4 text-[#ff6b35]" />
                            <span>Real-time interview scheduling</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Star className="w-4 h-4 text-[#ff6b35]" />
                            <span>Priority application status</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {!isPremium && isAutoApplied && (
                      <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-200">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-green-700">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span><strong>Special Access:</strong> This recruiter reached out to you first</span>
                          </div>
                          <p className="text-green-700 text-xs">
                            Basic users can chat when recruiters send consideration requests (auto-apply)
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Chat Messages */}
                    <div className={`space-y-3 max-h-60 overflow-y-auto mb-4 rounded-lg p-3 ${
                      canChat ? 'bg-white/80' : 'bg-white/60'
                    }`}>
                      {messages.map((msg) => (
                        <div key={msg.id} className={`${
                          msg.sender === 'user' ? 'ml-8' : ''
                        }`}>
                          <div className={`rounded-lg p-3 text-sm shadow-sm ${
                            msg.sender === 'user' 
                              ? 'bg-orange-50 text-orange-800' 
                              : 'bg-white text-gray-600'
                          }`}>
                            {msg.sender === 'recruiter' && (
                              <div className="flex items-center gap-2 mb-1">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={msg.avatar ?? jobData.recruiter?.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {msg.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-gray-500 font-medium">
                                  {msg.name} • {msg.timestamp}
                                </span>
                              </div>
                            )}
                            {msg.sender === 'user' && (
                              <span className="text-xs text-orange-600 block mb-1 font-medium">
                                {msg.name} • {msg.timestamp}
                              </span>
                            )}
                            <p>{msg.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="relative mb-4">
                      <div className={`border-2 rounded-lg px-4 py-3 flex items-center gap-3 backdrop-blur-sm ${
                        canChat 
                          ? 'border-green-200 bg-white/80' 
                          : 'border-orange-200 bg-white/80'
                      }`}>
                        <input
                          type="text"
                          placeholder={canChat ? "Type a message..." : "Type a message to the recruiter..."}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                          disabled={!canChat}
                        />
                        {!canChat && <Lock className="w-4 h-4 text-gray-400" />}
                        <Paperclip className="w-4 h-4 text-gray-400" />
                        <Smile className="w-4 h-4 text-gray-400" />
                      </div>
                      {!canChat && (
                        <div className="absolute -top-16 left-0 right-0 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] text-white text-sm px-4 py-3 rounded-lg shadow-lg border border-orange-300">
                          <div className="flex items-center gap-2">
                            <Crown className="w-4 h-4" />
                            <span>Upgrade to Premium to chat directly with recruiters and schedule interviews</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {canChat ? (
                      <Button 
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg disabled:opacity-50"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <Button 
                          onClick={() => alert('Upgrade to Premium to unlock direct chat with recruiters!')}
                          className="w-full bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#d4461f] text-white shadow-lg"
                        >
                          <Crown className="w-4 h-4 mr-2" />
                          Upgrade to Premium
                        </Button>
                        
                        {/* Pricing Info */}
                        <div className="p-3 bg-white/60 rounded-lg border border-orange-200">
                          <div className="text-center">
                            <div className="text-sm text-gray-600 mb-1">
                              Premium Plan - <span className="font-semibold text-[#ff6b35]">$19.99/month</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              Cancel anytime • 7-day free trial available
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })()}

            {/* Premium Chat Teaser for Non-Applied Jobs */}
            {!(jobData.hasApplied || jobData.isApplied) && (
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect with Recruiters</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Apply for this position to unlock direct chat with the hiring team
                    </p>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center justify-center gap-2">
                        <Crown className="w-4 h-4 text-purple-500" />
                        <span>Premium feature available after application</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                    >
                      Apply Now to Unlock Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes Section */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Notes</h3>
                <Textarea
                  placeholder="Add your thoughts about this position..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[120px] bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400 resize-none"
                />
                <Button 
                  onClick={handleSaveNotes}
                  className="mt-4 w-full bg-gray-900 hover:bg-gray-800 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Notes
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}