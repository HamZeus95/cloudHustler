export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
  LOCATION = 'LOCATION',
  SYSTEM = 'SYSTEM'
}

export interface ChatMessage {
  id?: string;
  content?: string;
  encryptedContent?: string;
  messageType: MessageType;
  timestamp: string;
  senderId?: string;
  senderName?: string;
  senderProfileImage?: string;
  receiverId?: string;
  receiverName?: string;
  groupId?: string;
  groupName?: string;
  read: boolean;
  readAt?: string;
  deleted?: boolean;
}

export interface ChatPaginatedResponse {
  content: ChatMessage[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: any;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
  size: number;
  number: number;
}