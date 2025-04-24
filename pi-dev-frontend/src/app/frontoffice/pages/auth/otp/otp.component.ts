import { Component, OnInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../auth/service/authentication.service';
import { TokenStorageService } from '../../../../auth/service/token-storage.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;
  
  otpForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  userEmail = '';
  remainingAttempts = 3;
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Get user email from TokenStorage synchronously using getCurrentUser()
    const user = this.tokenStorage.getCurrentUser();
    if (user && user.email) {
      this.userEmail = user.email;
    } else {
      // If no user email in storage, try to get it from localStorage directly
      const userData = localStorage.getItem('auth-user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          if (parsedUser.email) {
            this.userEmail = parsedUser.email;
          }
        } catch (e) {
          console.error('Failed to parse user data:', e);
        }
      }
    }
    
    // Initialize the form with 6 OTP digits
    this.otpForm = this.formBuilder.group({
      digit1: ['', [Validators.required, Validators.maxLength(1), Validators.pattern('[0-9]')]],
      digit2: ['', [Validators.required, Validators.maxLength(1), Validators.pattern('[0-9]')]],
      digit3: ['', [Validators.required, Validators.maxLength(1), Validators.pattern('[0-9]')]],
      digit4: ['', [Validators.required, Validators.maxLength(1), Validators.pattern('[0-9]')]],
      digit5: ['', [Validators.required, Validators.maxLength(1), Validators.pattern('[0-9]')]],
      digit6: ['', [Validators.required, Validators.maxLength(1), Validators.pattern('[0-9]')]]
    });
    
    if (!this.userEmail) {
      this.errorMessage = 'No email found. Please go back to registration.';
    }
  }

  ngAfterViewInit() {
    // Setup automatic focus movement between OTP inputs
    this.setupOtpInputEvents();
  }

  // Handle OTP input focus and navigation
  setupOtpInputEvents() {
    this.otpInputs.forEach((input, index) => {
      const inputElement = input.nativeElement;
      
      // Add input event listener
      inputElement.addEventListener('input', (e: any) => {
        const value = e.target.value;
        
        if (value.length === 1) {
          // Move to next input if available
          if (index < this.otpInputs.length - 1) {
            this.otpInputs.get(index + 1)?.nativeElement.focus();
          }
        }
      });

      // Add keydown event listener for backspace
      inputElement.addEventListener('keydown', (e: KeyboardEvent) => {
        // If backspace is pressed and the input is empty, move focus to previous input
        if (e.key === 'Backspace' && !inputElement.value && index > 0) {
          this.otpInputs.get(index - 1)?.nativeElement.focus();
        }
      });
    });
  }

  // Handle OTP form submission
  onSubmit(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Combine all OTP digits into a single string
    const otpValue = 
      this.otpForm.get('digit1')?.value +
      this.otpForm.get('digit2')?.value +
      this.otpForm.get('digit3')?.value +
      this.otpForm.get('digit4')?.value +
      this.otpForm.get('digit5')?.value +
      this.otpForm.get('digit6')?.value;

    // Call the OTP verification service
    this.authService.verifyOtp(this.userEmail, otpValue).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Email verification successful!';
        
        // Update user token and information if provided in response
        // Handle both camelCase and snake_case response properties from backend
        const accessToken = response.accessToken || response.access_token;
        if (accessToken) {
          this.tokenStorage.setToken(accessToken);
        }
        
        // The backend might return user data as 'user' or 'userResponse'
        const userData = response.user || response.userResponse;
        if (userData) {
          this.tokenStorage.saveUser(userData);
        }
        
        // Navigate to the dashboard after short delay
        setTimeout(() => {
          this.router.navigate(['/frontoffice/login']);
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Failed to verify OTP. Please try again.';
        this.remainingAttempts--;
        
        if (this.remainingAttempts <= 0) {
          this.errorMessage += ' Maximum attempts reached. Please request a new code.';
        }
      }
    });
  }

  // Handle resend OTP functionality
  resendOtp(): void {
    if (!this.userEmail) {
      this.errorMessage = 'No email found. Please go back to registration.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.authService.resendOtp(this.userEmail).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'A new verification code has been sent to your email.';
        this.remainingAttempts = 3; // Reset attempts counter
        
        // Reset form values
        this.otpForm.reset();
        
        // Focus on the first input field
        setTimeout(() => {
          this.otpInputs.first.nativeElement.focus();
        }, 100);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Failed to resend verification code.';
      }
    });
  }
}
