import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';  
import { TokenStorageService } from "../../../auth/service/token-storage.service";
import { ChatGroup, UserInfo } from '../models/chat-group.model';

@Injectable({
  providedIn: 'root'
})
export class ChatGroupService {
  private apiUrl = `/api/v1/chat/groups`;

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenStorage.getToken(); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Creates a new chat group
   */
  createGroup(group: { name: string; description?: string }): Observable<ChatGroup> {
    console.log("first" + group);
    return this.http.post<ChatGroup>(this.apiUrl, group, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Gets details of a specific group
   */
  getGroupById(groupId: string): Observable<ChatGroup> {
    return this.http.get<ChatGroup>(`${this.apiUrl}/${groupId}`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Gets all groups the user belongs to
   */
  getUserGroups(): Observable<ChatGroup[]> {
    return this.http.get<ChatGroup[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Gets all groups where user is an admin
   */
  getAdminGroups(): Observable<ChatGroup[]> {
    return this.http.get<ChatGroup[]>(`${this.apiUrl}/admin`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Updates group name or description
   */
  updateGroup(groupId: string, updates: { name?: string; description?: string }): Observable<ChatGroup> {
    return this.http.put<ChatGroup>(`${this.apiUrl}/${groupId}`, updates, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Deletes a group (admin only)
   */
  deleteGroup(groupId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${groupId}`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * User leaves a group
   */
  leaveGroup(groupId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${groupId}/leave`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Adds a member to a group
   */
  addMember(groupId: string, userId: string): Observable<ChatGroup> {
    return this.http.post<ChatGroup>(`${this.apiUrl}/${groupId}/members/${userId}`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Removes a member from a group
   */
  removeMember(groupId: string, userId: string): Observable<ChatGroup> {
    return this.http.delete<ChatGroup>(`${this.apiUrl}/${groupId}/members/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Makes a user an admin
   */
  makeAdmin(groupId: string, userId: string): Observable<ChatGroup> {
    return this.http.post<ChatGroup>(`${this.apiUrl}/${groupId}/admins/${userId}`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Removes admin privileges from user
   */
  removeAdmin(groupId: string, userId: string): Observable<ChatGroup> {
    return this.http.delete<ChatGroup>(`${this.apiUrl}/${groupId}/admins/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Gets all members of a group
   */
  getGroupMembers(groupId: string): Observable<UserInfo[]> {
    return this.http.get<UserInfo[]>(`${this.apiUrl}/${groupId}/members`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Gets all admins of a group
   */
  getGroupAdmins(groupId: string): Observable<UserInfo[]> {
    return this.http.get<UserInfo[]>(`${this.apiUrl}/${groupId}/admins`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Searches groups by name or description
   */
  searchGroups(query: string): Observable<ChatGroup[]> {
    return this.http.get<ChatGroup[]>(`${this.apiUrl}/search`, {
      headers: this.getAuthHeaders(),
      params: { query }
    });
  }

  /**
   * Checks if current user is member of group
   */
  checkIsMember(groupId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${groupId}/is-member`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Checks if current user is admin of group
   */
  checkIsAdmin(groupId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${groupId}/is-admin`, {
      headers: this.getAuthHeaders()
    });
  }
}
