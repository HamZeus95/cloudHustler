import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const USER_KEY = 'auth-user';
const PROFILE_IMAGE_KEY = 'user-profile-image';

@Injectable({
  providedIn: 'root'  // This makes the service available application-wide as a singleton
})
export class TokenStorageService {
  private accessToken: string | null = null;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<any>(null);
  private profileImageSubject = new BehaviorSubject<string | null>(null);
  
  constructor() {
    // Initialize from localStorage for user data
    this.loadFromStorage();
  }
  
  private loadFromStorage(): void {
    const user = localStorage.getItem(USER_KEY);
    const profileImage = localStorage.getItem(PROFILE_IMAGE_KEY);
    
    if (user) {
      const userData = JSON.parse(user);
      this.userSubject.next(userData);
      this.isAuthenticatedSubject.next(true);
      
      // If profile image exists in user data but not in separate storage, save it
      if (userData.profileImage && !profileImage) {
        this.saveProfileImage(userData.profileImage);
      }
    }
    
    if (profileImage) {
      this.profileImageSubject.next(profileImage);
    }
  }
  
  setToken(token: string): void {
    // Store token in memory only
    this.accessToken = token;
    this.isAuthenticatedSubject.next(true);
  }
  
  getToken(): string | null {
    return this.accessToken;
  }
  
  clearToken(): void {
    this.accessToken = null;
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(PROFILE_IMAGE_KEY);
    this.userSubject.next(null);
    this.profileImageSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }
  
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  // Methods to handle user data
  saveUser(user: any): void {
    if (!user) return;
    
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.userSubject.next(user);
    
    // If the user has a profile image, save it separately
    if (user.profileImage) {
      this.saveProfileImage(user.profileImage);
    }
  }

  saveProfileImage(imageUrl: string): void {
    if (!imageUrl) return;
    
    localStorage.setItem(PROFILE_IMAGE_KEY, imageUrl);
    this.profileImageSubject.next(imageUrl);
  }

  getProfileImage(): Observable<string | null> {
    return this.profileImageSubject.asObservable();
  }

  getCurrentProfileImage(): string | null {
    return localStorage.getItem(PROFILE_IMAGE_KEY);
  }

  getUser(): Observable<any> {
    return this.userSubject.asObservable();
  }

  getCurrentUser(): any {
    const user = localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return this.userSubject.value;
  }
}