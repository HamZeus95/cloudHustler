import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../post-list/service';
import { Post } from '../../modules/Post';
import { Comment } from '../../modules/Comment'; // Importer le modèle Comment

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {
  post: Post | null = null;
  comments: Comment[] = []; // Ajouter un tableau pour les commentaires

  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('postId');
    if (postId) {
      // Récupérer le post par son ID
      this.postService.getPostById(postId).subscribe((data) => {
        this.post = data;
      });

      // Récupérer les commentaires pour ce post
      this.postService.getCommentsByPostId(postId).subscribe((commentsData) => {
        console.log(commentsData);  // Affichez les données pour vérifier leur structure
        this.comments // Assignez les commentaires récupérés directement
      });
      
      
    }
  }
}
