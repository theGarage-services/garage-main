import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ArrowLeft, Bell, UserCheck, TrendingUp, Calendar, Briefcase, CheckCircle, Eye, ThumbsUp, Target, ChevronDown, Filter, ArrowRight, MapPin, DollarSign, FileText, ChevronRight, MessageSquare, Coffee, XCircle, MessageCircle } from 'lucide-react';
import { AppHeader } from '../layout/AppHeader';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface NotificationItem {
  id: string;
  type: 'recruiter-request' | 'status-change' | 'ranking-improvement' | 'application-update' | 'queue-activity' | 'job-specific' | 'chat-request' | 'candidate-message' | 'consideration-accepted' | 'consideration-declined' | 'coffee-chat-accepted' | 'coffee-chat-declined' | 'new-message';
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
    // Chat notification metadata
    senderName?: string;
    senderAvatar?: string;
    messagePreview?: string;
    conversationId?: string;
    coffeeChatId?: string;
    considerationId?: string;
    requesterName?: string;
    requesterAvatar?: string;
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
  onNavigate: (view: 'homepage' | 'job-tracker' | 'profile' | 'notifications' | 'settings' | 'support' | 'report-issue' | 'recruiter-chat') => void;
  user?: any;
  onLogout?: () => void;
  // Optional: Pass real notification data from parent or API
  generalNotifications?: NotificationItem[];
  recruiterNotifications?: NotificationItem[];
  chatNotifications?: NotificationItem[];
  jobNotificationGroups?: JobNotificationGroup[];
}


