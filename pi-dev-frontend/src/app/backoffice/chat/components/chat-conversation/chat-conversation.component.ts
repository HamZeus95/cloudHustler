import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { ChatWebsocketService } from '../../services/chat-websocket.service';
import { ChatMessage, MessageType, ChatPaginatedResponse } from '../../models';
import { TokenStorageService } from 'src/app/auth/service/token-storage.service';

@Component({
  selector: 'app-chat-conversation',
  templateUrl: './chat-conversation.component.html',
  styleUrls: ['./chat-conversation.component.css']
})
export class ChatConversationComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  // Form for sending messages
  messageForm: FormGroup;
  
  // Current conversation data
  messages: ChatMessage[] = [];
  conversationType: 'direct' | 'group' = 'direct';
  conversationId: string | null = null;
  partnerInfo: any = null;
  
  // Pagination
  currentPage: number = 0;
  totalPages: number = 0;
  pageSize: number = 20;
  loadingMessages: boolean = false;
  hasMoreMessages: boolean = true;
  
  // UI states
  isSubmitting: boolean = false;
  showEmptyState: boolean = true;
  currentUser: any = null;
  shouldScrollToBottom: boolean = true;
  
  // Track subscriptions for cleanup
  private subscriptions: Subscription[] = [];

  constructor(
    private chatService: ChatService,
    private chatWebsocketService: ChatWebsocketService,
    private tokenStorage: TokenStorageService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.messageForm = this.fb.group({
      content: ['', Validators.required],
      file: [null]
    });
  }

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
    
    // Subscribe to direct messages from WebSocket
    this.subscriptions.push(
      this.chatWebsocketService.getDirectMessages().subscribe(message => {
        this.handleIncomingMessage(message);
      })
    );
    
    // Subscribe to group messages from WebSocket
    this.subscriptions.push(
      this.chatWebsocketService.getGroupMessages().subscribe(message => {
        this.handleIncomingMessage(message);
      })
    );
    
    // Subscribe to errors from WebSocket
    this.subscriptions.push(
      this.chatWebsocketService.getErrors().subscribe(error => {
        console.error('WebSocket error:', error);
        // Implement error handling/notification here
      })
    );
    
    // Subscribe to active conversation changes
    this.subscriptions.push(
      this.chatService.activeConversation$.subscribe(conversation => {
        if (conversation) {
          this.showEmptyState = false;
          this.resetConversation();
          
          if (conversation.userId) {
            // Direct chat
            this.conversationType = 'direct';
            this.conversationId = conversation.userId;
            this.partnerInfo = {
              id: conversation.userId,
              name: conversation.username || 'User',
              avatar: conversation.avatar || null,
              online: conversation.online || false
            };
            
            // Load direct messages
            this.loadDirectMessages();
            
            // Mark all messages from this sender as read
            if (this.conversationId) {
              this.markAllMessagesFromSenderAsRead(this.conversationId);
            }
          } else if (conversation.id) {
            // Group chat
            this.conversationType = 'group';
            this.conversationId = conversation.id;
            this.partnerInfo = {
              id: conversation.id,
              name: conversation.name || 'Group',
              avatar: conversation.avatar || null,
              memberCount: conversation.memberCount || 0
            };
            
            // Load group messages
            this.loadGroupMessages();
            
            // Subscribe to this group's messages specifically
            if (this.conversationId) {
              this.chatWebsocketService.subscribeToGroup(this.conversationId, (message) => {
                this.handleIncomingMessage(message);
              });
            }
          }
        } else {
          this.showEmptyState = true;
          this.resetConversation();
        }
      })
    );
    
    // Subscribe to read receipts from WebSocket
    this.subscriptions.push(
      this.chatWebsocketService.getReadReceipts().subscribe(message => {
        this.updateMessageReadStatus(message.id);
      })
    );
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
    }
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // Reset conversation data when changing conversations
  resetConversation(): void {
    this.messages = [];
    this.currentPage = 0;
    this.totalPages = 0;
    this.hasMoreMessages = true;
    this.shouldScrollToBottom = true;
    this.messageForm.reset();
  }

  // Load direct messages from API
  loadDirectMessages(): void {
    if (!this.conversationId || this.loadingMessages || !this.hasMoreMessages) {
      return;
    }
    
    this.loadingMessages = true;
    
    this.chatService.getDirectMessages(this.conversationId, this.currentPage, this.pageSize)
      .subscribe({
        next: (response: ChatPaginatedResponse) => {
          this.handleMessagesResponse(response);
        },
        error: (error) => {
          console.error('Error loading direct messages:', error);
          this.loadingMessages = false;
        }
      });
  }

  // Load group messages from API
  loadGroupMessages(): void {
    if (!this.conversationId || this.loadingMessages || !this.hasMoreMessages) {
      return;
    }
    
    this.loadingMessages = true;
    
    this.chatService.getGroupMessages(this.conversationId, this.currentPage, this.pageSize)
      .subscribe({
        next: (response: ChatPaginatedResponse) => {
          this.handleMessagesResponse(response);
        },
        error: (error) => {
          console.error('Error loading group messages:', error);
          this.loadingMessages = false;
        }
      });
  }

  // Handle paginated messages response
  handleMessagesResponse(response: ChatPaginatedResponse): void {
    this.loadingMessages = false;
    
    if (response.content.length === 0) {
      this.hasMoreMessages = false;
      return;
    }
    
    // If loading first page, replace all messages and scroll to bottom
    if (this.currentPage === 0) {
      this.messages = response.content;
      this.shouldScrollToBottom = true;
    } else {
      // Otherwise prepend older messages to the top
      this.messages = [...response.content, ...this.messages];
      // Don't scroll to bottom when loading more
      this.shouldScrollToBottom = false;
    }
    
    this.totalPages = response.totalPages;
    this.currentPage++;
    
    // Check if we've reached the end
    if (this.currentPage >= this.totalPages) {
      this.hasMoreMessages = false;
    }
  }

  // Load more messages when scrolling to top
  loadMoreMessages(): void {
    if (this.conversationType === 'direct') {
      this.loadDirectMessages();
    } else {
      this.loadGroupMessages();
    }
  }

  // Handle incoming WebSocket messages
  handleIncomingMessage(message: ChatMessage): void {
    if (!this.conversationId) return;
    
    // Check if message belongs to current conversation
    const isRelevant = 
      (this.conversationType === 'direct' && 
        ((message.senderId === this.conversationId && message.receiverId === this.currentUser.uuid_user) || 
         (message.senderId === this.currentUser.uuid_user && message.receiverId === this.conversationId))) ||
      (this.conversationType === 'group' && message.groupId === this.conversationId);
    
    if (isRelevant) {
      // Add message to list
      this.messages = [...this.messages, message];
      this.shouldScrollToBottom = true;
      
      // Mark as read if from someone else
      if (message.senderId !== this.currentUser.uuid_user) {
        this.markMessageAsRead(message.id);
      }
    }
  }

  // Send a message
  sendMessage(): void {
    if (this.messageForm.invalid || !this.conversationId || this.isSubmitting) {
      return;
    }
    
    const content = this.messageForm.get('content')?.value;
    const file = this.messageForm.get('file')?.value;
    
    if (!content && !file) {
      return;
    }
    
    this.isSubmitting = true;
    
    if (this.conversationType === 'direct') {
      // Send direct message
      this.chatService.sendDirectMessage(this.conversationId, content)
        .subscribe({
          next: () => {
            this.messageForm.reset();
            this.isSubmitting = false;
          },
          error: (error) => {
            console.error('Error sending message:', error);
            this.isSubmitting = false;
          }
        });
    } else {
      // Send group message
      this.chatService.sendGroupMessage(this.conversationId, content)
        .subscribe({
          next: () => {
            this.messageForm.reset();
            this.isSubmitting = false;
          },
          error: (error) => {
            console.error('Error sending group message:', error);
            this.isSubmitting = false;
          }
        });
    }
  }

  // Mark a message as read
  markMessageAsRead(messageId: string): void {
    this.chatService.markMessageAsRead(messageId).subscribe();
  }

  // Mark all messages from a sender as read
  markAllMessagesFromSenderAsRead(senderId: string): void {
    this.chatService.markAllMessagesFromSenderAsRead(senderId).subscribe();
  }

  // Delete a message
  deleteMessage(messageId: string): void {
    this.chatService.deleteMessage(messageId).subscribe({
      next: () => {
        // Remove message from UI or mark as deleted
        this.messages = this.messages.filter(msg => msg.id !== messageId);
      },
      error: (error) => {
        console.error('Error deleting message:', error);
      }
    });
  }

  // Determine if a message is from the current user
  isFromCurrentUser(message: ChatMessage): boolean {
    return message.senderId === this.currentUser?.uuid_user;
  }

  // Format message timestamp
  formatTime(timestamp: string): string {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }
  
  // Format date for date separators
  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  }
  
  // Check if we should show a date separator
  shouldShowDate(index: number): boolean {
    if (index === 0) return true;
    
    const currentDate = new Date(this.messages[index].timestamp).toDateString();
    const prevDate = new Date(this.messages[index - 1].timestamp).toDateString();
    
    return currentDate !== prevDate;
  }

  // Handle file selection
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.messageForm.patchValue({ file: file });
    }
  }

  // Clear selected file
  clearSelectedFile(): void {
    this.messageForm.patchValue({ file: null });
  }

  // Update a message's read status
  private updateMessageReadStatus(messageId: string): void {
    this.messages = this.messages.map(msg => 
      msg.id === messageId ? {...msg, read: true} : msg
    );
  }

  // Scroll to bottom of messages
  private scrollToBottom(): void {
    try {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
      this.shouldScrollToBottom = false;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}
