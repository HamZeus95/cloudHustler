import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../../../core/services/service';
import { Post } from 'src/app/core/models/Post';
import { commentaires } from 'src/app/core/models/Comment';
import { Router } from '@angular/router';
import { TypeReaction } from '../../../../core/models/TypeReaction';
import { environment } from 'src/environments/environment'; // Importez l'environnement

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {
  postId!: string;
  post!: Post;
  comments: commentaires[] = [];
  public TypeReaction = TypeReaction;
  defaultImage = 'assets/images/default-image.png'; // Correction du nom de variable
  selectedPostId: any;

  constructor(private route: ActivatedRoute, private router: Router, private postService: PostService) {}

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('postId') || '';
    this.loadPost();
    this.loadComments();
  }
    
  loadPost(): void {
    this.postService.getPostById(this.postId).subscribe({
      next: (data: Post) => this.post = data,
      error: (err) => console.error(err)
    });
  }
  
  loadComments(): void {
    this.postService.getCommentByPostId(this.postId).subscribe({
      next: (data) => {
        this.comments = data.map(comment => ({...comment}));
      },
      error: (error) => console.error('Error loading posts:', error)
    });
  }
  
  editComment(commentId: string): void {
    if (!commentId) return;
    this.router.navigate(['/post', this.postId, 'edit-comment', commentId]);
  }
  
  deleteComment(commentId: string): void {
    if (!commentId) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      this.postService.deleteComment(commentId).subscribe({
        next: () => {
          this.loadComments();
          alert('Commentaire supprimé avec succès');
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          alert('Échec de la suppression du commentaire');
        }
      });
    }
  }

  isImage(url: string | undefined): boolean {
    if (!url) return false;
    return url.match(/\.(jpeg|jpg|gif|png|webp)$/) !== null || 
           url.startsWith('data:image');
  }

  getFullMediaUrl(url: string | undefined): string {
    if (!url) return this.defaultImage;
    
    // URL absolue existante
    if (url.startsWith('http') || url.startsWith('data:')) {
      return url;
    }
    
    // URL relative avec base API
    return `${environment.apiBaseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    console.warn('Image load failed:', img.src);
    img.src = this.defaultImage;
    img.onerror = null; // Prévenir les boucles d'erreur
  }
}