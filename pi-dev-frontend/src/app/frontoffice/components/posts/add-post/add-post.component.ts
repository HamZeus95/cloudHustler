import { Component, EventEmitter, Output } from '@angular/core';
import { PostService } from '../../../../core/services/service';
import { Post } from '../../../../core/models/Post';
import { AuthService } from '../../../../auth/service/authentication.service';
import { TokenStorageService } from '../../../../auth/service/token-storage.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent {
  @Output() postAdded = new EventEmitter<void>();
  showForm = false;
 
  post: Post = {
    title: '',
    content: '',
    mediaUrl: '',
  };
  
  currentUser: any = null;
  isAuthenticated = false;
  fileToUpload: File | null = null;

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        // Récupérer l'utilisateur directement depuis le stockage local
        const user = this.tokenStorageService.getCurrentUser();
        if (user) {
          this.currentUser = user;
          console.log('Current user:', this.currentUser); // Vérifiez les données de l'utilisateur
        }
      }
    });
    this.tokenStorageService.getUser().subscribe(user => {
      this.currentUser = user;
      console.log('User updated:', this.currentUser); // Vérifiez les mises à jour
    });
  }

  isImage(url: string | undefined): boolean {
    if (!url) return false;
    return url.startsWith('data:image');
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  isVideo(url: string | undefined): boolean {
    if (!url) return false;
    return url.startsWith('data:video');
  }

  isPDF(url: string | undefined): boolean {
    if (!url) return false;
    return url.includes('application/pdf');
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileToUpload = file;
      this.previewFile(file);
    }
  }

  previewFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.post.mediaUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    const user = this.tokenStorageService.getCurrentUser();
    if (!user?.userUUID) {
      console.error('User UUID is missing', user);
      return;
    }

    const formData = new FormData();
    formData.append('title', this.post.title);
    formData.append('content', this.post.content);
    
    if (this.fileToUpload) {
      formData.append('media', this.fileToUpload);
    }
    
    formData.append('userUuid', user.userUUID); // Assurez-vous que user.userUUID est une chaîne
      // formData.append('userUuid', "37fcb2b3-662e-4389-9187-2333d5f38f4b");


    // console.log('Submitting form with userUuid:', user.userUUID); // Vérifiez l'UUID

    this.postService.addPost(formData).subscribe({
      next: () => {
        this.resetForm();
        this.postAdded.emit();
        this.showForm = false;
      },
      error: (err) => {
        console.error('Error adding post', err);
        console.error('Error details:', err.error);
      }
    });
  }
  

  resetForm(): void {
    this.post = { title: '', content: '', mediaUrl: '' };
    this.fileToUpload = null;
  }
}