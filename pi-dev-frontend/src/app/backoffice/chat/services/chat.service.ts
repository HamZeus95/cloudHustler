import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ChatMessage, ChatRequest, ChatGroup, BlockedUser, ChatRequestStatus, NotConsumer, MessageType, ChatPaginatedResponse } from '../models';
import { TokenStorageService } from "../../../auth/service/token-storage.service";
import { ChatWebsocketService } from './chat-websocket.service';

export interface TypingStatus {
  conversationId: string;
  isTyping: boolean;
  user?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = `/api/v1/chat/`;
  
  // Observable sources
  private messagesSource = new BehaviorSubject<ChatMessage[]>([]);
  private activeConversationSource = new BehaviorSubject<any>(null);
  private selectedChatSource = new BehaviorSubject<any>(null);
  private chatRequestsSource = new BehaviorSubject<ChatRequest[]>([]);
  private unreadCountsSource = new BehaviorSubject<{[key: string]: number}>({});
  private typingStatusSource = new BehaviorSubject<TypingStatus | null>(null);
  

  // Observable streams
  public messages$ = this.messagesSource.asObservable();
  public activeConversation$ = this.activeConversationSource.asObservable();
  public selectedChat$ = this.selectedChatSource.asObservable();
  public chatRequests$ = this.chatRequestsSource.asObservable();
  public unreadCounts$ = this.unreadCountsSource.asObservable();
  public typingStatus$ = this.typingStatusSource.asObservable();
  
