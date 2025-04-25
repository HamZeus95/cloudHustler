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
        
        if(response.user){
          this.router.navigate(["/backoffice"])
        }else{
          this.router.navigate(["/frontoffice"])
        }

        //! fix later
        // Get user role to direct to proper dashboard
        // const userRole = response.user?.Role;
        
        
        // // Navigate based on user role
        // if (userRole === 'ADMIN') {
        //   this.router.navigate(['/backoffice']);
        // } else {
        //   this.router.navigate(['/frontoffice']);
        // }
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
