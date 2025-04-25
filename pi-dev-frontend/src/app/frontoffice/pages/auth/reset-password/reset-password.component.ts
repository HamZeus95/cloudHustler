import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../auth/service/authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  isSubmitting = false;
  isValidating = true;
  isTokenValid = false;
  errorMessage = '';
  successMessage = '';
  token = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: this.passwordMatchValidator
    });

    // Extract token from URL
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.token = params['token'];
        this.validateToken();
      } else {
        this.isValidating = false;
        this.isTokenValid = false;
        this.errorMessage = 'Invalid reset link. Please request a new password reset.';
      }
    });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(frm: FormGroup) {
    return frm.controls['password'].value === frm.controls['confirmPassword'].value ? null : { 'mismatch': true };
  }

  // Validate the token when component initializes
  validateToken(): void {
    this.authService.validateResetToken(this.token).subscribe({
      next: (response) => {
        this.isValidating = false;
        if (response.valid) {
          this.isTokenValid = true;
        } else {
          this.isTokenValid = false;
          this.errorMessage = 'Reset token is invalid or has expired. Please request a new password reset.';
        }
      },
      error: (error) => {
        this.isValidating = false;
        this.isTokenValid = false;
        this.errorMessage = 'Invalid reset link. Please request a new password reset.';
      }
    });
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.resetPasswordForm.controls;
  }

  onSubmit(): void {
    // Stop here if form is invalid
    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const password = this.f['password'].value;
    const confirmPassword = this.f['confirmPassword'].value;

    this.authService.resetPassword(this.token, password, confirmPassword).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.successMessage = 'Password reset successful. You can now log in with your new password.';
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/frontoffice/login']);
        }, 3000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'Failed to reset password. Please try again.';
      }
    });
  }

  requestNewReset(): void {
    this.router.navigate(['/frontoffice/forgot-password']);
  }

  goToLogin(): void {
    this.router.navigate(['/frontoffice/login']);
  }
}