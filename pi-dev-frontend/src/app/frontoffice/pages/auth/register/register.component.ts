import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import  Stepper  from 'bs-stepper';
import { AuthService } from '../../../../auth/service/authentication.service';
import { Router } from '@angular/router';

// Custom validator to check if passwords match
export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { mismatch: true };
  }
  
  return null;
}

enum UserRole {
  EXPERT = 'Expert',
  FARMER = 'Farmer',
  DELIVERY_MAN = 'Delivery Man'
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  private stepper!: Stepper;
  registerForm!: FormGroup;
  selectedUserType: string = '';
  stepperInitialized: boolean = false;
  currentStep: number = 1;
  showPassword = false;
  showConfirmPassword = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Initialize the form
    this.initForm();
  }

  next() {
    if (this.stepper) {
      this.stepper.next();
      this.currentStep++;
    }
  }

  previous() {
    if (this.stepper) {
      this.stepper.previous();
      this.currentStep--;
    }
  }

  // Helper method to check if a step should be visible
  isStepVisible(stepNumber: number): boolean {
    return this.currentStep === stepNumber;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      // Format address as "country + city + zip code" to match backend requirements
      const country = this.registerForm.get('country')?.value || '';
      const city = this.registerForm.get('city')?.value || '';
      const zipCode = this.registerForm.get('zipCode')?.value || '';
      const formattedAddress = `${country} ${city} ${zipCode}`.trim();
      
      // Format the date properly - this is critical for backend compatibility
      let birthDateValue = this.registerForm.get('birthdate')?.value;
      let birthDate = null;
      
      if (birthDateValue) {
        // Ensure proper date format for Java backend
        const date = new Date(birthDateValue);
        // Format as yyyy-MM-dd
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        birthDate = `${year}-${month}-${day}`;
      }
      
      // Create the registration payload exactly matching backend Consumer.builder() structure
      const registrationData: Record<string, any> = {
        firstName: this.registerForm.get('firstName')?.value,
        lastName: this.registerForm.get('lastName')?.value,
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value,
        birthDate: birthDate,
        address: formattedAddress,
        phone: this.registerForm.get('phoneNumber')?.value,
        image: '' // Empty image field as required by backend
      };

      // Log the payload for debugging
      console.log('Registration payload:', JSON.stringify(registrationData));
      
      // Add user type specific fields if applicable
      if (this.selectedUserType === 'expert') {
        registrationData['typeSpeciality'] = this.registerForm.get('expertType')?.value;
        registrationData['yearsOfExperience'] = this.registerForm.get('yearsOfExperience')?.value;
        registrationData["role"] = this.selectedUserType;
      } else if (this.selectedUserType === 'farmer') {
        registrationData['experience'] = this.registerForm.get('farmerExperience')?.value;
        registrationData["role"] = this.selectedUserType;
      } else if (this.selectedUserType === 'delivery') {
        registrationData['carType'] = this.registerForm.get('carType')?.value;
        registrationData['available'] = this.registerForm.get('isAvailable')?.value;
        registrationData["role"] = this.selectedUserType;
      }

      // Call the auth service to register the user
      this.authService.register(registrationData).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.isSubmitting = false;
          this.successMessage = 'Registration successful! Redirecting to dashboard...';
          
          // Navigate based on user type or default to frontoffice
          setTimeout(() => {
            // Check for the access token using both camelCase and snake_case keys
            const accessToken = response.accessToken || response.access_token;
            if (accessToken) {
              // Use AuthService methods instead of directly accessing tokenStorage
               
              
              // Get user from response in the format the backend is sending
              const user = response.userResponse || response.user;
              console.log("user from registration", user);
              
              if (user) {
                // Save user data
                localStorage.setItem('auth-user', JSON.stringify(user));
                // Navigate to verify-email page with the correct path
                this.router.navigate(['/frontoffice/verify-email']);
              } else {
                this.router.navigate(['/frontoffice']);
              }
            } else {
              // If no token, redirect to login
              this.router.navigate(['/frontoffice/login']);
            }
          }, 1500);
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Registration error details:', error);
          this.errorMessage = error.message || 'Registration failed. Please try again.';
        }
      });
    } else {
      // Mark all fields as touched to trigger validation
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
    }
    return false;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onUserTypeChange(userType: string) {
     
    this.selectedUserType = userType;
    this.registerForm.get('userType')?.setValue(userType); // Re-added this line to ensure the value is set
    this.currentStep = 1; // Reset to step 1 when user type changes
    
    // Reset form controls for other user types
    if (userType === 'expert') {
      this.registerForm.get('expertType')?.reset();
      this.registerForm.get('yearsOfExperience')?.reset();
      this.registerForm.get('farmerExperience')?.reset();
      this.registerForm.get('carType')?.reset();
      this.registerForm.get('isAvailable')?.reset();

      // Add validators for expert fields
      this.registerForm.get('expertType')?.setValidators([Validators.required]);
      this.registerForm.get('yearsOfExperience')?.setValidators([Validators.required, Validators.min(0)]);
      
      // Remove validators from other fields
      this.registerForm.get('farmerExperience')?.clearValidators();
      this.registerForm.get('carType')?.clearValidators();
    } else if (userType === 'farmer') {
      this.registerForm.get('expertType')?.reset();
      this.registerForm.get('yearsOfExperience')?.reset();
      this.registerForm.get('carType')?.reset();
      this.registerForm.get('isAvailable')?.reset();

      // Add validators for farmer fields
      this.registerForm.get('farmerExperience')?.setValidators([Validators.required]);
      
      // Remove validators from other fields
      this.registerForm.get('expertType')?.clearValidators();
      this.registerForm.get('yearsOfExperience')?.clearValidators();
      this.registerForm.get('carType')?.clearValidators();
    } else if (userType === 'delivery') {
      this.registerForm.get('expertType')?.reset();
      this.registerForm.get('yearsOfExperience')?.reset();
      this.registerForm.get('farmerExperience')?.reset();

      // Add validators for delivery fields
      this.registerForm.get('carType')?.setValidators([Validators.required]);
      
      // Remove validators from other fields
      this.registerForm.get('expertType')?.clearValidators();
      this.registerForm.get('yearsOfExperience')?.clearValidators();
      this.registerForm.get('farmerExperience')?.clearValidators();
    }

    // Update the validators
    this.registerForm.get('expertType')?.updateValueAndValidity();
    this.registerForm.get('yearsOfExperience')?.updateValueAndValidity();
    this.registerForm.get('farmerExperience')?.updateValueAndValidity();
    this.registerForm.get('carType')?.updateValueAndValidity();
    
    // Initialize stepper after a small delay to ensure DOM is updated
    setTimeout(() => {
      this.initializeStepper();
    }, 100);
  }

  // New method to allow changing user type
  changeUserType() {
    this.selectedUserType = '';
    this.stepperInitialized = false;
    this.currentStep = 1;
    if (this.stepper) {
      this.stepper.reset();
    }
  }
  
  proceedWithRegistration() {
    // User type is now optional, so always proceed
    // If the user has selected a type, initialize the stepper
    if (this.registerForm.get('userType')?.value) {
      this.selectedUserType = this.registerForm.get('userType')?.value;
      
      setTimeout(() => {
        this.initializeStepper();
      }, 100);
    } else {
      // No user type selected, just proceed with regular registration
      // Here you might need to implement a simplified registration flow
      // For now, we'll just submit the form without the multi-step process
      this.onSubmit();
    }
  }
  
  private initializeStepper() {
     
    if (this.selectedUserType) {
      const stepperElement = document.querySelector('#stepper1');
      if (stepperElement) {
        try {
          this.stepper = new Stepper(stepperElement, {
            linear: true,
            animation: true
          });
          this.stepperInitialized = true;
          
        } catch (error) {
          console.error('Error initializing stepper:', error);
        }
      } else {
        console.error('Stepper element not found in DOM');
      }
    }
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      // First stepper - personal info
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required], // Added confirmation password field
      birthdate: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      userType: [''], // Removed Validators.required
      
      // Expert specific fields
      expertType: [''],
      yearsOfExperience: [''],
      
      // Farmer specific fields
      farmerExperience: [''],
      
      // Delivery man specific fields
      carType: [''],
      isAvailable: [false]
    }, {
      validators: passwordMatchValidator // Add the custom validator to the form group
    });
  }
  
  // Helper methods for validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
  
  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (!field) return '';
    
    if (field.hasError('required')) {
      return 'This field is required';
    }
    if (field.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field.hasError('minlength')) {
      return `Minimum length is ${field.errors?.['minlength'].requiredLength} characters`;
    }
    if (field.hasError('min')) {
      return `Value must be at least ${field.errors?.['min'].min}`;
    }
    
    return 'Invalid input';
  }
}
