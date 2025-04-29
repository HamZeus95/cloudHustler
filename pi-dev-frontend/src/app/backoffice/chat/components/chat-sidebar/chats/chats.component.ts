import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { ChatWebsocketService } from '../../../services/chat-websocket.service';
import { TokenStorageService } from 'src/app/auth/service/token-storage.service';
import { Subscription } from 'rxjs';
import { ChatMessage } from '../../../models';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit, OnDestroy {
  @Input() searchTerm: string = '';
  @Input() isSearching: boolean = false;
  @Input() searchResults: any[] = [];
  @Input() chats: any[] = [];
  
  @Output() chatSelected = new EventEmitter<any>();
  @Output() chatInitiated = new EventEmitter<any>();
  @Output() search = new EventEmitter<string>();

  currentUser: any;
  unreadCounts: { [userId: string]: number } = {};
  onlineUsers: Set<string> = new Set();
  
  private subscriptions: Subscription[] = [];

  constructor(
    private chatService: ChatService,
    private chatWebsocketService: ChatWebsocketService,
    private tokenStorage: TokenStorageService
  ) {}

  ngOnInit(): void {
    // Get current user
    this.currentUser = this.tokenStorage.getCurrentUser();
    
    // Connect to WebSocket if not already connected
    if (!this.chatWebsocketService.isConnected()) {
      const token = this.tokenStorage.getToken();
      if (token && this.currentUser?.uuid_user) {
        this.chatWebsocketService.connect(token, this.currentUser.uuid_user);
      }
    }
    
    // Subscribe to direct messages to update unread counts
    this.subscriptions.push(
      this.chatWebsocketService.getDirectMessages().subscribe(message => {
        this.handleNewMessage(message);
      })
    );
    
    // Subscribe to user status updates
    this.subscriptions.push(
      this.chatWebsocketService.connectionStatus().subscribe(status => {
        if (status) {
          // When reconnected, refresh online status of users
          this.refreshOnlineStatus();
        }
      })
    );
    
    // Subscribe to unread message counts
    this.subscriptions.push(
      this.chatService.unreadCounts$.subscribe(counts => {
        this.unreadCounts = counts;
      })
    );
    
    // Load initial unread counts
    this.loadUnreadCounts();
    
    // Refresh online status every minute
    this.refreshOnlineStatus();
    const statusInterval = setInterval(() => this.refreshOnlineStatus(), 60000);
    
    // Clear interval on component destroy
    this.subscriptions.push({
      unsubscribe: () => clearInterval(statusInterval)
    } as Subscription);
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  selectChat(chat: any): void {
    // Reset unread count when selecting a chat
    if (chat.userId) {
      this.unreadCounts[chat.userId] = 0;
      
      // Mark all messages as read from this user
      this.chatService.markAllMessagesFromSenderAsRead(chat.userId).subscribe();
    } else if (chat.id && chat.isGroup) {
      this.unreadCounts[`group_${chat.id}`] = 0;
    }
    
    this.chatSelected.emit(chat);
  }

  initiateChat(user: any): void {
    this.chatInitiated.emit(user);
  }
  
  // Get unread message count for a user
  getUnreadCount(userId: string): number {
    return this.unreadCounts[userId] || 0;
  }
  
  // Check if a user is online
  isUserOnline(userId: string): boolean {
    return this.onlineUsers.has(userId);
  }
  
  // Format last message for display
  formatLastMessage(message: string): string {
    if (!message) return 'Start a conversation';
    
    // Truncate long messages
    return message.length > 30 ? message.substring(0, 30) + '...' : message;
  }
  
  // Format time for display
  formatTime(timestamp: string): string {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    
    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If this week, show day name
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Otherwise show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
  
  // Private methods
  
  // Handle incoming new message
  private handleNewMessage(message: ChatMessage): void {
    // Update unread counts for sender
    if (message.senderId !== this.currentUser?.uuid_user) {
      const senderId = message.senderId;
      this.unreadCounts[senderId] = (this.unreadCounts[senderId] || 0) + 1;
      
      // Update chat list with new message
      this.updateChatWithNewMessage(message);
    }
  }
  
  // Update chat list with new message
  private updateChatWithNewMessage(message: ChatMessage): void {
    // For direct messages
    if (!message.groupId) {
      const chatIndex = this.chats.findIndex(chat => chat.userId === message.senderId);
      
      if (chatIndex >= 0) {
        // Update existing chat
        const updatedChat = { 
          ...this.chats[chatIndex],
          lastMessage: message.content,
          lastMessageTime: message.timestamp
        };
        
        // Move to top of list
        this.chats.splice(chatIndex, 1);
        this.chats.unshift(updatedChat);
      } else {
        // Add new chat to list
        this.chats.unshift({
          userId: message.senderId,
          name: message.senderName || 'User',
          avatar: message.senderAvatar || null,
          lastMessage: message.content,
          lastMessageTime: message.timestamp,
          isGroup: false
        });
      }
    } else {
      // For group messages
      const groupIndex = this.chats.findIndex(chat => chat.id === message.groupId);
      
      if (groupIndex >= 0) {
        // Update existing group chat
        const updatedGroup = { 
          ...this.chats[groupIndex],
          lastMessage: message.content,
          lastMessageTime: message.timestamp,
          lastMessageSender: message.senderName
        };
        
        // Move to top of list
        this.chats.splice(groupIndex, 1);
        this.chats.unshift(updatedGroup);
      }
    }
  }
  
  // Load unread counts for all chats
  private loadUnreadCounts(): void {
    // For each chat, get unread count
    this.chats.forEach(chat => {
      if (chat.userId) {
        this.chatService.getUnreadMessageCountFromSender(chat.userId)
          .subscribe(count => {
            this.unreadCounts[chat.userId] = count;
          });
      } else if (chat.id && chat.isGroup) {
        this.chatService.getUnreadGroupMessageCount(chat.id)
          .subscribe(count => {
            this.unreadCounts[`group_${chat.id}`] = count;
          });
      }
    });
  }
  
  // Refresh online status of users in chat list
  private refreshOnlineStatus(): void {
    // Get list of user IDs from chats
    const userIds = this.chats
      .filter(chat => chat.userId) // Filter to only user chats (not groups)
      .map(chat => chat.userId);
    
    // If no users, return
    if (userIds.length === 0) return;
    
    // Example: implement your actual online status check here
    // This could be a WebSocket subscription or an API call
    // For now, we'll just simulate with random status
    this.onlineUsers.clear();
    
    // In a real implementation, you would connect to the backend
    // to get actual online status of users
    userIds.forEach(userId => {
      if (Math.random() > 0.5) {  // Simulate some users being online
        this.onlineUsers.add(userId);
      }
    });
  }
}
