import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { ChatGroup } from '../models';
import { FakeChatService } from './fake-chat.service';

@Injectable({
  providedIn: 'root'
})
export class FakeChatGroupService {
  private groups: ChatGroup[] = [];

  constructor(private fakeChatService: FakeChatService) { }

  // Get group by ID
  getGroupById(groupId: string): Observable<ChatGroup> {
    return this.getUserGroups().pipe(
      map(groups => {
        const group = groups.find(g => g.id === groupId);
        if (!group) {
          throw new Error(`Group with ID ${groupId} not found`);
        }
        return group;
      }),
      delay(300)
    );
  }

  // Get all groups where the current user is an admin
  getAdminGroups(): Observable<ChatGroup[]> {
    return this.fakeChatService.getUserGroups().pipe(
      map(groups => groups.filter(group => group.isCurrentUserAdmin))
    );
  }

  // Get all groups the user is a member of
  getUserGroups(): Observable<ChatGroup[]> {
    return this.fakeChatService.getUserGroups();
  }

  // Create a new group
  createGroup(groupData: { name: string, description: string }): Observable<ChatGroup> {
    return this.fakeChatService.createGroup(groupData);
  }

  // Update an existing group
  updateGroup(groupId: string, groupData: { name: string, description: string }): Observable<ChatGroup> {
    return this.getUserGroups().pipe(
      map(groups => {
        const groupIndex = groups.findIndex(g => g.id === groupId);
        if (groupIndex !== -1) {
          const updatedGroup = {
            ...groups[groupIndex],
            name: groupData.name,
            description: groupData.description
          };
          // Simulate update
          return updatedGroup;
        }
        return groups[groupIndex];
      }),
      delay(300)
    );
  }

  // Delete a group
  deleteGroup(groupId: string): Observable<void> {
    return of(undefined).pipe(delay(300));
  }

  // Leave a group
  leaveGroup(groupId: string): Observable<void> {
    return of(undefined).pipe(delay(300));
  }

  // Search for groups
  searchGroups(query: string): Observable<ChatGroup[]> {
    return this.getUserGroups().pipe(
      map(groups => {
        const lowerQuery = query.toLowerCase();
        return groups.filter(group => 
          group.name.toLowerCase().includes(lowerQuery) || 
          (group.description && group.description.toLowerCase().includes(lowerQuery))
        );
      }),
      delay(300)
    );
  }
} 