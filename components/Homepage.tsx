import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Checkbox } from './ui/checkbox';
import { ChevronDown, MapPin, Briefcase, DollarSign, Building, Clock, Share2, Heart, Zap, CheckCircle, Users, Star, FileText, X, Crown, BarChart3, Filter, Check, Shield, ShieldCheck, UserMinus } from 'lucide-react';
import { AppHeader } from './AppHeader';
import { MyQueues } from './MyQueues';
import { ImageWithFallback } from './figma/ImageWithFallback';
import imgGoogleFavicon2025Svg1 from '../assets/f41a7265fbd0207a04bf4698fb2ddab3e9942bd7.png';

interface Recruiter {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  linkedinUrl: string;
  yearsExperience: number;
  contactInfo?: {
    email: string;
    phone: string;
  };
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  rank: string;
  postedTime: string;
  logo: string;
  isFavorited: boolean;
  description: string;
  requirements: string[];
  benefits: string[];
  companySize: string;
  companyIndustry: string;
  workModel: string;
  experienceLevel: string;
  companyRating: number;
  totalEmployees: string;
  recruiter: Recruiter;
  // Application tracking fields
  applicationMethod?: 'manual' | 'quick-apply' | 'recruiter-consideration';
  isApplied?: boolean;
  isSaved?: boolean;
  hasApplied?: boolean;
}

interface TrackedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  applicationMethod: 'manual' | 'quick-apply' | 'recruiter-consideration';
  dateApplied: string;
  status: 'application-received' | 'not-considered' | 'under-consideration' | 'interview-stage' | 'rejected' | 'offer';
  notes?: string;
  recruiterNotes?: string;
  logo?: string;
  recruiter?: any;
  fullJobData?: any;
}

