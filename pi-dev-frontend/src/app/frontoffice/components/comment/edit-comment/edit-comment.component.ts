import { Component, HostListener, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../../../core/services/service'
import { commentaires } from 'src/app/core/models/Comment';

import { AuthService } from '../../../../auth/service/authentication.service'; // Ajoutez cette importation
import { TokenStorageService } from '../../../../auth/service/token-storage.service'; // Ajoutez cette importation

@Component({
  selector: 'app-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrls: ['./edit-comment.component.css']
})

export class EditCommentComponent implements OnInit {
  commentForm: FormGroup;
  commentId!: string;
  postId!: string;
  isLoading = true;
  errorMessage = '';
  currentUser: any = null;
  isAuthenticated = false;
  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    this.onCancel();
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private authService: AuthService,
    private tokenStorageService: TokenStorageService
  ) {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

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
    
    this.commentId = this.route.snapshot.paramMap.get('commentId') || '';
    this.postId = this.route.snapshot.paramMap.get('postId') || '';
    
    if (this.commentId) {
      this.postService.getCommentById(this.commentId).subscribe({
        next: (comment: commentaires) => {
          this.commentForm.patchValue({
            content: comment.content
          });
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to load comment';
          this.isLoading = false;
          console.error(err);
        }
      });
    } else {
      this.isLoading = false;
      this.errorMessage = 'No comment ID provided';
    }
  }

  onSubmit(): void {
    if (this.commentForm.invalid) {
      return;
    }

    const updatedComment: commentaires = {
      ...this.commentForm.value,
      commentId: this.commentId
    };

    this.postService.updateCommentById(this.commentId, updatedComment).subscribe({
      next: () => {
        this.router.navigate(['/frontoffice/blog']);
      },
      error: (err) => {
        this.errorMessage = 'Failed to update comment';
        console.error(err);
      }
    });
  }
  

  onCancel(): void {
    this.router.navigate(['/frontoffice/blog']);
  }
}