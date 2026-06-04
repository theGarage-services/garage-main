import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  ArrowLeft,
  Send,
  Paperclip,
  Smile,
  MoreHorizontal,
  Crown,
  Clock,
  CheckCircle,
  Calendar,
  Briefcase,
  Search,
  MessageSquare,
  Coffee,
  ChevronDown,
  ChevronRight,
  Filter} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { useChat } from '../../hooks/useChat';
import type { Conversation } from '../../api/chat';

interface CoffeeChatContact {
  id: string;
  name: string;
  avatar: string;
  position: string;
  company: string;
  isPremium: boolean;
  isOnline: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  requestType: 'coffee-chat';
  requestMessage?: string;
}

interface CandidateContact {
  id: string;
  name: string;
  avatar: string;
  position: string;
  company: string;
  isPremium: boolean;
  isOnline: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  jobRole: string;
  jobId: string;
  applicationMethod: 'manual' | 'auto';
  initiatedBy: 'recruiter' | 'candidate';
  matchScore?: number;
}

interface JobRoleGroup {
  roleTitle: string;
  roleId: string;
  totalConversations: number;
  unreadCount: number;
  candidates: CandidateContact[];
}

interface RecruiterChatSystemProps {
  onBack: () => void;
  initialContact?: any;
  availableJobs?: any[];
  onUpdateCandidateStatus?: (candidateId: string, status: string) => void;
}

