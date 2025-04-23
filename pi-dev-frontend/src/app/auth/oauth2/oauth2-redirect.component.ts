import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from '../service/token-storage.service';

@Component({
  selector: 'app-oauth2-redirect',
  template: `
    <div class="d-flex justify-content-center align-items-center" style="height: 100vh;">
      <div class="text-center">
        <h2>Processing your authentication...</h2>
        <div class="spinner-border text-primary mt-3" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-danger mt-3" *ngIf="errorMessage">{{ errorMessage }}</p>
      </div>
    </div>
  `
})
export class OAuth2RedirectComponent implements OnInit {
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tokenStorage: TokenStorageService
  ) {}

  ngOnInit(): void {
    // Handle error from OAuth2 provider
    this.route.queryParams.subscribe(params => {
      const error = params['error'];
      if (error) {
        this.errorMessage = `Authentication failed: ${error}`;
        setTimeout(() => {
          this.router.navigate(['/frontoffice/login']);
        }, 3000);
        return;
      }

      const token = params['token'];
      const userJson = params['user'];

      if (!token) {
        this.errorMessage = 'No authentication token received';
        setTimeout(() => {
          this.router.navigate(['/frontoffice/login']);
        }, 3000);
        return;
      }

      try {
        // Clear the logged_out flag to ensure refresh token works on page reload
        localStorage.removeItem('logged_out');
        
        // Store the token
        this.tokenStorage.setToken(token);
        
        // Parse and store user data if available
        if (userJson) {
          try {
            const user = JSON.parse(userJson);
            this.tokenStorage.saveUser(user);
          } catch (e) {
            console.error('Error parsing user JSON:', e);
          }
        }

        // Navigate to the appropriate page
        this.router.navigate(['/backoffice']);
      } catch (error) {
        console.error('Error processing OAuth2 redirect:', error);
        this.errorMessage = 'Failed to process authentication';
        setTimeout(() => {
          this.router.navigate(['/frontoffice/login']);
        }, 3000);
      }
    });
  }
}