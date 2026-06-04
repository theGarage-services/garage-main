/**
 * Custom hook for chat functionality.
 * Provides centralized chat state management and API integration.
 */
import { useState, useEffect, useCallback } from 'react';
import * as chatApi from '../api/chat';
import type {
  Conversation,
  Message,
  CoffeeChatRequest,
  ConsiderationRequest,
  ChatNotification,
  ConversationStats,
  CreateMessageRequest,
  CreateCoffeeChatRequest,
  CreateConsiderationRequest,
} from '../api/chat';

interface UseChatReturn {
  // Conversations
  conversations: Conversation[];
  isLoadingConversations: boolean;
  errorConversations: string | null;
  refreshConversations: () => Promise<void>;
  
  // Current conversation
  currentConversation: Conversation | null;
  setCurrentConversation: (conv: Conversation | null) => void;
  conversationMessages: Message[];
  isLoadingMessages: boolean;
  loadMessages: (conversationId: number) => Promise<void>;
  sendMessage: (data: CreateMessageRequest) => Promise<void>;
  markAsRead: (conversationId: number) => Promise<void>;
  
  // Coffee Chat
  coffeeChatRequests: CoffeeChatRequest[];
  receivedCoffeeChats: CoffeeChatRequest[];
  sentCoffeeChats: CoffeeChatRequest[];
  isLoadingCoffeeChats: boolean;
  sendCoffeeChatRequest: (data: CreateCoffeeChatRequest) => Promise<CoffeeChatRequest>;
  acceptCoffeeChat: (id: number, message?: string) => Promise<void>;
  declineCoffeeChat: (id: number, message?: string) => Promise<void>;
  
  // Considerations
  considerationRequests: ConsiderationRequest[];
  receivedConsiderations: ConsiderationRequest[];
  sentConsiderations: ConsiderationRequest[];
  isLoadingConsiderations: boolean;
  sendConsideration: (data: CreateConsiderationRequest) => Promise<ConsiderationRequest>;
  acceptConsideration: (id: number, message?: string) => Promise<void>;
  declineConsideration: (id: number, message?: string) => Promise<void>;
  
  // Notifications
  notifications: ChatNotification[];
  unreadCount: number;
  isLoadingNotifications: boolean;
  refreshNotifications: () => Promise<void>;
  markNotificationRead: (id: number) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  
  // Stats
  stats: ConversationStats | null;
  refreshStats: () => Promise<void>;
  
  // Init chat
  initChatFromJob: (jobId: number, candidateId?: number) => Promise<Conversation>;
  initChatFromProfile: (userId: number) => Promise<Conversation>;
}

