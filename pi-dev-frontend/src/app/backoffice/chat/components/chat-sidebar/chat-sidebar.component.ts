import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ChatService, BlockUserService } from '../../services/index';
import { ChatGroupService } from '../../services/chat-group.service';
import { ChatGroup } from '../../models/chat-group.model';
import { MatDialog } from '@angular/material/dialog';
import { GroupDialogComponent } from '../group-dialog/group-dialog.component'; 

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
  searchResults: any[] = [];
  chats = [];
  
  // Requests related properties
  requests = [];
  
  // Groups related properties
  groupSearchTerm = '';
  isGroupSearching = false;
  groupSearchResults: ChatGroup[] = [];
  adminGroups: ChatGroup[] = [];
  memberGroups: ChatGroup[] = [];
  
  // Blocked users related properties
  blockedUsers = [];
  
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
    // Implement chat loading logic
    // ...existing code...
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
  
  selectChat(chat: any): void {
    // Implement chat selection logic
    this.chatSelected.emit(chat);
  }
  
  initiateChat(user: any): void {
    // Implement initiating a new chat
    // ...existing code...
  }
  
  getUnreadCount(userId: string): number {
    // Implement unread count logic
    return 0; // Replace with actual implementation
  }
  
  // REQUESTS SECTION METHODS
  loadPendingRequests(): void {
    // Implement pending requests loading logic
    // ...existing code...
  }
  
  approveChatRequest(request: any): void {
    // Implement approve chat request logic
    // ...existing code...
  }
  
  rejectChatRequest(request: any): void {
    // Implement reject chat request logic
    // ...existing code...
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
