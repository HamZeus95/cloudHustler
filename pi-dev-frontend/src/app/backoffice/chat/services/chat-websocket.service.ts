import { Injectable } from '@angular/core';
import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChatMessage, MessageType } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ChatWebsocketService {
  private client: Client | null = null;
  private connected = new BehaviorSubject<boolean>(false);
  private userId: string | null = null;
  
  // Message subjects
  private directMessages = new Subject<ChatMessage>();
  private groupMessages = new Subject<ChatMessage>();
  private readReceipts = new Subject<ChatMessage>();
  private bulkReadReceipts = new Subject<any>();
  private messageDeleted = new Subject<any>();
  private errors = new Subject<string>();
  
  // Group subscription tracking
  private groupSubscriptions: { [groupId: string]: StompSubscription } = {};

  constructor() {}

  // Connect to WebSocket
  connect(token: string, userId: string): void {
    this.userId = userId;
    
    this.client = new Client({
      webSocketFactory: () => {
        return new SockJS(`${environment.apiUrl}/ws?token=${token}`);
      },
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: function(str) {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    this.client.onConnect = () => {
      console.log('WebSocket Connected');
      this.connected.next(true);
      
      // Subscribe to direct messages
      this.client?.subscribe(`/user/queue/messages`, (message) => {
        try {
          const chatMessage = JSON.parse(message.body) as ChatMessage;
          this.directMessages.next(chatMessage);
        } catch (error) {
          console.error('Error parsing direct message:', error);
        }
      });
      
      // Subscribe to read receipts
      this.client?.subscribe(`/user/queue/readReceipts`, (message) => {
        try {
          const chatMessage = JSON.parse(message.body) as ChatMessage;
          this.readReceipts.next(chatMessage);
        } catch (error) {
          console.error('Error parsing read receipt:', error);
        }
      });
      
      // Subscribe to bulk read receipts
      this.client?.subscribe(`/user/queue/bulkReadReceipts`, (message) => {
        try {
          const data = JSON.parse(message.body);
          this.bulkReadReceipts.next(data);
        } catch (error) {
          console.error('Error parsing bulk read receipts:', error);
        }
      });
      
      // Subscribe to message deleted events
      this.client?.subscribe(`/user/queue/messageDeleted`, (message) => {
        try {
          const data = JSON.parse(message.body);
          this.messageDeleted.next(data);
        } catch (error) {
          console.error('Error parsing message deleted event:', error);
        }
      });
      
      // Subscribe to errors
      this.client?.subscribe(`/user/queue/errors`, (message) => {
        this.errors.next(message.body);
      });
    };

    this.client.onStompError = (frame) => {
      console.error('STOMP Error:', frame);
      this.errors.next(`STOMP Error: ${frame.headers['message']}`);
    };
    
    this.client.onDisconnect = () => {
      this.connected.next(false);
      console.log('WebSocket Disconnected');
    };

    this.client.activate();
  }

  // Disconnect from WebSocket
  disconnect(): void {
    if (this.client && this.client.connected) {
      this.client.deactivate();
    }
    this.connected.next(false);
  }

  // Check if connected to WebSocket
  isConnected(): boolean {
    return this.connected.value;
  }

  // Get connection status as Observable
  connectionStatus(): Observable<boolean> {
    return this.connected.asObservable();
  }

  // Subscribe to a specific group
  subscribeToGroup(groupId: string, callback: (message: ChatMessage) => void): void {
    if (!this.client?.connected) {
      console.error('Cannot subscribe to group - WebSocket not connected');
      return;
    }
    
    // Unsubscribe if already subscribed
    if (this.groupSubscriptions[groupId]) {
      this.groupSubscriptions[groupId].unsubscribe();
    }
    
    // Subscribe to the group topic
    this.groupSubscriptions[groupId] = this.client.subscribe(
      `/topic/group/${groupId}`,
      (message) => {
        try {
          const chatMessage = JSON.parse(message.body) as ChatMessage;
          this.groupMessages.next(chatMessage);
          callback(chatMessage);
        } catch (error) {
          console.error(`Error parsing group message for ${groupId}:`, error);
        }
      }
    );
    
    // Also subscribe to group message deleted events
    this.client.subscribe(
      `/topic/group/${groupId}/messageDeleted`,
      (message) => {
        try {
          const data = JSON.parse(message.body);
          this.messageDeleted.next(data);
        } catch (error) {
          console.error(`Error parsing group message deleted event for ${groupId}:`, error);
        }
      }
    );
  }

  // Unsubscribe from a group
  unsubscribeFromGroup(groupId: string): void {
    if (this.groupSubscriptions[groupId]) {
      this.groupSubscriptions[groupId].unsubscribe();
      delete this.groupSubscriptions[groupId];
    }
  }

  // Send a message via WebSocket
  sendMessage(receiverId: string, content: string, messageType: MessageType = MessageType.TEXT): void {
    if (!this.client?.connected) {
      this.errors.next('Cannot send message - WebSocket not connected');
      return;
    }
    
    this.client.publish({
      destination: `/app/chat.sendMessage`,
      body: JSON.stringify({
        receiverId,
        content,
        messageType
      })
    });
  }

  // Send a direct message via WebSocket
  sendDirectMessage(receiverId: string, content: string, messageType: MessageType = MessageType.TEXT): void {
    this.sendMessage(receiverId, content, messageType);
  }

  // Send a group message via WebSocket
  sendGroupMessage(groupId: string, content: string, messageType: MessageType = MessageType.TEXT): void {
    if (!this.client?.connected) {
      this.errors.next('Cannot send group message - WebSocket not connected');
      return;
    }
    
    this.client.publish({
      destination: `/app/chat.sendGroupMessage`,
      body: JSON.stringify({
        groupId,
        content,
        messageType
      })
    });
  }

  // Mark a message as read
  markMessageAsRead(messageId: string): void {
    if (!this.client?.connected) {
      this.errors.next('Cannot mark message as read - WebSocket not connected');
      return;
    }
    
    this.client.publish({
      destination: `/app/chat.markAsRead`,
      body: messageId
    });
  }

  // Mark all messages from a sender as read
  markAllMessagesFromSenderAsRead(senderId: string): void {
    if (!this.client?.connected) {
      this.errors.next('Cannot mark messages as read - WebSocket not connected');
      return;
    }
    
    this.client.publish({
      destination: `/app/chat.markAllMessagesFromSenderAsRead`,
      body: senderId
    });
  }

  // Delete a message
  deleteMessage(messageId: string): void {
    if (!this.client?.connected) {
      this.errors.next('Cannot delete message - WebSocket not connected');
      return;
    }
    
    this.client.publish({
      destination: `/app/chat.deleteMessage`,
      body: messageId
    });
  }

  // Send a chat request
  sendChatRequest(receiverId: string): void {
    if (!this.client?.connected) {
      this.errors.next('Cannot send chat request - WebSocket not connected');
      return;
    }
    
    this.client.publish({
      destination: `/app/chat.sendChatRequest`,
      body: receiverId
    });
  }

  // Approve a chat request
  approveChatRequest(requestId: string): void {
    if (!this.client?.connected) {
      this.errors.next('Cannot approve chat request - WebSocket not connected');
      return;
    }
    
    this.client.publish({
      destination: `/app/chat.approveChatRequest`,
      body: requestId
    });
  }

  // Reject a chat request
  rejectChatRequest(requestId: string): void {
    if (!this.client?.connected) {
      this.errors.next('Cannot reject chat request - WebSocket not connected');
      return;
    }
    
    this.client.publish({
      destination: `/app/chat.rejectChatRequest`,
      body: requestId
    });
  }

  // Get direct messages as Observable
  getDirectMessages(): Observable<ChatMessage> {
    return this.directMessages.asObservable();
  }

  // Get group messages as Observable
  getGroupMessages(): Observable<ChatMessage> {
    return this.groupMessages.asObservable();
  }

  // Get read receipts as Observable
  getReadReceipts(): Observable<ChatMessage> {
    return this.readReceipts.asObservable();
  }

  // Get bulk read receipts as Observable
  getBulkReadReceipts(): Observable<any> {
    return this.bulkReadReceipts.asObservable();
  }

  // Get message deleted events as Observable
  getMessageDeletedEvents(): Observable<any> {
    return this.messageDeleted.asObservable();
  }

  // Get errors as Observable
  getErrors(): Observable<string> {
    return this.errors.asObservable();
  }
}