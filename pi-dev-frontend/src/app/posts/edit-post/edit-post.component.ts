import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../post-list/service';
import { Post } from '../../modules/Post';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {

  postId: string = '';
  post: Post = { idPost: '', title: '', content: '', mediaUrl: '', createdAt: '' };

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.postId = params['id'];  // Récupérer l'ID du post depuis l'URL
      this.loadPost();
    });
  }

  loadPost() {
    this.postService.getPostById(this.postId).subscribe({
      next: (data) => {
        this.post = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du post :', error);
      }
    });
  }

  // Méthode pour enregistrer les modifications
  savePost() {
    if (!this.post.idPost) {
      console.error('ID du post manquant');
      return;
    }
  
    this.postService.updatePost(this.post.idPost, this.post).subscribe({
      next: (data) => {
        console.log('Post modifié avec succès');
        this.router.navigate(['/posts']);
      },
      error: (error) => {
        console.error('Erreur lors de la modification du post :', error);
      }
    });
  }
}
