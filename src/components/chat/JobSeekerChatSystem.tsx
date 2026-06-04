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
  MoreHorizontal,
} from 'lucide-react';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { useChat } from '../../hooks/useChat';
import type { Message as ApiMessage } from '../../api/chat';

type MessageSender = 'job-seeker' | 'recruiter' | 'peer';
type MessageType = 'text' | 'file' | 'consideration' | 'interview-scheduled';
type MessageStatus = 'sent' | 'delivered' | 'read';
type ActiveTab = 'coffee-chats' | 'recruiters';
type ContactUnion = CoffeeChatContact | RecruiterContact;

interface Message {
  id: string;
  sender: MessageSender;
  content: string;
  timestamp: string;
  type: MessageType;
  status: MessageStatus;
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
  const [activeTab, setActiveTab] = useState<ActiveTab>('coffee-chats');
  const [selectedContact, setSelectedContact] = useState<ContactUnion | null>(initialContact);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set());
  
  // Toggle filters for Coffee Chats tab
  const [showRecruiters, setShowRecruiters] = useState(true);
  const [showJobSeekers, setShowJobSeekers] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use chat hook for API integration
  const {
    conversations,
    currentConversation,
    conversationMessages,
    loadMessages,
    sendMessage: sendApiMessage,
    markAsRead,
  } = useChat();

  // Messages now come from API via conversationMessages
  const messages: Message[] = conversationMessages.map((apiMsg: ApiMessage) => ({
    id: apiMsg.id.toString(),
    sender: apiMsg.sender.id === currentConversation?.participants?.[0]?.id ? 'recruiter' : 'job-seeker',
    content: apiMsg.content,
    timestamp: new Date(apiMsg.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    type: apiMsg.message_type as MessageType,
    status: apiMsg.status as MessageStatus,
  }));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message via API
  const handleSendMessage = async () => {
    if (!message.trim() || !currentConversation) return;

    try {
      await sendApiMessage({
        conversation: currentConversation.id,
        content: message,
        message_type: 'text',
      });
      setMessage('');
      // Refresh messages
      await loadMessages(currentConversation.id);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversation?.id) {
      loadMessages(currentConversation.id);
      markAsRead(currentConversation.id);
    }
  }, [currentConversation?.id, loadMessages, markAsRead]);


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

  // Transform API conversations into contact format
  const filteredCoffeeChatContacts: CoffeeChatContact[] = conversations
    .filter(c => c.conversation_type === 'coffee')
    .map(c => ({
      id: c.id.toString(),
      name: c.other_participant?.username || c.participants?.[0]?.username || 'Unknown',
      avatar: (c.other_participant?.username || c.participants?.[0]?.username || '?')[0].toUpperCase(),
      position: c.other_participant?.role || 'Professional',
      company: c.job?.company || '',
      isOnline: c.participant_details?.find(p => p.user.id === c.other_participant?.id)?.is_online || false,
      lastMessage: c.last_message_preview || 'No messages yet',
      lastMessageTime: c.last_message_at
        ? new Date(c.last_message_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        : '',
      unreadCount: c.unread_count || 0,
      get contactType(): 'recruiter' | 'job-seeker' { return (c.other_participant?.role === 'recruiter' ? 'recruiter' : 'job-seeker'); },
    })).filter(contact => {
      const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           contact.position.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        (showRecruiters && contact.contactType === 'recruiter') ||
        (showJobSeekers && contact.contactType === 'job-seeker');
      return matchesSearch && matchesFilter;
    });

  // Group job conversations by role
  const recruitersByRole: JobRoleGroup[] = conversations
    .filter(c => c.conversation_type === 'job')
    .reduce((groups: JobRoleGroup[], c) => {
      const roleTitle = c.job?.title || 'Unknown Position';
      const roleId = c.job?.id?.toString() || c.id.toString();
      const company = c.job?.company || 'Unknown Company';

      let group = groups.find(g => g.roleId === roleId);
      if (!group) {
        group = {
          roleTitle,
          roleId,
          company,
          totalConversations: 0,
          unreadCount: 0,
          applicationMethod: c.application_method || 'manual',
          recruiters: []
        };
        groups.push(group);
      }

      const otherParticipant = c.other_participant || c.participants?.[0];
      const participantDetail = c.participant_details?.find(p => p.user.id === otherParticipant?.id);

      group.recruiters.push({
        id: c.id.toString(),
        name: otherParticipant?.username || 'Unknown',
        avatar: (otherParticipant?.username || '?')[0].toUpperCase(),
        position: otherParticipant?.role || 'Recruiter',
        company,
        isOnline: participantDetail?.is_online || false,
        lastMessage: c.last_message_preview || 'No messages yet',
        lastMessageTime: c.last_message_at
          ? new Date(c.last_message_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
          : '',
        unreadCount: c.unread_count || 0,
        jobRole: roleTitle,
        jobId: roleId,
        applicationMethod: c.application_method || 'manual',
        initiatedBy: (c.initiated_by || 'recruiter') as 'recruiter' | 'job-seeker',
        responseRate: 85,
        avgResponseTime: '2h',
        successRate: 75,
        interviewRate: 40,
      });

      group.totalConversations++;
      group.unreadCount += c.unread_count || 0;

      return groups;
    }, []);

  const filteredRecruitersByRole = recruitersByRole.map(roleGroup => ({
    ...roleGroup,
    recruiters: roleGroup.recruiters.filter(recruiter =>
      recruiter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recruiter.position.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(roleGroup => roleGroup.recruiters.length > 0);

  const totalCoffeeChatUnread = filteredCoffeeChatContacts.reduce((sum, contact) => sum + contact.unreadCount, 0);
  const totalRecruiterUnread = recruitersByRole.reduce((sum, role) => sum + role.unreadCount, 0);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
        <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as ActiveTab)} className="w-full">
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
      return <EmptyChatState activeTab={activeTab} />;
    }

    const contactType = getContactType(selectedContact);
    const showRecruiterStats = contactType === 'recruiter';

    return (
      <Card className="h-full flex flex-col">
        <ChatHeader
          contact={selectedContact}
          contactType={contactType}
          activeTab={activeTab}
        />
        {showRecruiterStats && <RecruiterStats contact={selectedContact} contactType={contactType} />}
        <MessageList messages={messages} messagesEndRef={messagesEndRef} />
        <MessageInput
          message={message}
          setMessage={setMessage}
          sendMessage={handleSendMessage}
          handleKeyPress={handleKeyPress}
        />
      </Card>
    );
  }
}

// Helper to determine contact type
function getContactType(contact: ContactUnion): MessageSender {
  if ('jobRole' in contact) return 'recruiter';
  if (contact.contactType === 'recruiter') return 'recruiter';
  return 'job-seeker';
}

// Sub-components for renderChatArea

interface EmptyChatStateProps {
  activeTab: ActiveTab;
}

function EmptyChatState({ activeTab }: Readonly<EmptyChatStateProps>) {
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

interface ChatHeaderProps {
  contact: ContactUnion;
  contactType: MessageSender;
  activeTab: ActiveTab;
}

function ChatHeader({ contact, contactType, activeTab }: Readonly<ChatHeaderProps>) {
  const isRecruiter = contactType === 'recruiter';
  const avatarColor = isRecruiter ? 'bg-blue-500' : 'bg-[#ff6b35]';

  return (
    <div className="p-4 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <Avatar className="w-10 h-10">
              <AvatarFallback className={`${avatarColor} text-white`}>
                {contact.avatar}
              </AvatarFallback>
            </Avatar>
            {contact.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              {contact.name}
              {contact.isPremium && <Crown className="w-4 h-4 text-yellow-500" />}
            </h3>
            <p className="text-sm text-gray-600">{contact.position}</p>
            <ChatBadges contact={contact} contactType={contactType} activeTab={activeTab} />
            <p className="text-xs text-gray-500 mt-1">
              {contact.isOnline ? 'Online now' : 'Last seen 1 hour ago'}
            </p>
          </div>
        </div>

        <Button size="sm" variant="outline">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

interface ChatBadgesProps {
  contact: ContactUnion;
  contactType: MessageSender;
  activeTab: ActiveTab;
}

function ChatBadges({ contact, contactType, activeTab }: Readonly<ChatBadgesProps>) {
  const badges = [];

  if ('contactType' in contact && activeTab === 'coffee-chats') {
    badges.push(
      <Badge key="coffee" className="bg-amber-100 text-amber-700 text-xs">
        <Coffee className="w-3 h-3 mr-1" />
        Coffee Chat
      </Badge>
    );
  }

  if (contactType === 'recruiter') {
    badges.push(
      <Badge key="recruiter" className="bg-blue-100 text-blue-700 text-xs">Recruiter</Badge>
    );
  } else if ('contactType' in contact && contact.contactType === 'job-seeker') {
    badges.push(
      <Badge key="jobseeker" className="bg-green-100 text-green-700 text-xs">
        <Users className="w-3 h-3 mr-1" />
        Job Seeker
      </Badge>
    );
  }

  if ('jobRole' in contact) {
    badges.push(
      <Badge key="role" className="bg-gray-100 text-gray-700 text-xs">{contact.jobRole}</Badge>,
      <Badge
        key="method"
        className={`text-xs ${
          contact.applicationMethod === 'manual'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-purple-100 text-purple-700'
        }`}
      >
        {contact.applicationMethod === 'manual' ? 'Manual Apply' : 'Auto Applied'}
      </Badge>
    );
  }

  return <div className="flex items-center gap-2 mt-1">{badges}</div>;
}

interface RecruiterStatsProps {
  contact: ContactUnion;
  contactType: MessageSender;
}

function RecruiterStats({ contact, contactType }: Readonly<RecruiterStatsProps>) {
  const stats = getRecruiterStats(contact, contactType);

  return (
    <div className="mt-4 mx-4 grid grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg">
      <StatItem icon={<TrendingUp className="w-3 h-3 text-green-600" />} value={`${stats.responseRate}%`} label="Response Rate" />
      <StatItem icon={<Clock className="w-3 h-3 text-blue-600" />} value={stats.avgResponseTime} label="Avg Response" />
      <StatItem icon={<Award className="w-3 h-3 text-yellow-600" />} value={`${stats.successRate}%`} label="Success Rate" />
      <StatItem
        icon={<Target className="w-3 h-3 text-[#ff6b35]" />}
        value={stats.fourthStat.value + (stats.fourthStat.isPercentage ? '%' : '')}
        label={stats.fourthStat.label}
      />
    </div>
  );
}

interface StatItemProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}

function StatItem({ icon, value, label }: Readonly<StatItemProps>) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-900">
        {icon}
        {value}
      </div>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function getRecruiterStats(contact: ContactUnion, contactType: string) {
  const isRecruiter = contactType === 'recruiter';
  const hasProp = (key: string) => key in contact;

  const getNumber = (key: 'responseRate' | 'successRate') =>
    hasProp(key) ? (contact[key] as number) : 0;

  const getTime = () =>
    hasProp('avgResponseTime') ? (contact.avgResponseTime ?? 'N/A') : 'N/A';

  const getFourthStat = () => {
    if (isRecruiter && 'interviewRate' in contact) {
      return { value: contact.interviewRate ?? 'N/A', label: 'Interview Rate', isPercentage: true };
    }
    return { value: ('totalHires' in contact && contact.totalHires) || 'N/A', label: 'Total Hires', isPercentage: false };
  };

  return {
    responseRate: getNumber('responseRate'),
    avgResponseTime: getTime(),
    successRate: getNumber('successRate'),
    fourthStat: getFourthStat()
  };
}

interface MessageListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

function MessageList({ messages, messagesEndRef }: Readonly<MessageListProps>) {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((msg) => (
          <MessageItem key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}

interface MessageItemProps {
  message: Message;
}

function MessageItem({ message }: Readonly<MessageItemProps>) {
  const isJobSeeker = message.sender === 'job-seeker';
  const isRecruiter = message.sender === 'recruiter';

  const bgClass = isJobSeeker
    ? 'bg-[#ff6b35] text-white'
    : isRecruiter
      ? 'bg-blue-50 border border-blue-200'
      : 'bg-white border border-gray-200';

  return (
    <div className={`flex ${isJobSeeker ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] p-3 rounded-lg ${bgClass}`}>
        {message.type === 'consideration' && <MessageMetadata icon={<Briefcase className="w-4 h-4" />} text={`Job Consideration: ${message.metadata?.jobTitle}`} />}
        {message.type === 'interview-scheduled' && <MessageMetadata icon={<Calendar className="w-4 h-4" />} text="Interview Scheduled" />}

        <p className="text-sm leading-relaxed">{message.content}</p>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-current/20">
          <span className="text-xs opacity-70">{message.timestamp}</span>
          {isJobSeeker && <MessageStatus status={message.status} />}
        </div>
      </div>
    </div>
  );
}

interface MessageMetadataProps {
  icon: React.ReactNode;
  text: string;
}

function MessageMetadata({ icon, text }: Readonly<MessageMetadataProps>) {
  return (
    <div className="mb-2 p-2 bg-white/20 rounded border">
      <div className="flex items-center gap-2 text-sm">
        {icon}
        <span>{text}</span>
      </div>
    </div>
  );
}

interface MessageStatusProps {
  status: MessageStatus;
}

function MessageStatus({ status }: Readonly<MessageStatusProps>) {
  const iconClass = 'w-3 h-3';

  if (status === 'read') return <CheckCircle className={iconClass} />;
  if (status === 'delivered') return <CheckCircle className={`${iconClass} opacity-50`} />;
  return <Clock className={`${iconClass} opacity-50`} />;
}

interface MessageInputProps {
  message: string;
  setMessage: (msg: string) => void;
  sendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

function MessageInput({ message, setMessage, sendMessage, handleKeyPress }: Readonly<MessageInputProps>) {
  return (
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
          <Button size="sm" variant="ghost" className="absolute right-1 top-1/2 transform -translate-y-1/2">
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
  );
}
