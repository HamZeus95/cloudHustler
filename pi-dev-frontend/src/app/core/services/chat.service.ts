import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = `${environment.apiUrl}chat/messages`;

  constructor(private http: HttpClient) {}

  // Send direct message to a user
  sendDirectMessage(receiverId: string, message: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/send/direct/${receiverId}`, message);
  }

  // Send message to a group
  sendGroupMessage(groupId: string, message: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/send/group/${groupId}`, message);
  }

  // Get paginated direct messages with a user
  getDirectMessages(userId: string, page: number = 0, size: number = 20): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get(`${this.apiUrl}/direct/${userId}`, { params });
  }

  // Get paginated group messages
  getGroupMessages(groupId: string, page: number = 0, size: number = 20): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get(`${this.apiUrl}/group/${groupId}`, { params });
  }

  // Mark a message as read
  markMessageAsRead(messageId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${messageId}/read`, {});
  }

  // Mark all messages from a sender as read
  markAllMessagesFromSenderAsRead(senderId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/read-all/from/${senderId}`, {});
  }

  // Get count of all unread messages
  getUnreadMessagesCount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/unread/count`);
  }

  // Get count of unread messages from specific sender
  getUnreadMessagesFromSenderCount(senderId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/unread/from/${senderId}/count`);
  }

  // Get all unread messages in a group
  getUnreadGroupMessages(groupId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/unread/group/${groupId}`);
  }

  // Get count of unread messages in a group
  getUnreadGroupMessagesCount(groupId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/unread/group/${groupId}/count`);
  }

  // Delete a message (sender only)
  deleteMessage(messageId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${messageId}`);
  }
}