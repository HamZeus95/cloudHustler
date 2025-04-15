import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'  // This makes the service available application-wide as a singleton
})
export class TokenStorageService {
  private accessToken: string | null = null;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<any>(null);
  
  constructor() {
    // Initialize from localStorage for user data only
    this.loadFromStorage();
  }
  
  private loadFromStorage(): void {
    const user = localStorage.getItem(USER_KEY);
    
    if (user) {
      this.userSubject.next(JSON.parse(user));
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
    this.userSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }
  
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  // Methods to handle user data
  saveUser(user: any): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.userSubject.next(user);
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