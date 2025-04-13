import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private accessToken: string | null = null;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  
  constructor(private http: HttpClient) {
    // Check if user is authenticated on service initialization
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    // Make a call to validate if we have a valid refresh token cookie
    //! fix this endpoint
    this.http.post<any>('/auth/validate-session', {}).subscribe({
      next: () => {
        this.isAuthenticatedSubject.next(true);
      },
      error: () => {
        this.isAuthenticatedSubject.next(false);
      }
    });
  }
  
  login(credentials: any): Observable<any> {
    return this.http.post<any>('/auth/authenticate', credentials, { withCredentials: true }).pipe(
      tap(response => {
        if (response && response.accessToken) {
          this.accessToken = response.accessToken;
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }
  
  register(credentials: any): Observable<any> {
    return this.http.post<any>('/api/auth/register', credentials, { withCredentials: true }).pipe(
      tap(response => {
        if (response && response.accessToken) {
          this.accessToken = response.accessToken;
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }
  
  logout(): Observable<any> {
    // Clear in-memory token
    this.accessToken = null;
    this.isAuthenticatedSubject.next(false);
    
    // Make a request to the server to invalidate the refresh token cookie
    return this.http.post<any>('/auth/logout', {}, { withCredentials: true });
  }
  
  refreshToken(): Observable<any> {
    return this.http.post<any>('/auth/refresh-token', {}, { 
      withCredentials: true // Important to include the refresh token cookie
    }).pipe(
      tap(response => {
        if (response && response.accessToken) {
          this.accessToken = response.accessToken;
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }
  
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
  
  getToken(): string | null {
    return this.accessToken;
  }
  
  private hasToken(): boolean {
    return !!this.accessToken;
  }
}