export function RecruiterChatSystem({ 
  onBack, 
  initialContact, 
  availableJobs = [],
  onUpdateCandidateStatus
}: Readonly<RecruiterChatSystemProps>) {
  const [activeTab, setActiveTab] = useState<'coffee-chats' | 'job-seekers'>('coffee-chats');
  const [selectedContact, setSelectedContact] = useState<CoffeeChatContact | CandidateContact | null>(initialContact);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use chat hook for API integration
  const {
    conversations,
    currentConversation,
    conversationMessages,
    loadMessages,
    sendMessage: sendApiMessage,
    receivedCoffeeChats,
    sendConsideration: sendConsiderationRequest,
  } = useChat();
  const [showConsiderationDialog, setShowConsiderationDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set());
  
  // Toggle filters for Job Seekers tab
  const [showRecruiterInitiated, setShowRecruiterInitiated] = useState(true);
  const [showCandidateInitiated, setShowCandidateInitiated] = useState(true);
  
  const [considerationData, setConsiderationData] = useState({
    jobId: '',
    message: '',
    status: 'under-consideration'
  });
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages]);

  const sendMessage = async () => {
    if (message.trim() && currentConversation) {
      try {
        await sendApiMessage({
          conversation: currentConversation.id,
          content: message,
          message_type: 'text',
        });
        setMessage('');
        await loadMessages(currentConversation.id);
      } catch (err) {
        console.error('Failed to send message:', err);
      }
    }
  };

  const submitConsideration = async () => {
    if (considerationData.jobId && considerationData.message.trim() && selectedContact) {
      try {
        await sendConsiderationRequest({
          candidate: Number.parseInt(selectedContact.id),
          job: Number.parseInt(considerationData.jobId),
          message: considerationData.message,
        });

        if (onUpdateCandidateStatus) {
          onUpdateCandidateStatus(selectedContact.id, considerationData.status);
        }

        setShowConsiderationDialog(false);
        setConsiderationData({ jobId: '', message: '', status: 'under-consideration' });
      } catch (err) {
        console.error('Failed to send consideration:', err);
      }
    }
  };

  const scheduleInterview = async () => {
    if (scheduleData.date && scheduleData.time && selectedContact && currentConversation) {
      let locationDetails = '';
      if (scheduleData.type === 'in-person' && scheduleData.location) {
        locationDetails = ` Location: ${scheduleData.location}.`;
      } else if (scheduleData.type === 'video' && scheduleData.meetingLink) {
        locationDetails = ` Meeting link: ${scheduleData.meetingLink}.`;
      } else if (scheduleData.type === 'video' && scheduleData.meetingPlatform) {
        locationDetails = ` Platform: ${scheduleData.meetingPlatform}.`;
      }

      try {
        await sendApiMessage({
          conversation: currentConversation.id,
          content: `I've scheduled an interview for ${scheduleData.date} at ${scheduleData.time}.${locationDetails} ${scheduleData.message}`,
          message_type: 'interview_scheduled',
          metadata: {
            date: scheduleData.date,
            time: scheduleData.time,
            duration: scheduleData.duration,
            type: scheduleData.type,
            location: scheduleData.location,
            meetingLink: scheduleData.meetingLink,
            meetingPlatform: scheduleData.meetingPlatform
          }
        });

        if (onUpdateCandidateStatus) {
          onUpdateCandidateStatus(selectedContact.id, 'interview-stage');
        }

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
        await loadMessages(currentConversation.id);
      } catch (err) {
        console.error('Failed to schedule interview:', err);
      }
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

  // Transform API coffee chat requests into contacts
  const coffeeChatContacts: CoffeeChatContact[] = receivedCoffeeChats.map(req => ({
    id: req.id.toString(),
    name: req.requester.username,
    avatar: req.requester.username[0].toUpperCase(),
    position: req.requester.role || 'Professional',
    company: '',
    isPremium: req.requester.is_premium || false,
    isOnline: false,
    lastMessage: req.message,
    lastMessageTime: new Date(req.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    unreadCount: 0,
    requestType: 'coffee-chat',
    requestMessage: req.message,
  }));

  // Transform API conversations into candidate contacts grouped by job
  const candidatesByRole: JobRoleGroup[] = (conversations)
    .filter((c: Conversation) => c.conversation_type === 'job')
    .reduce((groups: JobRoleGroup[], c: Conversation) => {
      const roleTitle = c.job?.title || 'Unknown Position';
      const roleId = c.job?.id?.toString() || c.id.toString();

      let group = groups.find(g => g.roleId === roleId);
      if (!group) {
        group = {
          roleTitle,
          roleId,
          totalConversations: 0,
          unreadCount: 0,
          candidates: []
        };
        groups.push(group);
      }

      const otherParticipant = c.other_participant || c.participants?.[0];

      group.candidates.push({
        id: c.id.toString(),
        name: otherParticipant?.username || 'Unknown',
        avatar: (otherParticipant?.username || '?')[0].toUpperCase(),
        position: otherParticipant?.role || 'Candidate',
        company: c.job?.company || '',
        isPremium: otherParticipant?.is_premium || false,
        isOnline: false,
        lastMessage: c.last_message_preview || 'No messages yet',
        lastMessageTime: c.last_message_at
          ? new Date(c.last_message_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
          : '',
        unreadCount: c.unread_count || 0,
        jobRole: roleTitle,
        jobId: roleId,
        applicationMethod: c.application_method || 'manual',
        initiatedBy: (c.initiated_by || 'candidate') as 'recruiter' | 'candidate',
      });

      group.totalConversations++;
      group.unreadCount += c.unread_count || 0;

      return groups;
    }, []);

  const filteredCoffeeChatContacts = coffeeChatContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCandidatesByRole = candidatesByRole.map(roleGroup => ({
    ...roleGroup,
    candidates: roleGroup.candidates.filter(candidate => {
      const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           candidate.position.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        (showRecruiterInitiated && candidate.initiatedBy === 'recruiter') ||
        (showCandidateInitiated && candidate.initiatedBy === 'candidate');
      return matchesSearch && matchesFilter;
    })
  })).filter(roleGroup => roleGroup.candidates.length > 0);

  const totalCoffeeChatUnread = coffeeChatContacts.reduce((sum, contact) => sum + contact.unreadCount, 0);
  const totalJobSeekerUnread = candidatesByRole.reduce((sum, role) => sum + role.unreadCount, 0);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isCoffeeChatContact = (contact: any): contact is CoffeeChatContact => {
    return contact?.requestType === 'coffee-chat';
  };

  const isCandidateContact = (contact: any): contact is CandidateContact => {
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
        <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as 'coffee-chats' | 'job-seekers')} className="w-full">
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
            <TabsTrigger value="job-seekers" className="relative">
              <Briefcase className="w-4 h-4 mr-2" />
              Job Seekers
              {totalJobSeekerUnread > 0 && (
                <Badge className="ml-2 bg-[#ff6b35] text-white text-xs h-5 px-2">
                  {totalJobSeekerUnread}
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
                  <div className="p-4 border-b">
                    <div className="relative mb-4">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Search contacts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Coffee className="w-4 h-4" />
                      <span>{filteredCoffeeChatContacts.length} Networking Requests</span>
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
                              
                              <p className={`text-xs mb-1 ${
                                selectedContact?.id === contact.id ? 'text-white/80' : 'text-gray-600'
                              }`}>
                                {contact.position}
                              </p>
                              
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

          {/* Job Seekers Tab Content */}
          <TabsContent value="job-seekers">
            <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-280px)]">
              {/* Job Seekers Sidebar with Role Grouping */}
              <div className="lg:col-span-1">
                <Card className="h-full flex flex-col">
                  <div className="p-4 border-b space-y-4">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Search candidates..."
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
                          Filter by
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="recruiter-initiated" className="text-xs">Recruiter Initiated</Label>
                        <Switch
                          id="recruiter-initiated"
                          checked={showRecruiterInitiated}
                          onCheckedChange={setShowRecruiterInitiated}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="candidate-initiated" className="text-xs">Candidate Initiated</Label>
                        <Switch
                          id="candidate-initiated"
                          checked={showCandidateInitiated}
                          onCheckedChange={setShowCandidateInitiated}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <ScrollArea className="flex-1">
                    <div className="p-2">
                      {filteredCandidatesByRole.map((roleGroup) => (
                        <div key={roleGroup.roleId} className="mb-2">
                          {/* Role Header - Collapsible */}
                          <button
                            onClick={() => toggleRoleExpansion(roleGroup.roleId)}
                            className="w-full p-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-2 flex-1">
                              {expandedRoles.has(roleGroup.roleId) ? (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-500" />
                              )}
                              <Briefcase className="w-4 h-4 text-[#ff6b35]" />
                              <div className="text-left">
                                <h3 className="text-sm font-medium text-gray-900">{roleGroup.roleTitle}</h3>
                                <p className="text-xs text-gray-500">{roleGroup.totalConversations} conversations</p>
                              </div>
                            </div>
                            {roleGroup.unreadCount > 0 && (
                              <Badge className="bg-[#ff6b35] text-white text-xs h-5 px-2">
                                {roleGroup.unreadCount}
                              </Badge>
                            )}
                          </button>

                          {/* Candidate List under this role */}
                          {expandedRoles.has(roleGroup.roleId) && (
                            <div className="ml-4 mt-1 space-y-1">
                              {roleGroup.candidates.map((candidate) => (
                                <div
                                  key={candidate.id}
                                  onClick={() => setSelectedContact(candidate)}
                                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                    selectedContact?.id === candidate.id 
                                      ? 'bg-[#ff6b35] text-white' 
                                      : 'hover:bg-gray-50'
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="relative">
                                      <Avatar className="w-10 h-10">
                                        <AvatarFallback className={
                                          selectedContact?.id === candidate.id 
                                            ? "bg-white/20 text-white" 
                                            : "bg-[#ff6b35] text-white"
                                        }>
                                          {candidate.avatar}
                                        </AvatarFallback>
                                      </Avatar>
                                      {candidate.isOnline && (
                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                      )}
                                      {candidate.isPremium && (
                                        <Crown className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1" />
                                      )}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between mb-1">
                                        <h4 className={`text-sm font-medium truncate ${
                                          selectedContact?.id === candidate.id ? 'text-white' : 'text-gray-900'
                                        }`}>
                                          {candidate.name}
                                        </h4>
                                        {candidate.unreadCount > 0 && (
                                          <Badge className="bg-[#ff6b35] text-white text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                                            {candidate.unreadCount}
                                          </Badge>
                                        )}
                                      </div>
                                      
                                      <div className="flex items-center gap-2 mb-1">
                                        <Badge className={`text-xs ${
                                          selectedContact?.id === candidate.id 
                                            ? 'bg-white/20 text-white' 
                                            : candidate.applicationMethod === 'manual' 
                                              ? 'bg-blue-100 text-blue-700'
                                              : 'bg-purple-100 text-purple-700'
                                        }`}>
                                          {candidate.applicationMethod === 'manual' ? 'Manual' : 'Auto Applied'}
                                        </Badge>
                                      </div>
                                      
                                      <p className={`text-xs truncate mb-1 ${
                                        selectedContact?.id === candidate.id ? 'text-white/70' : 'text-gray-500'
                                      }`}>
                                        {candidate.lastMessage}
                                      </p>
                                      
                                      <div className="flex items-center justify-between">
                                        <span className={`text-xs ${
                                          selectedContact?.id === candidate.id ? 'text-white/60' : 'text-gray-400'
                                        }`}>
                                          {candidate.lastMessageTime}
                                        </span>
                                        {candidate.matchScore && (
                                          <span className={`text-xs font-medium ${
                                            selectedContact?.id === candidate.id ? 'text-white' : 'text-[#ff6b35]'
                                          }`}>
                                            {candidate.matchScore}%
                                          </span>
                                        )}
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
                ? 'Choose a networking request to start chatting'
                : 'Choose a candidate to continue the conversation'
              }
            </p>
          </div>
        </Card>
      );
    }

    return (
      <Card className="h-full flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-[#ff6b35] text-white">
                    {selectedContact.avatar}
                  </AvatarFallback>
                </Avatar>
                {selectedContact.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  {selectedContact.name}
                  {selectedContact.isPremium && (
                    <Crown className="w-4 h-4 text-yellow-500" />
                  )}
                </h3>
                <p className="text-sm text-gray-600">{selectedContact.position}</p>
                {isCoffeeChatContact(selectedContact) && (
                  <Badge className="mt-1 bg-amber-100 text-amber-700 text-xs">
                    <Coffee className="w-3 h-3 mr-1" />
                    Coffee Chat Request
                  </Badge>
                )}
                {isCandidateContact(selectedContact) && (
                  <div className="flex items-center gap-2 mt-1">
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
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {selectedContact.isOnline ? 'Online now' : 'Last seen 1 hour ago'}
                </p>
              </div>
            </div>
            
            {/* Action Buttons - Only for candidate contacts */}
            {isCandidateContact(selectedContact) && (
              <div className="flex items-center gap-2">
                <Dialog open={showConsiderationDialog} onOpenChange={setShowConsiderationDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                      <Briefcase className="w-4 h-4 mr-1" />
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
                        <Select value={considerationData.jobId} onValueChange={(value: any) => setConsiderationData(prev => ({ ...prev, jobId: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a job position..." />
                          </SelectTrigger>
                          <SelectContent>
                            {availableJobs.map((job: any) => (
                              <SelectItem key={job.id} value={job.id}>
                                {job.title} - {job.department}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Status Update</Label>
                        <Select value={considerationData.status} onValueChange={(value: any) => setConsiderationData(prev => ({ ...prev, status: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under-consideration">Under Consideration</SelectItem>
                            <SelectItem value="interview-stage">Interview Stage</SelectItem>
                            <SelectItem value="offer">Job Offer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Message</Label>
                        <Textarea
                          placeholder="Hi [Name], I'm excited to share that we'd like to move forward with your application..."
                          value={considerationData.message}
                          onChange={(e) => setConsiderationData(prev => ({ ...prev, message: e.target.value }))}
                          rows={4}
                        />
                      </div>
                      
                      <Button 
                        onClick={submitConsideration}
                        className="w-full bg-[#ff6b35] hover:bg-[#e55a2b] text-white"
                        disabled={!considerationData.jobId || !considerationData.message.trim()}
                      >
                        Send Consideration
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Calendar className="w-4 h-4 mr-1" />
                      Schedule
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Schedule Interview</DialogTitle>
                      <DialogDescription>
                        Schedule an interview with this candidate.
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
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="45">45 minutes</SelectItem>
                              <SelectItem value="60">60 minutes</SelectItem>
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
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
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
                        <Label>Message</Label>
                        <Textarea
                          placeholder="Looking forward to our interview..."
                          value={scheduleData.message}
                          onChange={(e) => setScheduleData(prev => ({ ...prev, message: e.target.value }))}
                          rows={3}
                        />
                      </div>
                      
                      <Button 
                        onClick={scheduleInterview}
                        className="w-full bg-[#ff6b35] hover:bg-[#e55a2b] text-white"
                        disabled={!scheduleData.date || !scheduleData.time}
                      >
                        Schedule Interview
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button size="sm" variant="outline">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {conversationMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.is_mine ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    msg.is_mine
                      ? 'bg-[#ff6b35] text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  {msg.message_type === 'consideration' && (
                    <div className="mb-2 p-2 bg-white/20 rounded border">
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="w-4 h-4" />
                        <span>Job Consideration</span>
                      </div>
                    </div>
                  )}

                  {msg.message_type === 'interview_scheduled' && (
                    <div className="mb-2 p-2 bg-white/20 rounded border">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>Interview Scheduled</span>
                      </div>
                    </div>
                  )}

                  <p className="text-sm leading-relaxed">{msg.content}</p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20">
                    <span className="text-xs opacity-70">{msg.timestamp_display}</span>
                    {msg.is_mine && (
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
