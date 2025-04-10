import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../post-list/service';
import { Post } from 'src/app/modules/Post';
import { commentaires } from 'src/app/modules/Comment';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {
  postId!: string;
  post!: Post;
  comments: commentaires[] = [];

  constructor(private route: ActivatedRoute, private postService: PostService) {}

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('postId') || '';
    
    // Charger le post
    this.postService.getPostById(this.postId).subscribe({
      next: (data: Post) => {
        this.post = data;
      },
      error: (err) => console.error(err)
    });

    // Charger les commentaires
    this.postService.getCommentsByPostId(this.postId).subscribe({
      next: (data: commentaires[]) => {
        this.comments = data;
      },
      error: (err) => console.error(err)
    });
  }
}
