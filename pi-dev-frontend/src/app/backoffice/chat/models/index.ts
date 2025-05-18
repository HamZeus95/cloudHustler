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
  senderProfileImage?: string;
  receiverId?: string;
  receiverName?: string;
  groupId?: string;
  groupName?: string;
  timestamp: string;
  read: boolean;
  readAt?: string;
  messageType: MessageType;
  mediaUrl?: string;
  deleted?: boolean;
}

export interface ChatPaginatedResponse {
  content: ChatMessage[];
  pageable?: {
    pageNumber: number;
    pageSize: number;
    sort: any;
  };
  totalPages: number;
  totalElements: number;
  currentPage?: number;
  size: number;
  number?: number;
  last?: boolean;
  first?: boolean;
  empty?: boolean;
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
  senderUsername?: string;
  receiverUsername?: string;
  receiverProfileImage?: string;
  createdAt?: string; // For backward compatibility
  updatedAt?: string;
}

export enum ChatRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface BlockedUser {
  id: string;
  blockedUserId?: string;
  userId?: string;
  blockedUserName?: string;
  name?: string;
  blockDate?: string;
  profileImage?: string;
  blockedAt?: string;
  unblockedAt?: string;
  blockedByUserId?: string;
  blockedByUserName?: string;
  reason?: string;
  status?: string;
}

export interface NotConsumer {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: string;
}

export interface UserInfo {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImage?: string;
  online?: boolean;
}

export * from './chat-message.model';
export * from './chat-request.model';
export * from './blocked-user.model';
export * from './chat-group.model';
export * from './not-consumer.model';