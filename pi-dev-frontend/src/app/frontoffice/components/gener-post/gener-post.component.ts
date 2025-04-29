import { Component } from '@angular/core';
import { GeminiService } from '../../../core/services/gemini.service';

@Component({
  selector: 'app-gener-post',
  templateUrl: './gener-post.component.html',
  styleUrls: ['./gener-post.component.css']
})
export class GenerPostComponent {
  theme: string = '';
  generatedPost: string = '';
  isGenerating: boolean = false;
  errorMessage: string | null = null;
  isGeneratorVisible: boolean = false; // Nouvelle propriété pour gérer la visibilité

  constructor(private geminiService: GeminiService) {}
  toggleGenerator(): void {
    this.isGeneratorVisible = !this.isGeneratorVisible;
  }
  generatePost(): void {
    if (!this.theme.trim()) {
      this.errorMessage = 'Veuillez entrer un thème';
      return;
    }

    this.isGenerating = true;
    this.errorMessage = null;
    this.generatedPost = '';

    const prompt = `Génère un paragraphe de contexte sur le thème suivant: ${this.theme}. 
                   Le texte doit être en français, clair et concis (environ 150 mots).`;

    this.geminiService.askGemini(prompt).subscribe({
      next: (response) => {
        this.generatedPost = response.response || 'Aucune réponse reçue';
        this.isGenerating = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la génération du post';
        this.isGenerating = false;
        console.error(err);
      }
    });
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.generatedPost)
      .then(() => alert('Texte copié dans le presse-papiers !'))
      .catch(err => console.error('Erreur lors de la copie :', err));
  }
}