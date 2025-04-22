import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/v1/auth'; // Updated to match backend context path

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService
  ) { }
  
  // Get current user profile from backend
  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`, { withCredentials: true })
      .pipe(
        tap(user => {
          this.tokenStorage.saveUser(user);
        }),
        catchError(error => {
          console.error('Error fetching user profile:', error);
          return of(null);
        })
      );
  }
  
  // Check session validity
  validateSession(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/validate-session`, {}, { withCredentials: true })
      .pipe(
        tap(response => {
          if (response && response.access_token) {
            this.tokenStorage.setToken(response.access_token);
            if (response.user) {
              this.tokenStorage.saveUser(response.user);
            }
          }
        }),
        catchError(error => {
          console.error('Session validation failed:', error);
          return of(null);
        })
      );
  }
  
  // Get the current user from memory
  getCurrentUser(): any {
    return this.tokenStorage.getCurrentUser();
  }
  
  // Check if user has specific role
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user && user.Role === role;
  }
}
