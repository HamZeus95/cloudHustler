import { Component, EventEmitter, Output } from '@angular/core';
import { PostService } from '../../../../core/services/service';
import { Post } from '../../../../core/models/Post';

import { AuthService } from '../../../../auth/service/authentication.service'; // Ajoutez cette importation
import { TokenStorageService } from '../../../../auth/service/token-storage.service'; // Ajoutez cette importation

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent {
  @Output() postAdded = new EventEmitter<void>();
  showForm = false; // État initial: formulaire masqué
 
  post: Post = {
    title: '',
    content: '',
    mediaUrl: '',
    
  };
  currentUser: any = null;
  isAuthenticated = false;
  fileToUpload: File | null = null;

  constructor(private postService: PostService ,
              private authService: AuthService,
              private tokenStorageService: TokenStorageService) { // Ajoutez cette injection
    
      }
    
    
  
  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        this.currentUser = this.tokenStorageService.getCurrentUser();
      }
      console.log(this.currentUser)
    });

    // Subscribe to user changes
    this.tokenStorageService.getUser().subscribe(user => {
      this.currentUser = user;
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
    if (!this.currentUser?.userUUID) {
      console.error('User UUID is missing');
      return;
    }
  
    const formData = new FormData();
    formData.append('title', this.post.title);
    formData.append('content', this.post.content);
    
    if (this.fileToUpload) {
      formData.append('media', this.fileToUpload);
    }
    
    // Add user UUID to the request
    formData.append('userUuid', this.currentUser.userUUID);
  
    console.log('FormData contents:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });
  
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