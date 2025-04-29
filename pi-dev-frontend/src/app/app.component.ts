import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/service/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'pi-dev-frontend';
  
  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
    // Attempt to refresh the access token on application startup
    // This will use the HttpOnly refresh token cookie if it exists
    this.authService.validateSession().subscribe({
      next: () => {
        console.log('Session validated successfully on app startup');
      },
      error: (err) => {
        console.log('No valid session found on app startup:', err);
        // This is not necessarily an error, just means the user isn't logged in
      }
    });
  }
}
