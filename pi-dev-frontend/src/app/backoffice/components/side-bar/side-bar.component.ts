import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from '../../../core/services/sidebar.service';
import { Subscription } from 'rxjs';
import { TokenStorageService } from "../../../auth/service/token-storage.service";
import { AuthService } from '../../../auth/service/authentication.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit, OnDestroy {
  isSidebarOpen = false;
  private subscription: Subscription;
  isAuthenticated = false;
  currentUser: any = null;
  
  // Define route permissions mapping
  routePermissions: { [key: string]: string[] } = {
    '/backoffice': ['ADMIN'],
    '/backoffice/profile/edit-profile': ['ADMIN', 'Farmer'],
    '/backoffice/profile/manage-profile': ['ADMIN', 'Farmer'],
    '/backoffice/farm': ['Farmer', 'ADMIN'],
    '/backoffice/task': ['Farmer', 'ADMIN'],
    '/backoffice/crop': ['Farmer', 'ADMIN'],
    '/backoffice/weather': ['Farmer', 'ADMIN'],
    '/backoffice/farm-ia': ['ADMIN', 'Farmer'],
    '/backoffice/backEvent': ['Farmer', 'ADMIN'],
    '/backoffice/add-event': ['Farmer', 'ADMIN'],
    '/backoffice/edit-event': ['Farmer', 'ADMIN'],
    '/backoffice/blog': ['ADMIN'],
    '/backoffice/facture': ['ADMIN'],
    '/backoffice/livraison': ['ADMIN'],
    '/backoffice/factures': ['ADMIN'],
    '/backoffice/livraisons': ['ADMIN'],
    '/backoffice/suivilivraison': ['ADMIN'],
    '/backoffice/market': ['Farmer', 'ADMIN'],
    '/backoffice/chat': ['ADMIN', 'Farmer'],
    '/backoffice/jobs': ['Farmer', 'ADMIN'],
    '/backoffice/jobsRequests': ['Farmer', 'ADMIN'],
    '/backoffice/display-cv': ['Farmer', 'ADMIN'],
    '/backoffice/email': ['Farmer', 'ADMIN'],
    '/backoffice/quiz': ['Farmer', 'ADMIN']
  };

  constructor(
    private router: Router, 
    private sidebarService: SidebarService,
    private authService: AuthService,
    private tokenStorageService: TokenStorageService,
  ) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        this.currentUser = this.tokenStorageService.getCurrentUser();
      }
       
    });

    // Subscribe to user changes
    this.tokenStorageService.getUser().subscribe(user => {
      this.currentUser = user;
    });

    // Subscribe to sidebar toggle events
    this.subscription.add(
      this.sidebarService.toggle$.subscribe(() => {
        this.toggleSidebar();
      })
    );
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    // For mobile views, we'll also add a class to the body to help with styling
    document.body.classList.toggle('g-sidenav-pinned', this.isSidebarOpen);
    document.body.classList.toggle('g-sidenav-hidden', !this.isSidebarOpen);
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
  
  // tchouf if user has permission for a  route eli mawjdin fel sidebar
  hasRequiredRole(route: string): boolean {
    if (!this.isAuthenticated || !this.currentUser) {
      return false;
    }
    
    // Find the most specific matching route
    const matchingRoute = Object.keys(this.routePermissions)
      .filter(r => route.startsWith(r))
      .sort((a, b) => b.length - a.length)[0]; // Get the longest (most specific) match
    
    if (!matchingRoute) {
      return true; // If no specific route permissions defined, allow access
    }
    
    const requiredRoles = this.routePermissions[matchingRoute];
    const userRoles = this.currentUser.role || [];
    
    // Check if user has any of the required roles
    return requiredRoles.some(role => userRoles.includes(role));
  }
}
