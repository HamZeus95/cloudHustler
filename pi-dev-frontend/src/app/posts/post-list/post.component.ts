import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from './service';
import { Post } from '../../modules/Post';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  posts: Post[] = [];

  constructor(
    private postService: PostService,
    private router: Router
  ) {}

  ngOnInit(): void {
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

  viewPost(uuid: string): void {
    this.router.navigate(['/posts', uuid]);
  }
}
