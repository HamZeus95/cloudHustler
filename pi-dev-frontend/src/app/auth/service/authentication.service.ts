import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { TokenStorageService } from './token-storage.service'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/v1/auth'; // Updated to match backend's security configuration whitelist

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService,
     
  ) {}
  
  // Social login methods
  loginWithGoogle(): void {
    this.initiateOAuth2Login('google');
  }

  loginWithGithub(): void {
    this.initiateOAuth2Login('github');
  }

  private initiateOAuth2Login(provider: string): void {
    // Redirect to the backend OAuth2 authorization endpoint
    const oauth2BaseUrl = '/api/v1/oauth2/authorize';
    const redirectUri = encodeURIComponent(`${window.location.origin}/oauth2/redirect`);
    const oauth2Url = `${oauth2BaseUrl}/${provider}?redirect_uri=${redirectUri}`;
    
    // Redirect the browser to the OAuth2 provider
    window.location.href = oauth2Url;
  }
  
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
    // Create a copy of credentials to avoid mutating the original
    const formattedCredentials = { ...credentials };
    
    // Make sure birthDate is properly formatted for the backend
    if (formattedCredentials.birthDate) {
      // If it's already a Date object, convert to ISO string
      if (formattedCredentials.birthDate instanceof Date) {
        formattedCredentials.birthDate = formattedCredentials.birthDate.toISOString().split('T')[0];
      } else if (typeof formattedCredentials.birthDate === 'string') {
        // If it's a string, try to create a Date and then format it
        try {
          const date = new Date(formattedCredentials.birthDate);
          formattedCredentials.birthDate = date.toISOString().split('T')[0];
        } catch (e) {
          console.error('Invalid date format:', formattedCredentials.birthDate);
        }
      }
    }
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    
    console.log('Sending registration request with data:', JSON.stringify(formattedCredentials));
    
    // Use the proxy path rather than the full URL to let Angular handle the proxy correctly
    return this.http.post<any>(`${this.apiUrl}/register`, formattedCredentials, { 
      headers: headers,
      withCredentials: true // Enable credentials for cookie handling
    }).pipe(
      tap(response => {
        console.log('Registration response received:', response);
        if (response && response.accessToken) {
          this.tokenStorage.setToken(response.accessToken);
          if (response.userResponse) {
            this.tokenStorage.saveUser(response.userResponse);
          }
        }
      }),
      catchError(error => {
        console.error('Registration error details:', error);
        // Provide more detailed error information
        let errorMessage = 'Registration failed';
        
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.status === 409) {
          errorMessage = 'Email already exists. Please use a different email or login to your existing account.';
        } else if (error.status === 403) {
          errorMessage = 'Access denied. Please check your credentials or try again later.';
        } else if (error.status === 400) {
          errorMessage = 'Invalid registration data. Please check your form and try again.';
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }
  
  logout(): Observable<any> {
    // Clear token from memory first
    this.tokenStorage.clearToken();
    
    // Create robust headers to prevent caching
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    
    // Make a request to the server to logout (this will clear the httpOnly cookie)
    return this.http.post<any>(`${this.apiUrl}/logout`, {}, { 
      headers: headers,
      withCredentials: true  // Essential for sending and receiving cookies
    }).pipe(
      tap(() => {
        console.log('Logout successful - refresh token cookie cleared');
        
        // Clear local storage and session storage
        localStorage.removeItem('auth-user');
        sessionStorage.removeItem('auth-user');
        document.cookie = 'auth-user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict';
        document.cookie = 'auth-user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/api; SameSite=Strict';
        document.cookie = 'auth-user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/api/v1; SameSite=Strict';
        document.cookie = 'auth-user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/api/v1/auth; SameSite=Strict';
        
        // Try to clear cookies from all possible paths and domains
        this.clearAllCookies();
      }),
      catchError(error => {
        console.error('Logout error:', error);
        
        // Even if the server call fails, clear all local storage and cookies
        localStorage.removeItem('auth-user');
        sessionStorage.removeItem('auth-user');
        
        // Try to clear cookies regardless of server response
        this.clearAllCookies();
        
        return throwError(() => new Error('Logout failed on server. Local data has been cleared.'));
      })
    );
  }

  // Helper method to clear cookies with all possible combinations
  private clearAllCookies(): void {
    const cookieNames = ['refresh_token', 'JSESSIONID', 'AUTH-TOKEN', 'remember-me'];
    const paths = ['/', '/api', '/api/v1', '/api/v1/auth', ''];
    const domains = [window.location.hostname, '', null];
    
    cookieNames.forEach(cookieName => {
      // Try with different path and domain combinations
      paths.forEach(path => {
        // Standard approach (no domain specified)
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; SameSite=Strict`;
        
        // Try with Secure flag for HTTPS
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; Secure; SameSite=Strict`;
        
        // Try with different domains
        domains.forEach(domain => {
          if (domain) {
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=${domain}; SameSite=Strict`;
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=${domain}; Secure; SameSite=Strict`;
          }
        });
      });
    });
    
    console.log('Attempted to clear all authentication cookies client-side');
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
    // Check if user has explicitly logged out
    const loggedOut = localStorage.getItem('logged_out') === 'true';
    if (loggedOut) {
      console.log('User has logged out flag set - preventing auto-login with refresh token');
      // Clear any remaining tokens to be safe
      this.tokenStorage.clearToken();
      this.clearAllCookies();
      return throwError(() => new Error('User has logged out'));
    }

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

  // Login with Face ID
  loginWithFaceId(email: string, imageBase64: string): Observable<any> {
    console.log('AuthService: Attempting Face ID login for email:', email);
    return this.http.post<any>(`${this.apiUrl}/login-with-face`, {
      email: email,
      imageBase64: imageBase64
    }, { withCredentials: true }).pipe(
      tap(response => {
        console.log('Face ID login response:', response);
        
        // Handle both camelCase and snake_case properties
        const accessToken = response.accessToken || response.access_token;
        const userResponse = response.userResponse || response.user;
        
        if (accessToken) {
          console.log('Face ID login: Setting token:', accessToken.substring(0, 10) + '...');
          this.tokenStorage.setToken(accessToken);
          
          // Clear the logged out flag if it exists
          localStorage.removeItem('logged_out');
          
          if (userResponse) {
            console.log('Face ID login: Saving user data:', userResponse);
            this.tokenStorage.saveUser(userResponse);
          }
        } else {
          console.warn('Face ID login: No access token received in response');
        }
      }),
      catchError(error => {
        console.error('Face ID login error:', error);
        let errorMessage = 'Face ID login failed';
        
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // Login with Face ID only (no email required)
  loginWithFaceIdOnly(imageBase64: string): Observable<any> {
    console.log('AuthService: Attempting Face ID only login');
    return this.http.post<any>(`/api/v1/face-id/login-with-face-only`, {
      imageBase64: imageBase64
    }, { withCredentials: true }).pipe(
      tap(response => {
        console.log('Face ID only login response:', response);
        
        // Handle both camelCase and snake_case properties
        const accessToken = response.accessToken || response.access_token;
        const userResponse = response.userResponse || response.user;
        
        if (accessToken) {
          console.log('Face ID only login: Setting token:', accessToken.substring(0, 10) + '...');
          this.tokenStorage.setToken(accessToken);
          
          // Clear the logged out flag if it exists
          localStorage.removeItem('logged_out');
          
          if (userResponse) {
            console.log('Face ID only login: Saving user data:', userResponse);
            this.tokenStorage.saveUser(userResponse);
          }
        } else {
          console.warn('Face ID only login: No access token received in response');
        }
      }),
      catchError(error => {
        console.error('Face ID only login error:', error);
        let errorMessage = 'Face ID login failed';
        
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // Method to verify OTP for email verification
  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/verify-otp`, { email, otpValue: otp }, { withCredentials: true })
      .pipe(
        tap(response => {
          console.log('OTP verification response:', response);
          // If verification successful, we might get a new token or user data
          const accessToken = response.accessToken || response.access_token;
          const userResponse = response.userResponse || response.user;
          
          if (accessToken) {
            this.tokenStorage.setToken(accessToken);
            if (userResponse) {
              this.tokenStorage.saveUser(userResponse);
            }
          }
        }),
        catchError(error => {
          console.error('OTP verification error:', error);
          let errorMessage = 'OTP verification failed';
          
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          
          return throwError(() => new Error(errorMessage));
        })
      );
  }
  
  // Method to resend OTP if user didn't receive it
  resendOtp(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/resend-otp`, {}, { 
      params: { email },
      withCredentials: true 
    })
      .pipe(
        tap(response => {
          console.log('Resend OTP response:', response);
        }),
        catchError(error => {
          console.error('Resend OTP error:', error);
          let errorMessage = 'Failed to resend OTP';
          
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  // Method to request password reset email
  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, { email })
      .pipe(
        tap(response => {
          console.log('Forgot password response:', response);
        }),
        catchError(error => {
          console.error('Forgot password error:', error);
          let errorMessage = 'Failed to process reset password request';
          
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          
          return throwError(() => new Error(errorMessage));
        })
      );
  }
  
  // Method to validate reset token
  validateResetToken(token: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/validate-reset-token`, { params: { token } })
      .pipe(
        tap(response => {
          console.log('Validate reset token response:', response);
        }),
        catchError(error => {
          console.error('Validate reset token error:', error);
          let errorMessage = 'Invalid or expired reset token';
          
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          
          return throwError(() => new Error(errorMessage));
        })
      );
  }
  
  // Method to reset password
  resetPassword(token: string, password: string, confirmPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, { token, password, confirmPassword })
      .pipe(
        tap(response => {
          console.log('Reset password response:', response);
        }),
        catchError(error => {
          console.error('Reset password error:', error);
          let errorMessage = 'Failed to reset password';
          
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          
          return throwError(() => new Error(errorMessage));
        })
      );
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