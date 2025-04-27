import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/service/authentication.service';

@Component({
  selector: 'app-oauth2-restricted',
  templateUrl: './oauth2-restricted.component.html',
  styleUrls: ['./oauth2-restricted.component.css']
})
export class Oauth2RestrictedComponent {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  navigateToHome(): void {
    // Navigate to your app's home page
    this.router.navigate(['/']);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/frontoffice/login']);
      },
      error: (error) => {
        console.error('Logout error', error);
        // Even if there's an error, try to redirect to login
        this.router.navigate(['/frontoffice/login']);
      }
    });
  }
}