export function Notifications({
  onNavigate,
  user,
  onLogout,
  generalNotifications = [],
  recruiterNotifications = [],
  chatNotifications = [],
  jobNotificationGroups = []
}: Readonly<NotificationsProps>) {
  const [selectedTab, setSelectedTab] = useState('general');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const unreadGeneralCount = generalNotifications.filter(n => !n.isRead).length;
  const unreadRecruiterCount = recruiterNotifications.filter(n => !n.isRead).length;
  const unreadJobsCount = jobNotificationGroups.reduce((sum, job) => sum + job.unreadCount, 0);
  const unreadChatCount = chatNotifications.filter(n => !n.isRead).length;

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
      // Chat notification icons
      case 'chat-request':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'candidate-message':
        return <MessageSquare className="w-5 h-5 text-[#ff6b35]" />;
      case 'consideration-accepted':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'consideration-declined':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'coffee-chat-accepted':
        return <Coffee className="w-5 h-5 text-amber-600" />;
      case 'coffee-chat-declined':
        return <Coffee className="w-5 h-5 text-gray-500" />;
      case 'new-message':
        return <MessageSquare className="w-5 h-5 text-indigo-500" />;
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


  const selectedJob = jobNotificationGroups.find(job => job.jobId === selectedJobId);

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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">General</h3>
                    <p className="text-2xl font-bold text-blue-600">{generalNotifications.length}</p>
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
                    <p className="text-2xl font-bold text-green-600">{recruiterNotifications.length}</p>
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
                    <p className="text-2xl font-bold text-[#ff6b35]">{jobNotificationGroups.length}</p>
                    <p className="text-sm text-orange-700">{unreadJobsCount} unread</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Chat</h3>
                    <p className="text-2xl font-bold text-indigo-600">{chatNotifications.length}</p>
                    <p className="text-sm text-indigo-700">{unreadChatCount} unread</p>
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
              <TabsList className="grid w-fit grid-cols-4 bg-white shadow-sm">
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
                  <span>Recruiter</span>
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
                <TabsTrigger 
                  value="chat" 
                  className="flex items-center gap-2 data-[state=active]:bg-[#ff6b35] data-[state=active]:text-white"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat</span>
                  {unreadChatCount > 0 && (
                    <Badge className="bg-blue-500 text-white text-xs px-1.5 py-0.5 min-w-[16px] h-[16px] rounded-full">
                      {unreadChatCount}
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
              {generalNotifications.map((notification) => (
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
              
              {generalNotifications.length === 0 && (
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
              {recruiterNotifications.map((notification) => (
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
              
              {recruiterNotifications.length === 0 && (
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
              {jobNotificationGroups.map((job) => (
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
              
              {jobNotificationGroups.length === 0 && (
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

            {/* Chat Notifications Tab */}
            <TabsContent value="chat" className="space-y-4">
              {chatNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`p-6 border-l-4 transition-all duration-200 hover:shadow-lg ${
                    notification.isRead ? 'bg-white' : getPriorityColor(notification.priority)
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl flex items-center justify-center border border-indigo-200">
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

                      {/* Chat notification metadata display */}
                      {notification.metadata && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                          {/* Message preview for chat notifications */}
                          {notification.metadata.messagePreview && (
                            <div className="mb-3 p-3 bg-white rounded-lg border border-gray-200">
                              <p className="text-sm text-gray-500 italic">
                                &ldquo;{notification.metadata.messagePreview}&rdquo;
                              </p>
                            </div>
                          )}

                          <div className="flex items-center gap-4">
                            {/* Sender/Requester avatar */}
                            {(notification.metadata.senderAvatar || notification.metadata.requesterAvatar) && (
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-white">
                                <ImageWithFallback
                                  src={notification.metadata.senderAvatar || notification.metadata.requesterAvatar || ''}
                                  alt={`${notification.metadata.senderName || notification.metadata.requesterName} avatar`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}

                            <div className="flex-1">
                              {/* Sender/Requester name */}
                              {(notification.metadata.senderName || notification.metadata.requesterName) && (
                                <p className="font-medium text-gray-900">
                                  {notification.metadata.senderName || notification.metadata.requesterName}
                                </p>
                              )}

                              {/* Company info */}
                              {notification.metadata.companyName && (
                                <p className="text-sm text-gray-600">{notification.metadata.companyName}</p>
                              )}

                              {/* Job title */}
                              {notification.metadata.jobTitle && (
                                <p className="text-sm text-[#ff6b35] font-medium">{notification.metadata.jobTitle}</p>
                              )}

                              {/* Conversation/Chat ID */}
                              {(notification.metadata.conversationId || notification.metadata.coffeeChatId || notification.metadata.considerationId) && (
                                <p className="text-xs text-gray-400 mt-1">
                                  {notification.metadata.conversationId && `Conversation: ${notification.metadata.conversationId}`}
                                  {notification.metadata.coffeeChatId && `Coffee Chat: ${notification.metadata.coffeeChatId}`}
                                  {notification.metadata.considerationId && `Consideration: ${notification.metadata.considerationId}`}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action buttons based on notification type */}
                      <div className="flex items-center gap-3 mt-4">
                        {(notification.type === 'chat-request' || notification.type === 'candidate-message' || notification.type === 'new-message') && (
                          <Button
                            size="sm"
                            className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white"
                            onClick={() => onNavigate('recruiter-chat')}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Open Chat
                          </Button>
                        )}

                        {notification.type === 'consideration-accepted' && (
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 text-white"
                            onClick={() => onNavigate('recruiter-chat')}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Start Conversation
                          </Button>
                        )}

                        {notification.type === 'coffee-chat-accepted' && (
                          <Button
                            size="sm"
                            className="bg-amber-500 hover:bg-amber-600 text-white"
                            onClick={() => onNavigate('recruiter-chat')}
                          >
                            <Coffee className="w-4 h-4 mr-2" />
                            Start Chat
                          </Button>
                        )}

                        {(notification.type === 'consideration-declined' || notification.type === 'coffee-chat-declined') && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Acknowledged
                          </Button>
                        )}

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

              {chatNotifications.length === 0 && (
                <Card className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">No chat notifications</h3>
                  <p className="text-gray-600 mb-6">
                    You&apos;ll receive notifications about messages, coffee chat requests, and job considerations here.
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
