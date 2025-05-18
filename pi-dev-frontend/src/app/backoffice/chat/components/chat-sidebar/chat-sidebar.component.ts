import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ChatService, BlockUserService } from '../../services/index';
import { ChatGroupService } from '../../services/chat-group.service';
import { ChatGroup, UserInfo, BlockedUser, ChatRequest } from '../../models';
import { MatDialog } from '@angular/material/dialog';
import { GroupDialogComponent } from '../group-dialog/group-dialog.component'; 

interface ChatPreview {
  userId?: string;
  id?: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  lastMessageSender?: string;
  isGroup: boolean;
  memberCount?: number;
  active: boolean;
}

@Component({
  selector: 'app-chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.css']
})
export class ChatSidebarComponent implements OnInit, OnDestroy {
  @Output() chatSelected = new EventEmitter<any>();
  @Output() groupChatSelected = new EventEmitter<ChatGroup>();

  @Input() activeSection = 'chats'; // Added @Input() decorator
  @Input() currentUser: any; // Added @Input() decorator for currentUser
  
  // Chats related properties
  searchTerm = '';
  isSearching = false;
  searchResults: UserInfo[] = [];
  chats: ChatPreview[] = [];
  
  // Requests related properties
  requests: ChatRequest[] = [];
  
  // Groups related properties
  groupSearchTerm = '';
  isGroupSearching = false;
  groupSearchResults: ChatGroup[] = [];
  adminGroups: ChatGroup[] = [];
  memberGroups: ChatGroup[] = [];
  
  // Blocked users related properties
  blockedUsers: BlockedUser[] = [];
  
  private subscriptions: Subscription[] = [];
  
  constructor(
    private chatService: ChatService,
    private blockUserService: BlockUserService,
    private chatGroupService: ChatGroupService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadChats();
    this.loadPendingRequests();
    this.loadGroups();
    this.loadBlockedUsers();
    
    // Add any necessary subscriptions for real-time updates
  }
  
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
  
  // Section navigation methods
  setActiveSection(section: string): void {
    this.activeSection = section;
    
    // Reload data when switching sections
    switch(section) {
      case 'chats':
        this.loadChats();
        break;
      case 'requests':
        this.loadPendingRequests();
        break;
      case 'groups':
        this.loadGroups();
        break;
      case 'blocked':
        this.loadBlockedUsers();
        break;
    }
  }
  
  // CHAT SECTION METHODS
  loadChats(): void {
    // Generate chat previews from messages in fake service
    const chatPreviews: ChatPreview[] = [];
    
    // Process user chats from the fake direct messages
    this.chatService.getAllUsers().subscribe(users => {
      users.forEach(user => {
        // Get the most recent message for this user
        this.chatService.getDirectMessages(user.id, 0, 1).subscribe(result => {
          if (result.content && result.content.length > 0) {
            const lastMessage = result.content[result.content.length - 1];
            
            // Create a chat preview
            chatPreviews.push({
              userId: user.id,
              name: `${user.firstName} ${user.lastName}`,
              avatar: user.profileImage,
              lastMessage: lastMessage.content,
              lastMessageTime: lastMessage.timestamp,
              isGroup: false,
              active: false
            });
            
            // Update the chats array
            this.chats = [...chatPreviews];
          }
        });
      });
    });
    
    // Process group chats
    this.chatGroupService.getUserGroups().subscribe(groups => {
      groups.forEach(group => {
        this.chatService.getGroupMessages(group.id, 0, 1).subscribe(result => {
          const lastMessage = result.content && result.content.length > 0 
            ? result.content[result.content.length - 1] 
            : null;
          
          // Create a group chat preview
          chatPreviews.push({
            id: group.id,
            name: group.name,
            avatar: undefined,
            lastMessage: lastMessage ? lastMessage.content : undefined,
            lastMessageTime: lastMessage ? lastMessage.timestamp : group.createdAt,
            lastMessageSender: lastMessage ? lastMessage.senderName : undefined,
            isGroup: true,
            memberCount: group.memberCount,
            active: false
          });
          
          // Update the chats array
          this.chats = [...chatPreviews];
        });
      });
    });
  }
  
  searchUsers(): void {  
    if (this.searchTerm.trim() === '') {
      this.searchResults = [];
      return;
    }
    this.isSearching = true;
    this.chatService.searchUsers(this.searchTerm).pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(
      results => {
        this.searchResults = results;
        this.isSearching = false;
      }
    );
  }
  
  selectChat(chat: ChatPreview): void {
    // Reset active state for all chats
    this.chats.forEach(c => c.active = false);
    
    // Set this chat as active
    const chatIndex = this.chats.findIndex(c => 
      (chat.userId && c.userId === chat.userId) || 
      (chat.id && c.id === chat.id)
    );
    
    if (chatIndex >= 0) {
      this.chats[chatIndex].active = true;
    }
    
    // Set the active conversation in the chat service
    if (chat.isGroup) {
      this.chatService.setActiveConversation({ 
        id: chat.id,
        name: chat.name,
        memberCount: chat.memberCount
      });
      // Use a fully populated ChatGroup object
      this.chatGroupService.getGroupById(chat.id!).subscribe(group => {
        if (group) {
          this.groupChatSelected.emit(group);
        }
      });
    } else {
      this.chatService.setActiveConversation({ 
        userId: chat.userId,
        username: chat.name,
        avatar: chat.avatar
      });
      this.chatSelected.emit(chat);
    }
  }
  
