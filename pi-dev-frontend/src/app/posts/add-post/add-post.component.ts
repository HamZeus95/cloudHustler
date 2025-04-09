import { Component } from '@angular/core';
import { PostService } from '../post-list/service';
import { Post } from '../../modules/Post';
@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent {
  post: Post = {
    title: '',
    content: '',
    mediaUrl: '',
    
  };

  constructor(private postService: PostService) {}

  onSubmit() {
    this.post.createdAt = new Date().toISOString();
    this.post.updatedAt = new Date().toISOString();

    this.postService.addPost(this.post).subscribe({
      next: (data) => {
        console.log('Post ajouté avec succès :', data);
        alert('Post ajouté !');
        this.post = { title: '', content: '', mediaUrl: '' }; // reset form
      },
      error: (err) => {
        console.error('Erreur lors de l’ajout :', err);
      }
    });
  }
}
