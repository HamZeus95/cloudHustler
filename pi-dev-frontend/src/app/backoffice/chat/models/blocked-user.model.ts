export interface BlockedUser {
  id: string;
  userId: string;
  name: string;
  profileImage?: string;
  blockedAt: string;
  unblockedAt?: string;
  blockedByUserId?: string;
  blockedByUserName?: string;
  reason?: string;
  status?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  role: string;
  online: boolean;
}