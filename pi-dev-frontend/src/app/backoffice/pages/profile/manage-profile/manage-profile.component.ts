import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenStorageService } from '../../../../auth/service/token-storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-manage-profile',
  templateUrl: './manage-profile.component.html',
  styleUrls: ['./manage-profile.component.css']
})
export class ManageProfileComponent implements OnInit, OnDestroy {
  // Existing properties
  currentUser: any;
  twoFactorEnabled = false;
  faceIdEnabled = false;
  showQrCode = false;
  showVerifyCode = false;
  showFaceSetup = false;
  step = 1;
  verificationCode = '';
  qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?data=otpauth://totp/PiDevApp:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=PiDevApp&algorithm=SHA1&digits=6&period=30';
  setupComplete = false;
  
  // Face ID related variables
  faceDetected = false;
  captureInProgress = false;
  captureFailed = false;
  captureComplete = false;
  faceCaptureMessage = '';
  
  // Webcam variables
  @ViewChild('webcamContainer') webcamContainer!: ElementRef;
  showWebcam = false;
  webcamImage: WebcamImage | undefined = undefined;
  trigger: Subject<void> = new Subject<void>();
  errors: WebcamInitError[] = [];
  private mediaStream: MediaStream | null = null;
  
  // Verification form
  verificationForm: FormGroup;
  
  // API URLs - Using environment configuration
  private apiUrl = environment.apiUrl;

  constructor(
    private tokenStorage: TokenStorageService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.verificationForm = this.fb.group({
      verificationCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
    
    // Check browser webcam support
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        if (mediaDevices && mediaDevices.length > 0) {
          console.log('Found camera devices:', mediaDevices.length);
        } else {
          console.error('No camera devices available');
        }
      });
  }
  
  ngOnDestroy(): void {
    // Ensure we clean up the camera when component is destroyed
    this.stopWebcam();
  }

  loadUserProfile(): void {
    const user = this.tokenStorage.getCurrentUser();
    if (user) {
      this.currentUser = user;
      console.log('Current user:', this.currentUser);
      this.twoFactorEnabled = user.twoFactorEnabled || false;
      this.faceIdEnabled = user.faceIdEnabled || false;
    }
  }

  startTwoFactorSetup(): void {
    this.showQrCode = true;
    this.showVerifyCode = false;
    this.showFaceSetup = false;
    this.step = 1;
    this.setupComplete = false;
    
    // In a real implementation, you would generate a secret key and QR code from the backend
    // For demo purposes, we're using a static URL
    this.qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?data=otpauth://totp/PiDevApp:' + 
                    this.currentUser?.email + '?secret=JBSWY3DPEHPK3PXP&issuer=PiDevApp&algorithm=SHA1&digits=6&period=30';
  }

  verifyTwoFactorCode(): void {
    if (this.verificationForm.invalid) return;
    
    const code = this.verificationForm.get('verificationCode')?.value;
    
    // In a real implementation, you would validate this code with your backend
    // For demo purposes, let's pretend any 6-digit code works
    if (code && code.length === 6) {
      this.twoFactorEnabled = true;
      this.setupComplete = true;
      this.showQrCode = false;
      this.step = 2;
      
      // In a real implementation, you'd save this setting to the backend
      const updatedUser = {...this.currentUser, twoFactorEnabled: true};
      this.tokenStorage.saveUser(updatedUser);
    }
  }

  nextStep(): void {
    this.showQrCode = false;
    this.showVerifyCode = true;
    this.step = 2;
  }

  startFaceIdSetup(): void {
    this.showFaceSetup = true;
    this.showQrCode = false;
    this.showVerifyCode = false;
    this.faceDetected = false;
    this.captureFailed = false;
    this.captureInProgress = false;
    this.captureComplete = false;
    this.faceCaptureMessage = 'Position your face in the frame';
    this.setupComplete = false;
    
    // Initialize webcam with a delay to ensure DOM is ready
    setTimeout(() => {
      this.showWebcam = true;
    }, 100);
  }

  stopWebcam(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    this.showWebcam = false;
  }

  captureFace(): void {
    this.captureInProgress = true;
    this.faceCaptureMessage = 'Capturing your face...';
    
    // Trigger the webcam to take a photo
    this.trigger.next();
  }

  // WebcamImage handling
  handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.showWebcam = false; // Hide webcam after capture
    this.faceDetected = true;
    this.faceCaptureMessage = 'Face captured! Processing...';
    
    // Convert image to base64 for sending to the server
    const imageAsDataUrl = webcamImage.imageAsDataUrl;
    
