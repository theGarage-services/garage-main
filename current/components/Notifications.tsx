import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, Bell, UserCheck, TrendingUp, Calendar, Briefcase, CheckCircle, Eye, ThumbsUp, Target, ChevronDown, Filter, ArrowRight, MapPin, DollarSign, FileText, ChevronRight } from 'lucide-react';
import { AppHeader } from './AppHeader';
import { ImageWithFallback } from './figma/ImageWithFallback';
import imgGoogleFavicon2025Svg1 from "figma:asset/f41a7265fbd0207a04bf4698fb2ddab3e9942bd7.png";

interface NotificationItem {
  id: string;
  type: 'recruiter-request' | 'status-change' | 'ranking-improvement' | 'application-update' | 'queue-activity' | 'job-specific';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  metadata?: {
    recruiterName?: string;
    recruiterTitle?: string;
    companyName?: string;
    companyLogo?: string;
    jobTitle?: string;
    queueName?: string;
    oldRank?: number;
    newRank?: number;
    oldStatus?: string;
    newStatus?: string;
    jobId?: string;
  };
}

interface JobNotificationGroup {
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  location: string;
  salary: string;
  currentStatus: string;
  appliedDate: string;
  notifications: NotificationItem[];
  unreadCount: number;
}

interface NotificationsProps {
  onNavigate: (view: 'homepage' | 'job-tracker' | 'profile' | 'notifications' | 'settings' | 'support' | 'report-issue') => void;
  user?: any;
  onLogout?: () => void;
}

// Mock notification data
const mockJobSpecificNotifications: NotificationItem[] = [
  {
    id: 'job-1-notif-1',
    type: 'job-specific',
    title: 'Application Moved to Interview Stage',
    message: 'Congratulations! Your application has been reviewed and you have moved to the Interview stage.',
    timestamp: '2 hours ago',
    isRead: false,
    priority: 'high',
    metadata: {
      jobId: 'job-1',
      jobTitle: 'Senior Software Engineer',
      companyName: 'Google',
      companyLogo: imgGoogleFavicon2025Svg1,
      newStatus: 'Interview'
    }
  },
  {
    id: 'job-1-notif-2',
    type: 'job-specific',
    title: 'Application Received',
    message: 'Your application has been received and is under review.',
    timestamp: '3 days ago',
    isRead: true,
    priority: 'medium',
    metadata: {
      jobId: 'job-1',
      jobTitle: 'Senior Software Engineer',
      companyName: 'Google',
      companyLogo: imgGoogleFavicon2025Svg1,
      newStatus: 'Under Review'
    }
  },
  {
    id: 'job-2-notif-1',
    type: 'job-specific',
    title: 'Application Not Proceeding',
    message: 'Thank you for your interest. Unfortunately, we have decided not to proceed with your application at this time.',
    timestamp: '1 day ago',
    isRead: false,
    priority: 'high',
    metadata: {
      jobId: 'job-2',
      jobTitle: 'Frontend Developer',
      companyName: 'Meta',
      companyLogo: 'https://images.unsplash.com/photo-1667586091163-e759ac830a1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXRhJTIwZmFjZWJvb2slMjBsb2dvfGVufDF8fHx8MTc1OTA4MjE2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      newStatus: 'Rejected'
    }
  },
  {
    id: 'job-3-notif-1',
    type: 'job-specific',
    title: 'Interview Scheduled',
    message: 'Your interview has been scheduled for January 25, 2025 at 2:00 PM.',
    timestamp: '5 hours ago',
    isRead: false,
    priority: 'high',
    metadata: {
      jobId: 'job-3',
      jobTitle: 'Data Scientist',
      companyName: 'Amazon',
      companyLogo: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWF6b24lMjBsb2dvfGVufDF8fHx8MTc1OTA4MjE2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      newStatus: 'Interview Scheduled'
    }
  },
  {
    id: 'job-3-notif-2',
    type: 'job-specific',
    title: 'Additional Information Requested',
    message: 'The recruiter has requested additional information about your previous projects.',
    timestamp: '2 days ago',
    isRead: true,
    priority: 'medium',
    metadata: {
      jobId: 'job-3',
      jobTitle: 'Data Scientist',
      companyName: 'Amazon',
      companyLogo: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWF6b24lMjBsb2dvfGVufDF8fHx8MTc1OTA4MjE2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      newStatus: 'Under Review'
    }
  }
];

