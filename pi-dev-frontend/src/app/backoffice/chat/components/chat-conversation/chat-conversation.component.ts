import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription, debounceTime } from 'rxjs';
import { ChatService, TypingStatus } from '../../services/chat.service';
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
  isTyping: boolean = false;
  typingUser: any = null;
  private typingTimeout: any;
  
  // Track subscriptions for cleanup
  private subscriptions: Subscription[] = [];

  constructor(
    private chatService: ChatService,
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
    this.currentUser = this.tokenStorage.getCurrentUser() || {
      userUUID: 'current',
      firstName: 'Current',
      lastName: 'User',
      email: 'current.user@example.com'
    };
    
    // Subscribe to messages from service
    this.subscriptions.push(
      this.chatService.messages$.subscribe(messages => {
        this.messages = messages;
        this.shouldScrollToBottom = true;
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
          }
        } else {
          this.showEmptyState = true;
          this.resetConversation();
        }
      })
    );
    
    // Add subscription to typing events
    this.subscriptions.push(
      this.chatService.typingStatus$.subscribe((status: TypingStatus | null) => {
        if (status && status.conversationId === this.conversationId) {
          this.isTyping = status.isTyping;
          this.typingUser = status.user;
          
          // Auto-clear typing indicator after 3 seconds
          if (this.isTyping) {
            clearTimeout(this.typingTimeout);
            this.typingTimeout = setTimeout(() => {
              this.isTyping = false;
            }, 3000);
          }
        }
      })
    );
    
    // Add typing indicator when user types
    this.subscriptions.push(
      this.messageForm.get('content')?.valueChanges
        .pipe(debounceTime(300))
        .subscribe(value => {
          if (value && value.trim() !== '' && this.conversationId) {
            this.sendTypingStatus(true);
          }
        }) || new Subscription()
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
    clearTimeout(this.typingTimeout);
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
    
    // Reverse the order of messages for column-reverse display
    const sortedMessages = [...response.content].sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
    
    // If loading first page, replace all messages and scroll to bottom
    if (this.currentPage === 0) {
      this.messages = sortedMessages;
      this.shouldScrollToBottom = true;
    } else {
      // Otherwise prepend older messages
      this.messages = [...sortedMessages, ...this.messages];
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

  // Handle incoming messages
  handleIncomingMessage(message: ChatMessage): void {
    // Check if this message belongs to the current conversation
    if (
      (this.conversationType === 'direct' && 
       ((message.senderId === this.conversationId && message.receiverId === 'current') || 
        (message.senderId === 'current' && message.receiverId === this.conversationId))) ||
      (this.conversationType === 'group' && message.groupId === this.conversationId)
    ) {
      this.messages = [...this.messages, message];
      this.shouldScrollToBottom = true;
      
      // Mark as read if it's not from the current user
      if (message.senderId !== 'current' && !message.read) {
        this.markMessageAsRead(message.id!);
      }
    }
  }

  // Send a message
  sendMessage(): void {
    if (this.messageForm.invalid) {
      return;
    }
    
    const content = this.messageForm.get('content')?.value.trim();
    if (!content) {
      return;
    }
    
    this.isSubmitting = true;
    
    if (this.conversationType === 'direct' && this.conversationId) {
      this.chatService.sendDirectMessage(this.conversationId, content)
        .subscribe({
          next: (message) => {
            this.handleSendMessageSuccess();
          },
          error: (error) => {
            console.error('Error sending direct message:', error);
            this.isSubmitting = false;
          }
        });
    } else if (this.conversationType === 'group' && this.conversationId) {
      this.chatService.sendGroupMessage(this.conversationId, content)
        .subscribe({
          next: (message) => {
            this.handleSendMessageSuccess();
          },
          error: (error) => {
            console.error('Error sending group message:', error);
            this.isSubmitting = false;
          }
        });
    }
  }
  
  // Handle successful message send
  private handleSendMessageSuccess(): void {
    this.messageForm.reset();
    this.isSubmitting = false;
    this.shouldScrollToBottom = true;
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
        // Update the message in the list
        this.messages = this.messages.map(msg => 
          msg.id === messageId ? {...msg, deleted: true, content: 'This message was deleted'} : msg
        );
      },
      error: (error) => {
        console.error('Error deleting message:', error);
      }
    });
  }

  // Check if a message is from the current user
  isFromCurrentUser(message: ChatMessage): boolean {
    return message.senderId === 'current';
  }

  // Format time for display
  formatTime(timestamp: string): string {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }

  // Format date for display
  formatDate(timestamp: string): string {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }

  // Check if we should show the date separator
  shouldShowDate(index: number): boolean {
    if (index === 0) {
      return true;
    }
    
    const currentDate = new Date(this.messages[index].timestamp).toDateString();
    const prevDate = new Date(this.messages[index - 1].timestamp).toDateString();
    
    return currentDate !== prevDate;
  }

  // Handle file selection
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.messageForm.patchValue({
        file: file
      });
    }
  }

  // Clear selected file
  clearSelectedFile(): void {
    this.messageForm.patchValue({
      file: null
    });
  }

  // Scroll to the bottom of the messages container
  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        // For column-reverse layout, scrolling to top shows the most recent messages
        this.messagesContainer.nativeElement.scrollTop = 0;
        
        // Ensure input field is visible by focusing on it after scrolling
        setTimeout(() => {
          const inputField = document.querySelector('.message-input textarea');
          if (inputField) {
            (inputField as HTMLElement).focus();
          }
        }, 100);
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  // Send typing status to other users
  sendTypingStatus(isTyping: boolean): void {
    if (this.conversationId) {
      if (this.conversationType === 'direct') {
        this.chatService.sendTypingStatus(this.conversationId, isTyping, 'direct');
      } else {
        this.chatService.sendTypingStatus(this.conversationId, isTyping, 'group');
      }
    }
  }
}
