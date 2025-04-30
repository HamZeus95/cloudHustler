import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../../../../core/services/service';
import { Post } from '../../../../core/models/Post';
import { TypeReaction } from '../../../../core/models/TypeReaction';
import { environment } from '../../../../../environments/environment';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';



import { AuthService } from '../../../../auth/service/authentication.service'; // Ajoutez cette importation
import { TokenStorageService } from '../../../../auth/service/token-storage.service'; // Ajoutez cette importation


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  public TypeReaction = TypeReaction;
  posts: Post[] = [];
  filteredPosts: Post[] = [];
  defaultImage = 'assets/images/default-image.png';
  selectedPostId: any;
  searchTerm: string = '';
  isGeneratingPdf = false;
  currentUser: any = null;
  isAuthenticated = false;
  isPoster: boolean = false;
  
  @ViewChildren('postElement') postElements!: QueryList<ElementRef>;

  constructor(
    private postService: PostService,
    private router: Router,
    private authService: AuthService, // Ajoutez ce service
    private tokenStorageService: TokenStorageService // Ajoutez ce servic
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        this.currentUser = this.tokenStorageService.getCurrentUser();
      }
      console.log(this.currentUser)
    });

    // Subscribe to user changes
    this.tokenStorageService.getUser().subscribe(user => {
      this.currentUser = user;
    });
    this.loadPosts();
    
    
  }
  
  

  reactions = [
    { type: TypeReaction.LIKE, emoji: '👍', label: 'Like' },
    { type: TypeReaction.LOVE, emoji: '❤️', label: 'Love' },
    { type: TypeReaction.INSIGHTFUL, emoji: '💡', label: 'Insightful' },
    { type: TypeReaction.SUPPORT, emoji: '🤝', label: 'Support' },
    { type: TypeReaction.CURIOUS, emoji: '🤔', label: 'Curious' }
  ];

  isUserPoster(posterId: string | undefined): boolean {
    if (!this.currentUser || !posterId) return false;
     
    return posterId == this.currentUser.userUUID;
  }

  async exportToPdf(postId: string, element: HTMLElement): Promise<void> {
    if (!postId || this.isGeneratingPdf) return;
    
    this.isGeneratingPdf = true;
    
    try {
      // Clone l'élément pour ne pas modifier l'original
      const clonedElement = element.cloneNode(true) as HTMLElement;
      
      // Supprime les boutons
      const buttons = clonedElement.querySelectorAll('.post-actions');
      buttons.forEach(button => button.remove());
      
      // Supprime l'image du post
      const postImage = clonedElement.querySelector('.static-image-container');
      if (postImage) {
        postImage.remove();
      }
      
      // Supprime la section des réactions
      const reactionSection = clonedElement.querySelector('app-add-reaction');
      if (reactionSection) {
        reactionSection.remove();
      }
            // Supprime la section des commentaires
            

      const addCommentSection  = clonedElement.querySelector('app-add-comment');
      if (addCommentSection ) {
        addCommentSection .remove();
      }
      // Récupère tous les commentaires pour ce post
      const comments = await this.postService.getCommentByPostId(postId).toPromise();
      
      // Crée un élément pour afficher les commentaires
      const commentsContainer = document.createElement('div');
      commentsContainer.style.marginTop = '20px';
      commentsContainer.style.borderTop = '1px solid #eee';
      commentsContainer.style.paddingTop = '15px';
      
      if (comments && comments.length > 0) {
        const commentsTitle = document.createElement('h4');
        commentsTitle.textContent = 'Commentaires (' + comments.length + ')';
        commentsTitle.style.marginBottom = '15px';
        commentsContainer.appendChild(commentsTitle);
        
        comments.forEach(comment => {
          const commentDiv = document.createElement('div');
          commentDiv.style.marginBottom = '15px';
          commentDiv.style.padding = '10px';
          commentDiv.style.backgroundColor = '#f9f9f9';
          commentDiv.style.borderRadius = '5px';
          
          const userInfo = document.createElement('div');
          userInfo.style.display = 'flex';
          userInfo.style.alignItems = 'center';
          userInfo.style.marginBottom = '8px';
          
          const avatar = document.createElement('img');
          avatar.style.width = '30px';
          avatar.style.height = '30px';
          avatar.style.borderRadius = '50%';
          avatar.style.marginRight = '10px';
          
          const userName = document.createElement('span');
          userName.style.fontWeight = 'bold';
          
          userInfo.appendChild(avatar);
          userInfo.appendChild(userName);
          
          const content = document.createElement('p');
          content.textContent = comment.content;
          content.style.margin = '0';
          
          commentDiv.appendChild(userInfo);
          commentDiv.appendChild(content);
          
          commentsContainer.appendChild(commentDiv);
        });
      } else {
        const noComments = document.createElement('p');
        noComments.textContent = 'Aucun commentaire';
        noComments.style.fontStyle = 'italic';
        commentsContainer.appendChild(noComments);
      }
      
      // Ajoute les commentaires au clone
      clonedElement.appendChild(commentsContainer);
      
      // Ajoute temporairement le clone au DOM
      document.body.appendChild(clonedElement);
      
      const options = {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
      };

      const canvas = await html2canvas(clonedElement, options);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      let heightLeft = pdfHeight;
      let position = 10;
      const pageHeight = pdf.internal.pageSize.getHeight() - 20;
      
      pdf.addImage(imgData, 'PNG', 10, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }
      
      // Supprime le clone du DOM
      document.body.removeChild(clonedElement);
      
      pdf.save(`post-${postId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Une erreur est survenue lors de la génération du PDF');
    } finally {
      this.isGeneratingPdf = false;
    }
  }

  loadPosts(): void {
    console.log('currentUser:', this.currentUser);
    this.postService.getAllPosts().subscribe({
      next: (data) => {
        this.posts = data.map(post => {
          const isPoster = this.isUserPoster(post.posterId);
           
          return {
            ...post, 
            mediaUrl: this.getFullMediaUrl(post.mediaUrl),
            isPoster: isPoster
          };
        });
        this.filteredPosts = [...this.posts];
      },
      error: (error) => console.error('Error loading posts:', error)
    });
  }

  filterPosts(): void {
    if (!this.searchTerm) {
      this.filteredPosts = [...this.posts];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredPosts = this.posts.filter(post => 
      (post.title && post.title.toLowerCase().includes(term)) || 
      (post.content && post.content.toLowerCase().includes(term))
    );
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

  viewPost(postId: string | undefined): void {
    if (postId) {
      this.router.navigate(['frontoffice/posts', postId]);
    }
  }

  editPost(id: string): void {
    this.router.navigate(['/frontoffice/post', id]).catch(err => {
      console.error('Navigation error:', err);
      // Optional: Redirect to not-found if the navigation fails
      this.router.navigate(['/not-found']);
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
          this.filteredPosts = this.filteredPosts.filter(post => post.idPost !== postId);
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
    return post.reactions?.some(r => r.typeReaction === type) || false;
  }

  isLandscapeImage(url: string): boolean {
    return true;
  }

  focusCommentInput(postId: string): void {
    // Logique pour focus l'input de commentaire
  }
}