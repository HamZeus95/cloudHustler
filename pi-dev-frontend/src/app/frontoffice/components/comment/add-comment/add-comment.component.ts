import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PostService } from '../../../../core/services/service';
import { commentaires } from 'src/app/core/models/Comment'; 
// Corrige le chemin


@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css']
})
export class AddCommentComponent {
  @Input() postId!: string;
  commentForm: FormGroup;

  constructor(private postService: PostService, private fb: FormBuilder) {
    this.commentForm = this.fb.group({
      content: ['']
    });
  }

  submitComment() {
    if (this.commentForm.valid) {
      const comment: Comment = this.commentForm.value;
      this.postService.addCommentToPost(this.postId, comment).subscribe({
        next: (res: any) => {
          
          console.log('Commentaire ajouté !', res);
          this.commentForm.reset();
        },
        error: (err: any) => {
          console.error('Erreur lors de l’ajout', err);
        }
      });
    }
  }
}