  initiateChat(user: UserInfo): void {
    // Create a chat preview for this user
    const chatPreview: ChatPreview = {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      avatar: user.profileImage,
      isGroup: false,
      active: true
    };
    
    // Check if this chat already exists
    const existingChatIndex = this.chats.findIndex(c => c.userId === user.id);
    
    if (existingChatIndex >= 0) {
      // Reset active state for all chats
      this.chats.forEach(c => c.active = false);
      
      // Set existing chat as active
      this.chats[existingChatIndex].active = true;
      this.selectChat(this.chats[existingChatIndex]);
    } else {
      // Add to chats list
      this.chats = [chatPreview, ...this.chats];
      
      // Reset active state for all other chats
      for (let i = 1; i < this.chats.length; i++) {
        this.chats[i].active = false;
      }
      
      // Select the new chat
      this.selectChat(chatPreview);
    }
  }
  
  getUnreadCount(userId: string): number {
    // Get unread count from the chat service
    let count = 0;
    this.chatService.unreadCounts$.subscribe(counts => {
      count = counts[userId] || 0;
    });
    return count;
  }
  
  // REQUESTS SECTION METHODS
  loadPendingRequests(): void {
    this.chatService.getPendingRequests().subscribe({
      next: (requests) => {
        this.requests = requests;
      },
      error: (error) => {
        console.error('Error loading pending requests:', error);
      }
    });
  }
  
  approveChatRequest(request: any): void {
    this.chatService.approveChatRequest(request.id);
    this.loadPendingRequests();
  }
  
  rejectChatRequest(request: any): void {
    this.chatService.rejectChatRequest(request.id);
    this.loadPendingRequests();
  }
  
  // GROUPS SECTION METHODS
  loadGroups(): void {
    // Load groups where user is admin
    this.chatGroupService.getAdminGroups().subscribe({
      next: (groups) => {
        this.adminGroups = groups;
      },
      error: (error) => {
        console.error('Error loading admin groups:', error);
      }
    });
    
    // Load all groups user belongs to, filtering out admin groups
    this.chatGroupService.getUserGroups().subscribe({
      next: (groups) => {
        this.memberGroups = groups.filter(group => 
          !this.adminGroups.some(adminGroup => adminGroup.id === group.id)
        );
      },
      error: (error) => {
        console.error('Error loading member groups:', error);
      }
    });
  }
  
  searchGroups(): void {
    if (this.groupSearchTerm.trim() === '') {
      this.groupSearchResults = [];
      return;
    }
    
    this.isGroupSearching = true;
    this.chatGroupService.searchGroups(this.groupSearchTerm).subscribe({
      next: (results) => {
        this.groupSearchResults = results;
        this.isGroupSearching = false;
      },
      error: (error) => {
        console.error('Error searching groups:', error);
        this.isGroupSearching = false;
      }
    });
  }
  
  onGroupSearchTermChange(term: string): void {
    this.groupSearchTerm = term;
    this.searchGroups();
  }
  
  createNewGroup(groupData: { name: string, description: string }): void {
    this.chatGroupService.createGroup(groupData).subscribe({
      next: (newGroup) => {
        this.adminGroups = [newGroup, ...this.adminGroups];
      },
      error: (error) => {
        console.error('Error creating group:', error);
      }
    });
  }
  
  selectGroupChat(group: ChatGroup): void {
    this.groupChatSelected.emit(group);
  }
  
  editGroup(group: ChatGroup): void {
    const dialogRef = this.dialog.open(GroupDialogComponent, {
      width: '500px',
      data: { ...group }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.chatGroupService.updateGroup(group.id, result).subscribe({
          next: (updatedGroup) => {
            const index = this.adminGroups.findIndex(g => g.id === updatedGroup.id);
            if (index !== -1) {
              this.adminGroups[index] = updatedGroup;
              this.adminGroups = [...this.adminGroups]; // Trigger change detection
            }
          },
          error: (error) => {
            console.error('Error updating group:', error);
          }
        });
      }
    });
  }
  
  deleteGroup(groupId: string): void {
    this.chatGroupService.deleteGroup(groupId).subscribe({
      next: () => {
        this.adminGroups = this.adminGroups.filter(group => group.id !== groupId);
      },
      error: (error) => {
        console.error('Error deleting group:', error);
      }
    });
  }
  
  leaveGroup(groupId: string): void {
    this.chatGroupService.leaveGroup(groupId).subscribe({
      next: () => {
        this.memberGroups = this.memberGroups.filter(group => group.id !== groupId);
      },
      error: (error) => {
        console.error('Error leaving group:', error);
      }
    });
  }
  
  // BLOCKED USERS SECTION METHODS
  loadBlockedUsers(): void {
     
  }
  
  unblockUser(userId: string): void {
    // Implement unblock user logic
    // ...existing code...
  }
}
