import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { 
  ChatMessage, 
  ChatGroup, 
  ChatRequest, 
  BlockedUser, 
  ChatRequestStatus, 
  MessageType, 
  ChatPaginatedResponse, 
  UserInfo 
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class FakeChatService {
  // Observable sources
  private messagesSource = new BehaviorSubject<ChatMessage[]>([]);
  private activeConversationSource = new BehaviorSubject<any>(null);
  private selectedChatSource = new BehaviorSubject<any>(null);
  private chatRequestsSource = new BehaviorSubject<ChatRequest[]>([]);
  private unreadCountsSource = new BehaviorSubject<{[key: string]: number}>({});

  // Observable streams
  public messages$ = this.messagesSource.asObservable();
  public activeConversation$ = this.activeConversationSource.asObservable();
  public selectedChat$ = this.selectedChatSource.asObservable();
  public chatRequests$ = this.chatRequestsSource.asObservable();
  public unreadCounts$ = this.unreadCountsSource.asObservable();
  
  // Fake data storage
  private fakeUsers: UserInfo[] = [
    { id: 'user1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', profileImage: 'https://randomuser.me/api/portraits/men/1.jpg', online: true },
    { id: 'user2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', profileImage: 'https://randomuser.me/api/portraits/women/2.jpg', online: false },
    { id: 'user3', firstName: 'Robert', lastName: 'Johnson', email: 'robert@example.com', profileImage: 'https://randomuser.me/api/portraits/men/3.jpg', online: true },
    { id: 'user4', firstName: 'Emily', lastName: 'Brown', email: 'emily@example.com', profileImage: 'https://randomuser.me/api/portraits/women/4.jpg', online: true },
    { id: 'user5', firstName: 'Michael', lastName: 'Wilson', email: 'michael@example.com', profileImage: 'https://randomuser.me/api/portraits/men/5.jpg', online: false }
  ];
  
  private fakeGroups: ChatGroup[] = [
    { 
      id: 'group1', 
      name: 'Project Team', 
      description: 'Team working on the main project',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      creator: this.fakeUsers[0],
      admins: [this.fakeUsers[0]],
      members: [this.fakeUsers[0], this.fakeUsers[1], this.fakeUsers[2]],
      memberCount: 3,
      isCurrentUserAdmin: true,
      isCurrentUserCreator: true,
      lastMessage: {
        content: 'Next meeting on Monday',
        senderId: 'user2',
        senderName: 'Jane Smith',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
      }
    },
    { 
      id: 'group2', 
      name: 'Marketing', 
      description: 'Marketing department discussions',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
      creator: this.fakeUsers[1],
      admins: [this.fakeUsers[1]],
      members: [this.fakeUsers[1], this.fakeUsers[3], this.fakeUsers[4]],
      memberCount: 3,
      isCurrentUserAdmin: false,
      isCurrentUserCreator: false,
      lastMessage: {
        content: 'Campaign results are in!',
        senderId: 'user4',
        senderName: 'Emily Brown',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
      }
    }
  ];
  
  private fakeDirectMessages: {[key: string]: ChatMessage[]} = {
    'user1': this.generateFakeConversation('user1', 'John Doe'),
    'user2': this.generateFakeConversation('user2', 'Jane Smith'),
    'user3': this.generateFakeConversation('user3', 'Robert Johnson'),
    'user4': this.generateFakeConversation('user4', 'Emily Brown'),
    'user5': this.generateFakeConversation('user5', 'Michael Wilson')
  };
  
  private fakeGroupMessages: {[key: string]: ChatMessage[]} = {
    'group1': this.generateFakeGroupConversation('group1', 'Project Team'),
    'group2': this.generateFakeGroupConversation('group2', 'Marketing')
  };
  
  private fakeChatRequests: ChatRequest[] = [
    {
      id: 'req1',
      senderId: 'user3',
      senderName: 'Robert Johnson',
      senderProfileImage: 'https://randomuser.me/api/portraits/men/3.jpg',
      receiverId: 'current',
      receiverName: 'Current User',
      status: ChatRequestStatus.PENDING,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
    },
    {
      id: 'req2',
      senderId: 'user4',
      senderName: 'Emily Brown',
      senderProfileImage: 'https://randomuser.me/api/portraits/women/4.jpg',
      receiverId: 'current',
      receiverName: 'Current User',
      status: ChatRequestStatus.PENDING,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    }
  ];
  
  private fakeBlockedUsers: BlockedUser[] = [
    {
      id: 'blocked1',
      userId: 'user5',
      name: 'Michael Wilson',
      profileImage: 'https://randomuser.me/api/portraits/men/5.jpg',
      blockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
    }
  ];
  
  private unreadCounts: {[key: string]: number} = {
    'user1': 2,
    'user3': 1,
    'group1': 3
  };

  constructor() {
    // Initialize with some data
    this.chatRequestsSource.next(this.fakeChatRequests);
    this.unreadCountsSource.next(this.unreadCounts);
  }

  // Helper method to generate fake conversation with a user
  private generateFakeConversation(userId: string, userName: string): ChatMessage[] {
    const messages: ChatMessage[] = [];
    const now = Date.now();
    
    // Add some messages with varying timestamps
    messages.push({
      id: `msg_${userId}_1`,
      content: 'Hey there! How are you doing?',
      messageType: MessageType.TEXT,
      timestamp: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
      senderId: userId,
      senderName: userName,
      senderProfileImage: `https://randomuser.me/api/portraits/${userId.includes('user2') || userId.includes('user4') ? 'women' : 'men'}/${userId.charAt(userId.length - 1)}.jpg`,
      receiverId: 'current',
      read: true
    });
    
    messages.push({
      id: `msg_current_to_${userId}_1`,
      content: 'Hi! I\'m good, thanks for asking. How about you?',
      messageType: MessageType.TEXT,
      timestamp: new Date(now - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
      senderId: 'current',
      senderName: 'Current User',
      receiverId: userId,
      receiverName: userName,
      read: true
    });
    
    messages.push({
      id: `msg_${userId}_2`,
      content: 'I\'m doing well! Just wanted to check in about the project progress.',
      messageType: MessageType.TEXT,
      timestamp: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
      senderId: userId,
      senderName: userName,
      senderProfileImage: `https://randomuser.me/api/portraits/${userId.includes('user2') || userId.includes('user4') ? 'women' : 'men'}/${userId.charAt(userId.length - 1)}.jpg`,
      receiverId: 'current',
      read: userId !== 'user1' && userId !== 'user3'
    });
    
    // Add more messages as needed
    messages.push({
      id: `msg_current_to_${userId}_2`,
      content: 'Yes, the project is going well. I\'ve completed most of my tasks.',
      messageType: MessageType.TEXT,
      timestamp: new Date(now - 1 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(),
      senderId: 'current',
      senderName: 'Current User',
      receiverId: userId,
      receiverName: userName,
      read: true
    });
    
    if (userId === 'user1' || userId === 'user2') {
      messages.push({
        id: `msg_${userId}_3`,
        content: 'Great! Can you share the latest designs?',
        messageType: MessageType.TEXT,
        timestamp: new Date(now - 12 * 60 * 60 * 1000).toISOString(),
        senderId: userId,
        senderName: userName,
        senderProfileImage: `https://randomuser.me/api/portraits/${userId.includes('user2') ? 'women' : 'men'}/${userId.charAt(userId.length - 1)}.jpg`,
        receiverId: 'current',
        read: userId !== 'user1'
      });
    }
    
    return messages;
  }
  
  // Helper method to generate fake group conversation
  private generateFakeGroupConversation(groupId: string, groupName: string): ChatMessage[] {
    const messages: ChatMessage[] = [];
    const now = Date.now();
    
    // Add some group messages with varying timestamps and senders
    messages.push({
      id: `grp_msg_${groupId}_1`,
      content: 'Hello everyone! Welcome to the group.',
      messageType: MessageType.TEXT,
      timestamp: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
      senderId: 'user1',
      senderName: 'John Doe',
      senderProfileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
      groupId: groupId,
      groupName: groupName,
      read: true
    });
    
    messages.push({
      id: `grp_msg_${groupId}_2`,
      content: 'Thanks for adding me to this group!',
      messageType: MessageType.TEXT,
      timestamp: new Date(now - 7 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
      senderId: 'user2',
      senderName: 'Jane Smith',
      senderProfileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
      groupId: groupId,
      groupName: groupName,
      read: true
    });
    
    messages.push({
      id: `grp_msg_${groupId}_3`,
      content: 'I\'ve been working on the new designs, should I share them here?',
      messageType: MessageType.TEXT,
      timestamp: new Date(now - 4 * 24 * 60 * 60 * 1000).toISOString(),
      senderId: 'user3',
      senderName: 'Robert Johnson',
      senderProfileImage: 'https://randomuser.me/api/portraits/men/3.jpg',
      groupId: groupId,
      groupName: groupName,
      read: true
    });
    
    messages.push({
      id: `grp_msg_${groupId}_4`,
      content: 'Yes, please share your progress with the team!',
      messageType: MessageType.TEXT,
      timestamp: new Date(now - 4 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(),
      senderId: 'current',
      senderName: 'Current User',
      groupId: groupId,
      groupName: groupName,
      read: true
    });
    
    if (groupId === 'group1') {
      messages.push({
        id: `grp_msg_${groupId}_5`,
        content: 'Next meeting on Monday',
        messageType: MessageType.TEXT,
        timestamp: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
        senderId: 'user2',
        senderName: 'Jane Smith',
        senderProfileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
        groupId: groupId,
        groupName: groupName,
        read: false
      });
    }
    
    if (groupId === 'group2') {
      messages.push({
        id: `grp_msg_${groupId}_5`,
        content: 'Campaign results are in!',
        messageType: MessageType.TEXT,
        timestamp: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
        senderId: 'user4',
        senderName: 'Emily Brown',
        senderProfileImage: 'https://randomuser.me/api/portraits/women/4.jpg',
        groupId: groupId,
        groupName: groupName,
        read: false
      });
    }
    
    return messages;
  }

  // API methods that mirror the real service but return fake data
  
  setActiveConversation(conversation: any): void {
    this.activeConversationSource.next(conversation);
    this.selectedChatSource.next(conversation);
    
    // Load messages for this conversation
    if (conversation) {
      if (conversation.userId) {
        // Direct conversation
        const userId = conversation.userId;
        this.getDirectMessages(userId).subscribe(messages => {
          this.messagesSource.next(messages.content);
        });
        
        // Reset unread count
        this.resetUnreadCount(userId);
      } else if (conversation.id) {
        // Group conversation
        const groupId = conversation.id;
        this.getGroupMessages(groupId).subscribe(messages => {
          this.messagesSource.next(messages.content);
        });
        
        // Reset unread count
        this.resetUnreadCount(groupId);
      }
    }
  }
  
  setSelectedChat(chat: any): void {
    this.selectedChatSource.next(chat);
    this.activeConversationSource.next(chat);
  }

  sendDirectMessage(receiverId: string, content: string, messageType: MessageType = MessageType.TEXT): Observable<ChatMessage> {
    // Create new message
    const newMessage: ChatMessage = {
      id: `msg_current_to_${receiverId}_${Date.now()}`,
      content: content,
      messageType: messageType,
      timestamp: new Date().toISOString(),
      senderId: 'current',
      senderName: 'Current User',
      receiverId: receiverId,
      receiverName: this.fakeUsers.find(u => u.id === receiverId)?.firstName + ' ' + this.fakeUsers.find(u => u.id === receiverId)?.lastName,
      read: false
    };
    
    // Add to message list
    const currentMessages = this.messagesSource.value;
    this.messagesSource.next([...currentMessages, newMessage]);
    
    // Add to fake direct messages
    if (this.fakeDirectMessages[receiverId]) {
      this.fakeDirectMessages[receiverId].push(newMessage);
    } else {
      this.fakeDirectMessages[receiverId] = [newMessage];
    }
    
    // Return as observable with slight delay to simulate network
    return of(newMessage).pipe(delay(300));
  }

  sendGroupMessage(groupId: string, content: string, messageType: MessageType = MessageType.TEXT): Observable<ChatMessage> {
    // Find group
    const group = this.fakeGroups.find(g => g.id === groupId);
    
    // Create new message
    const newMessage: ChatMessage = {
      id: `grp_msg_${groupId}_${Date.now()}`,
      content: content,
      messageType: messageType,
      timestamp: new Date().toISOString(),
      senderId: 'current',
      senderName: 'Current User',
      groupId: groupId,
      groupName: group?.name || 'Group',
      read: false
    };
    
    // Add to message list
    const currentMessages = this.messagesSource.value;
    this.messagesSource.next([...currentMessages, newMessage]);
    
    // Add to fake group messages
    if (this.fakeGroupMessages[groupId]) {
      this.fakeGroupMessages[groupId].push(newMessage);
    } else {
      this.fakeGroupMessages[groupId] = [newMessage];
    }
    
    // Return as observable with slight delay to simulate network
    return of(newMessage).pipe(delay(300));
  }

  getDirectMessages(userId: string, page: number = 0, size: number = 20): Observable<ChatPaginatedResponse> {
    const messages = this.fakeDirectMessages[userId] || [];
    
    // Sort by timestamp
    const sortedMessages = [...messages].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // Paginate
    const start = page * size;
    const end = start + size;
    const paginatedMessages = sortedMessages.slice(start, end);
    
    // Create paginated response
    const response: ChatPaginatedResponse = {
      content: paginatedMessages,
      pageable: {
        pageNumber: page,
        pageSize: size,
        sort: null
      },
      totalElements: messages.length,
      totalPages: Math.ceil(messages.length / size),
      last: (page + 1) * size >= messages.length,
      first: page === 0,
      empty: paginatedMessages.length === 0,
      size: paginatedMessages.length,
      number: page
    };
    
    return of(response).pipe(delay(300));
  }

  getGroupMessages(groupId: string, page: number = 0, size: number = 20): Observable<ChatPaginatedResponse> {
    const messages = this.fakeGroupMessages[groupId] || [];
    
    // Sort by timestamp
    const sortedMessages = [...messages].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // Paginate
    const start = page * size;
    const end = start + size;
    const paginatedMessages = sortedMessages.slice(start, end);
    
    // Create paginated response
    const response: ChatPaginatedResponse = {
      content: paginatedMessages,
      pageable: {
        pageNumber: page,
        pageSize: size,
        sort: null
      },
      totalElements: messages.length,
      totalPages: Math.ceil(messages.length / size),
      last: (page + 1) * size >= messages.length,
      first: page === 0,
      empty: paginatedMessages.length === 0,
      size: paginatedMessages.length,
      number: page
    };
    
    return of(response).pipe(delay(300));
  }

  markMessageAsRead(messageId: string): Observable<ChatMessage> {
    // Find and update message
    let foundMessage: ChatMessage | undefined;
    
    // Check in direct messages
    for (const userId in this.fakeDirectMessages) {
      const messages = this.fakeDirectMessages[userId];
      const message = messages.find(m => m.id === messageId);
      if (message) {
        message.read = true;
        message.readAt = new Date().toISOString();
        foundMessage = message;
        break;
      }
    }
    
    // Check in group messages if not found
    if (!foundMessage) {
      for (const groupId in this.fakeGroupMessages) {
        const messages = this.fakeGroupMessages[groupId];
        const message = messages.find(m => m.id === messageId);
        if (message) {
          message.read = true;
          message.readAt = new Date().toISOString();
          foundMessage = message;
          break;
        }
      }
    }
    
    // Update in current messages list
    if (foundMessage) {
      const currentMessages = this.messagesSource.value;
      const updatedMessages = currentMessages.map(msg => 
        msg.id === messageId ? {...msg, read: true, readAt: new Date().toISOString()} : msg
      );
      this.messagesSource.next(updatedMessages);
    }
    
    return of(foundMessage || {} as ChatMessage).pipe(delay(200));
  }

  markAllMessagesFromSenderAsRead(senderId: string): Observable<any> {
    // Update messages in the fake data and in the current list
    if (this.fakeDirectMessages[senderId]) {
      this.fakeDirectMessages[senderId].forEach(message => {
        if (message.senderId === senderId) {
          message.read = true;
          message.readAt = new Date().toISOString();
        }
      });
    }
    
    // Reset unread count
    this.resetUnreadCount(senderId);
    
    return of({success: true}).pipe(delay(200));
  }

  resetUnreadCount(id: string): void {
    const counts = {...this.unreadCountsSource.value};
    counts[id] = 0;
    this.unreadCountsSource.next(counts);
  }

  getAllUsers(): Observable<UserInfo[]> {
    return of(this.fakeUsers).pipe(delay(300));
  }

  searchUsers(query: string): Observable<UserInfo[]> {
    query = query.toLowerCase();
    const results = this.fakeUsers.filter(user => 
      user.firstName?.toLowerCase().includes(query) || 
      user.lastName?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    );
    
    return of(results).pipe(delay(300));
  }

  canChatWithUser(userId: string): Observable<boolean> {
    // Check if user is blocked
    const isBlocked = this.fakeBlockedUsers.some(b => b.userId === userId);
    return of(!isBlocked).pipe(delay(200));
  }

  getPendingRequests(): Observable<ChatRequest[]> {
    return of(this.fakeChatRequests.filter(r => r.status === ChatRequestStatus.PENDING)).pipe(delay(300));
  }

  approveChatRequest(requestId: string): void {
    const request = this.fakeChatRequests.find(r => r.id === requestId);
    if (request) {
      request.status = ChatRequestStatus.APPROVED;
      this.chatRequestsSource.next([...this.fakeChatRequests]);
    }
  }

  rejectChatRequest(requestId: string): void {
    const request = this.fakeChatRequests.find(r => r.id === requestId);
    if (request) {
      request.status = ChatRequestStatus.REJECTED;
      this.chatRequestsSource.next([...this.fakeChatRequests]);
    }
  }

  getUserGroups(): Observable<ChatGroup[]> {
    return of(this.fakeGroups).pipe(delay(300));
  }
  
  getBlockedUsers(): Observable<BlockedUser[]> {
    return of(this.fakeBlockedUsers).pipe(delay(300));
  }
  
  unblockUser(userId: string): Observable<void> {
    this.fakeBlockedUsers = this.fakeBlockedUsers.filter(b => b.userId !== userId);
    return of(undefined).pipe(delay(300));
  }
  
  // This is specific to fake service - let's add a method to simulate incoming messages
  simulateIncomingMessage(senderId: string, content: string): void {
    // Find the sender
    const sender = this.fakeUsers.find(u => u.id === senderId);
    
    if (sender) {
      const newMessage: ChatMessage = {
        id: `msg_${senderId}_${Date.now()}`,
        content: content,
        messageType: MessageType.TEXT,
        timestamp: new Date().toISOString(),
        senderId: senderId,
        senderName: `${sender.firstName} ${sender.lastName}`,
        senderProfileImage: sender.profileImage,
        receiverId: 'current',
        read: false
      };
      
      // Add to fake direct messages
      if (this.fakeDirectMessages[senderId]) {
        this.fakeDirectMessages[senderId].push(newMessage);
      } else {
        this.fakeDirectMessages[senderId] = [newMessage];
      }
      
      // Add to current messages if this user is active
      const activeConversation = this.activeConversationSource.value;
      if (activeConversation && activeConversation.userId === senderId) {
        const currentMessages = this.messagesSource.value;
        this.messagesSource.next([...currentMessages, newMessage]);
      }
      
      // Update unread count
      const counts = {...this.unreadCountsSource.value};
      counts[senderId] = (counts[senderId] || 0) + 1;
      this.unreadCountsSource.next(counts);
    }
  }
  
  // Fake method for group creation simulation
  createGroup(groupData: { name: string, description: string }): Observable<ChatGroup> {
    const newGroup: ChatGroup = {
      id: `group${this.fakeGroups.length + 1}`,
      name: groupData.name,
      description: groupData.description,
      createdAt: new Date().toISOString(),
      creator: { id: 'current', firstName: 'Current', lastName: 'User' },
      admins: [{ id: 'current', firstName: 'Current', lastName: 'User' }],
      members: [{ id: 'current', firstName: 'Current', lastName: 'User' }],
      memberCount: 1,
      isCurrentUserAdmin: true,
      isCurrentUserCreator: true
    };
    
    this.fakeGroups.push(newGroup);
    
    // Initialize empty message array for this group
    this.fakeGroupMessages[newGroup.id] = [];
    
    return of(newGroup).pipe(delay(500));
  }
  
  // Simulate deleting a message
  deleteMessage(messageId: string): Observable<any> {
    // Find and mark message as deleted across all message collections
    let foundMessage: ChatMessage | undefined;
    
    // Check and update in direct messages
    for (const userId in this.fakeDirectMessages) {
      const index = this.fakeDirectMessages[userId].findIndex(m => m.id === messageId);
      if (index !== -1) {
        this.fakeDirectMessages[userId][index].deleted = true;
        this.fakeDirectMessages[userId][index].content = 'This message was deleted';
        foundMessage = this.fakeDirectMessages[userId][index];
        break;
      }
    }
    
    // Check in group messages if not found
    if (!foundMessage) {
      for (const groupId in this.fakeGroupMessages) {
        const index = this.fakeGroupMessages[groupId].findIndex(m => m.id === messageId);
        if (index !== -1) {
          this.fakeGroupMessages[groupId][index].deleted = true;
          this.fakeGroupMessages[groupId][index].content = 'This message was deleted';
          foundMessage = this.fakeGroupMessages[groupId][index];
          break;
        }
      }
    }
    
    // Update current message list if needed
    if (foundMessage) {
      const currentMessages = this.messagesSource.value;
      const updatedMessages = currentMessages.map(msg => 
        msg.id === messageId ? {...msg, deleted: true, content: 'This message was deleted'} : msg
      );
      this.messagesSource.next(updatedMessages);
    }
    
    return of({success: true}).pipe(delay(300));
  }
} 