interface HomepageProps {
  onNavigate: (view: 'homepage' | 'tracker' | 'profile' | 'notifications' | 'settings' | 'support' | 'report-issue' | 'queue-detail' | 'my-queues' | 'queue-selector') => void;
  onNavigateToJobDetails?: (job: any) => void;
  onNavigateToQueueDetail?: (queue: any) => void;
  onJobApplication: (job: any, method: 'manual' | 'quick-apply' | 'recruiter-consideration') => void;
  trackedJobs: TrackedJob[];
  user?: any;
  onLogout?: () => void;
  autoApplyEnabled: boolean;
  onToggleAutoApply: (enabled: boolean) => void;
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Software Engineer',
    company: 'Google',
    location: 'Toronto, CA',
    salary: '$100k - $150k',
    type: 'FT/Permanent',
    rank: 'Top 10%',
    postedTime: 'Posted 1 day ago',
    logo: imgGoogleFavicon2025Svg1,
    isFavorited: false,
    description: 'Join our world-class engineering team to build products that impact billions of users. You\'ll work on cutting-edge technologies including cloud computing, machine learning, and distributed systems. This role offers the opportunity to solve complex technical challenges while collaborating with some of the brightest minds in tech. We\'re looking for passionate engineers who thrive in fast-paced environments and are excited to push the boundaries of what\'s possible.',
    requirements: [
      'Bachelor\'s degree in Computer Science or equivalent experience',
      '3+ years of experience with modern programming languages (Python, Java, C++, Go)',
      'Experience with distributed systems and cloud technologies',
      'Strong problem-solving skills and algorithmic thinking',
      'Experience with version control systems (Git) and CI/CD pipelines'
    ],
    benefits: [
      'Comprehensive health, dental, and vision insurance',
      '$5,000 annual learning and development budget',
      'Flexible work arrangements and unlimited PTO',
      'Stock options and performance bonuses',
      'Free meals and on-site fitness facilities',
      'Relocation assistance and visa sponsorship available'
    ],
    companySize: 'Large (10,000+ employees)',
    companyIndustry: 'Technology',
    workModel: 'Hybrid',
    experienceLevel: 'Mid-Senior Level',
    companyRating: 4.4,
    totalEmployees: '139,995',
    recruiter: {
      id: 'r1',
      name: 'Jane Doe',
      title: 'Senior Technical Recruiter',
      company: 'Google',
      avatar: imgGoogleFavicon2025Svg1,
      linkedinUrl: 'https://linkedin.com/in/sarahchen-google',
      yearsExperience: 6,
      contactInfo: {
        email: 's.chen@google.com',
        phone: '+1 (555) 123-4567'
      }
    },
    // Applied via quick apply
    applicationMethod: 'quick-apply',
    isApplied: true,
    hasApplied: true,
    isSaved: false
  },
  {
    id: '2',
    title: 'Frontend Developer',
    company: 'Meta',
    location: 'San Francisco, CA',
    salary: '$120k - $180k',
    type: 'FT/Permanent',
    rank: 'Top 5%',
    postedTime: 'Posted 2 days ago',
    logo: 'https://images.unsplash.com/photo-1667586091163-e759ac830a1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXRhJTIwZmFjZWJvb2slMjBsb2dvfGVufDF8fHx8MTc1OTA4MjE2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isFavorited: true,
    description: 'Build the future of social technology with React, React Native, and cutting-edge web technologies. You\'ll work on products used by billions of people worldwide, creating intuitive user experiences that connect people and build communities. Join our mission to bring the world closer together through innovative frontend solutions that scale across multiple platforms and devices.',
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      '4+ years of experience with React, JavaScript, and TypeScript',
      'Experience with state management libraries (Redux, MobX)',
      'Proficiency in modern CSS frameworks and responsive design',
      'Experience with testing frameworks (Jest, React Testing Library)',
      'Knowledge of performance optimization and accessibility standards'
    ],
    benefits: [
      'Top-tier health insurance with $0 deductible',
      '$6,000 annual wellness stipend',
      'Generous parental leave (4 months paid)',
      'RSU grants and annual bonus opportunities',
      'Free transportation and housing assistance',
      'Mental health support and counseling services'
    ],
    companySize: 'Large (10,000+ employees)',
    companyIndustry: 'Social Media & Technology',
    workModel: 'Remote Friendly',
    experienceLevel: 'Senior Level',
    companyRating: 4.1,
    totalEmployees: '67,317',
    recruiter: {
      id: 'r2',
      name: 'Michael Rodriguez',
      title: 'Engineering Talent Partner',
      company: 'Meta',
      avatar: 'https://images.unsplash.com/photo-1667586091163-e759ac830a1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXRhJTIwZmFjZWJvb2slMjBsb2dvfGVufDF8fHx8MTc1OTA4MjE2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      linkedinUrl: 'https://linkedin.com/in/mrodriguez-meta',
      yearsExperience: 4,
      contactInfo: {
        email: 'm.rodriguez@meta.com',
        phone: '+1 (555) 987-6543'
      }
    },
    // Saved job (favorited)
    applicationMethod: undefined,
    isApplied: false,
    hasApplied: false,
    isSaved: true
  },
  {
    id: '3',
    title: 'Full Stack Engineer',
    company: 'Netflix',
    location: 'Los Angeles, CA',
    salary: '$110k - $160k',
    type: 'FT/Permanent',
    rank: 'Top 15%',
    postedTime: 'Posted 3 days ago',
    logo: 'https://images.unsplash.com/photo-1627873649417-c67f701f1949?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXRmbGl4JTIwbG9nbyUyMHJlZHxlbnwxfHx8fDE3NTkwODIxNjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isFavorited: false,
    description: 'Help us deliver amazing entertainment experiences to 200+ million members worldwide. You\'ll work on microservices architecture, content delivery systems, and recommendation algorithms that power the Netflix platform. Be part of a team that values innovation, creativity, and technical excellence while building systems that operate at unprecedented scale.',
    requirements: [
      'Bachelor\'s degree in Computer Science or equivalent',
      '3+ years of full-stack development experience',
      'Proficiency in Java, Python, or Node.js',
      'Experience with React, Angular, or Vue.js',
      'Knowledge of cloud platforms (AWS, GCP) and containerization',
      'Understanding of microservices architecture and APIs'
    ],
    benefits: [
      'Unlimited vacation policy',
      'Premium healthcare with fertility benefits',
      '$4,000 annual professional development budget',
      'Stock options and performance-based bonuses',
      'Free Netflix subscription for family',
      'Flexible work hours and remote work options'
    ],
    companySize: 'Large (10,000+ employees)',
    companyIndustry: 'Entertainment & Streaming',
    workModel: 'Hybrid',
    experienceLevel: 'Mid Level',
    companyRating: 4.3,
    totalEmployees: '12,800',
    recruiter: {
      id: 'r3',
      name: 'Emily Park',
      title: 'Technical Recruiting Lead',
      company: 'Netflix',
      avatar: 'https://images.unsplash.com/photo-1627873649417-c67f701f1949?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXRmbGl4JTIwbG9nbyUyMHJlZHxlbnwxfHx8fDE3NTkwODIxNjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      linkedinUrl: 'https://linkedin.com/in/emilypark-netflix',
      yearsExperience: 8,
      contactInfo: {
        email: 'e.park@netflix.com',
        phone: '+1 (555) 456-7890'
      }
    },
    // Recruiter put user under consideration
    applicationMethod: 'recruiter-consideration',
    isApplied: true,
    hasApplied: true,
    isSaved: false
  },
  {
    id: '4',
    title: 'Cloud Solutions Architect',
    company: 'Amazon',
    location: 'Seattle, WA',
    salary: '$140k - $200k',
    type: 'FT/Permanent',
    rank: 'Top 8%',
    postedTime: 'Posted 1 day ago',
    logo: 'https://images.unsplash.com/photo-1704204656144-3dd12c110dd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWF6b24lMjBsb2dvfGVufDF8fHx8MTc1ODk2NjgyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isFavorited: false,
    description: 'Design and implement scalable cloud infrastructure solutions using AWS services. Lead technical discussions with enterprise clients and drive digital transformation initiatives. Work with cutting-edge technologies including serverless computing, containerization, and AI/ML services while helping businesses migrate to the cloud.',
    requirements: [
      'Bachelor\'s degree in Computer Science or related technical field',
      '5+ years of experience with AWS cloud services',
      'Strong understanding of networking, security, and database technologies',
      'Experience with Infrastructure as Code (Terraform, CloudFormation)',
      'Excellent communication and client-facing skills'
    ],
    benefits: [
      'Comprehensive health benefits and retirement plans',
      '$8,000 annual education budget',
      'Stock purchase plan and RSU grants',
      'Flexible work arrangements',
      'Career advancement and mentorship programs'
    ],
    companySize: 'Large (10,000+ employees)',
    companyIndustry: 'Cloud Computing & E-commerce',
    workModel: 'Hybrid',
    experienceLevel: 'Senior Level',
    companyRating: 4.2,
    totalEmployees: '1,541,000',
    recruiter: {
      id: 'r4',
      name: 'David Kim',
      title: 'Senior Technical Recruiter',
      company: 'Amazon',
      avatar: 'https://images.unsplash.com/photo-1704204656144-3dd12c110dd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWF6b24lMjBsb2dvfGVufDF8fHx8MTc1ODk2NjgyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      linkedinUrl: 'https://linkedin.com/in/davidkim-amazon',
      yearsExperience: 7,
      contactInfo: {
        email: 'd.kim@amazon.com',
        phone: '+1 (555) 234-5678'
      }
    },
    applicationMethod: undefined,
    isApplied: false,
    hasApplied: false,
    isSaved: false
  },
  {
    id: '5',
    title: 'iOS Developer',
    company: 'Apple',
    location: 'Cupertino, CA',
    salary: '$130k - $190k',
    type: 'FT/Permanent',
    rank: 'Top 3%',
    postedTime: 'Posted 2 days ago',
    logo: 'https://images.unsplash.com/photo-1621000922765-23d95b2be591?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHBsZSUyMGNvbXBhbnklMjBsb2dvfGVufDF8fHx8MTc1OTA4MjE3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isFavorited: true,
    description: 'Join the iOS team to create revolutionary user experiences on iPhone and iPad. Work on features that millions of users interact with daily, from system-level frameworks to innovative app experiences. Collaborate with world-class designers and engineers to push the boundaries of mobile technology.',
    requirements: [
      'Bachelor\'s degree in Computer Science or equivalent experience',
      '4+ years of iOS development experience with Swift/Objective-C',
      'Deep understanding of iOS frameworks and design patterns',
      'Experience with performance optimization and memory management',
      'Strong UI/UX design sensibilities'
    ],
    benefits: [
      'Comprehensive medical and dental coverage',
      'Employee stock purchase plan',
      'Generous vacation and sabbatical programs',
      'On-site fitness and wellness facilities',
      'Free Apple products and accessories'
    ],
    companySize: 'Large (10,000+ employees)',
    companyIndustry: 'Consumer Electronics & Software',
    workModel: 'On-site',
    experienceLevel: 'Senior Level',
    companyRating: 4.5,
    totalEmployees: '164,000',
    recruiter: {
      id: 'r5',
      name: 'Lisa Martinez',
      title: 'iOS Talent Acquisition',
      company: 'Apple',
      avatar: 'https://images.unsplash.com/photo-1621000922765-23d95b2be591?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHBsZSUyMGNvbXBhbnklMjBsb2dvfGVufDF8fHx8MTc1OTA4MjE3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      linkedinUrl: 'https://linkedin.com/in/lisamartinez-apple',
      yearsExperience: 5,
      contactInfo: {
        email: 'l.martinez@apple.com',
        phone: '+1 (555) 345-6789'
      }
    },
    applicationMethod: undefined,
    isApplied: false,
    hasApplied: false,
    isSaved: true
  }
];

