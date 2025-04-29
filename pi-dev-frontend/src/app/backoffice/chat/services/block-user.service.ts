import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { BlockedUser } from "../models/blocked-user.model";
import { TokenStorageService } from "../../../auth/service/token-storage.service";

interface UserDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlockUserService {
  private apiUrl = `/api/v1/chat/blocked-users`;

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService
  ) { }

  /**
   * Get authentication headers with token from memory
   * @returns HttpHeaders object with Authorization header
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenStorage.getToken(); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Block a user
   * @param userId ID of the user to block
   * @param reason Optional reason for blocking
   * @returns Observable with the blocked user data
   */
  blockUser(userId: string, reason?: string): Observable<BlockedUser> {
    const payload = reason ? { reason } : {};
    return this.http.post<BlockedUser>(`${this.apiUrl}/${userId}`, payload, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Unblock a previously blocked user
   * @param userId ID of the user to unblock
   * @returns Observable indicating success
   */
  unblockUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Get list of users blocked by current user
   * @returns Observable with list of blocked users
   */
  getBlockedUsers(): Observable<BlockedUser[]> {
    return this.http.get<BlockedUser[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Check if a specific user is blocked by current user
   * @param userId ID of the user to check
   * @returns Observable with boolean result
   */
  isUserBlocked(userId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/is-blocked/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Check if either user blocked the other
   * @param userId ID of the user to check relationship with
   * @returns Observable with boolean result
   */
  isBlockingRelationshipExists(userId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/is-blocking-relationship/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Get list of users who blocked current user
   * @returns Observable with list of users who blocked current user
   */
  getUsersWhoBlockedCurrentUser(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.apiUrl}/blocked-by`, {
      headers: this.getAuthHeaders()
    });
  }
}
