import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit, OnDestroy {
  remainingSeconds = 5;
  progressValue = 0;
  private countdownSubscription?: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Set a flag in localStorage to indicate user has logged out
    localStorage.setItem('logged_out', 'true');
    
    // Start the countdown
    this.startCountdown();
    
    // Delete all potential cookies by setting expiration in the past
    this.clearAllCookies();
    
    // Try direct approach for the specific refresh_token cookie
    this.clearRefreshTokenCookie();
  }

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  startCountdown(): void {
    // Create a countdown from 5 seconds
    this.countdownSubscription = interval(1000)
      .pipe(take(this.remainingSeconds))
      .subscribe({
        next: (count) => {
          this.remainingSeconds = this.remainingSeconds - 1;
          this.progressValue = (count + 1) / this.remainingSeconds * 100;
        },
        complete: () => {
          this.goToLogin();
        }
      });
  }

  goToLogin(): void {
    // Navigate to login page
    this.router.navigate(['/frontoffice/login']);
  }

  // Additional client-side attempt to clear cookies
  private clearAllCookies(): void {
    const cookies = document.cookie.split(';');
    
    for (let cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      
      // Set cookie expiration in the past
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/api`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/api/v1`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/api/v1/auth`;
    }
  }
  
  // Focused approach to target the specific persistent cookie
  private clearRefreshTokenCookie(): void {
    // Try with exact matching parameters from the browser
    document.cookie = "refresh_token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax";
    
    // Try another variation with domain
    if (window.location.hostname === 'localhost') {
      document.cookie = "refresh_token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=localhost;SameSite=Lax";
    }
    
    // Try with a combination that sometimes works for HttpOnly cookies
    document.cookie = "refresh_token=;max-age=0;path=/;SameSite=Lax";
    
    console.log("Attempted to clear refresh_token cookie with specific parameters");
  }
}