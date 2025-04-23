import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, map, take, switchMap, of, catchError } from 'rxjs';
import { AuthService } from '../service/authentication.service';
import { TokenStorageService } from '../service/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService, 
    private router: Router,
    private tokenStorage: TokenStorageService
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | boolean | UrlTree {
    console.log('AuthGuard: Checking if user can access route:', state.url);
    
    return this.authService.isAuthenticated().pipe(
      take(1),
      switchMap(isAuthenticated => {
        // If already authenticated, allow access
        if (isAuthenticated) {
          console.log('AuthGuard: User is authenticated, allowing access');
          return of(true);
        }
        
        // Check if there's a token stored
        const token = this.tokenStorage.getToken();
        if (!token) {
          // No token, try to use refresh token
          console.log('AuthGuard: No token found in memory, trying refresh token');
          
          // Try to validate the session using the service
          return this.authService.validateSession().pipe(
            map(response => {
              console.log('AuthGuard: Session validated successfully:', response);
              if (response && (response.accessToken || response.access_token)) {
                // Session is valid, allow access
                return true;
              }
              // If no valid session, redirect to login
              console.log('AuthGuard: No valid session from validateSession, redirecting to login');
              return this.router.createUrlTree(['/frontoffice/login']);
            }),
            // On error, redirect to login
            catchError(error => {
              console.error('AuthGuard: Session validation failed:', error);
              return of(this.router.createUrlTree(['/frontoffice/login']));
            })
          );
        }
        
        // We have a token in memory, validate it
        console.log('AuthGuard: Token found in memory, validating...');
        return this.authService.validateSession().pipe(
          map(response => {
            console.log('AuthGuard: Token validation response:', response);
            if (response && (response.accessToken || response.access_token)) {
              // validateSession method already handles token and user storage
              return true;
            }
            // If no valid session, redirect to login
            console.log('AuthGuard: Token validation failed, redirecting to login');
            return this.router.createUrlTree(['/frontoffice/login']);
          }),
          // On error, redirect to login
          catchError(error => {
            console.error('AuthGuard: Token validation error:', error);
            return of(this.router.createUrlTree(['/frontoffice/login']));
          })
        );
      })
    );
  }
}

// Make sure to export the class for it to be recognized as a module
export default AuthGuard;