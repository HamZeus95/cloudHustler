import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../../../../core/services/service';
import { commentaires } from '../../../../core/models/Comment'; // Adjust path as needed

@Component({
  selector: 'app-list-comment',
  templateUrl: './list-comment.component.html',
  styleUrls: ['./list-comment.component.css']
})
export class ListCommentComponent implements OnInit {
  @Input() postId!: string;
  comments: commentaires[] = [];
  isLoading = false;

  constructor(
    private router: Router,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    if (!this.postId) return;
    
    this.isLoading = true;
    this.postService.getCommentByPostId(this.postId).subscribe({
      next: (data: commentaires[]) => {
        this.comments = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading comments:', err);
        this.isLoading = false;
      }
    });
  }

  editComment(commentId: string): void {
    if (!commentId) return;
    this.router.navigate(['/frontoffice/post', this.postId, 'edit-comment', commentId]);
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
  showComments = false; // État initial: commentaires masqués

  // Méthode pour basculer l'affichage
  toggleComments(): void {
    this.showComments = !this.showComments;
    
    // Optionnel: Charger les commentaires seulement quand on ouvre
    if (this.showComments && (this.comments.length === 0)) {
      this.loadComments();
    }
  }
}