export function Homepage({ onNavigate, onNavigateToJobDetails, onNavigateToQueueDetail, onJobApplication, trackedJobs, user, onLogout, autoApplyEnabled }: Readonly<HomepageProps>) {
  const [selectedFilter, setSelectedFilter] = useState('All Jobs');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  
  // Filter states
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedSalaryRanges, setSelectedSalaryRanges] = useState<string[]>([]);
  const [selectedCompanySizes, setSelectedCompanySizes] = useState<string[]>([]);
  const [selectedExperienceLevels, setSelectedExperienceLevels] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedWorkModes, setSelectedWorkModes] = useState<string[]>([]);

  const selectedJob = selectedJobId ? mockJobs.find(job => job.id === selectedJobId) : null;

  // Check if job is already tracked/applied
  const isJobTracked = (jobId: string) => {
    return trackedJobs.some(trackedJob => trackedJob.id === jobId);
  };

  const handleQuickApply = (job: Job) => {
    if (!isJobTracked(job.id)) {
      onJobApplication(job, 'quick-apply');
      // Update local job state to show as applied
      job.hasApplied = true;
      job.isApplied = true;
      job.applicationMethod = 'quick-apply';
    }
  };

  const handleWithdrawApplication = (_job: Job) => {
    // Remove from tracked jobs
    // Note: In real app, this would also remove from trackedJobs via parent component
  };

  // Filter options derived from actual job data
  const filterOptions = {
    locations: Array.from(new Set(mockJobs.map(job => job.location))),
    jobTypes: Array.from(new Set(mockJobs.map(job => job.type))),
    salaryRanges: Array.from(new Set(mockJobs.map(job => job.salary))),
    companySizes: Array.from(new Set(mockJobs.map(job => job.companySize))),
    experienceLevels: Array.from(new Set(mockJobs.map(job => job.experienceLevel))),
    industries: Array.from(new Set(mockJobs.map(job => job.companyIndustry))),
    workModes: Array.from(new Set(mockJobs.map(job => job.workModel)))
  };

  // Filter jobs based on selected filters
  const filteredJobs = mockJobs.filter(job => {
    // Application status filter
    let applicationStatusMatch = true;
    if (selectedFilter === 'Auto-Applied') {
      applicationStatusMatch = job.applicationMethod === 'recruiter-consideration';
    } else if (selectedFilter === 'Manually Applied') {
      applicationStatusMatch = job.applicationMethod === 'manual' || job.applicationMethod === 'quick-apply';
    } else if (selectedFilter === 'Saved Jobs') {
      applicationStatusMatch = job.isSaved === true;
    }
    // For 'All Jobs', show all jobs (applicationStatusMatch remains true)

    return (
      applicationStatusMatch &&
      (selectedLocations.length === 0 || selectedLocations.includes(job.location)) &&
      (selectedJobTypes.length === 0 || selectedJobTypes.includes(job.type)) &&
      (selectedSalaryRanges.length === 0 || selectedSalaryRanges.includes(job.salary)) &&
      (selectedCompanySizes.length === 0 || selectedCompanySizes.includes(job.companySize)) &&
      (selectedExperienceLevels.length === 0 || selectedExperienceLevels.includes(job.experienceLevel)) &&
      (selectedIndustries.length === 0 || selectedIndustries.includes(job.companyIndustry)) &&
      (selectedWorkModes.length === 0 || selectedWorkModes.includes(job.workModel))
    );
  });

  const handleJobClick = (jobId: string) => {
    setSelectedJobId(jobId);
  };

  const handleFilterToggle = (filterType: string, value: string) => {
    switch (filterType) {
      case 'location':
        setSelectedLocations(prev => 
          prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
        );
        break;
      case 'jobType':
        setSelectedJobTypes(prev => 
          prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
        );
        break;
      case 'salary':
        setSelectedSalaryRanges(prev => 
          prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
        );
        break;
      case 'companySize':
        setSelectedCompanySizes(prev => 
          prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
        );
        break;
      case 'experience':
        setSelectedExperienceLevels(prev => 
          prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
        );
        break;
      case 'industry':
        setSelectedIndustries(prev => 
          prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
        );
        break;
      case 'workMode':
        setSelectedWorkModes(prev => 
          prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
        );
        break;
    }
  };

  const clearAllFilters = () => {
    setSelectedLocations([]);
    setSelectedJobTypes([]);
    setSelectedSalaryRanges([]);
    setSelectedCompanySizes([]);
    setSelectedExperienceLevels([]);
    setSelectedIndustries([]);
    setSelectedWorkModes([]);
  };

  const getFilterCount = () => {
    return selectedLocations.length + selectedJobTypes.length + selectedSalaryRanges.length + 
           selectedCompanySizes.length + selectedExperienceLevels.length + selectedIndustries.length + 
           selectedWorkModes.length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex">
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${selectedJobId ? 'mr-[800px]' : ''}`}>
        <AppHeader
          userRole="job-seeker"
          user={user}
          currentView="homepage"
          onNavigate={onNavigate as (view: string) => void}
          onLogout={onLogout || (() => {})}
        />

        {/* Enhanced Queue Leadership Section */}
        <div className="container mx-auto px-6 pt-8">
          <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 via-orange-50 to-blue-50 rounded-3xl border border-purple-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-orange-600 rounded-xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Queue Leadership & Analytics</h2>
                  <p className="text-gray-600">Click any queue below to view detailed analytics, leaderboards, and your competitive position</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-gradient-to-r from-purple-100 to-orange-100 text-purple-800 border border-purple-200">
                  <BarChart3 className="w-3 h-3 mr-1" />
                  Advanced Analytics
                </Badge>
                <Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200">
                  <Crown className="w-3 h-3 mr-1" />
                  Leaderboards
                </Badge>
              </div>
            </div>
          </div>

          <MyQueues 
            onEditQueues={() => onNavigate('queue-selector')}
            onQueueClick={(queue) => onNavigateToQueueDetail?.(queue)}
            className="mb-8"
            user={user}
          />
        </div>

        <div className="container mx-auto px-6 pb-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="w-72 sticky top-24 h-fit">
              {/* Enhanced Filters Card */}
              <div className="bg-gradient-to-br from-white to-orange-50 rounded-3xl p-6 shadow-xl border border-orange-100/50 backdrop-blur-sm">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] rounded-xl flex items-center justify-center shadow-lg">
                        <Filter className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Smart Filters</h3>
                        <p className="text-sm text-gray-500">
                          {getFilterCount() > 0 ? `${getFilterCount()} filters applied` : 'Find your perfect match'}
                        </p>
                      </div>
                    </div>
                    {getFilterCount() > 0 && (
                      <button
                        onClick={clearAllFilters}
                        className="text-xs text-[#ff6b35] hover:text-[#e55a2b] transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  {/* Status Filter Buttons */}
                  <div className="space-y-2 mb-6">
                    {['All Jobs', 'Auto-Applied', 'Manually Applied', 'Saved Jobs'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setSelectedFilter(filter)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                          selectedFilter === filter
                            ? 'bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] text-white shadow-lg transform scale-[1.02]'
                            : 'bg-white/80 text-gray-700 hover:bg-orange-50 hover:text-[#ff6b35] border border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{filter}</span>
                          {selectedFilter === filter && <Check className="w-4 h-4" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Advanced Filters */}
                <div className="space-y-4">
                  {/* Location Filter */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="w-full flex items-center justify-between p-3 bg-white/80 rounded-xl border border-gray-200 hover:bg-orange-50 hover:border-orange-200 transition-colors">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#ff6b35]" />
                          <span className="text-sm font-medium text-gray-700">Location</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedLocations.length > 0 && (
                            <Badge className="bg-[#ff6b35] text-white text-xs px-2 py-1">
                              {selectedLocations.length}
                            </Badge>
                          )}
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-4" side="right">
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 mb-3">Filter by Location</h4>
                        {filterOptions.locations.map((location) => (
                          <div key={location} className="flex items-center space-x-2">
                            <Checkbox
                              id={`location-${location}`}
                              checked={selectedLocations.includes(location)}
                              onCheckedChange={() => handleFilterToggle('location', location)}
                            />
                            <label
                              htmlFor={`location-${location}`}
                              className="text-sm text-gray-700 cursor-pointer"
                            >
                              {location}
                            </label>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Job Type Filter */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="w-full flex items-center justify-between p-3 bg-white/80 rounded-xl border border-gray-200 hover:bg-orange-50 hover:border-orange-200 transition-colors">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-[#ff6b35]" />
                          <span className="text-sm font-medium text-gray-700">Job Type</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedJobTypes.length > 0 && (
                            <Badge className="bg-[#ff6b35] text-white text-xs px-2 py-1">
                              {selectedJobTypes.length}
                            </Badge>
                          )}
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-4" side="right">
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 mb-3">Filter by Job Type</h4>
                        {filterOptions.jobTypes.map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={`type-${type}`}
                              checked={selectedJobTypes.includes(type)}
                              onCheckedChange={() => handleFilterToggle('jobType', type)}
                            />
                            <label
                              htmlFor={`type-${type}`}
                              className="text-sm text-gray-700 cursor-pointer"
                            >
                              {type}
                            </label>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Salary Filter */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="w-full flex items-center justify-between p-3 bg-white/80 rounded-xl border border-gray-200 hover:bg-orange-50 hover:border-orange-200 transition-colors">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-[#ff6b35]" />
                          <span className="text-sm font-medium text-gray-700">Salary Range</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedSalaryRanges.length > 0 && (
                            <Badge className="bg-[#ff6b35] text-white text-xs px-2 py-1">
                              {selectedSalaryRanges.length}
                            </Badge>
                          )}
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-4" side="right">
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 mb-3">Filter by Salary</h4>
                        {filterOptions.salaryRanges.map((range) => (
                          <div key={range} className="flex items-center space-x-2">
                            <Checkbox
                              id={`salary-${range}`}
                              checked={selectedSalaryRanges.includes(range)}
                              onCheckedChange={() => handleFilterToggle('salary', range)}
                            />
                            <label
                              htmlFor={`salary-${range}`}
                              className="text-sm text-gray-700 cursor-pointer"
                            >
                              {range}
                            </label>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Company Size Filter */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="w-full flex items-center justify-between p-3 bg-white/80 rounded-xl border border-gray-200 hover:bg-orange-50 hover:border-orange-200 transition-colors">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-[#ff6b35]" />
                          <span className="text-sm font-medium text-gray-700">Company Size</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedCompanySizes.length > 0 && (
                            <Badge className="bg-[#ff6b35] text-white text-xs px-2 py-1">
                              {selectedCompanySizes.length}
                            </Badge>
                          )}
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-4" side="right">
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 mb-3">Filter by Company Size</h4>
                        {filterOptions.companySizes.map((size) => (
                          <div key={size} className="flex items-center space-x-2">
                            <Checkbox
                              id={`size-${size}`}
                              checked={selectedCompanySizes.includes(size)}
                              onCheckedChange={() => handleFilterToggle('companySize', size)}
                            />
                            <label
                              htmlFor={`size-${size}`}
                              className="text-sm text-gray-700 cursor-pointer"
                            >
                              {size}
                            </label>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Experience Level Filter */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="w-full flex items-center justify-between p-3 bg-white/80 rounded-xl border border-gray-200 hover:bg-orange-50 hover:border-orange-200 transition-colors">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#ff6b35]" />
                          <span className="text-sm font-medium text-gray-700">Experience</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedExperienceLevels.length > 0 && (
                            <Badge className="bg-[#ff6b35] text-white text-xs px-2 py-1">
                              {selectedExperienceLevels.length}
                            </Badge>
                          )}
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-4" side="right">
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 mb-3">Filter by Experience Level</h4>
                        {filterOptions.experienceLevels.map((level) => (
                          <div key={level} className="flex items-center space-x-2">
                            <Checkbox
                              id={`experience-${level}`}
                              checked={selectedExperienceLevels.includes(level)}
                              onCheckedChange={() => handleFilterToggle('experience', level)}
                            />
                            <label
                              htmlFor={`experience-${level}`}
                              className="text-sm text-gray-700 cursor-pointer"
                            >
                              {level}
                            </label>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>


            </div>

            {/* Job Results */}
            <div className="flex-1">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      {selectedFilter === 'All Jobs' ? 'Available Jobs' : selectedFilter}
                    </h2>
                    <p className="text-gray-600 mt-1">{filteredJobs.length} opportunities found</p>
                  </div>
                  
                  {/* Smart Apply Status Indicator */}
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                    autoApplyEnabled 
                      ? 'bg-green-50 border-green-200 text-green-700' 
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}>
                    {autoApplyEnabled ? (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-sm font-medium">Auto-Apply Active</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        <span className="text-sm font-medium">Manual Only</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <Card 
                    key={job.id} 
                    className={`p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 ${
                      job.applicationMethod === 'recruiter-consideration' 
                        ? 'border-l-green-500 bg-gradient-to-r from-green-50 to-white' 
                        : job.hasApplied
                        ? 'border-l-blue-500 bg-gradient-to-r from-blue-50 to-white'
                        : job.isSaved
                        ? 'border-l-orange-500 bg-gradient-to-r from-orange-50 to-white'
                        : 'border-l-gray-200 hover:border-l-[#ff6b35]'
                    }`}
                    onClick={() => handleJobClick(job.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                          <ImageWithFallback
                            src={job.logo}
                            alt={`${job.company} logo`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                              <p className="text-gray-600 mb-2">{job.company}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {job.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="w-4 h-4" />
                                  {job.salary}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Briefcase className="w-4 h-4" />
                                  {job.type}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {job.postedTime}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {job.applicationMethod === 'recruiter-consideration' && (
                                <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">
                                  Auto-Applied
                                </Badge>
                              )}
                              {job.hasApplied && job.applicationMethod !== 'recruiter-consideration' && (
                                <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-1">
                                  Applied
                                </Badge>
                              )}
                              {job.isSaved && (
                                <Badge className="bg-orange-100 text-orange-800 text-xs px-2 py-1">
                                  Saved
                                </Badge>
                              )}
                              <Badge className="bg-[#ff6b35] text-white text-xs px-2 py-1">
                                {job.rank}
                              </Badge>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Toggle favorite
                                }}
                                className={`p-2 rounded-lg transition-colors ${
                                  job.isFavorited 
                                    ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                }`}
                              >
                                <Heart className={`w-4 h-4 ${job.isFavorited ? 'fill-current' : ''}`} />
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                            <span className="flex items-center gap-1">
                              <Building className="w-4 h-4" />
                              {job.companySize}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {job.experienceLevel}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4" />
                              {job.companyRating}/5
                            </span>
                          </div>
                          
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                            {job.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Job Details Sidebar */}
      {selectedJobId && selectedJob && (
        <div className="fixed right-0 top-16 w-[800px] h-[calc(100vh-4rem)] bg-white shadow-2xl z-40 overflow-y-auto border-l border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Job Details</h2>
              <button
                onClick={() => setSelectedJobId(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close job details"
              >
                <X className="w-6 h-6 text-gray-500 hover:text-[#ff6b35]" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Company Header */}
              <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-gray-50 to-orange-50 rounded-xl border border-orange-100">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-lg">
                  <ImageWithFallback
                    src={selectedJob.logo}
                    alt={`${selectedJob.company} logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{selectedJob.title}</h3>
                  <p className="text-lg text-gray-600 mb-3">{selectedJob.company}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedJob.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {selectedJob.salary}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedJob.postedTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {selectedJob.hasApplied || isJobTracked(selectedJob.id) ? (
                  <Button 
                    variant="outline"
                    onClick={() => handleWithdrawApplication(selectedJob)}
                    className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                  >
                    <UserMinus className="w-4 h-4 mr-2" />
                    Withdraw Application
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleQuickApply(selectedJob)}
                    className="flex-1 bg-[#ff6b35] hover:bg-[#e55a2b] text-white"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Quick Apply
                  </Button>
                )}
                <Button variant="outline" className="px-6 border-[#ff6b35] text-[#ff6b35] hover:bg-orange-50">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="px-6 border-[#ff6b35] text-[#ff6b35] hover:bg-orange-50">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => onNavigateToJobDetails?.(selectedJob)}
                  className="px-6 border-[#ff6b35] text-[#ff6b35] hover:bg-orange-50"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Full Description
                </Button>
              </div>

              {/* Job Description */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-3">About this role</h4>
                <p className="text-gray-600 leading-relaxed">{selectedJob.description}</p>
              </div>

              {/* Requirements */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Requirements</h4>
                <ul className="space-y-2">
                  {selectedJob.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Benefits & Perks</h4>
                <ul className="space-y-2">
                  {selectedJob.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-600">
                      <Star className="w-4 h-4 text-[#ff6b35] mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Info */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Company Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Industry</p>
                    <p className="text-sm text-gray-900">{selectedJob.companyIndustry}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Company Size</p>
                    <p className="text-sm text-gray-900">{selectedJob.companySize}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Work Model</p>
                    <p className="text-sm text-gray-900">{selectedJob.workModel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Rating</p>
                    <p className="text-sm text-gray-900">{selectedJob.companyRating}/5.0</p>
                  </div>
                </div>
              </div>

              {/* Recruiter Info */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Recruiter Contact</h4>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white">
                    <ImageWithFallback
                      src={selectedJob.recruiter.avatar}
                      alt={`${selectedJob.recruiter.name} avatar`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{selectedJob.recruiter.name}</h5>
                    <p className="text-sm text-gray-600 mb-1">{selectedJob.recruiter.title}</p>
                    <p className="text-sm text-gray-500 mb-3">{selectedJob.recruiter.yearsExperience} years experience</p>
                    {selectedJob.recruiter.contactInfo && (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">{selectedJob.recruiter.contactInfo.email}</p>
                        <p className="text-sm text-gray-600">{selectedJob.recruiter.contactInfo.phone}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