const mockGeneralNotifications: NotificationItem[] = [
  {
    id: 'gen-1',
    type: 'ranking-improvement',
    title: 'Queue Ranking Improved',
    message: 'Your ranking in the Frontend Development queue improved from #15 to #8.',
    timestamp: '1 day ago',
    isRead: false,
    priority: 'medium',
    metadata: {
      queueName: 'Frontend Development',
      oldRank: 15,
      newRank: 8
    }
  },
  {
    id: 'gen-2',
    type: 'queue-activity',
    title: 'New Match in AI/ML Queue',
    message: 'A new high-match opportunity has been added to your AI/ML Engineering queue.',
    timestamp: '3 days ago',
    isRead: true,
    priority: 'medium',
    metadata: {
      queueName: 'AI/ML Engineering'
    }
  },
  {
    id: 'gen-3',
    type: 'ranking-improvement',
    title: 'Profile Views Increased',
    message: 'Your profile was viewed by 12 recruiters this week, up from 5 last week.',
    timestamp: '5 days ago',
    isRead: true,
    priority: 'low',
    metadata: {
      queueName: 'Data Science'
    }
  },
  {
    id: 'gen-4',
    type: 'queue-activity',
    title: 'New Queue Match Available',
    message: 'Based on your skills, you may be interested in the Backend Engineering queue.',
    timestamp: '1 week ago',
    isRead: true,
    priority: 'low',
    metadata: {
      queueName: 'Backend Engineering'
    }
  }
];

