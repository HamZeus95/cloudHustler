import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../../../../core/services/service';
import { commentaires } from '../../../../core/models/Comment'; // Adjust path as needed
import { AuthService } from '../../../../auth/service/authentication.service'; // Ajoutez cette importation
import { TokenStorageService } from '../../../../auth/service/token-storage.service'; // Ajoutez cette importation


@Component({
  selector: 'app-list-comment',
  templateUrl: './list-comment.component.html',
  styleUrls: ['./list-comment.component.css']
})
export class ListCommentComponent implements OnInit {
  @Input() postId!: string;
  comments: commentaires[] = [];
  isLoading = false;
  isCommantair: boolean = false;
  currentUser: any = null;
  isAuthenticated = false;

  constructor(
    private router: Router,
    private postService: PostService,
    private authService: AuthService, // Ajoutez ce service
    private tokenStorageService: TokenStorageService // Ajoutez ce servic
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        this.currentUser = this.tokenStorageService.getCurrentUser();
      }
      console.log('Comment component currentUser:', this.currentUser);
      
      // Load comments after getting user authentication info
      this.loadComments();
    });

    // Subscribe to user changes
    this.tokenStorageService.getUser().subscribe(user => {
      this.currentUser = user;
      // Reload comments when user changes
      if (user) {
        this.loadComments();
      }
    });
  }
  isUserCommantair(commenterId: string | undefined): boolean {
    if (!this.currentUser || !commenterId) return false;
    return commenterId === this.currentUser.userUUID;
  }
  loadComments(): void {
    if (!this.postId) return;
    
    this.isLoading = true;
    this.postService.getCommentByPostId(this.postId).subscribe({
      next: (data: commentaires[]) => {
        this.comments = data.map(comment => {
          // Use commenterId if available, fall back to commantairId
          const commenterId = comment.commenterId || comment.commantairId;
          const isCommenter = this.isUserCommantair(commenterId);
          console.log(`Comment ${comment.commentId} - commenterId: ${commenterId}, currentUser: ${this.currentUser?.userUUID}, isCommenter: ${isCommenter}`);
          
          return {
            ...comment,
            isCommantair: isCommenter // Add isCommenter flag to each comment
          };
        });
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