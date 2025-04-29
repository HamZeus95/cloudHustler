import { Injectable } from '@angular/core';
import { Observable, Subject, Observer, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenStorageService } from '../../auth/service/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ChatWebsocketService {
  private socket: WebSocket | null = null;
  private connected$ = new BehaviorSubject<boolean>(false);
  private messageSubject = new Subject<any>();

  constructor(private tokenStorage: TokenStorageService) {}

  public connect(): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket connection already established');
      return;
    }

    const token = this.tokenStorage.getToken();
    
    if (!token) {
      console.error('No authentication token available');
      return;
    }

    try {
      // Create WebSocket connection with JWT token for authentication
      this.socket = new WebSocket(`${this.getWebSocketUrl()}/chat/ws?token=${token}`);

      this.socket.onopen = () => {
        console.log('WebSocket connection established');
        this.connected$.next(true);
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.messageSubject.next(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.connected$.next(false);
      };

      this.socket.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        this.connected$.next(false);
        
        // Try to reconnect after a delay if it wasn't a clean closure
        if (event.code !== 1000) {
          setTimeout(() => this.connect(), 5000);
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }

  public disconnect(): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
    }
  }

  public sendMessage(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected. Message not sent.');
    }
  }

  public onMessage(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  public isConnected(): Observable<boolean> {
    return this.connected$.asObservable();
  }

  private getWebSocketUrl(): string {
    // Convert HTTP/HTTPS to WS/WSS
    const apiUrl = environment.apiUrl;
    return apiUrl.replace('http:', 'ws:').replace('https:', 'wss:');
  }
}