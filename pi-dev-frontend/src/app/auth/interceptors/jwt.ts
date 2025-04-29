import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TokenStorageService } from '../service/token-storage.service';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  
  constructor(
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip adding auth header for auth endpoints
    if (this.shouldSkipInterceptor(request)) {
      return next.handle(request);
    }

    // Add authorization header with JWT token if available
    const token = this.tokenStorage.getToken();
    if (token) {
      request = this.addTokenToRequest(request, token);
    }

    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // Token is expired or invalid
          this.tokenStorage.clearToken();
          this.router.navigate(['/frontoffice/login']);
        }
        return throwError(() => error);
      })
    );
  }

  private shouldSkipInterceptor(request: HttpRequest<any>): boolean {
    // Skip auth-related endpoints to avoid intercepting token refresh requests
    const authEndpoints = [
      '/api/v1/auth/authenticate',
      '/api/v1/auth/register',
      '/api/v1/auth/refresh-token',
      '/api/v1/auth/logout',
 

    ];
    
    return authEndpoints.some(url => request.url.includes(url));
  }

  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}