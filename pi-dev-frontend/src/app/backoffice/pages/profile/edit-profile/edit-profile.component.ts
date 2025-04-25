import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../auth/service/authentication.service';
import { TokenStorageService } from '../../../../auth/service/token-storage.service';
import { UserService } from '../../../../auth/service/user.service';
import { InitialsPipe } from '../../../../core/pipes/initials.pipe';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
  providers: [InitialsPipe]
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  currentUser: any;
  isSubmitting: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  showPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    public initialsPipe: InitialsPipe
  ) { 
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [{value: '', disabled: true}], // Email cannot be edited
      phone: ['', Validators.required],
      address: ['', Validators.required],
      birthDate: ['', Validators.required]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
      this.loadUserProfile();
    });
  }

  loadUserProfile(): void {
    // First try to get the user from token storage
    const user = this.tokenStorage.getCurrentUser();
    if (user) {
      this.currentUser = user;
      this.populateForm(user);
    } else {
      // If not available, fetch from API
      this.userService.getUserProfile().subscribe({
        next: (userData) => {
          this.currentUser = userData;
          this.populateForm(userData);
          this.tokenStorage.saveUser(userData);
        },
        error: (error) => {
          this.errorMessage = 'Failed to load user profile. Please try again.';
          console.error('Error loading user profile:', error);
        }
      });
    }
  }

  populateForm(user: any): void {
    if (!user) return;

    this.profileForm.patchValue({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : ''
    });

    // Set image preview if image exists
    if (user.image) {
      // Check if the image is a full URL or just a filename
      this.imagePreview = user.image.startsWith('http://') || user.image.startsWith('https://') ? 
                          user.image : 
                          `/api/v1/images/${user.image}`;
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = new FormData();
    
    // Add form fields to FormData
    formData.append('firstName', this.profileForm.get('firstName')?.value);
    formData.append('lastName', this.profileForm.get('lastName')?.value);
    formData.append('phone', this.profileForm.get('phone')?.value);
    formData.append('address', this.profileForm.get('address')?.value);
    formData.append('birthDate', this.profileForm.get('birthDate')?.value);
    
    // Add image if selected and not an OAuth user
    if (this.selectedFile && !this.isOAuthUser()) {
      formData.append('image', this.selectedFile);
    } else if (this.selectedFile && this.isOAuthUser()) {
      this.errorMessage = 'Profile image cannot be changed for users authenticated with Google or GitHub.';
      this.isSubmitting = false;
      return;
    }

    // Call API to update profile
    this.userService.updateUserProfile(formData).subscribe({
      next: (response) => {
        this.successMessage = 'Profile updated successfully!';
        this.isSubmitting = false;
        
        // Update stored user data
        if (response.userResponse) {
          this.tokenStorage.saveUser(response.userResponse);
          this.currentUser = response.userResponse;
        }

        // Reload page after 2 seconds to reflect changes
        setTimeout(() => {
          this.router.navigate(['/backoffice/profile/manage-profile', this.userId]);
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to update profile. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  onChangePassword(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const passwordData = {
      currentPassword: this.passwordForm.get('currentPassword')?.value,
      newPassword: this.passwordForm.get('newPassword')?.value,
      confirmPassword: this.passwordForm.get('confirmPassword')?.value
    };

    this.userService.changePassword(passwordData).subscribe({
      next: () => {
        this.successMessage = 'Password changed successfully!';
        this.isSubmitting = false;
        this.passwordForm.reset();
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to change password. Please check your current password.';
        this.isSubmitting = false;
      }
    });
  }

  onFileChange(event: Event): void {
    // Prevent image changes for OAuth users
    if (this.isOAuthUser()) {
      this.errorMessage = 'Profile image cannot be changed for users authenticated with Google or GitHub.';
      return;
    }
    
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'current') {
      this.showPassword = !this.showPassword;
    } else if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(form: FormGroup) {
    return form.controls['newPassword'].value === form.controls['confirmPassword'].value 
      ? null 
      : { 'mismatch': true };
  }

  cancelEdit(): void {
    this.router.navigate(['/backoffice/profile/manage-profile', this.userId]);
  }

  /**
   * Checks if the user is authenticated via OAuth (Google or GitHub)
   */
  isOAuthUser(): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.provider === 'google' || this.currentUser.provider === 'github';
  }

  /**
   * Gets the user's full name
   */
  getFullName(): string {
    if (!this.currentUser) return '';
    return `${this.currentUser.firstName || ''} ${this.currentUser.lastName || ''}`.trim();
  }
}
