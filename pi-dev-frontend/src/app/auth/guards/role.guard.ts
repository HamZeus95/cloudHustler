import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../service/authentication.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private jwtHelper: JwtHelperService
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
          return this.router.createUrlTree(['/login']);
        }
        
        const token = this.authService.getToken();
        if (!token) {
          return this.router.createUrlTree(['/login']);
        }
        
        const decodedToken = this.jwtHelper.decodeToken(token);
        const userRoles = decodedToken.roles || [];
        
        if (requiredRoles.some(role => userRoles.includes(role))) {
          return true;
        }
        
        // Redirect to unauthorized page
        return this.router.createUrlTree(['/unauthorized']);
      })
    );
  }
}