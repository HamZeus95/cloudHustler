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
    // For testing purposes, load fake data first
    this.loadFakeRequests();
    
    // Also load from service
    this.loadRequests();
    
    // Also subscribe to real-time request updates
    this.chatService.chatRequests$.subscribe(requests => {
      // Combine real requests with fake ones if needed
      if (requests && requests.length > 0) {
        this.requests = [...this.fakeChatRequests, ...requests];
      }
    });
  }
  
  // Get pending requests only
  getPendingRequests(): ChatRequest[] {
    return this.requests.filter(req => 
      req.status === ChatRequestStatus.PENDING
    ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  // Get non-pending requests
  getNonPendingRequests(): ChatRequest[] {
    return this.requests.filter(req => 
      req.status !== ChatRequestStatus.PENDING
    ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  loadRequests(): void {
    this.chatService.getPendingRequests().subscribe(
      (requests: ChatRequest[]) => {
        // If there are real requests, combine them with fake data
        // Otherwise just keep our fake data
        if (requests && requests.length > 0) {
          this.requests = [...this.fakeChatRequests, ...requests];
        }
      },
      error => {
        console.error('Error loading chat requests:', error);
      }
    );
  }
  
  loadFakeRequests(): void {
    this.requests = this.fakeChatRequests;
  }
  
  // Fake data for testing UI
  private get fakeChatRequests(): ChatRequest[] {
    return [
      {
        id: 'req-001',
        senderId: 'user-1',
        senderName: 'John Doe',
        receiverId: 'current',
        receiverName: 'Current User',
        status: ChatRequestStatus.PENDING,
        timestamp: new Date().toISOString(),
        senderProfileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      {
        id: 'req-002',
        senderId: 'user-2',
        senderName: 'Jane Smith',
        receiverId: 'current',
        receiverName: 'Current User',
        status: ChatRequestStatus.PENDING,
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        senderProfileImage: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      {
        id: 'req-003',
        senderId: 'user-3',
        senderName: 'Robert Johnson',
        receiverId: 'current',
        receiverName: 'Current User',
        status: ChatRequestStatus.ACCEPTED,
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      },
      {
        id: 'req-004',
        senderId: 'user-4',
        senderName: 'Maria Garcia',
        receiverId: 'current',
        receiverName: 'Current User',
        status: ChatRequestStatus.REJECTED,
        timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        senderProfileImage: 'https://randomuser.me/api/portraits/women/68.jpg'
      },
      {
        id: 'req-005',
        senderId: 'user-5',
        senderName: 'David Wilson',
        receiverId: 'current',
        receiverName: 'Current User',
        status: ChatRequestStatus.PENDING,
        timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      },
      // Add more pending requests
      {
        id: 'req-006',
        senderId: 'user-6',
        senderName: 'Emily Brown',
        receiverId: 'current',
        receiverName: 'Current User',
        status: ChatRequestStatus.PENDING,
        timestamp: new Date(Date.now() - 40000000).toISOString(), // ~12 hours ago
        senderProfileImage: 'https://randomuser.me/api/portraits/women/33.jpg'
      },
      {
        id: 'req-007',
        senderId: 'user-7',
        senderName: 'Michael Taylor',
        receiverId: 'current',
        receiverName: 'Current User',
        status: ChatRequestStatus.PENDING,
        timestamp: new Date(Date.now() - 129600000).toISOString(), // ~1.5 days ago
        senderProfileImage: 'https://randomuser.me/api/portraits/men/52.jpg'
      },
      {
        id: 'req-008',
        senderId: 'user-8',
        senderName: 'Sophia Williams',
        receiverId: 'current',
        receiverName: 'Current User',
        status: ChatRequestStatus.PENDING,
        timestamp: new Date(Date.now() - 216000000).toISOString(), // ~2.5 days ago
      },
      {
        id: 'req-009',
        senderId: 'user-9',
        senderName: 'Daniel Martin',
        receiverId: 'current',
        receiverName: 'Current User',
        status: ChatRequestStatus.PENDING,
        timestamp: new Date(Date.now() - 30000000).toISOString(), // ~8 hours ago
        senderProfileImage: 'https://randomuser.me/api/portraits/men/71.jpg'
      },
      {
        id: 'req-010',
        senderId: 'user-10',
        senderName: 'Olivia Clark',
        receiverId: 'current',
        receiverName: 'Current User',
        status: ChatRequestStatus.PENDING,
        timestamp: new Date(Date.now() - 60000000).toISOString(), // ~17 hours ago
        senderProfileImage: 'https://randomuser.me/api/portraits/women/29.jpg'
      }
    ];
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
      case ChatRequestStatus.APPROVED:
        return 'status-success';
      case ChatRequestStatus.REJECTED:
        return 'status-danger';
      default:
        return 'status-warning';
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
