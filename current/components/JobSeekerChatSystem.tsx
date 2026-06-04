import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft,
  Send,
  Paperclip,
  Smile,
  Clock,
  CheckCircle,
  Calendar,
  Briefcase,
  Search,
  Users,
  MessageSquare,
  Coffee,
  ChevronDown,
  ChevronRight,
  Filter,
  Crown,
  TrendingUp,
  Award,
  Target,
  MoreHorizontal
} from 'lucide-react';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

interface Message {
  id: string;
  sender: 'job-seeker' | 'recruiter' | 'peer';
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'consideration' | 'interview-scheduled';
  status: 'sent' | 'delivered' | 'read';
  metadata?: any;
}

interface CoffeeChatContact {
  id: string;
  name: string;
  avatar: string;
  position: string;
  company: string;
  isPremium?: boolean;
  isOnline: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  contactType: 'recruiter' | 'job-seeker';
  // Recruiter-specific stats
  responseRate?: number;
  avgResponseTime?: string;
  successRate?: number;
  totalHires?: number;
}

interface RecruiterContact {
  id: string;
  name: string;
  avatar: string;
  position: string;
  company: string;
  isPremium?: boolean;
  isOnline: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  jobRole: string;
  jobId: string;
  applicationMethod: 'manual' | 'auto';
  initiatedBy: 'recruiter' | 'job-seeker';
  // Recruiter stats
  responseRate: number;
  avgResponseTime: string;
  successRate: number;
  interviewRate: number;
}

interface JobRoleGroup {
  roleTitle: string;
  roleId: string;
  company: string;
  totalConversations: number;
  unreadCount: number;
  applicationMethod: 'manual' | 'auto';
  recruiters: RecruiterContact[];
}

interface JobSeekerChatSystemProps {
  onBack: () => void;
  initialContact?: any;
  user?: any;
}

