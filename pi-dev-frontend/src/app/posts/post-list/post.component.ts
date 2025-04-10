
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from './service';
import { Post } from '../../modules/Post';
import { TypeReaction } from '../../modules/TypeReaction';  // Assurez-vous que cet import est correct

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  public TypeReaction = TypeReaction;

  posts: Post[] = [];

  constructor(
    private postService: PostService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getAllPosts().subscribe({
      next: (data) => {
        this.posts = data;
        console.log('Données reçues :', this.posts);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des posts :', error);
      }
    });
  }

  // Méthode pour naviguer vers les détails du post
  viewPost(postId: string): void {
    this.router.navigate(['/posts', postId]);
  }

  editPost(postId: string): void {
    this.router.navigate(['/edit-post', postId]);
  }

  // Méthode pour ajouter une réaction au post
  addReaction(type: TypeReaction, postId: string): void {
    const reaction = {
      reactionId: '',  // Si généré côté backend, laisser vide
      typeReaction: type,
      post: { idPost: postId } as Post
    };

    this.postService.addReactionToPost(postId, reaction).subscribe({
      next: (res) => {
        console.log('Réaction ajoutée avec succès', res);
        // Après avoir ajouté la réaction, recharge les posts pour afficher les nouvelles réactions
        this.loadPosts();
      },
      error: (err) => {
        console.error('Erreur lors de l’ajout de la réaction', err);
      }
    });
  }

  // Méthode pour obtenir le nombre de réactions de chaque type
  getReactionCount(post: Post, type: TypeReaction): number {
    return post.reactions?.filter(reaction => reaction.typeReaction === type).length || 0;
  }
}
