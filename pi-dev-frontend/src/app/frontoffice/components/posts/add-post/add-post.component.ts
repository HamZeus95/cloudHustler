import { Component, EventEmitter, Output } from '@angular/core';
import { PostService } from '../../../../core/services/service';
import { Post } from '../../../../core/models/Post';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent {
  @Output() postAdded = new EventEmitter<void>();
  post: Post = {
    title: '',
    content: '',
    mediaUrl: ''
  };
  fileToUpload: File | null = null;

  constructor(private postService: PostService) {}

  isImage(url: string | undefined): boolean {
    if (!url) return false;
    return url.startsWith('data:image');
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
    const formData = new FormData();
    formData.append('title', this.post.title);
    formData.append('content', this.post.content);
    if (this.fileToUpload) {
      formData.append('media', this.fileToUpload);
    }
    formData.append('createdAt', new Date().toISOString());
    formData.append('updatedAt', new Date().toISOString());

    this.postService.addPost(formData).subscribe({
      next: () => {
        this.resetForm();
        this.postAdded.emit();
      },
      error: (err) => console.error('Error adding post', err)
    });
  }

  resetForm(): void {
    this.post = { title: '', content: '', mediaUrl: '' };
    this.fileToUpload = null;
  }
}