export function useChat(): UseChatReturn {
  // Conversations state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [errorConversations, setErrorConversations] = useState<string | null>(null);
  
  // Current conversation state
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [conversationMessages, setConversationMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  
  // Coffee chat state
  const [coffeeChatRequests, setCoffeeChatRequests] = useState<CoffeeChatRequest[]>([]);
  const [receivedCoffeeChats, setReceivedCoffeeChats] = useState<CoffeeChatRequest[]>([]);
  const [sentCoffeeChats, setSentCoffeeChats] = useState<CoffeeChatRequest[]>([]);
  const [isLoadingCoffeeChats, setIsLoadingCoffeeChats] = useState(false);
  
  // Considerations state
  const [considerationRequests, setConsiderationRequests] = useState<ConsiderationRequest[]>([]);
  const [receivedConsiderations, setReceivedConsiderations] = useState<ConsiderationRequest[]>([]);
  const [sentConsiderations, setSentConsiderations] = useState<ConsiderationRequest[]>([]);
  const [isLoadingConsiderations, setIsLoadingConsiderations] = useState(false);
  
  // Notifications state
  const [notifications, setNotifications] = useState<ChatNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  
  // Stats state
  const [stats, setStats] = useState<ConversationStats | null>(null);

  // Load conversations
  const refreshConversations = useCallback(async () => {
    setIsLoadingConversations(true);
    setErrorConversations(null);
    try {
      const data = await chatApi.getConversations();
      setConversations(data);
    } catch (err) {
      setErrorConversations(err instanceof Error ? err.message : 'Failed to load conversations');
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  // Load messages for conversation
  const loadMessages = useCallback(async (conversationId: number) => {
    setIsLoadingMessages(true);
    try {
      const data = await chatApi.getConversationMessages(conversationId);
      setConversationMessages(data);
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  // Send message
  const sendMessage = useCallback(async (data: CreateMessageRequest) => {
    try {
      await chatApi.sendMessage(data);
      // Refresh messages
      await loadMessages(data.conversation);
    } catch (err) {
      console.error('Failed to send message:', err);
      throw err;
    }
  }, [loadMessages]);

  // Mark conversation as read
  const markAsRead = useCallback(async (conversationId: number) => {
    try {
      await chatApi.markConversationAsRead(conversationId);
      await refreshConversations();
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  }, [refreshConversations]);

  // Load coffee chats
  const refreshCoffeeChats = useCallback(async () => {
    setIsLoadingCoffeeChats(true);
    try {
      const [all, received, sent] = await Promise.all([
        chatApi.getCoffeeChatRequests(),
        chatApi.getReceivedCoffeeChatRequests(),
        chatApi.getSentCoffeeChatRequests(),
      ]);
      setCoffeeChatRequests(all);
      setReceivedCoffeeChats(received);
      setSentCoffeeChats(sent);
    } catch (err) {
      console.error('Failed to load coffee chats:', err);
    } finally {
      setIsLoadingCoffeeChats(false);
    }
  }, []);

  // Send coffee chat request
  const sendCoffeeChatRequest = useCallback(async (data: CreateCoffeeChatRequest) => {
    const result = await chatApi.createCoffeeChatRequest(data);
    await refreshCoffeeChats();
    return result;
  }, [refreshCoffeeChats]);

  // Accept/decline coffee chat
  const acceptCoffeeChat = useCallback(async (id: number, message?: string) => {
    await chatApi.acceptCoffeeChatRequest(id, message);
    await refreshCoffeeChats();
  }, [refreshCoffeeChats]);

  const declineCoffeeChat = useCallback(async (id: number, message?: string) => {
    await chatApi.declineCoffeeChatRequest(id, message);
    await refreshCoffeeChats();
  }, [refreshCoffeeChats]);

  // Load considerations
  const refreshConsiderations = useCallback(async () => {
    setIsLoadingConsiderations(true);
    try {
      const [all, received, sent] = await Promise.all([
        chatApi.getConsiderationRequests(),
        chatApi.getReceivedConsiderations(),
        chatApi.getSentConsiderations(),
      ]);
      setConsiderationRequests(all);
      setReceivedConsiderations(received);
      setSentConsiderations(sent);
    } catch (err) {
      console.error('Failed to load considerations:', err);
    } finally {
      setIsLoadingConsiderations(false);
    }
  }, []);

  // Send consideration
  const sendConsideration = useCallback(async (data: CreateConsiderationRequest) => {
    const result = await chatApi.createConsiderationRequest(data);
    await refreshConsiderations();
    return result;
  }, [refreshConsiderations]);

  // Accept/decline consideration
  const acceptConsideration = useCallback(async (id: number, message?: string) => {
    await chatApi.acceptConsideration(id, message);
    await refreshConsiderations();
  }, [refreshConsiderations]);

  const declineConsideration = useCallback(async (id: number, message?: string) => {
    await chatApi.declineConsideration(id, message);
    await refreshConsiderations();
  }, [refreshConsiderations]);

  // Load notifications
  const refreshNotifications = useCallback(async () => {
    setIsLoadingNotifications(true);
    try {
      const [notifs, count] = await Promise.all([
        chatApi.getChatNotifications(),
        chatApi.getUnreadNotificationCount(),
      ]);
      setNotifications(notifs);
      setUnreadCount(count.unread_count);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setIsLoadingNotifications(false);
    }
  }, []);

  // Mark notification as read
  const markNotificationRead = useCallback(async (id: number) => {
    await chatApi.markNotificationAsRead(id);
    await refreshNotifications();
  }, [refreshNotifications]);

  // Mark all notifications as read
  const markAllNotificationsRead = useCallback(async () => {
    await chatApi.markAllNotificationsAsRead();
    await refreshNotifications();
  }, [refreshNotifications]);

  // Load stats
  const refreshStats = useCallback(async () => {
    try {
      const data = await chatApi.getConversationStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }, []);

  // Init chat from job
  const initChatFromJob = useCallback(async (jobId: number, candidateId?: number) => {
    const result = await chatApi.initChatFromJob(jobId, candidateId);
    await refreshConversations();
    return result.conversation;
  }, [refreshConversations]);

  // Init chat from profile
  const initChatFromProfile = useCallback(async (userId: number) => {
    const result = await chatApi.initChatFromProfile(userId);
    await refreshConversations();
    return result.conversation;
  }, [refreshConversations]);

  // Initial load
  useEffect(() => {
    refreshConversations();
    refreshCoffeeChats();
    refreshConsiderations();
    refreshNotifications();
    refreshStats();
  }, [refreshConversations, refreshCoffeeChats, refreshConsiderations, refreshNotifications, refreshStats]);

  return {
    // Conversations
    conversations,
    isLoadingConversations,
    errorConversations,
    refreshConversations,
    
    // Current conversation
    currentConversation,
    setCurrentConversation,
    conversationMessages,
    isLoadingMessages,
    loadMessages,
    sendMessage,
    markAsRead,
    
    // Coffee Chat
    coffeeChatRequests,
    receivedCoffeeChats,
    sentCoffeeChats,
    isLoadingCoffeeChats,
    sendCoffeeChatRequest,
    acceptCoffeeChat,
    declineCoffeeChat,
    
    // Considerations
    considerationRequests,
    receivedConsiderations,
    sentConsiderations,
    isLoadingConsiderations,
    sendConsideration,
    acceptConsideration,
    declineConsideration,
    
    // Notifications
    notifications,
    unreadCount,
    isLoadingNotifications,
    refreshNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    
    // Stats
    stats,
    refreshStats,
    
    // Init chat
    initChatFromJob,
    initChatFromProfile,
  };
}
