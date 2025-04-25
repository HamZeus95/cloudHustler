import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../../../core/services/service';
import { Post } from '../../../../core/models/Post';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {
  postId: string = '';
  post: Post = { idPost: '', title: '', content: '', mediaUrl: '', createdAt: '' };
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.postId = params['id'];
      this.loadPost();
    });
  }

  loadPost() {
    this.postService.getPostById(this.postId).subscribe({
      next: (data) => {
        this.post = data;
        this.post.idPost = this.postId;
        console.log('Post chargé:', this.post);  // <--- Ajoute ça
      },
      error: (error) => {
        console.error('Erreur lors du chargement du post :', error);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  savePost() {
    if (!this.post.idPost) {
      console.error('ID du post manquant');
      return;
    }

    const formData = new FormData();
    formData.append('post', new Blob([JSON.stringify(this.post)], { type: 'application/json' }));
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.postService.updatePost(this.post.idPost, this.post).subscribe({
      next: () => {
        console.log('Post modifié avec succès');
        this.router.navigate(['/homee']);
      },
      error: (error) => console.error('Erreur modification post :', error)
    });
  }
}


