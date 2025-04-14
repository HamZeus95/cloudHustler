import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PostService } from '../../../../core/services/service';
import { Post } from 'src/app/core/models/Post';
import { TypeReaction } from 'src/app/core/models/TypeReaction';

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

  constructor(private postService: PostService) {}

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

  addReaction(type: TypeReaction): void {
    if (this.isLoading || !this.post.idPost) return;
    
    this.isLoading = true;
    this.activeReaction = type;

    const reaction = {
      reactionId: '',
      typeReaction: type,
      post: { idPost: this.post.idPost } as Post
    };

    this.postService.addReactionToPost(this.post.idPost, reaction).subscribe({
      next: (res) => {
        // Update local post reactions to avoid full reload
        this.post.reactions = [...(this.post.reactions || []), res];
        this.updateReactionCounts();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error adding reaction', err);
        this.activeReaction = null;
        this.isLoading = false;
      }
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