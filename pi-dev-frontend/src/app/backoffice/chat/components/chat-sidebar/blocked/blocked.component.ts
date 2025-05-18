import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { BlockedUser } from "../../../models";
import { BlockUserService } from "../../../services/block-user.service";

@Component({
  selector: 'app-blocked',
  templateUrl: './blocked.component.html',
  styleUrls: ['./blocked.component.css']
})
export class BlockedComponent implements OnInit {
  @Input() blockedUsers: BlockedUser[] = [];
  
  @Output() userUnblocked = new EventEmitter<string>();

  constructor(private blockUserService: BlockUserService) {}

  ngOnInit(): void {
    // Only load blocked users if none were provided via input
    if (!this.blockedUsers || this.blockedUsers.length === 0) {
      this.loadBlockedUsers();
    }
  }

  loadBlockedUsers(): void {
    this.blockUserService.getBlockedUsers().subscribe({
      next: (users) => {
        this.blockedUsers = users;
      },
      error: (error) => {
        console.error('Error loading blocked users:', error);
      }
    });
  }

  unblockUser(blockedId: string): void {
    this.blockUserService.unblockUser(blockedId).subscribe({
      next: () => {
        this.userUnblocked.emit(blockedId);
        this.loadBlockedUsers(); // Refresh the list
      },
      error: (error) => {
        console.error('Error unblocking user:', error);
      }
    });
  }
}
