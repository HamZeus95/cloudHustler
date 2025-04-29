export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  VIDEO = 'VIDEO'
}

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  receiverId?: string;
  groupId?: string;
  timestamp: string;
  read: boolean;
  messageType: MessageType;
  mediaUrl?: string;
  deleted?: boolean;
}

export interface ChatPaginatedResponse {
  content: ChatMessage[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  size: number;
}

export interface ChatRequest {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  status: ChatRequestStatus;
  timestamp: string;
  
  // Additional properties for UI
  senderProfileImage?: string;
  createdAt?: string; // For backward compatibility
}

export enum ChatRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export interface ChatGroup {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  memberCount: number;
  creatorId: string;
  avatar?: string;
}

export interface BlockedUser {
  id: string;
  blockedUserId: string;
  blockedUserName: string;
  blockDate: string;
}

export interface NotConsumer {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: string;
}