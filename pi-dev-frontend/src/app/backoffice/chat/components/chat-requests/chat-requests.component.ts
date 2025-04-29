import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ChatRequest, ChatRequestStatus } from '../../models';

@Component({
  selector: 'app-chat-requests',
  templateUrl: './chat-requests.component.html',
  styleUrls: ['./chat-requests.component.css']
})
export class ChatRequestsComponent implements OnInit {
  requests: ChatRequest[] = [];
  
  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.loadRequests();
    
    // Also subscribe to real-time request updates
    this.chatService.chatRequests$.subscribe(requests => {
      this.requests = requests;
    });
  }
  
  loadRequests(): void {
    this.chatService.getPendingRequests().subscribe(
      (requests: ChatRequest[]) => {
        this.requests = requests;
      },
      error => {
        console.error('Error loading chat requests:', error);
      }
    );
  }
  
  approveRequest(requestId: string): void {
    this.chatService.approveChatRequest(requestId);
    // Optimistically update UI
    this.updateRequestStatus(requestId, ChatRequestStatus.ACCEPTED);
  }
  
  rejectRequest(requestId: string): void {
    this.chatService.rejectChatRequest(requestId);
    // Optimistically update UI
    this.updateRequestStatus(requestId, ChatRequestStatus.REJECTED);
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case ChatRequestStatus.ACCEPTED:
        return 'status-approved';
      case ChatRequestStatus.REJECTED:
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  }
  
  getInitials(name: string): string {
    if (!name) return '--';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }
  
  // Helper to update request status locally
  private updateRequestStatus(requestId: string, newStatus: ChatRequestStatus): void {
    this.requests = this.requests.map(req => 
      req.id === requestId ? {...req, status: newStatus} : req
    );
  }
}