const mockRecruiterNotifications: NotificationItem[] = [
  {
    id: 'rec-1',
    type: 'recruiter-request',
    title: 'Interest from Google Recruiter',
    message: 'Jane Doe from Google is interested in considering you for their Software Engineer position.',
    timestamp: '2 hours ago',
    isRead: false,
    priority: 'high',
    metadata: {
      recruiterName: 'Jane Doe',
      recruiterTitle: 'Senior Technical Recruiter',
      companyName: 'Google',
      companyLogo: imgGoogleFavicon2025Svg1,
      jobTitle: 'Software Engineer'
    }
  },
  {
    id: 'rec-2',
    type: 'recruiter-request',
    title: 'Coffee Chat Request',
    message: 'Michael Rodriguez from Meta wants to connect regarding multiple open positions.',
    timestamp: '1 week ago',
    isRead: true,
    priority: 'medium',
    metadata: {
      recruiterName: 'Michael Rodriguez',
      recruiterTitle: 'Engineering Talent Partner',
      companyName: 'Meta',
      companyLogo: 'https://images.unsplash.com/photo-1667586091163-e759ac830a1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXRhJTIwZmFjZWJvb2slMjBsb2dvfGVufDF8fHx8MTc1OTA4MjE2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  }
];

// Group job-specific notifications by job
const mockJobGroups: JobNotificationGroup[] = [
  {
    jobId: 'job-1',
    jobTitle: 'Senior Software Engineer',
    companyName: 'Google',
    companyLogo: imgGoogleFavicon2025Svg1,
    location: 'Mountain View, CA',
    salary: '$150k - $200k',
    currentStatus: 'Interview',
    appliedDate: 'Jan 15, 2025',
    notifications: mockJobSpecificNotifications.filter(n => n.metadata?.jobId === 'job-1'),
    unreadCount: mockJobSpecificNotifications.filter(n => n.metadata?.jobId === 'job-1' && !n.isRead).length
  },
  {
    jobId: 'job-2',
    jobTitle: 'Frontend Developer',
    companyName: 'Meta',
    companyLogo: 'https://images.unsplash.com/photo-1667586091163-e759ac830a1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXRhJTIwZmFjZWJvb2slMjBsb2dvfGVufDF8fHx8MTc1OTA4MjE2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    location: 'Menlo Park, CA',
    salary: '$140k - $180k',
    currentStatus: 'Rejected',
    appliedDate: 'Jan 10, 2025',
    notifications: mockJobSpecificNotifications.filter(n => n.metadata?.jobId === 'job-2'),
    unreadCount: mockJobSpecificNotifications.filter(n => n.metadata?.jobId === 'job-2' && !n.isRead).length
  },
  {
    jobId: 'job-3',
    jobTitle: 'Data Scientist',
    companyName: 'Amazon',
    companyLogo: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWF6b24lMjBsb2dvfGVufDF8fHx8MTc1OTA4MjE2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    location: 'Seattle, WA',
    salary: '$160k - $210k',
    currentStatus: 'Interview Scheduled',
    appliedDate: 'Jan 12, 2025',
    notifications: mockJobSpecificNotifications.filter(n => n.metadata?.jobId === 'job-3'),
    unreadCount: mockJobSpecificNotifications.filter(n => n.metadata?.jobId === 'job-3' && !n.isRead).length
  }
];

export function Notifications({ onNavigate, user, onLogout }: Readonly<NotificationsProps>) {
  const [selectedTab, setSelectedTab] = useState('general');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const unreadGeneralCount = mockGeneralNotifications.filter(n => !n.isRead).length;
  const unreadRecruiterCount = mockRecruiterNotifications.filter(n => !n.isRead).length;
  const unreadJobsCount = mockJobGroups.reduce((sum, job) => sum + job.unreadCount, 0);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'recruiter-request':
        return <UserCheck className="w-5 h-5 text-blue-600" />;
      case 'ranking-improvement':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'application-update':
        return <Briefcase className="w-5 h-5 text-orange-600" />;
      case 'queue-activity':
        return <Target className="w-5 h-5 text-purple-600" />;
      case 'job-specific':
        return <Briefcase className="w-5 h-5 text-[#ff6b35]" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-orange-500 bg-orange-50';
      case 'low':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-300 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Interview':
      case 'Interview Scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Offer':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleMarkAsRead = (id: string) => {
    console.log('Mark as read:', id);
  };


  const selectedJob = mockJobGroups.find(job => job.jobId === selectedJobId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <AppHeader
        userRole="job-seeker"
        user={user}
        currentView="notifications"
        onNavigate={onNavigate as (view: string) => void}
        onLogout={onLogout || (() => {})}
      />

      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {selectedJobId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedJobId(null)}
                className="mr-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to My Jobs
              </Button>
            )}
            <div className="w-12 h-12 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] rounded-xl flex items-center justify-center shadow-lg">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">
                {selectedJobId ? selectedJob?.jobTitle : 'Notifications'}
              </h1>
              <p className="text-gray-600">
                {selectedJobId 
                  ? `Application updates for ${selectedJob?.companyName}` 
                  : 'Stay updated with your job search activity'
                }
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          {!selectedJobId && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">General</h3>
                    <p className="text-2xl font-bold text-blue-600">{mockGeneralNotifications.length}</p>
                    <p className="text-sm text-blue-700">{unreadGeneralCount} unread</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Recruiter Requests</h3>
                    <p className="text-2xl font-bold text-green-600">{mockRecruiterNotifications.length}</p>
                    <p className="text-sm text-green-700">{unreadRecruiterCount} unread</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#ff6b35] rounded-xl flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">My Jobs</h3>
                    <p className="text-2xl font-bold text-[#ff6b35]">{mockJobGroups.length}</p>
                    <p className="text-sm text-orange-700">{unreadJobsCount} unread</p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Job Details View - when a job is selected */}
        {selectedJobId && selectedJob ? (
          <div className="space-y-6">
            {/* Job Summary Card */}
            <Card className="p-6 bg-gradient-to-r from-white to-orange-50 border-[#ff6b35]/20">
              <div className="flex items-start gap-4">
                {selectedJob.companyLogo && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-gray-200">
                    <ImageWithFallback
                      src={selectedJob.companyLogo}
                      alt={`${selectedJob.companyName} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 mb-1">{selectedJob.jobTitle}</h2>
                      <p className="text-lg text-gray-700">{selectedJob.companyName}</p>
                    </div>
                    <Badge className={`${getStatusColor(selectedJob.currentStatus)} border px-3 py-1`}>
                      {selectedJob.currentStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedJob.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {selectedJob.salary}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Applied: {selectedJob.appliedDate}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Notifications Timeline */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#ff6b35]" />
                Application Timeline
              </h3>
              <div className="space-y-4">
                {selectedJob.notifications.map((notification, index) => (
                  <div 
                    key={notification.id}
                    className={`relative pl-8 pb-6 ${index === selectedJob.notifications.length - 1 ? 'pb-0' : ''}`}
                  >
                    {/* Timeline line */}
                    {index !== selectedJob.notifications.length - 1 && (
                      <div className="absolute left-2 top-6 bottom-0 w-0.5 bg-gray-200"></div>
                    )}
                    
                    {/* Timeline dot */}
                    <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 ${
                      notification.isRead ? 'bg-white border-gray-300' : 'bg-[#ff6b35] border-[#ff6b35]'
                    }`}></div>
                    
                    <Card className={`p-4 border-l-4 ${
                      notification.isRead ? 'bg-white border-l-gray-300' : getPriorityColor(notification.priority)
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-[#ff6b35] rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                          <p className="text-xs text-gray-500">{notification.timestamp}</p>
                        </div>
                      </div>
                      
                      {!notification.isRead && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="mt-2"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Mark Read
                        </Button>
                      )}
                    </Card>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : (
          /* Main Tabs View */
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList className="grid w-fit grid-cols-3 bg-white shadow-sm">
                <TabsTrigger 
                  value="general" 
                  className="flex items-center gap-2 data-[state=active]:bg-[#ff6b35] data-[state=active]:text-white"
                >
                  <Bell className="w-4 h-4" />
                  <span>General</span>
                  {unreadGeneralCount > 0 && (
                    <Badge className="bg-blue-500 text-white text-xs px-1.5 py-0.5 min-w-[16px] h-[16px] rounded-full">
                      {unreadGeneralCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="recruiter-requests" 
                  className="flex items-center gap-2 data-[state=active]:bg-[#ff6b35] data-[state=active]:text-white"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Recruiter Requests</span>
                  {unreadRecruiterCount > 0 && (
                    <Badge className="bg-blue-500 text-white text-xs px-1.5 py-0.5 min-w-[16px] h-[16px] rounded-full">
                      {unreadRecruiterCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="my-jobs" 
                  className="flex items-center gap-2 data-[state=active]:bg-[#ff6b35] data-[state=active]:text-white"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>My Jobs</span>
                  {unreadJobsCount > 0 && (
                    <Badge className="bg-blue-500 text-white text-xs px-1.5 py-0.5 min-w-[16px] h-[16px] rounded-full">
                      {unreadJobsCount}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* Filter Dropdown */}
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
                
                {showFilterDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-2">
                      <button
                        onClick={() => { setSelectedFilter('all'); setShowFilterDropdown(false); }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          selectedFilter === 'all' ? 'bg-orange-50 text-[#ff6b35]' : 'hover:bg-gray-50'
                        }`}
                      >
                        All Notifications
                      </button>
                      <button
                        onClick={() => { setSelectedFilter('unread'); setShowFilterDropdown(false); }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          selectedFilter === 'unread' ? 'bg-orange-50 text-[#ff6b35]' : 'hover:bg-gray-50'
                        }`}
                      >
                        Unread Only
                      </button>
                      <button
                        onClick={() => { setSelectedFilter('high'); setShowFilterDropdown(false); }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          selectedFilter === 'high' ? 'bg-orange-50 text-[#ff6b35]' : 'hover:bg-gray-50'
                        }`}
                      >
                        High Priority
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-4">
              {mockGeneralNotifications.map((notification) => (
                <Card 
                  key={notification.id}
                  className={`p-6 border-l-4 transition-all duration-200 hover:shadow-lg ${
                    notification.isRead ? 'bg-white' : getPriorityColor(notification.priority)
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{notification.title}</h3>
                          <p className="text-gray-600 text-sm leading-relaxed">{notification.message}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-[#ff6b35] rounded-full"></div>
                          )}
                          <span className="text-xs text-gray-500 whitespace-nowrap">{notification.timestamp}</span>
                        </div>
                      </div>
                      
                      {notification.metadata && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                          {notification.type === 'ranking-improvement' && (
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-600">Queue:</span>
                                <span className="font-medium text-gray-900">{notification.metadata.queueName}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-red-600">#{notification.metadata.oldRank}</span>
                                <ArrowRight className="w-4 h-4 text-gray-400" />
                                <span className="text-green-600 font-medium">#{notification.metadata.newRank}</span>
                              </div>
                            </div>
                          )}
                          
                          {notification.type === 'queue-activity' && (
                            <div className="flex items-center gap-2 text-sm">
                              <Target className="w-4 h-4 text-purple-600" />
                              <span className="text-gray-600">Queue:</span>
                              <span className="font-medium text-gray-900">{notification.metadata.queueName}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3 mt-4">
                        <Button 
                          size="sm" 
                          className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        {!notification.isRead && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              
              {mockGeneralNotifications.length === 0 && (
                <Card className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">No general notifications</h3>
                  <p className="text-gray-600 mb-6">
                    You'll receive updates about your queue rankings and platform activity here.
                  </p>
                  <Button 
                    onClick={() => onNavigate('homepage')}
                    className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white"
                  >
                    Browse Jobs
                  </Button>
                </Card>
              )}
            </TabsContent>

            {/* Recruiter Requests Tab */}
            <TabsContent value="recruiter-requests" className="space-y-4">
              {mockRecruiterNotifications.map((notification) => (
                <Card 
                  key={notification.id}
                  className={`p-6 border-l-4 transition-all duration-200 hover:shadow-lg ${
                    notification.isRead ? 'bg-white' : getPriorityColor(notification.priority)
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl flex items-center justify-center border border-blue-200">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{notification.title}</h3>
                          <p className="text-gray-600 text-sm leading-relaxed">{notification.message}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-[#ff6b35] rounded-full"></div>
                          )}
                          <span className="text-xs text-gray-500 whitespace-nowrap">{notification.timestamp}</span>
                        </div>
                      </div>
                      
                      {notification.metadata && (
                        <div className="flex items-center gap-4 mt-4 p-4 bg-gray-50 rounded-xl">
                          {notification.metadata.companyLogo && (
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white">
                              <ImageWithFallback
                                src={notification.metadata.companyLogo}
                                alt={`${notification.metadata.companyName} logo`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {notification.metadata.recruiterName} • {notification.metadata.recruiterTitle}
                            </p>
                            <p className="text-sm text-gray-600">{notification.metadata.companyName}</p>
                            {notification.metadata.jobTitle && (
                              <p className="text-sm text-[#ff6b35] font-medium">{notification.metadata.jobTitle}</p>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3 mt-4">
                        <Button 
                          size="sm" 
                          className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-green-500 text-green-600 hover:bg-green-50"
                        >
                          <ThumbsUp className="w-4 h-4 mr-2" />
                          Accept Interest
                        </Button>
                        {!notification.isRead && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              
              {mockRecruiterNotifications.length === 0 && (
                <Card className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserCheck className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">No recruiter requests yet</h3>
                  <p className="text-gray-600 mb-6">
                    You'll receive notifications here when recruiters show interest in your profile.
                  </p>
                  <Button 
                    onClick={() => onNavigate('profile')}
                    className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white"
                  >
                    Improve Your Profile
                  </Button>
                </Card>
              )}
            </TabsContent>

            {/* My Jobs Tab */}
            <TabsContent value="my-jobs" className="space-y-4">
              {mockJobGroups.map((job) => (
                <Card 
                  key={job.jobId}
                  className="p-6 transition-all duration-200 hover:shadow-lg cursor-pointer border-l-4 border-l-[#ff6b35]"
                  onClick={() => setSelectedJobId(job.jobId)}
                >
                  <div className="flex items-start gap-4">
                    {job.companyLogo && (
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-gray-200">
                        <ImageWithFallback
                          src={job.companyLogo}
                          alt={`${job.companyName} logo`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg mb-1">{job.jobTitle}</h3>
                          <p className="text-gray-700">{job.companyName}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {job.unreadCount > 0 && (
                            <Badge className="bg-red-500 text-white">
                              {job.unreadCount} new
                            </Badge>
                          )}
                          <Badge className={`${getStatusColor(job.currentStatus)} border px-3 py-1`}>
                            {job.currentStatus}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {job.salary}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Applied: {job.appliedDate}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Bell className="w-4 h-4" />
                          <span>{job.notifications.length} notification{job.notifications.length === 1 ? '' : 's'}</span>
                        </div>
                        
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="text-[#ff6b35] hover:text-[#e55a2b] hover:bg-orange-50"
                        >
                          View Timeline
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              
              {mockJobGroups.length === 0 && (
                <Card className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">No job applications yet</h3>
                  <p className="text-gray-600 mb-6">
                    Start applying to jobs and you'll see all your application updates here.
                  </p>
                  <Button 
                    onClick={() => onNavigate('homepage')}
                    className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white"
                  >
                    Browse Jobs
                  </Button>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
