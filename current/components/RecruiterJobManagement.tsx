import { useState, Key, ReactElement, ReactNode, JSXElementConstructor, ReactPortal } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay, DialogPortal } from './ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { XIcon , 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Eye, 
  Users,
  DollarSign,
  MapPin,
  Clock,
  Calendar,
  Building2,
  Target,
  Briefcase,
  Save,
  X,
  Star,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Brain,
  Zap,
  User,
  ExternalLink,
  Download,
  Settings,
  Github,
  Linkedin,
  BarChart3,
  Activity,
  ArrowLeft
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScheduleInterviewSheet } from './ScheduleInterviewSheet';
import { AppHeader } from './AppHeader';
import { Avatar, AvatarFallback } from './ui/avatar';
import { JobResultsView } from './JobResultsView';
import { UpdateJobStatusModal } from './UpdateJobStatusModal';

interface RecruiterJobManagementProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
  user: any;
  onNavigateToCandidates?: (job: any) => void;
  setGlobalSelectedCandidate?: (candidate: any) => void;
}

export function RecruiterJobManagement({ onNavigate, onLogout, user, setGlobalSelectedCandidate }: Readonly<RecruiterJobManagementProps>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('active');
  const [currentView, setCurrentView] = useState<'list' | 'job-detail' | 'edit-job' | 'candidates' | 'results'>('list');
  const [editingJob, setEditingJob] = useState<any>(null);
  const [candidateTab, setCandidateTab] = useState<'ai-recommended' | 'manually-applied' | 'all-queue'>('ai-recommended');
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [showCandidateProfile, setShowCandidateProfile] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [statusUpdateCandidate, setStatusUpdateCandidate] = useState<any>(null);
  const [showInterviewSheet, setShowInterviewSheet] = useState(false);
  const [interviewCandidate, setInterviewCandidate] = useState<any>(null);
  
  // Create Job State
  
  // Job Status Update State (separate from candidate status)
  const [showJobStatusUpdate, setShowJobStatusUpdate] = useState(false);
  const [jobStatusUpdateTarget, setJobStatusUpdateTarget] = useState<any>(null);



  // Mock candidates data for all candidates in queue (including AI recommended)
  const allQueueCandidates = [
    // Top 5 AI-recommended candidates (best JD match, not necessarily top of queue)
    {
      id: 'candidate-1',
      name: 'Sarah Chen',
      title: 'Senior Software Engineer',
      location: 'Toronto, ON',
      experience: '6 years',
      queuePosition: 2,
      matchScore: 92,
      isAIRecommended: true,
      avatar: null,
      skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
      currentCompany: 'Tech Innovations Inc.',
      aiRecommendation: {
        reason: 'Strong technical background with 6+ years in full-stack development. Current experience with React and Node.js directly matches job requirements.',
        strengths: ['Technical leadership', 'Full-stack expertise', 'Cloud architecture'],
        concerns: []
      },
      applicationStatus: 'consideration-accepted',
      lastActivity: '2024-01-22',
      resume: 'sarah-chen-resume.pdf',
      joinedQueue: '2024-01-15'
    },
    {
      id: 'candidate-2',
      name: 'Marcus Johnson',
      title: 'Full Stack Developer',
      location: 'Vancouver, BC',
      experience: '5 years',
      queuePosition: 1,
      matchScore: 88,
      isAIRecommended: true,
      avatar: null,
      skills: ['JavaScript', 'Python', 'Docker', 'GCP'],
      currentCompany: 'StartupXYZ',
      aiRecommendation: {
        reason: 'Top performer in queue with proven track record in scalable applications. Strong problem-solving skills and team collaboration.',
        strengths: ['System design', 'Performance optimization', 'Agile methodology'],
        concerns: ['Limited TypeScript experience']
      },
      applicationStatus: 'pending-consideration',
      lastActivity: '2024-01-21',
      resume: 'marcus-johnson-resume.pdf',
      joinedQueue: '2024-01-10'
    },
    {
      id: 'candidate-3',
      name: 'Emma Rodriguez',
      title: 'Software Engineer',
      location: 'Montreal, QC',
      experience: '4 years',
      queuePosition: 5,
      matchScore: 85,
      isAIRecommended: true,
      avatar: null,
      skills: ['React', 'TypeScript', 'PostgreSQL', 'Redis'],
      currentCompany: 'FinTech Solutions',
      aiRecommendation: {
        reason: 'Rising talent with strong fundamentals. Excellent code quality and documentation practices. Shows high potential for growth.',
        strengths: ['Code quality', 'Documentation', 'Database design'],
        concerns: ['Less experience with cloud platforms']
      },
      applicationStatus: 'consideration-sent',
      lastActivity: '2024-01-20',
      resume: 'emma-rodriguez-resume.pdf',
      joinedQueue: '2024-01-08'
    },
    {
      id: 'candidate-4',
      name: 'David Kim',
      title: 'Senior Developer',
      location: 'Calgary, AB',
      experience: '7 years',
      queuePosition: 3,
      matchScore: 90,
      isAIRecommended: true,
      avatar: null,
      skills: ['Vue.js', 'Node.js', 'AWS', 'Kubernetes'],
      currentCompany: 'CloudFirst Corp',
      aiRecommendation: {
        reason: 'Extensive experience with modern web technologies and cloud infrastructure. Strong leadership potential and mentoring experience.',
        strengths: ['Cloud architecture', 'Team leadership', 'DevOps practices'],
        concerns: ['Vue.js vs React preference']
      },
      applicationStatus: 'pending-consideration',
      lastActivity: '2024-01-19',
      resume: 'david-kim-resume.pdf',
      joinedQueue: '2024-01-12'
    },
    {
      id: 'candidate-5',
      name: 'Lisa Wang',
      title: 'Software Developer',
      location: 'Ottawa, ON',
      experience: '5 years',
      queuePosition: 4,
      matchScore: 87,
      isAIRecommended: true,
      avatar: null,
      skills: ['React', 'GraphQL', 'MongoDB', 'Docker'],
      currentCompany: 'DataFlow Systems',
      aiRecommendation: {
        reason: 'Strong technical skills with modern stack experience. Excellent communication skills and cross-functional collaboration experience.',
        strengths: ['API design', 'Frontend architecture', 'Communication'],
        concerns: []
      },
      applicationStatus: 'pending-consideration',
      lastActivity: '2024-01-18',
      resume: 'lisa-wang-resume.pdf',
      joinedQueue: '2024-01-14'
    },
    // Additional queue members (not AI recommended but still in queue)
    {
      id: 'candidate-6',
      name: 'James Wilson',
      title: 'Software Engineer',
      location: 'Edmonton, AB',
      experience: '3 years',
      queuePosition: 6,
      matchScore: 75,
      isAIRecommended: false,
      avatar: null,
      skills: ['JavaScript', 'Angular', 'MySQL', 'PHP'],
      currentCompany: 'Regional Tech Co',
      applicationStatus: 'in-queue',
      lastActivity: '2024-01-17',
      resume: 'james-wilson-resume.pdf',
      joinedQueue: '2024-01-05'
    },
    {
      id: 'candidate-7',
      name: 'Michelle Zhang',
      title: 'Junior Developer',
      location: 'Winnipeg, MB',
      experience: '2 years',
      queuePosition: 7,
      matchScore: 70,
      isAIRecommended: false,
      avatar: null,
      skills: ['Python', 'Django', 'CSS', 'HTML'],
      currentCompany: 'Prairie Software',
      applicationStatus: 'in-queue',
      lastActivity: '2024-01-16',
      resume: 'michelle-zhang-resume.pdf',
      joinedQueue: '2024-01-03'
    },
    {
      id: 'candidate-8',
      name: 'Ryan O\'Connor',
      title: 'Backend Developer',
      location: 'Halifax, NS',
      experience: '4 years',
      queuePosition: 8,
      matchScore: 73,
      isAIRecommended: false,
      avatar: null,
      skills: ['Java', 'Spring Boot', 'Oracle', 'Microservices'],
      currentCompany: 'Atlantic Systems',
      applicationStatus: 'in-queue',
      lastActivity: '2024-01-15',
      resume: 'ryan-oconnor-resume.pdf',
      joinedQueue: '2024-01-01'
    },
    {
      id: 'candidate-9',
      name: 'Taylor Smith',
      title: 'Full Stack Developer',
      location: 'Saskatoon, SK',
      experience: '3 years',
      queuePosition: 9,
      matchScore: 68,
      isAIRecommended: false,
      avatar: null,
      skills: ['C#', '.NET', 'SQL Server', 'Blazor'],
      currentCompany: 'Prairie Development',
      applicationStatus: 'in-queue',
      lastActivity: '2024-01-14',
      resume: 'taylor-smith-resume.pdf',
      joinedQueue: '2023-12-28'
    },
    {
      id: 'candidate-10',
      name: 'Alex Patel',
      title: 'Software Developer',
      location: 'St. John\'s, NL',
      experience: '1 year',
      queuePosition: 10,
      matchScore: 62,
      isAIRecommended: false,
      avatar: null,
      skills: ['JavaScript', 'React', 'Express', 'MongoDB'],
      currentCompany: 'Newfoundland Tech',
      applicationStatus: 'in-queue',
      lastActivity: '2024-01-13',
      resume: 'alex-patel-resume.pdf',
      joinedQueue: '2023-12-25'
    }
  ];

  // Mock candidates data
  const mockCandidates = {
    'ai-recommended': allQueueCandidates.filter(c => c.isAIRecommended),
    'all-queue': allQueueCandidates.sort((a, b) => {
      // Show AI recommended first, then sort by queue position
      if (a.isAIRecommended && !b.isAIRecommended) return -1;
      if (!a.isAIRecommended && b.isAIRecommended) return 1;
      if (a.isAIRecommended && b.isAIRecommended) return b.matchScore - a.matchScore;
      return a.queuePosition - b.queuePosition;
    }),
    'manually-applied': [
      {
        id: 'manual-1',
        name: 'Alex Thompson',
        title: 'Senior Software Engineer',
        location: 'Halifax, NS',
        experience: '5 years',
        avatar: null,
        skills: ['React', 'Node.js', 'TypeScript', 'GraphQL', 'PostgreSQL', 'Docker', 'AWS'],
        currentCompany: 'Atlantic Innovation Hub',
        applicationDate: '2024-01-15',
        applicationStatus: 'application-submitted', // Kanban status
        lastActivity: '2024-01-22',
        resumeId: 'resume-alex-001',
        profileId: 'profile-alex-001',
        // theGarage profile details
        theGarageProfile: {
          joinedDate: '2023-09-15',
          isPremium: true,
          completedProjects: ['E-commerce Platform', 'Data Analytics Dashboard', 'Mobile API Gateway'],
          education: [
            { degree: 'B.Sc. Computer Science', school: 'Dalhousie University', year: '2019' },
            { degree: 'AWS Solutions Architect Certification', school: 'Amazon Web Services', year: '2022' }
          ],
          workExperience: [
            {
              company: 'Atlantic Innovation Hub',
              role: 'Senior Software Engineer',
              duration: '2022 - Present',
              description: 'Lead full-stack development of enterprise applications, mentoring junior developers'
            },
            {
              company: 'Maritime Tech Solutions',
              role: 'Software Developer',
              duration: '2019 - 2022',
              description: 'Developed scalable web applications using React and Node.js ecosystem'
            }
          ],
          certifications: ['AWS Solutions Architect', 'React Professional', 'Agile Practitioner'],
          portfolioUrl: 'https://alexthompson.dev',
          githubUrl: 'https://github.com/alexthompson',
          linkedinUrl: 'https://linkedin.com/in/alexthompson-dev'
        },
        hiringProcess: {
          currentStage: 'application-submitted',
          stages: [
            { name: 'application-submitted', completed: true, date: '2024-01-15' },
            { name: 'under-review', completed: false, date: null },
            { name: 'phone-screening', completed: false, date: null },
            { name: 'technical-interview', completed: false, date: null },
            { name: 'final-interview', completed: false, date: null },
            { name: 'reference-check', completed: false, date: null },
            { name: 'offer-extended', completed: false, date: null },
            { name: 'offer-accepted', completed: false, date: null }
          ]
        }
      },
      {
        id: 'manual-2',
        name: 'Jennifer Liu',
        title: 'Full Stack Developer',
        location: 'Winnipeg, MB',
        experience: '4 years',
        avatar: null,
        skills: ['Python', 'Django', 'React', 'PostgreSQL', 'Redis', 'Kubernetes', 'GCP'],
        currentCompany: 'Prairie Tech Innovations',
        applicationDate: '2024-01-14',
        applicationStatus: 'phone-screening',
        lastActivity: '2024-01-21',
        resumeId: 'resume-jennifer-002',
        profileId: 'profile-jennifer-002',
        theGarageProfile: {
          joinedDate: '2023-07-20',
          isPremium: false,
          completedProjects: ['Healthcare Management System', 'Financial Dashboard', 'IoT Monitoring Platform'],
          education: [
            { degree: 'B.Eng. Software Engineering', school: 'University of Manitoba', year: '2020' },
            { degree: 'Google Cloud Professional Developer', school: 'Google Cloud', year: '2023' }
          ],
          workExperience: [
            {
              company: 'Prairie Tech Innovations',
              role: 'Full Stack Developer',
              duration: '2021 - Present',
              description: 'Developing healthcare software solutions with Python/Django backend and React frontend'
            },
            {
              company: 'Manitoba Software Co.',
              role: 'Junior Developer',
              duration: '2020 - 2021',
              description: 'Built web applications and RESTful APIs for local businesses'
            }
          ],
          certifications: ['Google Cloud Professional Developer', 'Django Certified Developer'],
          portfolioUrl: 'https://jenniferliu.ca',
          githubUrl: 'https://github.com/jenniferliu',
          linkedinUrl: 'https://linkedin.com/in/jennifer-liu-dev'
        },
        hiringProcess: {
          currentStage: 'phone-screening',
          stages: [
            { name: 'application-submitted', completed: true, date: '2024-01-14' },
            { name: 'under-review', completed: true, date: '2024-01-16' },
            { name: 'phone-screening', completed: true, date: '2024-01-19' },
            { name: 'technical-interview', completed: false, date: null },
            { name: 'final-interview', completed: false, date: null },
            { name: 'reference-check', completed: false, date: null },
            { name: 'offer-extended', completed: false, date: null },
            { name: 'offer-accepted', completed: false, date: null }
          ]
        }
      },
      {
        id: 'manual-3',
        name: 'Robert Martinez',
        title: 'Senior Full Stack Developer',
        location: 'Saskatoon, SK',
        experience: '6 years',
        avatar: null,
        skills: ['Angular', 'Spring Boot', 'Java', 'MySQL', 'Docker', 'Jenkins', 'Azure'],
        currentCompany: 'Prairie Development Corp',
        applicationDate: '2024-01-13',
        applicationStatus: 'technical-interview',
        lastActivity: '2024-01-20',
        resumeId: 'resume-robert-003',
        profileId: 'profile-robert-003',
        theGarageProfile: {
          joinedDate: '2023-11-10',
          isPremium: true,
          completedProjects: ['Enterprise CRM System', 'Supply Chain Management', 'Real-time Analytics Platform'],
          education: [
            { degree: 'M.Sc. Computer Science', school: 'University of Saskatchewan', year: '2018' },
            { degree: 'B.Sc. Software Systems', school: 'University of Saskatchewan', year: '2016' }
          ],
          workExperience: [
            {
              company: 'Prairie Development Corp',
              role: 'Senior Full Stack Developer',
              duration: '2020 - Present',
              description: 'Architecting and developing enterprise-level applications with Angular and Spring Boot'
            },
            {
              company: 'Saskatchewan Tech Hub',
              role: 'Software Developer',
              duration: '2018 - 2020',
              description: 'Full-stack development with focus on scalable web applications'
            }
          ],
          certifications: ['Azure Solutions Architect', 'Spring Professional', 'Angular Expert'],
          portfolioUrl: 'https://robertmartinez.tech',
          githubUrl: 'https://github.com/robertmartinez',
          linkedinUrl: 'https://linkedin.com/in/robert-martinez-dev'
        },
        hiringProcess: {
          currentStage: 'technical-interview',
          stages: [
            { name: 'application-submitted', completed: true, date: '2024-01-13' },
            { name: 'under-review', completed: true, date: '2024-01-14' },
            { name: 'phone-screening', completed: true, date: '2024-01-17' },
            { name: 'technical-interview', completed: true, date: '2024-01-20' },
            { name: 'final-interview', completed: false, date: null },
            { name: 'reference-check', completed: false, date: null },
            { name: 'offer-extended', completed: false, date: null },
            { name: 'offer-accepted', completed: false, date: null }
          ]
        }
      }
    ]
  };

  // Mock job postings data
  const jobPostings = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'Toronto, ON',
      type: 'Full-time',
      salary: '$120,000 - $160,000',
      experience: '5+ years',
      status: 'active',
      postedDate: '2024-01-20',
      applicants: 156,
      views: 2847,
      interviews: 12,
      offers: 0,
      queue: 'Senior Software Engineers',
      queueId: 'senior-software-engineers',
      numberOfCandidates: 3,
      description: 'We are seeking a talented Senior Software Engineer to join our growing engineering team...',
      requirements: [
        '5+ years of software development experience',
        'Proficiency in React, Node.js, and TypeScript',
        'Experience with cloud platforms (AWS, GCP, or Azure)',
        'Strong problem-solving and communication skills'
      ],
      responsibilities: [
        'Design and develop scalable web applications',
        'Collaborate with cross-functional teams',
        'Mentor junior developers',
        'Participate in code reviews and technical discussions'
      ],
      hiringStatus: {
        stage: 'interviewing',
        positionsFilled: 0,
        totalPositions: 3,
        applicationsCount: 156,
        interviewCount: 12,
        plannedInterviewCount: 20,
        customMessage: "We're excited by the strong candidate pool and moving quickly through our interview process!",
        isVisible: true,
        lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() // 3 hours ago
      }
    },
    {
      id: '2',
      title: 'Product Manager',
      department: 'Product',
      location: 'Vancouver, BC',
      type: 'Full-time',
      salary: '$110,000 - $140,000',
      experience: '3+ years',
      status: 'active',
      postedDate: '2024-01-15',
      applicants: 89,
      views: 1923,
      interviews: 8,
      offers: 0,
      queue: 'Product Managers',
      queueId: 'product-managers',
      numberOfCandidates: 2,
      description: 'Join our product team to drive innovation and strategy for our core platform...',
      requirements: [
        '3+ years of product management experience',
        'Experience with agile development methodologies',
        'Strong analytical and data-driven decision making',
        'Excellent communication and leadership skills'
      ],
      responsibilities: [
        'Define product roadmap and strategy',
        'Work closely with engineering and design teams',
        'Analyze user feedback and market trends',
        'Coordinate product launches and releases'
      ],
      hiringStatus: {
        stage: 'reviewing',
        positionsFilled: 0,
        totalPositions: 2,
        applicationsCount: 89,
        interviewCount: 8,
        plannedInterviewCount: 0,
        customMessage: '',
        isVisible: true,
        lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
      }
    },
    {
      id: '3',
      title: 'UX Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      salary: '$90,000 - $120,000',
      experience: '4+ years',
      status: 'paused',
      postedDate: '2024-01-10',
      applicants: 234,
      views: 3156,
      interviews: 15,
      offers: 0,
      queue: 'UX/UI Designers',
      queueId: 'ux-ui-designers',
      numberOfCandidates: 1,
      description: 'We are looking for a creative UX Designer to enhance our user experience...',
      requirements: [
        '4+ years of UX/UI design experience',
        'Proficiency in Figma, Sketch, or similar tools',
        'Experience with user research and testing',
        'Portfolio demonstrating strong design skills'
      ],
      responsibilities: [
        'Create user-centered design solutions',
        'Conduct user research and usability testing',
        'Collaborate with product and engineering teams',
        'Maintain design system consistency'
      ],
      hiringStatus: {
        stage: 'open',
        positionsFilled: 0,
        totalPositions: 1,
        applicationsCount: 234,
        interviewCount: 15,
        plannedInterviewCount: 0,
        customMessage: 'This position is currently paused. We will resume hiring in Q2.',
        isVisible: true,
        lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
      }
    }
  ];



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredJobs = jobPostings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'active' && job.status === 'active') ||
                      (activeTab === 'draft' && job.status === 'draft') ||
                      (activeTab === 'closed' && (job.status === 'closed' || job.status === 'paused'));
    
    return matchesSearch && matchesStatus && matchesTab;
  });


  const handleViewJob = (job: any) => {
    setSelectedJob(job);
    setCurrentView('job-detail');
  };

  const handleEditJob = (job: any) => {
    setEditingJob({ ...job });
    setCurrentView('edit-job');
  };

  const handleSaveJob = () => {
    // Here you would typically save the job data to your backend
    console.log('Saving job:', editingJob);
    setCurrentView('job-detail');
    setSelectedJob(editingJob);
    setEditingJob(null);
  };

  const handleViewCandidates = (job: any) => {
    setSelectedJob(job);
    setCurrentView('candidates');
  };

  const handleViewResults = (job: any) => {
    setSelectedJob(job);
    setCurrentView('results');
  };

  const handleSendConsiderationRequest = (candidate: any) => {
    // Here you would send the consideration request
    console.log('Sending consideration request to:', candidate.name);
    // Update candidate status to show request has been sent
    candidate.applicationStatus = 'consideration-sent';
    
    // Show user feedback
    alert(`✉️ Consideration request sent to ${candidate.name}!\n\nThe candidate will receive a notification and can review your job posting. Once they accept, you'll be able to message them, update their status, and schedule interviews.`);
    
    // Force re-render by updating the component
    setSelectedJob({...selectedJob});
  };

  const handleAcceptConsiderationRequest = (candidate: any) => {
    // Simulate candidate accepting the consideration request
    console.log('Candidate accepted consideration request:', candidate.name);
    candidate.applicationStatus = 'consideration-accepted';
    
    // Show user feedback
    alert(`🎉 ${candidate.name} has accepted your consideration request!\n\nYou can now:\n• Send messages directly to the candidate\n• Update their hiring status\n• Schedule interviews\n• Manage them through your full hiring workflow`);
    
    // Force re-render
    setSelectedJob({...selectedJob});
  };

  const handleScheduleInterview = (candidate: any) => {
    // Open interview sheet instead of navigating
    setInterviewCandidate(candidate);
    setShowInterviewSheet(true);
  };

  const handleViewProfile = (candidate: any) => {
    setSelectedCandidate(candidate);
    setGlobalSelectedCandidate?.(candidate);
    onNavigate?.('candidate-profile');
  };

  // CANDIDATE Status Update (for individual candidates in hiring pipeline)
  const handleUpdateStatus = (candidate: any) => {
    setStatusUpdateCandidate(candidate);
    setShowCandidateProfile(false); // Close candidate profile modal first to avoid z-index conflicts
    setShowStatusUpdate(true);
  };

  const handleStatusChange = (candidateId: string, newStatus: string) => {
    // Update the candidate's status in the mockCandidates data
    // This would normally make an API call to update the database
    console.log(`Updating candidate ${candidateId} status to: ${newStatus}`);
    setShowStatusUpdate(false);
    setStatusUpdateCandidate(null);
    alert(`Candidate status updated to: ${newStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`);
  };

  // JOB Status Update (for overall job posting hiring progress)
  const handleUpdateJobStatus = (job: any) => {
    setJobStatusUpdateTarget(job);
    setShowJobStatusUpdate(true);
  };

  const handleJobStatusUpdate = (updatedStatus: any) => {
    // Update the job's hiring status
    // This would normally make an API call to update the database
    console.log('Updated job hiring status:', updatedStatus);
    
    if (jobStatusUpdateTarget) {
      jobStatusUpdateTarget.hiringStatus = updatedStatus;
    }
    
    setShowJobStatusUpdate(false);
    setJobStatusUpdateTarget(null);
  };

  const handleSendMessage = (candidate: any) => {
    alert(`Opening message thread with ${candidate.name}`);
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedJob(null);
    setEditingJob(null);
  };

  // Render different views based on currentView
  if (currentView === 'results' && selectedJob) {
    return (
      <>
        <JobResultsView 
          job={selectedJob}
          onBack={handleBackToList}
          onViewProfile={(candidate) => {
            setSelectedCandidate(candidate);
            setGlobalSelectedCandidate?.(candidate);
            onNavigate?.('candidate-profile');
          }}
        />
        
        {/* Job Status Update Modal (for overall job posting status) */}
        {showJobStatusUpdate && jobStatusUpdateTarget && (
          <UpdateJobStatusModal
            job={jobStatusUpdateTarget}
            onClose={() => {
              setShowJobStatusUpdate(false);
              setJobStatusUpdateTarget(null);
            }}
            onUpdate={handleJobStatusUpdate}
          />
        )}
      </>
    );
  }

  if (currentView === 'job-detail' && selectedJob) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="outline" 
              onClick={handleBackToList}
              className="text-gray-900 hover:text-[#ff6b35] hover:border-[#ff6b35] border-2"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Back to Job List</span>
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => handleEditJob(selectedJob)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Job
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleViewCandidates(selectedJob)}
              >
                <Users className="w-4 h-4 mr-2" />
                View Candidates
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleUpdateJobStatus(selectedJob)}
                className="border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35] hover:text-white"
              >
                <Activity className="w-4 h-4 mr-2" />
                Update Job Status
              </Button>
              <Button 
                onClick={() => handleViewResults(selectedJob)}
                className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#d4461f] text-white"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Results
              </Button>
            </div>
          </div>

          <Card className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl text-gray-900 mb-2">{selectedJob.title}</h1>
                <div className="flex items-center gap-4 text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {selectedJob.department}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {selectedJob.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {selectedJob.salary}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[#ff6b35] border-[#ff6b35]">
                    📋 Queue: {selectedJob.queue}
                  </Badge>
                  <Badge variant="outline" className="text-blue-600 border-blue-300">
                    {allQueueCandidates.length} candidates in queue
                  </Badge>
                </div>
              </div>
              <Badge className={getStatusColor(selectedJob.status)}>
                {selectedJob.status}
              </Badge>
            </div>

            {/* Job Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl text-blue-600 mb-1">{selectedJob.applicants}</div>
                <div className="text-sm text-blue-600">Applicants</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl text-green-600 mb-1">{selectedJob.views}</div>
                <div className="text-sm text-green-600">Views</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl text-purple-600 mb-1">{selectedJob.interviews}</div>
                <div className="text-sm text-purple-600">Interviews</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl text-orange-600 mb-1">{selectedJob.offers}</div>
                <div className="text-sm text-orange-600">Offers</div>
              </div>
            </div>

            {/* Job Description */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl text-gray-900 mb-3">Job Description</h3>
                <p className="text-gray-700 leading-relaxed">{selectedJob.description}</p>
              </div>

              <div>
                <h3 className="text-xl text-gray-900 mb-3">Requirements</h3>
                <ul className="space-y-2">
                  {selectedJob.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl text-gray-900 mb-3">Responsibilities</h3>
                <ul className="space-y-2">
                  {selectedJob.responsibilities.map((resp: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <Target className="w-5 h-5 text-[#ff6b35] mt-0.5 flex-shrink-0" />
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Job Status Update Modal (for overall job posting status) */}
        {showJobStatusUpdate && jobStatusUpdateTarget && (
          <UpdateJobStatusModal
            job={jobStatusUpdateTarget}
            onClose={() => {
              setShowJobStatusUpdate(false);
              setJobStatusUpdateTarget(null);
            }}
            onUpdate={handleJobStatusUpdate}
          />
        )}
      </div>
    );
  }

  if (currentView === 'edit-job' && editingJob) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="outline" 
              onClick={() => setCurrentView('job-detail')}
              className="text-gray-900 hover:text-[#ff6b35] hover:border-[#ff6b35] border-2"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Back to Job Details</span>
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setCurrentView('job-detail')}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleSaveJob}
                className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#d4461f] text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>

          <Card className="p-8">
            <h1 className="text-3xl text-gray-900 mb-6">Edit Job Posting</h1>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="edit-title">Job Title</Label>
                  <Input
                    id="edit-title"
                    value={editingJob.title}
                    onChange={(e) => setEditingJob({...editingJob, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-department">Department</Label>
                  <Input
                    id="edit-department"
                    value={editingJob.department}
                    onChange={(e) => setEditingJob({...editingJob, department: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    value={editingJob.location}
                    onChange={(e) => setEditingJob({...editingJob, location: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-salary">Salary</Label>
                  <Input
                    id="edit-salary"
                    value={editingJob.salary}
                    onChange={(e) => setEditingJob({...editingJob, salary: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-description">Job Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingJob.description}
                  onChange={(e) => setEditingJob({...editingJob, description: e.target.value})}
                  rows={6}
                />
              </div>

              <div>
                <Label htmlFor="edit-requirements">Requirements (one per line)</Label>
                <Textarea
                  id="edit-requirements"
                  value={editingJob.requirements.join('\n')}
                  onChange={(e) => setEditingJob({...editingJob, requirements: e.target.value.split('\n').filter(Boolean)})}
                  rows={6}
                />
              </div>

              <div>
                <Label htmlFor="edit-responsibilities">Responsibilities (one per line)</Label>
                <Textarea
                  id="edit-responsibilities"
                  value={editingJob.responsibilities.join('\n')}
                  onChange={(e) => setEditingJob({...editingJob, responsibilities: e.target.value.split('\n').filter(Boolean)})}
                  rows={6}
                />
              </div>
            </div>
          </Card>
        </div>
        {/* Job Status Update Modal (for overall job posting status) */}
        {showJobStatusUpdate && jobStatusUpdateTarget && (
          <UpdateJobStatusModal
            job={jobStatusUpdateTarget}
            onClose={() => {
              setShowJobStatusUpdate(false);
              setJobStatusUpdateTarget(null);
            }}
            onUpdate={handleJobStatusUpdate}
          />
        )}
      </div>
    );
  }

  if (currentView === 'candidates' && selectedJob) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Button 
                variant="outline" 
                onClick={handleBackToList}
                className="mb-4 text-gray-900 hover:text-[#ff6b35] hover:border-[#ff6b35] border-2"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="font-medium">Back to Job List</span>
              </Button>
              <h1 className="text-3xl text-gray-900 mb-2">{selectedJob.title}</h1>
              <p className="text-gray-600 mb-3">Candidates for this position</p>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="outline" className="text-[#ff6b35] border-[#ff6b35]">
                  📋 Queue: {selectedJob.queue}
                </Badge>
                <Badge variant="outline" className="text-blue-600 border-blue-300">
                  {allQueueCandidates.length} total candidates
                </Badge>
                <Badge variant="outline" className="text-green-600 border-green-300">
                  {mockCandidates['ai-recommended'].length} AI recommended
                </Badge>
                <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                  {allQueueCandidates.filter(c => c.applicationStatus === 'consideration-sent').length} requests sent
                </Badge>
                <Badge variant="outline" className="text-green-600 border-green-300">
                  {allQueueCandidates.filter(c => c.applicationStatus === 'consideration-accepted').length} requests accepted
                </Badge>
                <Badge variant="outline" className="text-orange-600 border-orange-300">
                  {mockCandidates['manually-applied'].length} direct applications
                </Badge>
              </div>
            </div>
            <Badge className={getStatusColor(selectedJob.status)}>
              {selectedJob.status}
            </Badge>
          </div>

          <Tabs value={candidateTab} onValueChange={(value: any) => setCandidateTab(value)} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
              <TabsTrigger value="ai-recommended" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                AI Recommended ({mockCandidates['ai-recommended'].length})
              </TabsTrigger>
              <TabsTrigger value="all-queue" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                All Queue ({mockCandidates['all-queue'].length})
              </TabsTrigger>
              <TabsTrigger value="manually-applied" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Manually Applied ({mockCandidates['manually-applied'].length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai-recommended">
              <div className="space-y-4">
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg text-blue-900">AI-Powered Candidate Recommendations</h3>
                  </div>
                  <p className="text-blue-700 text-sm mb-2">
                    Our AI has analyzed your job requirements and identified the top 5 candidates from the queue who best match your criteria.
                  </p>
                  <p className="text-blue-600 text-xs">
                    💡 <strong>Workflow:</strong> Send consideration requests → Candidates review and respond → Once accepted, you can message, update status, and schedule interviews
                  </p>
                </Card>

                {mockCandidates['ai-recommended'].map((candidate) => (
                  <Card key={candidate.id} className="p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl text-gray-900">{candidate.name}</h3>
                            <Badge className="bg-green-100 text-green-800">
                              #{candidate.queuePosition} in Queue
                            </Badge>
                            <Badge className="bg-blue-100 text-blue-800">
                              {candidate.matchScore}% Match
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-2">{candidate.title} at {candidate.currentCompany}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                            <span>📍 {candidate.location}</span>
                            <span>📅 {candidate.experience} experience</span>
                          </div>
                          {candidate.applicationStatus === 'consideration-accepted' && (
                            <div className="text-sm text-green-700 mb-2 flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              Consideration request accepted - Ready for hiring process
                            </div>
                          )}
                          {candidate.applicationStatus === 'consideration-sent' && (
                            <div className="text-sm text-yellow-700 mb-2 flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Consideration request sent - Awaiting candidate response
                            </div>
                          )}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {candidate.skills.map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <Badge className={
                          candidate.applicationStatus === 'consideration-sent' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : candidate.applicationStatus === 'consideration-accepted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }>
                          {candidate.applicationStatus === 'consideration-sent' 
                            ? 'Request Sent' 
                            : candidate.applicationStatus === 'consideration-accepted'
                            ? 'Request Accepted'
                            : 'Available'}
                        </Badge>
                      </div>
                    </div>

                    {/* AI Recommendation */}
                    {candidate.aiRecommendation && (
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-blue-900">AI Recommendation</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{candidate.aiRecommendation.reason}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm text-green-700 mb-1 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Strengths
                            </h4>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {candidate.aiRecommendation.strengths.map((strength, idx) => (
                                <li key={idx}>• {strength}</li>
                              ))}
                            </ul>
                          </div>
                          {candidate.aiRecommendation.concerns.length > 0 && (
                            <div>
                              <h4 className="text-sm text-orange-700 mb-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Considerations
                              </h4>
                              <ul className="text-xs text-gray-600 space-y-1">
                                {candidate.aiRecommendation.concerns.map((concern, idx) => (
                                  <li key={idx}>• {concern}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Last activity: {new Date(candidate.lastActivity).toLocaleDateString()}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewProfile(candidate)}
                          className="text-orange-600 border-orange-300 hover:bg-orange-50"
                        >
                          <User className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Resume
                        </Button>
                        
                        {/* Different actions based on application status */}
                        {candidate.applicationStatus === 'consideration-accepted' ? (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleSendMessage(candidate)}
                            >
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Message
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => handleUpdateStatus(candidate)}
                              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                            >
                              <Settings className="w-4 h-4 mr-2" />
                              Update Status
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleScheduleInterview(candidate)}
                              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                            >
                              <Calendar className="w-4 h-4 mr-2" />
                              Schedule Interview
                            </Button>
                          </>
                        ) : candidate.applicationStatus === 'consideration-sent' ? (
                          <>
                            <Button size="sm" variant="outline" disabled>
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Message
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="bg-yellow-50 text-yellow-700 border-yellow-300"
                              disabled
                            >
                              <Clock className="w-4 h-4 mr-2" />
                              Awaiting Response
                            </Button>
                            {/* Demo button to simulate acceptance */}
                            <Button 
                              size="sm"
                              onClick={() => handleAcceptConsiderationRequest(candidate)}
                              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs"
                              variant="outline"
                            >
                              ✓ Demo: Accept Request
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="outline" disabled>
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Message
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleSendConsiderationRequest(candidate)}
                              className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#d4461f] text-white"
                            >
                              <Star className="w-4 h-4 mr-2" />
                              Send Consideration Request
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="all-queue">
              <div className="space-y-4">
                <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg text-purple-900">All Candidates in Queue: {selectedJob.queue}</h3>
                  </div>
                  <p className="text-purple-700 text-sm mb-2">
                    Complete list of all candidates in this queue. AI-recommended candidates (shown first) are ranked by JD match score, not queue position.
                  </p>
                  <p className="text-purple-600 text-xs mb-2">
                    💡 <strong>Consideration Requests:</strong> Send requests to candidates → They review and decide → Once accepted, full hiring workflow available
                  </p>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
                      <span className="text-purple-700">AI Recommended (Top JD Matches)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gray-300 rounded"></div>
                      <span className="text-purple-700">Other Queue Members (By Queue Position)</span>
                    </div>
                  </div>
                </Card>

                {mockCandidates['all-queue'].map((candidate) => (
                  <Card key={candidate.id} className={`p-6 hover:shadow-lg transition-all duration-300 ${
                    candidate.isAIRecommended ? 'border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50/50 to-purple-50/50' : ''
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl text-gray-900">{candidate.name}</h3>
                            <Badge className="bg-gray-100 text-gray-800">
                              #{candidate.queuePosition} in Queue
                            </Badge>
                            {candidate.isAIRecommended && (
                              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                🎯 AI Match: {candidate.matchScore}%
                              </Badge>
                            )}
                            {candidate.isAIRecommended && (
                              <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                Top JD Match
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">{candidate.title} at {candidate.currentCompany}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                            <span>📍 {candidate.location}</span>
                            <span>📅 {candidate.experience} experience</span>
                            <span>🕒 Joined queue: {new Date(candidate.joinedQueue).toLocaleDateString()}</span>
                          </div>
                          {candidate.applicationStatus === 'consideration-accepted' && (
                            <div className="text-sm text-green-700 mb-2 flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              Consideration request accepted - Ready for hiring process
                            </div>
                          )}
                          {candidate.applicationStatus === 'consideration-sent' && (
                            <div className="text-sm text-yellow-700 mb-2 flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Consideration request sent - Awaiting candidate response
                            </div>
                          )}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {candidate.skills.map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <Badge className={
                          candidate.applicationStatus === 'consideration-sent' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : candidate.applicationStatus === 'consideration-accepted'
                            ? 'bg-green-100 text-green-800'
                            : candidate.applicationStatus === 'in-queue'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }>
                          {candidate.applicationStatus === 'consideration-sent' 
                            ? 'Request Sent' 
                            : candidate.applicationStatus === 'consideration-accepted'
                            ? 'Request Accepted'
                            : candidate.applicationStatus === 'in-queue' 
                            ? 'In Queue' 
                            : 'Available'}
                        </Badge>
                      </div>
                    </div>

                    {/* AI Recommendation for recommended candidates */}
                    {candidate.isAIRecommended && candidate.aiRecommendation && (
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-4 border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-blue-900">AI Recommendation - Why this candidate ranks high for your JD</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{candidate.aiRecommendation.reason}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm text-green-700 mb-1 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Strengths
                            </h4>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {candidate.aiRecommendation.strengths.map((strength, idx) => (
                                <li key={idx}>• {strength}</li>
                              ))}
                            </ul>
                          </div>
                          {candidate.aiRecommendation.concerns.length > 0 && (
                            <div>
                              <h4 className="text-sm text-orange-700 mb-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Considerations
                              </h4>
                              <ul className="text-xs text-gray-600 space-y-1">
                                {candidate.aiRecommendation.concerns.map((concern, idx) => (
                                  <li key={idx}>• {concern}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Last activity: {new Date(candidate.lastActivity).toLocaleDateString()}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewProfile(candidate)}
                          className="text-orange-600 border-orange-300 hover:bg-orange-50"
                        >
                          <User className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Resume
                        </Button>
                        
                        {/* Different actions based on application status */}
                        {candidate.applicationStatus === 'consideration-accepted' ? (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleSendMessage(candidate)}
                            >
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Message
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => handleUpdateStatus(candidate)}
                              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                            >
                              <Settings className="w-4 h-4 mr-2" />
                              Update Status
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleScheduleInterview(candidate)}
                              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                            >
                              <Calendar className="w-4 h-4 mr-2" />
                              Schedule Interview
                            </Button>
                          </>
                        ) : candidate.applicationStatus === 'consideration-sent' ? (
                          <>
                            <Button size="sm" variant="outline" disabled>
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Message
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="bg-yellow-50 text-yellow-700 border-yellow-300"
                              disabled
                            >
                              <Clock className="w-4 h-4 mr-2" />
                              Awaiting Response
                            </Button>
                            {/* Demo button to simulate acceptance */}
                            <Button 
                              size="sm"
                              onClick={() => handleAcceptConsiderationRequest(candidate)}
                              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs"
                              variant="outline"
                            >
                              ✓ Demo: Accept Request
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="outline" disabled>
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Message
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleSendConsiderationRequest(candidate)}
                              className={candidate.isAIRecommended 
                                ? "bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#d4461f] text-white"
                                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                              }
                            >
                              <Star className="w-4 h-4 mr-2" />
                              Send Consideration Request
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="manually-applied">
              <div className="space-y-4">
                <Card className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-5 h-5 text-orange-600" />
                    <h3 className="text-lg text-orange-900">theGarage Direct Applications</h3>
                    <Badge className="bg-orange-100 text-orange-800 text-xs">Internal Platform Only</Badge>
                  </div>
                  <p className="text-orange-700 text-sm">
                    Candidates who have directly applied to this position through theGarage platform. These candidates have complete profiles and are ready for review.
                  </p>
                </Card>

                {mockCandidates['manually-applied'].map((candidate) => (
                  <Card key={candidate.id} className="p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-xl text-gray-900 mb-1">{candidate.name}</h3>
                          <p className="text-gray-600 mb-2">{candidate.title} at {candidate.currentCompany}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <span>���� {candidate.location}</span>
                            <span>📅 {candidate.experience} experience</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {candidate.skills.map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <Badge className={
                          candidate.applicationStatus === 'scheduled-interview' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }>
                          {candidate.applicationStatus === 'scheduled-interview' ? 'Interview Scheduled' : 'Under Review'}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          Applied: {new Date(candidate.applicationDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewProfile(candidate)}
                          className="text-orange-600 border-orange-300 hover:bg-orange-50"
                        >
                          <User className="w-4 h-4 mr-2" />
                          View Full Profile
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Resume
                        </Button>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleSendMessage(candidate)}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleUpdateStatus(candidate)}
                          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Update Status
                        </Button>
                        {(candidate.applicationStatus === 'technical-interview' || candidate.applicationStatus === 'final-interview') ? (
                          <Button 
                            size="sm"
                            onClick={() => handleScheduleInterview(candidate)}
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule Interview
                          </Button>
                        ) : candidate.applicationStatus === 'application-submitted' ? (
                          <Button 
                            size="sm"
                            onClick={() => handleStatusChange(candidate.id, 'under-review')}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Start Review
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Detailed Candidate Profile Modal */}
        <Dialog open={showCandidateProfile} onOpenChange={setShowCandidateProfile}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedCandidate && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>{selectedCandidate.name.split(' ').map((n: any[]) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        {selectedCandidate.name}
                        {selectedCandidate.theGarageProfile?.isPremium && (
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs">
                            ⭐ Premium
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{selectedCandidate.title}</p>
                    </div>
                  </DialogTitle>
                  <DialogDescription>
                    Complete candidate profile information including experience, skills, education, and theGarage activity details.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg mb-3">Contact Information</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Location:</strong> {selectedCandidate.location}</p>
                        <p><strong>Experience:</strong> {selectedCandidate.experience}</p>
                        <p><strong>Current Company:</strong> {selectedCandidate.currentCompany}</p>
                        <div className="flex gap-2 mt-3">
                          {selectedCandidate.theGarageProfile?.portfolioUrl && (
                            <Button size="sm" variant="outline">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Portfolio
                            </Button>
                          )}
                          {selectedCandidate.theGarageProfile?.githubUrl && (
                            <Button size="sm" variant="outline">
                              <Github className="w-4 h-4 mr-2" />
                              GitHub
                            </Button>
                          )}
                          {selectedCandidate.theGarageProfile?.linkedinUrl && (
                            <Button size="sm" variant="outline">
                              <Linkedin className="w-4 h-4 mr-2" />
                              LinkedIn
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg mb-3">theGarage Activity</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Member Since:</strong> {selectedCandidate.theGarageProfile ? new Date(selectedCandidate.theGarageProfile.joinedDate).toLocaleDateString() : 'N/A'}</p>
                        <p><strong>Account Type:</strong> {selectedCandidate.theGarageProfile?.isPremium ? 'Premium' : 'Basic'}</p>
                        <p><strong>Completed Projects:</strong> {selectedCandidate.theGarageProfile?.completedProjects?.length || 0}</p>
                        <p><strong>Certifications:</strong> {selectedCandidate.theGarageProfile?.certifications?.length || 0}</p>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="text-lg mb-3">Technical Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.skills?.map((skill: any, index: any) => (
                        <Badge key={index} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Work Experience */}
                  {selectedCandidate.theGarageProfile?.workExperience && (
                    <div>
                      <h3 className="text-lg mb-3">Work Experience</h3>
                      <div className="space-y-4">
                        {selectedCandidate.theGarageProfile.workExperience.map((job: { role: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; duration: any; company: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; description: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }, index: Key | null | undefined) => (
                          <Card key={index} className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold">{job.role}</h4>
                              <Badge variant="outline">{job.duration}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{job.company}</p>
                            <p className="text-sm">{job.description}</p>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {selectedCandidate.theGarageProfile?.education && (
                    <div>
                      <h3 className="text-lg mb-3">Education & Certifications</h3>
                      <div className="space-y-2">
                        {selectedCandidate.theGarageProfile.education.map((edu: { degree: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; school: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; year: any; }, index: Key | null | undefined) => (
                          <Card key={index} className="p-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold text-sm">{edu.degree}</p>
                                <p className="text-sm text-gray-600">{edu.school}</p>
                              </div>
                              <Badge variant="outline">{edu.year}</Badge>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {selectedCandidate.theGarageProfile?.completedProjects && (
                    <div>
                      <h3 className="text-lg mb-3">Recent Projects</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedCandidate.theGarageProfile.completedProjects.map((project: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined, index: Key | null | undefined) => (
                          <Card key={index} className="p-3">
                            <p className="font-semibold text-sm">{project}</p>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Status Update Modal - Custom implementation with high z-index overlay */}
        <Dialog open={showStatusUpdate} onOpenChange={setShowStatusUpdate}>
          <DialogPortal>
            <DialogOverlay className="z-[150]" />
            <DialogPrimitive.Content className="bg-white fixed top-[50%] left-[50%] z-[200] grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200">
              {statusUpdateCandidate && (
                <>
                  <DialogPrimitive.Close className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none">
                    <XIcon className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </DialogPrimitive.Close>
                  
                  <div className="flex flex-col gap-2 text-center sm:text-left">
                    <DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight">
                      Update Hiring Status
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Description className="text-sm text-slate-500">
                      Update the hiring process status for {statusUpdateCandidate.name}. This will be reflected in their job tracking dashboard.
                    </DialogPrimitive.Description>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Current Status</Label>
                      <Badge className="mt-1 block w-fit">
                        {statusUpdateCandidate.applicationStatus?.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      </Badge>
                    </div>

                    <div>
                      <Label>Select New Status</Label>
                      <Select onValueChange={(value: string) => handleStatusChange(statusUpdateCandidate.id, value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose new status" />
                        </SelectTrigger>
                        <SelectContent position="popper" className="z-[99999]" sideOffset={5}>
                          <SelectItem value="application-submitted">Application Submitted</SelectItem>
                          <SelectItem value="under-review">Under Review</SelectItem>
                          <SelectItem value="phone-screening">Phone Screening</SelectItem>
                          <SelectItem value="technical-interview">Technical Interview</SelectItem>
                          <SelectItem value="final-interview">Final Interview</SelectItem>
                          <SelectItem value="reference-check">Reference Check</SelectItem>
                          <SelectItem value="offer-extended">Offer Extended</SelectItem>
                          <SelectItem value="offer-accepted">Offer Accepted (Hired)</SelectItem>
                          <SelectItem value="offer-rejected">Offer Rejected by Candidate</SelectItem>
                          <SelectItem value="rejected">Rejected by Recruiter</SelectItem>
                          <SelectItem value="withdrawn">Withdrawn</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="text-xs text-gray-500">
                      <p><strong>Note:</strong> This update will be reflected in the candidate's job tracking dashboard.</p>
                    </div>
                  </div>
                </>
              )}
            </DialogPrimitive.Content>
          </DialogPortal>
        </Dialog>

        {/* Job Status Update Modal (for overall job posting status) */}
        {showJobStatusUpdate && jobStatusUpdateTarget && (
          <UpdateJobStatusModal
            job={jobStatusUpdateTarget}
            onClose={() => {
              setShowJobStatusUpdate(false);
              setJobStatusUpdateTarget(null);
            }}
            onUpdate={handleJobStatusUpdate}
          />
        )}
      </div>
    );
  }

  // Default list view
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100">
      {/* Header */}
      <AppHeader
        userRole="recruiter"
        user={user}
        currentView="job-management"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      {/* Page Title & Controls Section */}
      <div className="pt-20 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] text-white pb-8 shadow-lg">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold mb-2">Job Management</h1>
              <p className="text-white/90">Create, manage, and track your job postings</p>
            </div>
            
            <Button 
              onClick={() => onNavigate('job-posting')}
              className="bg-white text-[#ff6b35] hover:bg-white/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Job Posting
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">

        {/* Filters and Search */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search job postings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-gray-600">
              {filteredJobs.length} job{filteredJobs.length === 1 ? '' : 's'} found
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
            <TabsTrigger value="active">Active ({jobPostings.filter(j => j.status === 'active').length})</TabsTrigger>
            <TabsTrigger value="draft">Draft (0)</TabsTrigger>
            <TabsTrigger value="closed">Closed/Paused ({jobPostings.filter(j => j.status === 'paused' || j.status === 'closed').length})</TabsTrigger>
            <TabsTrigger value="all">All ({jobPostings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="p-6 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => handleViewJob(job)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl text-gray-900 hover:text-[#ff6b35] transition-colors">{job.title}</h3>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-6 text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {job.department}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {job.salary}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.experience}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2 group-hover:text-gray-800 transition-colors">
                        {job.description}
                        <span className="text-[#ff6b35] ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          Click to view full job description →
                        </span>
                      </p>
                    </div>
                    
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl text-blue-600 mb-1">{job.applicants}</div>
                      <div className="text-xs text-blue-600">Applicants</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl text-green-600 mb-1">{job.views}</div>
                      <div className="text-xs text-green-600">Views</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl text-purple-600 mb-1">{job.interviews}</div>
                      <div className="text-xs text-purple-600">Interviews</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl text-orange-600 mb-1">{job.offers}</div>
                      <div className="text-xs text-orange-600">Offers</div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Posted {new Date(job.postedDate).toLocaleDateString()}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewJob(job)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditJob(job)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e: { stopPropagation: () => void; }) => {
                          e.stopPropagation();
                          handleUpdateJobStatus(job);
                        }}
                        className="border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35] hover:text-white"
                      >
                        <Activity className="w-4 h-4 mr-2" />
                        Status
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewCandidates(job)}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Candidates ({job.applicants})
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleViewResults(job)}
                        className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#d4461f] text-white"
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Results
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              
              {filteredJobs.length === 0 && (
                <Card className="p-12 text-center">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg text-gray-900 mb-2">No job postings found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchQuery || filterStatus !== 'all' 
                      ? 'Try adjusting your search or filters'
                      : 'Get started by creating your first job posting'
                    }
                  </p>
                  {!searchQuery && filterStatus === 'all' && (
                    <Button 
                      onClick={() => onNavigate?.('job-posting')}
                      className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#e55a2b] hover:to-[#d4461f] text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Job
                    </Button>
                  )}
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Schedule Interview Sheet */}
      <ScheduleInterviewSheet
        open={showInterviewSheet}
        onOpenChange={setShowInterviewSheet}
        candidate={interviewCandidate}
        onScheduled={(interviewData) => {
          // Save interview to localStorage for Interview Calendar
          const existingInterviews = JSON.parse(localStorage.getItem('scheduledInterviews') || '[]');
          existingInterviews.push(interviewData);
          localStorage.setItem('scheduledInterviews', JSON.stringify(existingInterviews));
          
          // Update candidate status to "Interview Scheduled" in their record
          if (interviewCandidate) {
            const candidateUpdate = {
              ...interviewCandidate,
              status: 'Interview Scheduled',
              interviewScheduled: true,
              lastInterviewDate: interviewData.date,
              lastInterviewTime: interviewData.time,
              updatedAt: new Date().toISOString()
            };
            
            // Store updated candidate (in a real app, this would be an API call)
            const existingCandidates = JSON.parse(localStorage.getItem('candidates') || '[]');
            const updatedCandidates = existingCandidates.map((c: any) => 
              c.id === interviewCandidate.id ? candidateUpdate : c
            );
            if (!existingCandidates.some((c: any) => c.id === interviewCandidate.id)) {
              updatedCandidates.push(candidateUpdate);
            }
            localStorage.setItem('candidates', JSON.stringify(updatedCandidates));
          }
          
          // Create notification for the candidate
          const notification = {
            id: `notification-${Date.now()}`,
            type: 'interview',
            title: 'Interview Scheduled',
            message: `Interview scheduled for ${interviewData.date} at ${interviewData.time}`,
            candidateName: interviewCandidate?.name,
            candidateId: interviewCandidate?.id,
            interviewId: interviewData.id,
            timestamp: new Date().toISOString(),
            read: false
          };
          
          const existingNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
          existingNotifications.unshift(notification);
          localStorage.setItem('notifications', JSON.stringify(existingNotifications));
          
          console.log('Interview scheduled successfully:', interviewData);
        }}
        onExpandToFullscreen={(candidate) => {
          setShowInterviewSheet(false);
          setSelectedCandidate(candidate);
          setGlobalSelectedCandidate?.(candidate);
          onNavigate?.('interview-calendar');
        }}
      />

      {/* Job Status Update Modal (for overall job posting status) */}
      {showJobStatusUpdate && jobStatusUpdateTarget && (
        <UpdateJobStatusModal
          job={jobStatusUpdateTarget}
          onClose={() => {
            setShowJobStatusUpdate(false);
            setJobStatusUpdateTarget(null);
          }}
          onUpdate={handleJobStatusUpdate}
        />
      )}
    </div>
  );
}
