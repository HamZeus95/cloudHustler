import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, map, take, of, catchError } from 'rxjs';
import { AuthService } from '../service/authentication.service';
import { UserService } from '../service/user.service';

@Injectable({
  providedIn: 'root'
})
export class PublicGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | boolean | UrlTree {
    console.log('PublicGuard: Checking if user is NOT authenticated for route:', state.url);
    
    return this.authService.isAuthenticated().pipe(
      take(1),
      map(isAuthenticated => {
        // If NOT authenticated, allow access to public route
        if (!isAuthenticated) {
          console.log('PublicGuard: User is not authenticated, allowing access to public route');
          return true;
        }
        
        // User is authenticated, redirect based on role
        console.log('PublicGuard: User is authenticated, redirecting away from public route');
        const user = this.userService.getCurrentUser();
        
        if (user && user.role) {
          // Redirect based on role
          if (user.role.toLowerCase() === 'consumer') {
            return this.router.createUrlTree(['/frontoffice']);
          } else if (['expert', 'farmer', 'delivery'].some(role => user.role.toLowerCase().includes(role))) {
            return this.router.createUrlTree(['/backoffice']);
          }
        }
        
        // Default fallback redirect
        return this.router.createUrlTree(['/frontoffice']);
      }),
      catchError(error => {
        console.error('PublicGuard: Error checking authentication status:', error);
        // If error, allow access to public route
        return of(true);
      })
    );
  }
}

export default PublicGuard;