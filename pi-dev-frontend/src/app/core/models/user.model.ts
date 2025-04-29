export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email: string;
  profileImage?: string;
  phone?: string;
  address?: string;
  birthDate?: Date;
  role?: string;
  isActive?: boolean;
  provider?: string; // OAuth provider like "google", "github"
  providerId?: string; // ID from the OAuth provider
}