export interface ChatGroup {
  id: string;  // UUID as string
  name: string;
  description?: string;
  createdAt: string;
  creator: UserInfo;
  admins: UserInfo[];
  members: UserInfo[];
  memberCount: number;
  isCurrentUserAdmin: boolean;
  isCurrentUserCreator: boolean;
  avatar?: string;
  creatorId?: string;
  lastMessage?: {
    content: string;
    senderId: string;
    senderName: string;
    timestamp: string;
  };
}

export interface UserInfo {
  id: string;  // UUID as string
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImage?: string;
  online?: boolean;
}