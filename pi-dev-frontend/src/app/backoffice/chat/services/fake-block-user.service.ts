import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FakeChatService } from './fake-chat.service';
import { BlockedUser } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FakeBlockUserService {
  
  constructor(private fakeChatService: FakeChatService) { }

  // Get blocked users
  getBlockedUsers(): Observable<BlockedUser[]> {
    return this.fakeChatService.getBlockedUsers();
  }

  // Block a user
  blockUser(userId: string): Observable<void> {
    // For a fake implementation, we could just return a success response
    return this.fakeChatService.unblockUser(userId);
  }

  // Unblock a user
  unblockUser(userId: string): Observable<void> {
    return this.fakeChatService.unblockUser(userId);
  }

  // Check if a user is blocked
  isUserBlocked(userId: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.fakeChatService.getBlockedUsers().subscribe(blockedUsers => {
        const isBlocked = blockedUsers.some(blockedUser => blockedUser.userId === userId);
        observer.next(isBlocked);
        observer.complete();
      });
    });
  }
} 