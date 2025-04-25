import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/v1/auth'; // Base auth API URL
  private userApiUrl = '/api/v1/users'; // Base user API URL

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
  
  // Update user profile
  updateUserProfile(formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.userApiUrl}/profile/update`, formData, { withCredentials: true })
      .pipe(
        tap(response => {
          if (response && response.userResponse) {
            this.tokenStorage.saveUser(response.userResponse);
          }
        }),
        catchError(error => {
          console.error('Error updating user profile:', error);
          let errorMessage = 'Failed to update profile';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          throw new Error(errorMessage);
        })
      );
  }

  // Change user password
  changePassword(passwordData: any): Observable<any> {
    return this.http.post<any>(`${this.userApiUrl}/change-password`, passwordData, { withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('Error changing password:', error);
          let errorMessage = 'Failed to change password';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          throw new Error(errorMessage);
        })
      );
  }

  // Get user by UUID
  getUserById(userId: string): Observable<any> {
    return this.http.get<any>(`${this.userApiUrl}/${userId}`, { withCredentials: true })
      .pipe(
        catchError(error => {
          console.error(`Error fetching user ${userId}:`, error);
          throw new Error('Failed to load user information');
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