  private connected = false;

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService,
    private chatWebsocketService: ChatWebsocketService,
  ) {
    
    // Subscribe to websocket messages to update message list
    this.chatWebsocketService.getDirectMessages().subscribe(message => {
      this.addMessageToList(message as ChatMessage);
    });

    this.chatWebsocketService.getGroupMessages().subscribe(message => {
      this.addMessageToList(message as ChatMessage);
    });
    
    // Subscribe to typing status events
    this.chatWebsocketService.getTypingStatus().subscribe(status => {
      if (status) {
        this.typingStatusSource.next({
          conversationId: status.senderId || status.groupId,
          isTyping: status.isTyping,
          user: status.user
        });
      }
    });
  }

 

  // Helper method to add new messages to the list
  private addMessageToList(message: ChatMessage): void {
    const currentMessages = this.messagesSource.value;
    this.messagesSource.next([...currentMessages, message]);
  }

  // Authentication headers
  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenStorage.getToken(); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // WebSocket connection management
  connectWebSocket(): void {
    const token = this.tokenStorage.getToken();
    const user = this.tokenStorage.getCurrentUser();
    console.log("tokeeeeeeeeeen", token)
    console.log("useeeeeeeeer", user)
    const userId = user?.uuid_user || '';
    
    if (token && userId) {
      this.chatWebsocketService.connect(token, userId);
      this.connected = true;
    } else {
      console.error('Cannot connect WebSocket: Missing token or userId');
    }
  }

  disconnectWebSocket(): void {
    this.chatWebsocketService.disconnect();
    this.connected = false;
  }

  // Active conversation management
  setActiveConversation(conversation: any): void {
    this.activeConversationSource.next(conversation);
    // Also update the selectedChat for compatibility
    this.selectedChatSource.next(conversation);
    
    // Load messages for this conversation from server
    if (conversation) {
      if (conversation.type === 'user') {
        this.getDirectMessages(conversation.id).subscribe(messages => {
          this.messagesSource.next(messages.content);
        });
      } else if (conversation.type === 'group') {
        this.getGroupMessages(conversation.id).subscribe(messages => {
          this.messagesSource.next(messages.content);
        });
      }
    }
  }
  
  // Add a dedicated method to set the selected chat
  setSelectedChat(chat: any): void {
    this.selectedChatSource.next(chat);
    // Optional: Also update activeConversation for backward compatibility
    this.activeConversationSource.next(chat);
  }

  // Endpoint 1: Send direct message
  sendDirectMessage(receiverId: string, content: string, messageType: MessageType = MessageType.TEXT): Observable<ChatMessage> {
    const url = `${this.apiUrl}/messages/send/direct/${receiverId}`;
    const body = { content, messageType };
    
    return this.http.post<ChatMessage>(url, body, { headers: this.getAuthHeaders() })
      .pipe(
        tap(message => {
          // Add the sent message to the message list
          this.addMessageToList(message);
          
          // Also send via websocket if connected
          if (this.connected) {
            this.chatWebsocketService.sendMessage(receiverId, content, messageType);
          }
        })
      );
  }

  // Endpoint 2: Send group message
  sendGroupMessage(groupId: string, content: string, messageType: MessageType = MessageType.TEXT): Observable<ChatMessage> {
    const url = `${this.apiUrl}/messages/send/group/${groupId}`;
    const body = { content, messageType };
    
    return this.http.post<ChatMessage>(url, body, { headers: this.getAuthHeaders() })
      .pipe(
        tap(message => {
          // Add the sent message to the message list
          this.addMessageToList(message);
          
          // Also send via websocket if connected
          if (this.connected) {
            this.chatWebsocketService.sendGroupMessage(groupId, content, messageType);
          }
        })
      );
  }

  // Endpoint 3: Get direct messages with a user
  getDirectMessages(userId: string, page: number = 0, size: number = 20): Observable<ChatPaginatedResponse> {
    const url = `${this.apiUrl}/messages/direct/${userId}`;
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<ChatPaginatedResponse>(url, { 
      headers: this.getAuthHeaders(),
      params
    });
  }

  // Endpoint 4: Get group messages
  getGroupMessages(groupId: string, page: number = 0, size: number = 20): Observable<ChatPaginatedResponse> {
    const url = `${this.apiUrl}/messages/group/${groupId}`;
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<ChatPaginatedResponse>(url, { 
      headers: this.getAuthHeaders(),
      params
    });
  }

  // Endpoint 5: Mark message as read
  markMessageAsRead(messageId: string): Observable<ChatMessage> {
    const url = `${this.apiUrl}/messages/${messageId}/read`;
    
    return this.http.post<ChatMessage>(url, {}, { headers: this.getAuthHeaders() })
      .pipe(
        tap(message => {
          // Update message in the list
          this.updateMessageReadStatus(messageId, true);
          
          // Also mark via websocket if connected
          if (this.connected) {
            this.chatWebsocketService.markMessageAsRead(messageId);
          }
        })
      );
  }

  // Helper to update message read status in the message list
  private updateMessageReadStatus(messageId: string, read: boolean): void {
    const currentMessages = this.messagesSource.value;
    const updatedMessages = currentMessages.map(msg => 
      msg.id === messageId ? {...msg, read: read} : msg
    );
    this.messagesSource.next(updatedMessages);
  }

  // Endpoint 6: Mark all messages from sender as read
  markAllMessagesFromSenderAsRead(senderId: string): Observable<any> {
    const url = `${this.apiUrl}/messages/read-all/from/${senderId}`;
    
    return this.http.post<any>(url, {}, { headers: this.getAuthHeaders() })
      .pipe(
        tap(response => {
          // Update all messages from this sender in the list
          const currentMessages = this.messagesSource.value;
          const updatedMessages = currentMessages.map(msg => 
            msg.senderId === senderId ? {...msg, read: true} : msg
          );
          this.messagesSource.next(updatedMessages);
          
          // Reset unread count for this sender
          this.resetUnreadCount(senderId);
        })
      );
  }

  // Endpoint 7: Get count of all unread messages
  getUnreadMessageCount(): Observable<number> {
    const url = `${this.apiUrl}/messages/unread/count`;
    
    return this.http.get<{count: number}>(url, { headers: this.getAuthHeaders() })
      .pipe(
        map(response => response.count)
      );
  }

  // Endpoint 8: Get count of unread messages from specific sender
  getUnreadMessageCountFromSender(senderId: string): Observable<number> {
    const url = `${this.apiUrl}/messages/unread/from/${senderId}/count`;
    
    return this.http.get<{count: number}>(url, { headers: this.getAuthHeaders() })
      .pipe(
        map(response => response.count),
        tap(count => {
          // Update unread counts
          const unreadCounts = this.unreadCountsSource.value;
          unreadCounts[senderId] = count;
          this.unreadCountsSource.next({...unreadCounts});
        })
      );
  }

  // Endpoint 9: Get all unread messages in a group
  getUnreadGroupMessages(groupId: string): Observable<ChatMessage[]> {
    const url = `${this.apiUrl}/messages/unread/group/${groupId}`;
    
    return this.http.get<ChatMessage[]>(url, { headers: this.getAuthHeaders() });
  }

  // Endpoint 10: Get count of unread messages in a group
  getUnreadGroupMessageCount(groupId: string): Observable<number> {
    const url = `${this.apiUrl}/messages/unread/group/${groupId}/count`;
    
    return this.http.get<{count: number}>(url, { headers: this.getAuthHeaders() })
      .pipe(
        map(response => response.count),
        tap(count => {
          // Update unread counts for groups
          const unreadCounts = this.unreadCountsSource.value;
          unreadCounts[`group_${groupId}`] = count;
          this.unreadCountsSource.next({...unreadCounts});
        })
      );
  }

  // Endpoint 11: Delete a message (sender only)
  deleteMessage(messageId: string): Observable<any> {
    const url = `${this.apiUrl}/messages/${messageId}`;
    
    return this.http.delete<any>(url, { headers: this.getAuthHeaders() })
      .pipe(
        tap(() => {
          // Remove message from list or mark as deleted
          const currentMessages = this.messagesSource.value;
          const updatedMessages = currentMessages.map(msg => 
            msg.id === messageId ? {...msg, deleted: true} : msg
          );
          this.messagesSource.next(updatedMessages);
        })
      );
  }

  // Chat requests management
  sendChatRequest(receiverId: string): void {
    if (this.connected) {
      this.chatWebsocketService.sendChatRequest(receiverId);
    } else {
      console.error('Cannot send chat request: WebSocket not connected');
    }
  }

  approveChatRequest(requestId: string): void {
    if (this.connected) {
      this.chatWebsocketService.approveChatRequest(requestId);
    } else {
      console.error('Cannot approve chat request: WebSocket not connected');
    }
  }

  rejectChatRequest(requestId: string): void {
    if (this.connected) {
      this.chatWebsocketService.rejectChatRequest(requestId);
    } else {
      console.error('Cannot reject chat request: WebSocket not connected');
    }
  }

  // Unread messages management
  resetUnreadCount(userId: string): void {
    const unreadCounts = this.unreadCountsSource.value;
    unreadCounts[userId] = 0;
    this.unreadCountsSource.next({...unreadCounts});
  }

  // API methods

  // Get all users
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/users`);
  }

  // Search users
  searchUsers(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/users/not-consumer`, {
      params: { query },
      headers: this.getAuthHeaders()
    });
  }

  // Check if can chat with user
  canChatWithUser(userId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/requests/can-chat/${userId}`);
  }

  // Get chat requests
  getPendingRequests(): Observable<ChatRequest[]> {
    return this.http.get<ChatRequest[]>(`${this.apiUrl}/requests/received/pending`)
      .pipe(
        tap(requests => this.chatRequestsSource.next(requests))
      );
  }

  // Get user groups
  getUserGroups(): Observable<ChatGroup[]> {
    return this.http.get<ChatGroup[]>(`${this.apiUrl}/groups`);
  }

  // Get blocked users
  getBlockedUsers(): Observable<BlockedUser[]> {
    return this.http.get<BlockedUser[]>(`${this.apiUrl}/blocked-users`);
  }

  // Unblock user
  unblockUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/blocked-users/${userId}`);
  }

  getAllNotConsumerUsers(): Observable<NotConsumer[]> {
    return this.http.get<NotConsumer[]>(`${environment.apiUrl}/users/not-consumer`, {
      headers: this.getAuthHeaders()
    });
  }

  // Send typing status
  sendTypingStatus(recipientId: string, isTyping: boolean, type: 'direct' | 'group'): void {
    if (this.connected) {
      if (type === 'direct') {
        this.chatWebsocketService.sendTypingStatus(recipientId, isTyping);
      } else {
        this.chatWebsocketService.sendGroupTypingStatus(recipientId, isTyping);
      }
    }
  }
}