export function JobSeekerChatSystem({ 
  onBack, 
  initialContact}: Readonly<JobSeekerChatSystemProps>) {
  const [activeTab, setActiveTab] = useState<'coffee-chats' | 'recruiters'>('coffee-chats');
  const [selectedContact, setSelectedContact] = useState<CoffeeChatContact | RecruiterContact | null>(initialContact);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set());
  
  // Toggle filters for Coffee Chats tab
  const [showRecruiters, setShowRecruiters] = useState(true);
  const [showJobSeekers, setShowJobSeekers] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock Coffee Chat Contacts - Both recruiters and fellow job seekers
  const [coffeeChatContacts] = useState<CoffeeChatContact[]>([
    {
      id: 'cc-r1',
      name: 'Sarah Martinez',
      avatar: 'SM',
      position: 'Senior Talent Acquisition',
      company: 'TechCorp Inc.',
      isPremium: true,
      isOnline: true,
      lastMessage: 'Hi! I\'d be happy to share insights about our hiring process.',
      lastMessageTime: '10 min ago',
      unreadCount: 1,
      contactType: 'recruiter',
      responseRate: 95,
      avgResponseTime: '2 hours',
      successRate: 87,
      totalHires: 234
    },
    {
      id: 'cc-r2',
      name: 'Michael Chen',
      avatar: 'MC',
      position: 'Engineering Recruiter',
      company: 'StartupXYZ',
      isPremium: true,
      isOnline: false,
      lastMessage: 'Thanks for reaching out! Let\'s connect.',
      lastMessageTime: '2 hours ago',
      unreadCount: 0,
      contactType: 'recruiter',
      responseRate: 88,
      avgResponseTime: '4 hours',
      successRate: 82,
      totalHires: 156
    },
    {
      id: 'cc-js1',
      name: 'Alex Thompson',
      avatar: 'AT',
      position: 'Senior Software Engineer',
      company: 'DevCo',
      isOnline: true,
      lastMessage: 'I went through the same queue! Happy to share tips.',
      lastMessageTime: '1 hour ago',
      unreadCount: 2,
      contactType: 'job-seeker'
    },
    {
      id: 'cc-js2',
      name: 'Jamie Lee',
      avatar: 'JL',
      position: 'Data Scientist',
      company: 'Analytics Inc.',
      isPremium: true,
      isOnline: false,
      lastMessage: 'The auto-apply feature has been working great for me!',
      lastMessageTime: '1 day ago',
      unreadCount: 0,
      contactType: 'job-seeker'
    },
    {
      id: 'cc-js3',
      name: 'Morgan Davis',
      avatar: 'MD',
      position: 'Product Designer',
      company: 'DesignLab',
      isOnline: true,
      lastMessage: 'Would love to exchange interview experiences!',
      lastMessageTime: '3 hours ago',
      unreadCount: 1,
      contactType: 'job-seeker'
    }
  ]);

  // Mock Recruiter Contacts organized by job role
  const [recruitersByRole] = useState<JobRoleGroup[]>([
    {
      roleTitle: 'Senior Software Engineer',
      roleId: 'job-1',
      company: 'TechCorp Inc.',
      totalConversations: 3,
      unreadCount: 2,
      applicationMethod: 'auto',
      recruiters: [
        {
          id: 'r1',
          name: 'Sarah Martinez',
          avatar: 'SM',
          position: 'Senior Talent Acquisition',
          company: 'TechCorp Inc.',
          isPremium: true,
          isOnline: true,
          lastMessage: 'I\'d like to schedule an interview to discuss the role in detail.',
          lastMessageTime: '30 min ago',
          unreadCount: 2,
          jobRole: 'Senior Software Engineer',
          jobId: 'job-1',
          applicationMethod: 'auto',
          initiatedBy: 'recruiter',
          responseRate: 95,
          avgResponseTime: '2 hours',
          successRate: 87,
          interviewRate: 65
        },
        {
          id: 'r2',
          name: 'David Kim',
          avatar: 'DK',
          position: 'Engineering Manager',
          company: 'TechCorp Inc.',
          isOnline: false,
          lastMessage: 'Your experience with React and TypeScript looks impressive!',
          lastMessageTime: '2 days ago',
          unreadCount: 0,
          jobRole: 'Senior Software Engineer',
          jobId: 'job-1',
          applicationMethod: 'auto',
          initiatedBy: 'recruiter',
          responseRate: 78,
          avgResponseTime: '1 day',
          successRate: 72,
          interviewRate: 54
        }
      ]
    },
    {
      roleTitle: 'Product Manager',
      roleId: 'job-2',
      company: 'StartupXYZ',
      totalConversations: 2,
      unreadCount: 1,
      applicationMethod: 'manual',
      recruiters: [
        {
          id: 'r3',
          name: 'Michael Chen',
          avatar: 'MC',
          position: 'Head of Talent',
          company: 'StartupXYZ',
          isPremium: true,
          isOnline: true,
          lastMessage: 'We\'re moving forward with your application. Can we schedule a call?',
          lastMessageTime: '1 hour ago',
          unreadCount: 1,
          jobRole: 'Product Manager',
          jobId: 'job-2',
          applicationMethod: 'manual',
          initiatedBy: 'recruiter',
          responseRate: 88,
          avgResponseTime: '4 hours',
          successRate: 82,
          interviewRate: 68
        }
      ]
    },
    {
      roleTitle: 'UX Designer',
      roleId: 'job-3',
      company: 'DesignCo',
      totalConversations: 1,
      unreadCount: 0,
      applicationMethod: 'manual',
      recruiters: [
        {
          id: 'r4',
          name: 'Emily Watson',
          avatar: 'EW',
          position: 'Design Recruiter',
          company: 'DesignCo',
          isOnline: false,
          lastMessage: 'Thanks for your interest! We\'ll review your portfolio.',
          lastMessageTime: '3 days ago',
          unreadCount: 0,
          jobRole: 'UX Designer',
          jobId: 'job-3',
          applicationMethod: 'manual',
          initiatedBy: 'recruiter',
          responseRate: 92,
          avgResponseTime: '3 hours',
          successRate: 85,
          interviewRate: 71
        }
      ]
    }
  ]);

  // Mock messages for selected contact
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'recruiter',
      content: 'Hi! I reviewed your profile and I\'m impressed with your background. I\'d love to discuss the Senior Software Engineer role with you.',
      timestamp: '10:30 AM',
      type: 'text',
      status: 'read'
    },
    {
      id: '2',
      sender: 'job-seeker',
      content: 'Thank you for reaching out! I\'m very interested in learning more about the position and your company.',
      timestamp: '10:45 AM',
      type: 'text',
      status: 'delivered'
    },
    {
      id: '3',
      sender: 'recruiter',
      content: 'Great! We\'re building a strong engineering team focused on scalable systems. Could you share more about your experience with microservices?',
      timestamp: '11:00 AM',
      type: 'text',
      status: 'read'
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (message.trim() && selectedContact) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'job-seeker',
        content: message,
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        type: 'text',
        status: 'sent'
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    }
  };

  const toggleRoleExpansion = (roleId: string) => {
    setExpandedRoles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(roleId)) {
        newSet.delete(roleId);
      } else {
        newSet.add(roleId);
      }
      return newSet;
    });
  };

  const filteredCoffeeChatContacts = coffeeChatContacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      (showRecruiters && contact.contactType === 'recruiter') ||
      (showJobSeekers && contact.contactType === 'job-seeker');
    return matchesSearch && matchesFilter;
  });

  const filteredRecruitersByRole = recruitersByRole.map(roleGroup => ({
    ...roleGroup,
    recruiters: roleGroup.recruiters.filter(recruiter =>
      recruiter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recruiter.position.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(roleGroup => roleGroup.recruiters.length > 0);

  const totalCoffeeChatUnread = coffeeChatContacts.reduce((sum, contact) => sum + contact.unreadCount, 0);
  const totalRecruiterUnread = recruitersByRole.reduce((sum, role) => sum + role.unreadCount, 0);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isCoffeeChatContact = (contact: any): contact is CoffeeChatContact => {
    return contact?.contactType !== undefined;
  };

  const isRecruiterContact = (contact: any): contact is RecruiterContact => {
    return contact?.jobRole !== undefined;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-gray-600 hover:text-[#ff6b35]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-4">
            <h1 className="text-2xl text-gray-900">Messages</h1>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as 'coffee-chats' | 'recruiters')} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
            <TabsTrigger value="coffee-chats" className="relative">
              <Coffee className="w-4 h-4 mr-2" />
              Coffee Chats
              {totalCoffeeChatUnread > 0 && (
                <Badge className="ml-2 bg-[#ff6b35] text-white text-xs h-5 px-2">
                  {totalCoffeeChatUnread}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="recruiters" className="relative">
              <Briefcase className="w-4 h-4 mr-2" />
              Job Conversations
              {totalRecruiterUnread > 0 && (
                <Badge className="ml-2 bg-[#ff6b35] text-white text-xs h-5 px-2">
                  {totalRecruiterUnread}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Coffee Chats Tab Content */}
          <TabsContent value="coffee-chats">
            <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-280px)]">
              {/* Coffee Chat Contacts Sidebar */}
              <div className="lg:col-span-1">
                <Card className="h-full flex flex-col">
                  <div className="p-4 border-b space-y-4">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Search contacts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Toggle Filters */}
                    <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Filter className="w-3 h-3" />
                          Show
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-recruiters" className="text-xs">Recruiters</Label>
                        <Switch
                          id="show-recruiters"
                          checked={showRecruiters}
                          onCheckedChange={setShowRecruiters}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-job-seekers" className="text-xs">Fellow Job Seekers</Label>
                        <Switch
                          id="show-job-seekers"
                          checked={showJobSeekers}
                          onCheckedChange={setShowJobSeekers}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Coffee className="w-4 h-4" />
                      <span>{filteredCoffeeChatContacts.length} Contacts</span>
                    </div>
                  </div>
                  
                  <ScrollArea className="flex-1">
                    <div className="p-2">
                      {filteredCoffeeChatContacts.map((contact) => (
                        <div
                          key={contact.id}
                          onClick={() => setSelectedContact(contact)}
                          className={`p-3 rounded-lg cursor-pointer transition-all duration-200 mb-2 ${
                            selectedContact?.id === contact.id 
                              ? 'bg-[#ff6b35] text-white' 
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback className={
                                  selectedContact?.id === contact.id 
                                    ? "bg-white/20 text-white" 
                                    : contact.contactType === 'recruiter'
                                      ? "bg-blue-500 text-white"
                                      : "bg-[#ff6b35] text-white"
                                }>
                                  {contact.avatar}
                                </AvatarFallback>
                              </Avatar>
                              {contact.isOnline && (
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                              )}
                              {contact.isPremium && (
                                <Crown className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1" />
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className={`text-sm font-medium truncate ${
                                  selectedContact?.id === contact.id ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {contact.name}
                                </h4>
                                {contact.unreadCount > 0 && (
                                  <Badge className="bg-[#ff6b35] text-white text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                                    {contact.unreadCount}
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-1 mb-1">
                                <p className={`text-xs ${
                                  selectedContact?.id === contact.id ? 'text-white/80' : 'text-gray-600'
                                }`}>
                                  {contact.position}
                                </p>
                                {contact.contactType === 'recruiter' && (
                                  <Badge className={`text-xs ${
                                    selectedContact?.id === contact.id 
                                      ? 'bg-white/20 text-white'
                                      : 'bg-blue-100 text-blue-700'
                                  }`}>
                                    Recruiter
                                  </Badge>
                                )}
                              </div>
                              
                              <p className={`text-xs truncate mb-1 ${
                                selectedContact?.id === contact.id ? 'text-white/70' : 'text-gray-500'
                              }`}>
                                {contact.lastMessage}
                              </p>
                              
                              <span className={`text-xs ${
                                selectedContact?.id === contact.id ? 'text-white/60' : 'text-gray-400'
                              }`}>
                                {contact.lastMessageTime}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>
              </div>

              {/* Chat Area */}
              <div className="lg:col-span-3">
                {renderChatArea()}
              </div>
            </div>
          </TabsContent>

          {/* Recruiters Tab Content */}
          <TabsContent value="recruiters">
            <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-280px)]">
              {/* Recruiters Sidebar with Role Grouping */}
              <div className="lg:col-span-1">
                <Card className="h-full flex flex-col">
                  <div className="p-4 border-b space-y-4">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Search recruiters..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase className="w-4 h-4" />
                      <span>{recruitersByRole.length} Job Positions</span>
                    </div>
                  </div>
                  
                  <ScrollArea className="flex-1">
                    <div className="p-2">
                      {filteredRecruitersByRole.map((roleGroup) => (
                        <div key={roleGroup.roleId} className="mb-2">
                          {/* Role Header - Collapsible */}
                          <button
                            onClick={() => toggleRoleExpansion(roleGroup.roleId)}
                            className="w-full p-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {expandedRoles.has(roleGroup.roleId) ? (
                                <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
                              )}
                              <Briefcase className="w-4 h-4 text-[#ff6b35] flex-shrink-0" />
                              <div className="text-left min-w-0 flex-1">
                                <h3 className="text-sm font-medium text-gray-900 truncate">{roleGroup.roleTitle}</h3>
                                <div className="flex items-center gap-2">
                                  <p className="text-xs text-gray-500">{roleGroup.company}</p>
                                  <Badge className={`text-xs ${
                                    roleGroup.applicationMethod === 'manual' 
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'bg-purple-100 text-purple-700'
                                  }`}>
                                    {roleGroup.applicationMethod === 'manual' ? 'Manual' : 'Auto'}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            {roleGroup.unreadCount > 0 && (
                              <Badge className="bg-[#ff6b35] text-white text-xs h-5 px-2 flex-shrink-0">
                                {roleGroup.unreadCount}
                              </Badge>
                            )}
                          </button>

                          {/* Recruiter List under this role */}
                          {expandedRoles.has(roleGroup.roleId) && (
                            <div className="ml-4 mt-1 space-y-1">
                              {roleGroup.recruiters.map((recruiter) => (
                                <div
                                  key={recruiter.id}
                                  onClick={() => setSelectedContact(recruiter)}
                                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                    selectedContact?.id === recruiter.id 
                                      ? 'bg-[#ff6b35] text-white' 
                                      : 'hover:bg-gray-50'
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="relative">
                                      <Avatar className="w-10 h-10">
                                        <AvatarFallback className={
                                          selectedContact?.id === recruiter.id 
                                            ? "bg-white/20 text-white" 
                                            : "bg-blue-500 text-white"
                                        }>
                                          {recruiter.avatar}
                                        </AvatarFallback>
                                      </Avatar>
                                      {recruiter.isOnline && (
                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                      )}
                                      {recruiter.isPremium && (
                                        <Crown className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1" />
                                      )}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between mb-1">
                                        <h4 className={`text-sm font-medium truncate ${
                                          selectedContact?.id === recruiter.id ? 'text-white' : 'text-gray-900'
                                        }`}>
                                          {recruiter.name}
                                        </h4>
                                        {recruiter.unreadCount > 0 && (
                                          <Badge className="bg-[#ff6b35] text-white text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                                            {recruiter.unreadCount}
                                          </Badge>
                                        )}
                                      </div>
                                      
                                      <p className={`text-xs mb-1 ${
                                        selectedContact?.id === recruiter.id ? 'text-white/80' : 'text-gray-600'
                                      }`}>
                                        {recruiter.position}
                                      </p>
                                      
                                      <p className={`text-xs truncate mb-2 ${
                                        selectedContact?.id === recruiter.id ? 'text-white/70' : 'text-gray-500'
                                      }`}>
                                        {recruiter.lastMessage}
                                      </p>
                                      
                                      <div className="flex items-center justify-between">
                                        <span className={`text-xs ${
                                          selectedContact?.id === recruiter.id ? 'text-white/60' : 'text-gray-400'
                                        }`}>
                                          {recruiter.lastMessageTime}
                                        </span>
                                        <div className={`flex items-center gap-1 text-xs ${
                                          selectedContact?.id === recruiter.id ? 'text-white' : 'text-[#ff6b35]'
                                        }`}>
                                          <TrendingUp className="w-3 h-3" />
                                          {recruiter.responseRate}%
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>
              </div>

              {/* Chat Area */}
              <div className="lg:col-span-3">
                {renderChatArea()}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  function renderChatArea() {
    if (!selectedContact) {
      return (
        <Card className="h-full flex items-center justify-center">
          <div className="text-center text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
            <p className="text-sm">
              {activeTab === 'coffee-chats' 
                ? 'Choose a contact to start networking'
                : 'Choose a recruiter to continue the conversation'
              }
            </p>
          </div>
        </Card>
      );
    }

    const showRecruiterStats = isCoffeeChatContact(selectedContact) 
      ? selectedContact.contactType === 'recruiter'
      : isRecruiterContact(selectedContact);

    return (
      <Card className="h-full flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className={
                    isCoffeeChatContact(selectedContact) && selectedContact.contactType === 'recruiter'
                      ? "bg-blue-500 text-white"
                      : isRecruiterContact(selectedContact)
                        ? "bg-blue-500 text-white"
                        : "bg-[#ff6b35] text-white"
                  }>
                    {selectedContact.avatar}
                  </AvatarFallback>
                </Avatar>
                {selectedContact.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  {selectedContact.name}
                  {selectedContact.isPremium && (
                    <Crown className="w-4 h-4 text-yellow-500" />
                  )}
                </h3>
                <p className="text-sm text-gray-600">{selectedContact.position}</p>
                
                {/* Context Badges */}
                <div className="flex items-center gap-2 mt-1">
                  {isCoffeeChatContact(selectedContact) && activeTab === 'coffee-chats' && (
                    <Badge className="bg-amber-100 text-amber-700 text-xs">
                      <Coffee className="w-3 h-3 mr-1" />
                      Coffee Chat
                    </Badge>
                  )}
                  {isCoffeeChatContact(selectedContact) && selectedContact.contactType === 'recruiter' && (
                    <Badge className="bg-blue-100 text-blue-700 text-xs">
                      Recruiter
                    </Badge>
                  )}
                  {isCoffeeChatContact(selectedContact) && selectedContact.contactType === 'job-seeker' && (
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      Job Seeker
                    </Badge>
                  )}
                  {isRecruiterContact(selectedContact) && (
                    <>
                      <Badge className="bg-gray-100 text-gray-700 text-xs">
                        {selectedContact.jobRole}
                      </Badge>
                      <Badge className={`text-xs ${
                        selectedContact.applicationMethod === 'manual' 
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {selectedContact.applicationMethod === 'manual' ? 'Manual Apply' : 'Auto Applied'}
                      </Badge>
                    </>
                  )}
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {selectedContact.isOnline ? 'Online now' : 'Last seen 1 hour ago'}
                </p>
              </div>
            </div>
            
            <Button size="sm" variant="outline">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {/* Recruiter Stats - Only show for recruiters */}
          {showRecruiterStats && (
            <div className="mt-4 grid grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-900">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  {isCoffeeChatContact(selectedContact) ? selectedContact.responseRate : isRecruiterContact(selectedContact) ? selectedContact.responseRate : 0}%
                </div>
                <p className="text-xs text-gray-500 mt-1">Response Rate</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-900">
                  <Clock className="w-3 h-3 text-blue-600" />
                  {isCoffeeChatContact(selectedContact) ? selectedContact.avgResponseTime : isRecruiterContact(selectedContact) ? selectedContact.avgResponseTime : 'N/A'}
                </div>
                <p className="text-xs text-gray-500 mt-1">Avg Response</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-900">
                  <Award className="w-3 h-3 text-yellow-600" />
                  {isCoffeeChatContact(selectedContact) ? selectedContact.successRate : isRecruiterContact(selectedContact) ? selectedContact.successRate : 0}%
                </div>
                <p className="text-xs text-gray-500 mt-1">Success Rate</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-900">
                  <Target className="w-3 h-3 text-[#ff6b35]" />
                  {isRecruiterContact(selectedContact) ? selectedContact.interviewRate : isCoffeeChatContact(selectedContact) && selectedContact.totalHires ? selectedContact.totalHires : 'N/A'}
                  {isRecruiterContact(selectedContact) && '%'}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {isRecruiterContact(selectedContact) ? 'Interview Rate' : 'Total Hires'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'job-seeker' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    msg.sender === 'job-seeker'
                      ? 'bg-[#ff6b35] text-white'
                      : msg.sender === 'recruiter'
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-white border border-gray-200'
                  }`}
                >
                  {msg.type === 'consideration' && (
                    <div className="mb-2 p-2 bg-white/20 rounded border">
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="w-4 h-4" />
                        <span>Job Consideration: {msg.metadata?.jobTitle}</span>
                      </div>
                    </div>
                  )}
                  
                  {msg.type === 'interview-scheduled' && (
                    <div className="mb-2 p-2 bg-white/20 rounded border">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>Interview Scheduled</span>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-current/20">
                    <span className="text-xs opacity-70">{msg.timestamp}</span>
                    {msg.sender === 'job-seeker' && (
                      <div className="flex items-center gap-1">
                        {msg.status === 'read' && <CheckCircle className="w-3 h-3" />}
                        {msg.status === 'delivered' && <CheckCircle className="w-3 h-3 opacity-50" />}
                        {msg.status === 'sent' && <Clock className="w-3 h-3 opacity-50" />}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline">
              <Paperclip className="w-4 h-4" />
            </Button>
            <div className="flex-1 relative">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="pr-12"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
              >
                <Smile className="w-4 h-4" />
              </Button>
            </div>
            <Button 
              onClick={sendMessage}
              disabled={!message.trim()}
              className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }
}
