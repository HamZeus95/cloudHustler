import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TokenStorageService } from '../service/token-storage.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token from the service
    const token = this.tokenStorage.getToken();
    console.log(`AuthInterceptor - Request to ${request.url} - Token found: ${!!token}`); // Enhanced logging
    
    // Skip adding auth header for auth-related endpoints
    if (this.shouldSkipToken(request.url)) {
      console.log(`AuthInterceptor - Skipping auth header for: ${request.url}`);
      return next.handle(request);
    }

    // Clone the request and add the authorization header
    if (token) {
      request = this.addToken(request, token);
    }
    
    // Pass on the cloned request
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(`AuthInterceptor - Error ${error.status} for ${request.url}`);
        if (error.status === 401) {
          // Token is expired or invalid
          console.log('AuthInterceptor - Unauthorized, clearing token');
          this.tokenStorage.clearToken();
          this.router.navigate(['/frontoffice/login']);
        }
        return throwError(() => error);
      })
    );
  }

  private shouldSkipToken(url: string): boolean {
    // Skip adding auth token to these endpoints
    const skipUrls = [
      '/api/v1/auth/authenticate',
      '/api/v1/auth/register',
      '/api/v1/auth/reset-password',
      '/api/v1/auth/forgot-password'
    ];
    
    return skipUrls.some(skipUrl => url.includes(skipUrl));
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    console.log(`AuthInterceptor - Adding token to request to: ${request.url}`);
    
    // Clone the existing headers and add the Authorization header
    let headers = request.headers || new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    
    // Clone the request with the new headers
    return request.clone({ headers });
  }
}