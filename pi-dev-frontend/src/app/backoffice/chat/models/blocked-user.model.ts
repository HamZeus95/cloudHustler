export interface BlockedUser {
  id: string;
  blocker: User;
  blocked: User;
  blockedAt: string;
  reason?: string;
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