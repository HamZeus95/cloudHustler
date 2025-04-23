import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../auth/service/authentication.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // Convenience getter for easy access to form fields
  get f() { 
    return this.forgotPasswordForm.controls; 
  }

  onSubmit(): void {
    // Stop here if form is invalid
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    const email = this.f['email'].value;

    this.authService.forgotPassword(email).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.successMessage = 'Reset password instructions have been sent to your email address.';
        // We don't redirect the user here, as they need to check their email
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'Failed to send password reset email. Please try again.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/frontoffice/login']);
  }
}