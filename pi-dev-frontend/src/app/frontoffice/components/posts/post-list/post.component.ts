import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../../../../core/services/service';
import { Post } from '../../../../core/models/Post';
import { TypeReaction } from '../../../../core/models/TypeReaction';
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  public TypeReaction = TypeReaction;
  posts: Post[] = [];
  defaultImage = 'assets/images/default-image.png';
selectedPostId: any;

  constructor(
    private postService: PostService,
    
    private router: Router
    
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }
  reactions = [
    { type: TypeReaction.LIKE, emoji: '👍', label: 'Like' },
    { type: TypeReaction.LOVE, emoji: '❤️', label: 'Love' },
    { type: TypeReaction.INSIGHTFUL, emoji: '💡', label: 'Insightful' },
    { type: TypeReaction.SUPPORT, emoji: '🤝', label: 'Support' },
    { type: TypeReaction.CURIOUS, emoji: '🤔', label: 'Curious' }
  ];

  loadPosts(): void {
    this.postService.getAllPosts().subscribe({
      next: (data) => {
        this.posts = data.map(post => ({
          ...post,
          mediaUrl: this.getFullMediaUrl(post.mediaUrl)
        }));
      },
      error: (error) => console.error('Error loading posts:', error)
    });
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

  viewPost(postId: string | undefined): void {
    if (postId) {
      this.router.navigate(['frontoffice/posts', postId]);
    }
  }

  editPost(id: string) {
    if (id) {
      this.router.navigate(['frontoffice/edit-post', id]);
    } else {
      console.error("ID du post manquant pour la navigation.");
    }
  }

  addReaction(type: TypeReaction, postId: string | undefined): void {
    if (!postId) return;
    
    const reaction = {
      reactionId: '',
      typeReaction: type,
      post: { idPost: postId } as Post
    };

    this.postService.addReactionToPost(postId, reaction).subscribe({
      next: () => this.loadPosts(),
      error: (err) => console.error('Error adding reaction', err)
    });
  }

  getReactionCount(post: Post, type: TypeReaction): number {
    return post.reactions?.filter(r => r.typeReaction === type).length || 0;
  }

  isImage(url: string | undefined): boolean {
    if (!url) return false;
    return url.match(/\.(jpeg|jpg|gif|png|webp)$/) !== null || 
           url.startsWith('data:image');
  }
  deletePost(postId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce post et tous ses commentaires ?')) {
      this.postService.deletePost(postId).subscribe({
        next: () => {
          this.posts = this.posts.filter(post => post.idPost !== postId);
          alert('Post supprimé avec succès');
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          alert('Échec de la suppression du post');
        }
      });
    }
    
  }
  getTotalReactions(post: Post): number {
    return post.reactions?.length || 0;
  }

  hasReacted(post: Post, type: TypeReaction): boolean {
    // Implémentez cette méthode selon votre logique d'authentification
    return post.reactions?.some(r => r.typeReaction === type) || false;
  }

  isLandscapeImage(url: string): boolean {
    // Logique pour détecter si l'image est en paysage
    return true; // À adapter
  }

  focusCommentInput(postId: string): void {
    // Logique pour focus l'input de commentaire
  }
  
  
}