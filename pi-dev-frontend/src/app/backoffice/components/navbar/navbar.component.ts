import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/service/authentication.service';
import { TokenStorageService } from '../../../auth/service/token-storage.service';
import { InitialsPipe } from '../../../core/pipes/initials.pipe';
import { SidebarService } from '../../../core/services/sidebar.service';
//import { UserService } from "../../../auth/service/user.service"

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [InitialsPipe]
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  @Output() openSettingsEvent = new EventEmitter<void>();
  searchQuery = '';
  isAuthenticated = false;
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private initialsPipe: InitialsPipe,
    private sidebarService: SidebarService,
  ) {}

  ngOnInit(): void {
    // Check authentication status
    this.authService.isAuthenticated().subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        this.currentUser = this.tokenStorageService.getCurrentUser();
      }
      console.log(this.currentUser)
    });

    // Subscribe to user changes
    this.tokenStorageService.getUser().subscribe(user => {
      this.currentUser = user;
    });
    
    // Add click handler to close dropdowns when clicking outside
    document.addEventListener('click', (event: Event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown')) {
        this.closeAllDropdowns();
      }
    });
  }

  // Custom dropdown toggle handlers
  toggleUserDropdown(event: Event): void {
    event.stopPropagation(); // Prevent the document click handler from firing
    const dropdown = document.getElementById('userDropdownMenuList');
    
    // Close other dropdowns
    const notificationDropdown = document.getElementById('notificationDropdownList');
    if (notificationDropdown) {
      notificationDropdown.classList.remove('show');
    }
    
    // Toggle current dropdown
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  }
  
  toggleNotificationDropdown(event: Event): void {
    event.stopPropagation(); // Prevent the document click handler from firing
    const dropdown = document.getElementById('notificationDropdownList');
    
    // Close other dropdowns
    const userDropdown = document.getElementById('userDropdownMenuList');
    if (userDropdown) {
      userDropdown.classList.remove('show');
    }
    
    // Toggle current dropdown
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  }
  
  closeAllDropdowns(): void {
    const dropdowns = document.querySelectorAll('.dropdown-menu');
    dropdowns.forEach(dropdown => {
      dropdown.classList.remove('show');
    });
  }

  getUserInitials(): string {
    if (!this.currentUser) return 'U';
    
    const fullName = (this.currentUser.firstName || '') + ' ' + (this.currentUser.lastName || '');
    if (fullName.trim()) {
      return this.initialsPipe.transform(fullName);
    }
    return 'U';
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

  signOut(): void {
    // Call the logout API first
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout API call successful');
        // Navigate to the logout page which will handle displaying a message and redirect
        this.router.navigate(['/frontoffice/logout']);
      },
      error: (err) => {
        console.error('Logout API call failed:', err);
        // Even if the server call fails, clear local data and navigate to logout page
        this.tokenStorageService.clearToken();
        this.router.navigate(['/frontoffice/logout']);
      }
    });
  }

  toggleSidebar(): void {
    // Use the sidebar service to toggle
    this.sidebarService.toggleSidebar();
    
    // Also emit the event for backward compatibility
    this.toggleSidebarEvent.emit();
  }

  openSettings(): void {
    this.openSettingsEvent.emit();
  }

 

}
