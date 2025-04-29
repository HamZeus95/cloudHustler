export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  receiverId?: string;
  groupId?: string;
  timestamp: Date;
  read: boolean;
  mediaUrl?: string;
  messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'VIDEO'; // Type of message
}