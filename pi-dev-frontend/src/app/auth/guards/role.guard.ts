import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../service/authentication.service';
import { TokenStorageService } from '../service/token-storage.service'; 

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private tokenStorageService: TokenStorageService,
    private router: Router, 
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const requiredRoles = route.data['roles'] as Array<string>;
    
    
    return this.authService.isAuthenticated().pipe(
      take(1),
      map(isAuthenticated => {
        if (!isAuthenticated) {
          return this.router.createUrlTree(['frontoffice/login']);
        }
        // ger user roles from tokenstorage
        const user = this.tokenStorageService.getCurrentUser();
        if (!user) {
          return this.router.createUrlTree(['frontoffice/login']);
        }
        const userRoles = user.role || [];
        console.log("userRoles",userRoles);
        // Check if user has any of the required roles
        if (requiredRoles.some(role => userRoles.includes(role))) {
          return true;
        } 
        // Redirect to unauthorized page
        return this.router.createUrlTree(['frontoffice']);
      })
    );
  }
}