import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../auth/service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitting = false;
  loginError = '';
  loginSuccess = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  // Convenience getter for easy access to form fields
  get f() { 
    return this.loginForm.controls; 
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }

  loginWithGithub(): void {
    this.authService.loginWithGithub();
  }

  onSubmit(): void {
    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.loginError = '';
    
    const credentials = {
      email: this.f['email'].value,
      password: this.f['password'].value
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        // Clear the logged_out flag on successful login
        localStorage.removeItem('logged_out');
        
        this.isSubmitting = false;
        
        // Get user role from the response
        const userRole = response.userResponse?.Role || response.user?.Role;
        console.log('User logged in with role:', userRole);
        
        // Navigate based on user role
        if (userRole === 'farmer' || userRole === 'expert' || userRole === 'delivery') {
          this.router.navigate(['/backoffice']);
        } else {
          // Default to frontoffice for consumers or if role is not specified
          this.router.navigate(['/frontoffice/home']);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        
        // Check for specific error responses
        if (error.error && error.error.message) {
          this.loginError = error.error.message;
          
          // If account is not verified, offer to resend verification code
          if (error.error.requiresVerification) {
            this.handleUnverifiedAccount(error.error.email);
          }
        } else if (error.status === 401) {
          this.loginError = 'Invalid email or password';
        } else {
          this.loginError = 'An unexpected error occurred. Please try again later.';
        }
        console.error('Login error:', error);
      }
    });
  }
  
  // Helper method to handle unverified accounts
  handleUnverifiedAccount(email: string): void {
    // Store email temporarily for OTP verification
    sessionStorage.setItem('pendingVerificationEmail', email);
    
    // After a short delay, redirect to verification page
    setTimeout(() => {
      this.router.navigate(['/frontoffice/verify-email']);
    }, 3000);
  }
}
