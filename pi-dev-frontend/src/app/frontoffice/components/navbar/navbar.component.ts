import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../../auth/service/authentication.service';
import { TokenStorageService } from '../../../auth/service/token-storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  dropdownOpen = false;
  isAuthenticated = false;
  userProfileImage: string | null = null;
  userDropdownOpen = false;
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to authentication state
    this.tokenStorage.isAuthenticated().subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      
      // If authenticated, get current user and profile image
      if (isAuth) {
        this.currentUser = this.tokenStorage.getCurrentUser();
        this.loadProfileImage();
      } else {
        this.currentUser = null;
        this.userProfileImage = null;
      }
    });
    
    // Additional subscription for profile image updates
    this.tokenStorage.getProfileImage().subscribe(image => {
      this.userProfileImage = image;
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  
  toggleUserDropdown() {
    this.userDropdownOpen = !this.userDropdownOpen;
  }
  
  loadProfileImage(): void {
    const profileImage = this.tokenStorage.getCurrentProfileImage();
    if (profileImage) {
      this.userProfileImage = profileImage;
    } else if (this.currentUser && this.currentUser.profileImage) {
      this.userProfileImage = this.currentUser.profileImage;
      this.tokenStorage.saveProfileImage(this.currentUser.profileImage);
    }
  }
  
  // Navigate to appropriate backoffice section based on user role
  navigateToBackoffice(): void {
    if (!this.currentUser || !this.currentUser.role) {
      this.router.navigate(['frontoffice']);
      return;
    }
    
    const userRole = this.currentUser.role;
    
    switch(userRole.toUpperCase()) {
      case 'ADMIN':
        // Admin goes to dashboard
        this.router.navigate(['backoffice']);
        break;
      case 'FARMER':
        // Farmers go to farm management
        this.router.navigate(['backoffice/farm']);
        break;
      case 'EXPERT':
        // Experts go to events
        this.router.navigate(['backoffice/backEvent']);
        break; 
      case 'DELIVERYDRIVER':
        // Delivery roles go to livraison tracking
        this.router.navigate(['backoffice/suivilivraison']);
        break;
      default:
        // Default to frontoffice for consumers or if role is not recognized
        this.router.navigate(['frontoffice']);
    }
  }

  // Method to handle image loading errors
  handleImageError(event: any): void {
    event.target.style.display = 'none';
    this.userProfileImage = null; // This will trigger the fallback to initials
  }

  // Generate user initials from first and last name
  getUserInitials(): string {
    if (!this.currentUser) {
      return 'U';
    }
    
    let initials = '';
    
    if (this.currentUser.firstName) {
      initials += this.currentUser.firstName.charAt(0).toUpperCase();
    }
    
    if (this.currentUser.lastName) {
      initials += this.currentUser.lastName.charAt(0).toUpperCase();
    }
    
    return initials || this.currentUser.email?.charAt(0).toUpperCase() || 'U';
  }
  
  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/frontoffice']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Even if server-side logout fails, clear local data
        this.router.navigate(['/frontoffice']);
      }
    });
  }

  hasProfileImage(): boolean {
    return this.currentUser?.image != null && this.currentUser?.image !== '';
  }

  getProfileImageUrl(): string {
    if (!this.hasProfileImage()) {
      return '';
    }
    
    const imageName = this.currentUser.image;
    
    // Handle different image path formats
    if (imageName.startsWith('http://') || imageName.startsWith('https://')) {
      // External URLs (like OAuth provider images)
      return imageName;
    } else {
      // For images stored in backend, construct the proper URL
      // Spring Boot serves static resources with the context path
      const imagesPath = '/api/v1/images/';
      
      return `${imagesPath}${imageName}`;
    }
  }
}