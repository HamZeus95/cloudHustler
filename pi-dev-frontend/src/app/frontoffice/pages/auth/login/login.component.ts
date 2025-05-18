import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../auth/service/authentication.service';
import { TokenStorageService } from '../../../../auth/service/token-storage.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  isSubmitting = false;
  isFaceLoginSubmitting = false;
  loginError = '';
  loginSuccess = '';
  showPassword = false;
  
  // Face ID login properties
  showFaceIdLogin = false;
  isCameraActive = false;
  capturedImage: string | null = null;
  mediaStream: MediaStream | null = null;
  
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  
  // API URL from environment config
  private apiUrl = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private tokenStorage: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  ngOnDestroy(): void {
    // Make sure to stop the camera when component is destroyed
    this.stopCamera();
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
        this.loginSuccess = 'Login successful!';
        
        // Get user data from response
        const user = response.userResponse || response.user;
        
        if (user) {
          // Store profile image if available
          if (user.profileImage) {
            localStorage.setItem('user-profile-image', user.profileImage);
          }
          
          // Get user role and redirect based on role
          const userRole = user.role || user.Role;
          console.log('User logged in with role:', userRole);

          // Clear the logged_out flag on successful login
          localStorage.removeItem('logged_out');
        
          setTimeout(() => {
            if (userRole) {
              // Navigate to specific routes based on user role
              switch(userRole.toUpperCase()) {
                case 'ADMIN':
                  // Admin goes to dashboard
                  this.router.navigate(['backoffice']);
                  break;
                case 'FARMER':
                  // Farmers go to farm management
                  this.router.navigate(['backoffice/farm']);
                  break;
                case 'EXPERT':
                  // Experts go to events
                  this.router.navigate(['backoffice/backEvent']);
                  break; 
                case 'DeliveryDriver':
                  // Delivery roles go to livraison tracking
                  this.router.navigate(['backoffice/suivilivraison']);
                  break;
                default:
                  // Default to frontoffice for consumers or if role is not recognized
                  this.router.navigate(['frontoffice']);
              }
            } else {
              // Default to frontoffice if role is not specified
              this.router.navigate(['frontoffice']);
            }
          }, 500);
        } else {
          // Fallback if user object is not available
          this.router.navigate(['frontoffice']);
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

  // Face ID login methods
  toggleFaceIdLogin(): void {
    this.showFaceIdLogin = !this.showFaceIdLogin;
    if (!this.showFaceIdLogin) {
      this.stopCamera();
      this.capturedImage = null;
    }
  }

  startCamera(): void {
    this.loginError = '';
    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          this.mediaStream = stream;
          this.isCameraActive = true;
          
          // Need to wait for ViewChild to be available after *ngIf condition changes
          setTimeout(() => {
            if (this.videoElement && this.videoElement.nativeElement) {
              this.videoElement.nativeElement.srcObject = stream;
            }
          }, 100);
        })
        .catch(err => {
          console.error('Error accessing the camera:', err);
          this.loginError = 'Could not access the camera. Please check your camera permissions.';
        });
    } else {
      this.loginError = 'Your browser does not support camera access. Please use another browser or login with password.';
    }
  }

  stopCamera(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    this.isCameraActive = false;
  }

  captureImage(): void {
    if (!this.videoElement || !this.isCameraActive) return;
    
    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.capturedImage = canvas.toDataURL('image/jpeg');
      this.stopCamera();
    }
  }

  resetCaptureProcess(): void {
    this.capturedImage = null;
    this.startCamera();
  }

  loginWithFaceId(): void {
    if (!this.capturedImage) {
      this.loginError = 'Please capture your face image first';
      return;
    }
    
    this.loginError = '';
    this.isFaceLoginSubmitting = true;
    
    this.authService.loginWithFaceIdOnly(this.capturedImage).subscribe({
      next: (response) => {
        this.isFaceLoginSubmitting = false;
        this.loginSuccess = 'Face ID verification successful!';
        
        // Clear any logged out flags
        localStorage.removeItem('logged_out');
        
        console.log('Face ID login successful:', response);
        
        // Get user from response in the format the backend is sending
        const user = response.userResponse || response.user;
        
        // Handle case when no user data is returned
        if (!user && response.accessToken) {
          console.log('No user data in response, but token received - navigating to backoffice');
          setTimeout(() => {
            this.router.navigate(['/backoffice']);
          }, 1000);
          return;
        }
        
        if (user) {
          // Store profile image if available
          if (user.profileImage) {
            localStorage.setItem('user-profile-image', user.profileImage);
          }
          
          // Get user role and redirect based on role
          const userRole = user.role || user.Role;
          console.log('User logged in with Face ID. Role:', userRole);
          

          // Clear the logged_out flag on successful login
          localStorage.removeItem('logged_out');
        
          setTimeout(() => {
            if (userRole) {
              // Navigate to specific routes based on user role
              switch(userRole.toUpperCase()) {
                case 'ADMIN':
                  // Admin goes to dashboard
                  this.router.navigate(['backoffice']);
                  break;
                case 'FARMER':
                  // Farmers go to farm management
                  this.router.navigate(['backoffice/farm']);
                  break;
                case 'EXPERT':
                  // Experts go to events
                  this.router.navigate(['backoffice/backEvent']);
                  break; 
                case 'DeliveryDriver':
                  // Delivery roles go to livraison tracking
                  this.router.navigate(['backoffice/suivilivraison']);
                  break;
                default:
                  // Default to frontoffice for consumers or if role is not recognized
                  this.router.navigate(['frontoffice']);
              }
            } else {
              // Default to frontoffice if role is not specified
              this.router.navigate(['frontoffice']);
            }
          }, 500);
          
          // Navigate based on user role
          // setTimeout(() => {
          //   // Force navigation to backoffice for face login users
          //   this.router.navigate(['/backoffice/farm'], { replaceUrl: true }).then(
          //     success => console.log('Navigation success:', success),
          //     error => console.error('Navigation error:', error)
          //   );
          // }, 1000);
        } else {
          // Fallback if user object is not available
          console.log('No user data in response - using fallback navigation');
          setTimeout(() => {
            this.router.navigate(['/backoffice'], { replaceUrl: true });
          }, 1000);
        }
      },
      error: (error) => {
        this.isFaceLoginSubmitting = false;
        
        if (error.error && error.error.message) {
          this.loginError = error.error.message;
        } else {
          this.loginError = 'Face verification failed. Please try again or use password login.';
        }
        console.error('Face ID login error:', error);
      }
    });
  }
}