    // Send to the backend
    this.uploadFaceImage(imageAsDataUrl);
  }
  
  // Trigger webcam photo capture
  triggerSnapshot(): void {
    this.trigger.next();
  }
  
  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
  
  // Handle webcam errors
  handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
    console.error('Webcam error:', error);
    this.captureInProgress = false;
    this.captureFailed = true;
    this.faceCaptureMessage = `Error initializing webcam: ${error.message}`;
  }

  // Upload face image to backend
  uploadFaceImage(imageAsDataUrl: string): void {
    // Request body for face ID registration
    const requestData = {
      imageBase64: imageAsDataUrl
    };

    // Get auth token from storage - log token for debugging
    const token = this.tokenStorage.getToken();
    console.log('Token when uploading face image:', token ? 'Token exists' : 'Token is null');
    
    // Create headers object with token if it exists
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.error('No authentication token available. User may need to log in again.');
      this.captureFailed = true;
      this.captureInProgress = false;
      this.faceCaptureMessage = 'Authentication error. Please log in again.';
      return;
    }

    console.log('Uploading face image to:', `${this.apiUrl}face-id/register`);
    console.log('Headers:', headers);
    
    this.http.post(`${this.apiUrl}face-id/register`, requestData, { headers })
      .subscribe({
        next: (response: any) => {
          console.log('Face registration response:', response);
          
          if (response.success) {
            this.captureInProgress = false;
            this.captureComplete = true;
            this.faceIdEnabled = true;
            this.faceCaptureMessage = 'Face ID setup complete!';
            
            // Update user data in storage
            const updatedUser = {
              ...this.currentUser,
              faceIdEnabled: true,
              faceId: response.faceId
            };
            this.tokenStorage.saveUser(updatedUser);
          } else {
            // Handle error from the backend even with 200 OK response
            this.captureInProgress = false;
            this.captureFailed = true;
            this.faceCaptureMessage = response.message || 'Failed to register face. Please try again.';
            console.error('Face registration failed:', response.message);
          }
        },
        error: (error) => {
          console.error('Error registering face:', error);
          this.captureInProgress = false;
          this.captureFailed = true;
          
          // Get detailed error message if available
          let errorMsg = 'Failed to register face. Please try again.';
          if (error.error && error.error.message) {
            errorMsg = error.error.message;
          } else if (error.status === 401) {
            errorMsg = 'Authentication required. Please log in again.';
          } else if (error.status === 403) {
            errorMsg = 'You don\'t have permission to perform this action.';
          }
          
          this.faceCaptureMessage = errorMsg;
        }
      });
  }

  retryCaptureface(): void {
    this.faceDetected = false;
    this.captureFailed = false;
    this.captureInProgress = false;
    this.captureComplete = false;
    this.webcamImage = undefined;
    this.faceCaptureMessage = 'Position your face in the frame';
    this.showWebcam = true;
  }

  cancelSetup(): void {
    this.showQrCode = false;
    this.showVerifyCode = false;
    this.showFaceSetup = false;
    this.stopWebcam();
    this.setupComplete = false;
  }

  disableTwoFactor(): void {
    // Get auth token from storage
    const token = this.tokenStorage.getToken();
    
    // Add authorization header with JWT token if available
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.error('No authentication token available for disableTwoFactor');
      return;
    }
    
    // Make API call to backend to disable 2FA
    this.http.post(`${this.apiUrl}two-factor/disable`, { userId: this.currentUser.userUUID }, { headers })
      .subscribe({
        next: () => {
          this.twoFactorEnabled = false;
          const updatedUser = {...this.currentUser, twoFactorEnabled: false};
          this.tokenStorage.saveUser(updatedUser);
        },
        error: (error) => {
          console.error('Error disabling 2FA:', error);
        }
      });
  }

  disableFaceId(): void {
    // Get auth token from storage
    const token = this.tokenStorage.getToken();
    
    // Create headers object with token if it exists
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.error('No authentication token available for disableFaceId');
      return;
    }
    
    // Make API call to backend to disable Face ID
    this.http.post(`${this.apiUrl}face-id/disable`, {}, { headers })
      .subscribe({
        next: (response: any) => {
          console.log('Face ID disabled:', response);
          this.faceIdEnabled = false;
          const updatedUser = {...this.currentUser, faceIdEnabled: false, faceId: null};
          this.tokenStorage.saveUser(updatedUser);
        },
        error: (error) => {
          console.error('Error disabling Face ID:', error);
          let errorMsg = 'Failed to disable Face ID. Please try again.';
          if (error.error && error.error.message) {
            errorMsg = error.error.message;
          } else if (error.status === 401) {
            errorMsg = 'Authentication required. Please log in again.';
          }
          // You could display this error to the user with a toast/notification
        }
      });
  }
}
