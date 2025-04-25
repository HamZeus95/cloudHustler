import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../../../core/services/service';
import { Post } from '../../../core/models/Post';
import { TypeReaction } from '../../../core/models/TypeReaction';
import { environment } from '../../../../environments/environment';
import { commentaires } from 'src/app/core/models/Comment';

@Component({
  selector: 'app-post-back',
  templateUrl: './post-back.component.html',
  styleUrls: ['./post-back.component.css']
})
export class PostBackComponent {
  public TypeReaction = TypeReaction;
  posts: Post[] = [];
  comments: commentaires[] = [];
  isLoading = false; // Ajout de la propriété manquante

  paginatedPosts: Post[] = [];
  defaultImage = 'assets/images/default-image.png';
  selectedPostId: any;
  
  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 3; // Nombre d'éléments par page
  totalPosts: number = 0;
  totalPages: number = 0;

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
        this.totalPosts = this.posts.length;
        this.totalPages = Math.ceil(this.totalPosts / this.itemsPerPage);
        this.updatePaginatedPosts();
      },
      error: (error) => console.error('Error loading posts:', error)
    });
  }

  updatePaginatedPosts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedPosts = this.posts.slice(startIndex, endIndex);
  }

 

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedPosts();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedPosts();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedPosts();
    }
  }

  getFullMediaUrl(url: string | undefined): string {
    if (!url) return this.defaultImage;
    
    if (url.startsWith('http') || url.startsWith('data:')) {
      return url;
    }
    
    return `${environment.apiBaseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    console.warn('Image load failed:', img.src);
    img.src = this.defaultImage;
    img.onerror = null;
  }

  editPost(id: string) {
    if (id) {
      this.router.navigate(['/edit-post', id]);
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
          this.totalPosts = this.posts.length;
          this.totalPages = Math.ceil(this.totalPosts / this.itemsPerPage);
          
          // Si la page actuelle est vide après suppression, revenir à la page précédente
          if (this.currentPage > this.totalPages) {
            this.currentPage = Math.max(1, this.totalPages);
          }
          
          this.updatePaginatedPosts();
          alert('Post supprimé avec succès');
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          alert('Échec de la suppression du post');
        }
      });
    }
  }
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5; // Nombre maximum de pages visibles
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;
    
    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
  loadAllData(): void {
    this.isLoading = true;
    
    this.postService.getAllPosts().subscribe(posts => {
      this.posts = posts;
      
      this.postService.getAllComment().subscribe((comments: commentaires[]) => {
        this.comments = comments;
        this.isLoading = false;
      });
    });
  }
  filteredPostsWithDates(): Post[] {
    return this.posts
      .filter(post => post.idPost && post.createdAt && !isNaN(new Date(post.createdAt).getTime()))
      .map(post => ({
        ...post,
        createdAt: post.createdAt ? new Date(post.createdAt).toISOString() : new Date().toISOString()
      }));
  }

  validComments(): commentaires[] {
    return this.comments.filter(comment => 
      this.getCommentPostId(comment) && comment.content);
  }

  private getCommentPostId(comment: commentaires): string | undefined {
    return (comment as any).idPost;
  }
}
