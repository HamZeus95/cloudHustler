import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PostService } from '../../../../core/services/service';
import { Post } from 'src/app/core/models/Post';
import { TypeReaction } from 'src/app/core/models/TypeReaction';

import { AuthService } from '../../../../auth/service/authentication.service'; // Ajoutez cette importation
import { TokenStorageService } from '../../../../auth/service/token-storage.service'; // Ajoutez cette importation

@Component({
  selector: 'app-add-reaction',
  templateUrl: './add-reaction.component.html',
  styleUrls: ['./add-reaction.component.css']
})
export class AddReactionComponent implements OnChanges {
  @Input() post!: Post;
  

  
  // Define reactionTypes as an array of TypeReaction values
  reactionTypes: TypeReaction[] = Object.values(TypeReaction);
  
  // Initialize reactionCounts with proper typing
  reactionCounts: Record<TypeReaction, number> = {
    [TypeReaction.LIKE]: 0,
    [TypeReaction.LOVE]: 0,
    [TypeReaction.INSIGHTFUL]: 0,
    [TypeReaction.SUPPORT]: 0,
    [TypeReaction.CURIOUS]: 0
  };
  
  activeReaction: TypeReaction | null = null;
  isLoading = false;
  currentUser: any = null;
  isAuthenticated = false;

  constructor(private postService: PostService
    , private authService: AuthService,
              private tokenStorageService: TokenStorageService
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
    
    
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['post']) {
      this.updateReactionCounts();
    }
  }

  private updateReactionCounts(): void {
    this.reactionTypes.forEach(type => {
      this.reactionCounts[type] = 
        this.post.reactions?.filter(r => r.typeReaction === type).length || 0;
    });
  }


  private addNewReaction(type: TypeReaction): void {
    const reaction = {
      reactionId: '',  // Serra généré côté serveur
      typeReaction: type,
      post: { idPost: this.post.idPost } as Post
    };
  
    const userUUID = this.currentUser?.userUUID;
    if (!userUUID) {
      console.error('User UUID is not defined');
      this.isLoading = false;
      return;
    }
  
    this.postService.addReactionToPost(this.post.idPost!, reaction, userUUID).subscribe({
      next: (res) => {
        // Ajouter la nouvelle réaction à la liste
        this.post.reactions = [...(this.post.reactions || []), res];
        this.updateReactionCounts();
        this.isLoading = false;
        this.activeReaction = type;
      },
      error: (err) => {
        console.error('Error adding reaction', err);
        this.activeReaction = null;
        this.isLoading = false;
      }
    });
  }


  addReaction(type: TypeReaction): void {
  if (this.isLoading || !this.post.idPost || !this.currentUser?.userUUID) return;

  this.isLoading = true;
  this.activeReaction = type;

  // Vérifier si l'utilisateur a déjà réagi à ce post
  const existingReaction = this.post.reactions?.find(
    r => r.user?.userUUID === this.currentUser.userUUID
  );

  if (existingReaction) {
    // Si une réaction existe déjà et que c'est le même type, on la supprime
    if (existingReaction.typeReaction === type) {
      this.deleteReaction(existingReaction.reactionId);
    } else {
      // Si c'est un type différent, on supprime l'ancienne et on ajoute la nouvelle
      this.deleteReaction(existingReaction.reactionId).then(() => {
        this.addNewReaction(type);
      });
    }
  } else {
    // Si aucune réaction n'existe, ajouter la nouvelle réaction
    this.addNewReaction(type);
  }
}

private deleteReaction(reactionId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    this.postService.deleteReactionFromPost( reactionId).subscribe({
      next: () => {
        // Supprimer la réaction de la liste
        this.post.reactions = this.post.reactions?.filter(r => r.reactionId !== reactionId) || [];
        this.updateReactionCounts();
        this.isLoading = false;
        resolve();
      },
      error: (err) => {
        console.error('Error deleting reaction', err);
        this.isLoading = false;
        reject(err);
      }
    });
  });
}


  
   
  

  getReactionCount(type: TypeReaction): number {
    return this.reactionCounts[type] || 0;
  }

  getReactionEmoji(type: TypeReaction): string {
    const emojiMap: Record<TypeReaction, string> = {
      [TypeReaction.LIKE]: '👍',
      [TypeReaction.LOVE]: '❤️',
      [TypeReaction.INSIGHTFUL]: '💡',
      [TypeReaction.SUPPORT]: '🤝',
      [TypeReaction.CURIOUS]: '🤔'
    };
    return emojiMap[type];
  }

  isActive(type: TypeReaction): boolean {
    return this.activeReaction === type;
  }
}