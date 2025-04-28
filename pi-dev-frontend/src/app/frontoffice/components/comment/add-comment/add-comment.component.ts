import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PostService } from '../../../../core/services/service';
import { commentaires } from 'src/app/core/models/Comment'; 
// Corrige le chemin
import { AuthService } from '../../../../auth/service/authentication.service'; // Ajoutez cette importation
import { TokenStorageService } from '../../../../auth/service/token-storage.service'; // Ajoutez cette importation
import { GeminiService } from 'src/app/core/services/gemini.service';

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
              private tokenStorageService: TokenStorageService,
              private geminiService: GeminiService  // <= Ajout
) { // Ajoutez cette injection
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
      const comment: any = this.commentForm.value;  // <= Remplacer ici
      const userUuid = this.currentUser?.userUUID;
  
      if (!userUuid) {
        console.error('Utilisateur non connecté ou UUID manquant');
        return;
      }
  
      const prompt = `Ce texte contient-il des insultes, propos haineux ou mots inappropriés ? Réponds uniquement par "OUI" ou "NON". Texte: "${comment.content}"`;
  
      // Vérification avec Gemini
      this.geminiService.askGemini(prompt).subscribe({
        next: (geminiResponse: any) => {
          const response = geminiResponse.response?.toUpperCase().trim();
  
          if (response === 'NON') {
            // Aucun badword, on peut envoyer le commentaire
            this.postService.addCommentToPost(this.postId, comment, userUuid).subscribe({
              next: (res: any) => {
                console.log('Commentaire ajouté !', res);
                this.commentForm.reset();
                window.location.reload();
              },
              error: (err: any) => {
                console.error('Erreur lors de l\'ajout', err);
              }
            });
          } else if (response === 'OUI') {
            // Badword détecté
            alert('Votre commentaire contient des mots inappropriés. Veuillez le corriger.');
          } else {
            console.error('Réponse inattendue de Gemini:', geminiResponse);
            alert('Erreur de validation du commentaire. Essayez encore.');
          }
        },
        error: (error: any) => {
          console.error('Erreur Gemini:', error);
          alert('Erreur lors de la vérification du commentaire.');
        }
      });
    }
  }
}