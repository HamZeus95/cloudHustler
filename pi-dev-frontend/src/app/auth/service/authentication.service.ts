import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { TokenStorageService } from './token-storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/v1/auth'; // Updated to match backend's @RequestMapping("/auth")

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}
  
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/authenticate`, credentials, { withCredentials: true })
      .pipe(
        tap(response => {
          console.log('Login response:', response); // Add debugging
          // Handle both camelCase and snake_case properties
          const accessToken = response.accessToken || response.access_token;
          const userResponse = response.userResponse || response.user;
          
          if (accessToken) {
            this.tokenStorage.setToken(accessToken);
            if (userResponse) {
              this.tokenStorage.saveUser(userResponse);
            }
          }
        }),
        catchError(this.handleError)
      );
  }
  
  register(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, credentials, { withCredentials: true })
      .pipe(
        tap(response => {
          if (response && response.accessToken) {
            this.tokenStorage.setToken(response.accessToken);
            if (response.userResponse) {
              this.tokenStorage.saveUser(response.userResponse);
            }
          }
        }),
        catchError(this.handleError)
      );
  }
  
  logout(): Observable<any> {
    // Clear token from memory
    this.tokenStorage.clearToken();
    
    // Make a request to the server to logout (will clear the httpOnly cookie)
    return this.http.post<any>(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }
  
  refreshToken(): Observable<any> {
    // The refresh token is sent automatically as an HttpOnly cookie
    return this.http.post<any>(`${this.apiUrl}/refresh-token`, {}, { withCredentials: true })
      .pipe(
        tap(response => {
          console.log('Refresh token response:', response); // Add debugging
          // Handle both camelCase and snake_case properties
          const accessToken = response.accessToken || response.access_token;
          
          if (accessToken) {
            this.tokenStorage.setToken(accessToken);
          }
        }),
        catchError(error => {
          console.error('Refresh token error:', error);
          this.tokenStorage.clearToken();
          return throwError(() => error);
        })
      );
  }
  
  validateSession(): Observable<any> {
    const token = this.tokenStorage.getToken();
    
    if (!token) {
      console.log('No token in memory, trying to refresh with cookie');
      // Try to refresh the token using the HttpOnly cookie
      return this.refreshToken().pipe(
        switchMap(response => {
          if (response && (response.accessToken || response.access_token)) {
            // Successfully refreshed token
            return of(response);
          }
          return throwError(() => new Error('No valid session'));
        }),
        catchError(error => throwError(() => error))
      );
    }
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.post<any>(`${this.apiUrl}/validate-session`, {}, { 
      headers, 
      withCredentials: true  // Include cookies
    }).pipe(
      tap(response => {
        console.log('Validate session response:', response); // Add debugging
        // Handle both camelCase and snake_case properties
        const accessToken = response.accessToken || response.access_token;
        const userResponse = response.userResponse || response.user;
        
        if (accessToken) {
          this.tokenStorage.setToken(accessToken);
          if (userResponse) {
            this.tokenStorage.saveUser(userResponse);
          }
        }
      }),
      catchError(this.handleError)
    );
  }
  
  isAuthenticated(): Observable<boolean> {
    return this.tokenStorage.isAuthenticated();
  }
  
  getToken(): string | null {
    return this.tokenStorage.getToken();
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}