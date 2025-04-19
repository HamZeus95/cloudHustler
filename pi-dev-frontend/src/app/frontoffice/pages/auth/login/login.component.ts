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
        // Navigate to dashboard or home page after successful login
        this.router.navigate(['/backoffice']);
      },
      error: (error) => {
        this.isSubmitting = false;
        if (error.status === 401) {
          this.loginError = 'Invalid email or password';
        } else {
          this.loginError = 'An unexpected error occurred. Please try again later.';
        }
        console.error('Login error:', error);
      }
    });
  }
}
