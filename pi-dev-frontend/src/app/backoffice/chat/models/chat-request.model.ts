export enum ChatRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface ChatRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderUsername?: string;
  senderProfileImage?: string;
  receiverId: string;
  receiverName: string;
  receiverUsername?: string;
  receiverProfileImage?: string;
  status: ChatRequestStatus;
  createdAt: string;
  updatedAt?: string;
  timestamp?: string;
}