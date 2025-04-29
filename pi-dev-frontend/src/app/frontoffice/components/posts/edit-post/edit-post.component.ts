import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../../../core/services/service';
import { Post } from '../../../../core/models/Post';
import { AuthService } from '../../../../auth/service/authentication.service';
import { TokenStorageService } from '../../../../auth/service/token-storage.service';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {
  postId: string = '';
  post: Post = { idPost: '', title: '', content: '', mediaUrl: '', createdAt: '' , };
  currentUser: any = null;
  isAuthenticated = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    public router: Router,
    private authService: AuthService,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        this.currentUser = this.tokenStorageService.getCurrentUser();
      }
    });

    this.tokenStorageService.getUser().subscribe(user => {
      this.currentUser = user;
    });

    this.route.params.subscribe(params => {
      if (!params['id']) {
        this.router.navigate(['/not-found']);
        return;
      }
      
      this.postId = params['id'];
      this.loadPost();
    });
  }

  loadPost() {
    this.postService.getPostById(this.postId).subscribe({
      next: (data) => {
        this.post = data;
        this.post.idPost = this.postId;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du post :', error);
        this.errorMessage = 'Erreur lors du chargement du post';
      }
    });
  }

  savePost() {
    if (!this.post.idPost) {
      this.errorMessage = 'ID du post manquant';
      return;
    }

    if (!this.post.title || !this.post.content) {
      this.errorMessage = 'Le titre et le contenu sont obligatoires';
      return;
    }

    this.postService.updatePost(this.post.idPost, this.post).subscribe({
      next: () => {
        this.router.navigate(['/frontoffice/blog']);
      },
      error: (error) => {
        console.error('Erreur modification post :', error);
        this.errorMessage = 'Erreur lors de la modification du post';
      }
    });
  }
}