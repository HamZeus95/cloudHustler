import { Component, Input } from '@angular/core';
import { PostService } from 'src/app/posts/post-list/service';
import { Reaction,  } from 'src/app/modules/Reaction';  // Assure-toi que Reaction et TypeReaction sont définis dans ton module
import { Post } from 'src/app/modules/Post';
import { TypeReaction } from 'src/app/modules/TypeReaction'; // Assure-toi que TypeReaction est défini dans ton module

@Component({
  selector: 'app-add-reaction',
  templateUrl: './add-reaction.component.html',
  styleUrls: ['./add-reaction.component.css']
})
export class AddReactionComponent {
  @Input() postId!: string; // Reçoit l'ID du post auquel on ajoute une réaction

  constructor(private postService: PostService) {}

  addReaction(type: TypeReaction) {
    const reaction: Reaction = {
      reactionId: '',  // Générer ou laisser vide si généré par le backend
      typeReaction: type,
      post: { idPost: this.postId } as Post // Associer la réaction à un post
    };

    this.postService.addReactionToPost(this.postId, reaction).subscribe({
      next: (res) => {
        console.log('Réaction ajoutée avec succès', res);
      },
      error: (err) => {
        console.error('Erreur lors de l’ajout de la réaction', err);
      }
    });
  }
}
