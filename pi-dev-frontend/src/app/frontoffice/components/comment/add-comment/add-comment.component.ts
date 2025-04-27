import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PostService } from '../../../../core/services/service';
import { commentaires } from 'src/app/core/models/Comment'; 
// Corrige le chemin
import { AuthService } from '../../../../auth/service/authentication.service'; // Ajoutez cette importation
import { TokenStorageService } from '../../../../auth/service/token-storage.service'; // Ajoutez cette importation


@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css']
})
export class AddCommentComponent {
  @Input() postId!: string;
  commentForm: FormGroup;
  currentUser: any = null;
  isAuthenticated = false;

  constructor(private postService: PostService, private fb: FormBuilder
              , private authService: AuthService,
              private tokenStorageService: TokenStorageService) { // Ajoutez cette injection
    this.commentForm = this.fb.group({
      content: ['']
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
    
    
  
  
   {
    this.commentForm = this.fb.group({
      content: ['']
    });
  }}

  submitComment() {
  if (this.commentForm.valid) {
    const comment: Comment = this.commentForm.value;
    const userUuid = this.currentUser?.userUUID; // récupérer l'UUID du user

    if (!userUuid) {
      console.error('Utilisateur non connecté ou UUID manquant');
      return;
    }

    this.postService.addCommentToPost(this.postId, comment, userUuid).subscribe({
      next: (res: any) => {
        console.log('Commentaire ajouté !', res);
        this.commentForm.reset();
        window.location.reload(); // Rafraîchir la page
      },
      error: (err: any) => {
        console.error('Erreur lors de l\'ajout', err);
      }
    });
  }
}
}
