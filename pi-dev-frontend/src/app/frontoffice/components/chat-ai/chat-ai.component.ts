import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { GeminiService } from '../../../core/services/gemini.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface Message {
  text: string;
  isUser: boolean;
  time: Date;
  isAgricultureRelated?: boolean;
}

@Component({
  selector: 'app-chat-ai',
  templateUrl: './chat-ai.component.html',
  styleUrls: ['./chat-ai.component.css']
})
export class ChatAiComponent implements AfterViewChecked {
  @ViewChild('chatHistory') private chatHistory!: ElementRef;
  @ViewChild('inputTextarea') private inputTextarea!: ElementRef;
  
  isOpen: boolean = false;
  prompt: string = '';
  isLoading: boolean = false;
  
  messages: Message[] = [
    {
      text: 'Bonjour ! Je suis votre assistant agricole expert. Je peux vous aider avec :\n- Techniques de culture\n- Problèmes de plantes\n- Gestion des sols\n- Technologies agricoles\n\nPosez-moi votre question agricole !',
      isUser: false,
      time: new Date(),
      isAgricultureRelated: true
    }
  ];

  private agricultureKeywords = [
    'agriculture', 'cultiver', 'culture', 'plante', 'sol', 'terre', 
    'irrigation', 'engrais', 'fertilisant', 'récolte', 'semence',
    'plantation', 'végétal', 'céréale', 'légume', 'fruit', 'élevage',
    'bétail', 'pesticide', 'serre', 'tracteur', 'moisson', 'jardinage',
    'horticulture', 'agronomie', 'agroécologie', 'sylviculture', 'viticulture',
    'ferme', 'champ', 'compost', 'phytosanitaire', 'arrosage', 'saison'
  ];

  constructor(private geminiService: GeminiService) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
    this.adjustTextareaHeight();
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  private scrollToBottom(): void {
    try {
      this.chatHistory.nativeElement.scrollTop = this.chatHistory.nativeElement.scrollHeight;
    } catch(err) { console.error(err); }
  }

  private adjustTextareaHeight(): void {
    if (!this.inputTextarea?.nativeElement) return;
    const textarea = this.inputTextarea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }

  askAI(): void {
    if (!this.prompt.trim()) return;

    const userMessage = this.prompt;
    this.addMessage(userMessage, true);
    this.isLoading = true;
    this.prompt = '';

    const farmingPrompt = `[STRICTEMENT AGRICOLE]
    Tu es un expert agricole. Réponds uniquement si la question concerne:
    - Techniques de culture
    - Problèmes de plantes
    - Gestion des sols
    - Technologies agricoles
    
    Si la question n'est pas agricole, réponds: "Je suis spécialisé en agriculture uniquement. Posez-moi une question sur les cultures, plantes ou techniques agricoles."
    
    Question: ${userMessage}
    
    Réponse (en français, technique mais claire):`;

    this.geminiService.askGemini(farmingPrompt).pipe(
      catchError(err => {
        this.addBotMessage("Désolé, service indisponible. Réessayez plus tard.");
        return throwError(err);
      })
    ).subscribe({
      next: (res) => {
        const response = res.response || '';
        this.addBotMessage(response);
      },
      error: () => this.isLoading = false
    });
  }

  private addBotMessage(text: string): void {
    const isAgricultureRelated = this.checkAgricultureRelated(text);
    const finalText = isAgricultureRelated 
      ? this.formatAgricultureResponse(text)
      : "Je suis spécialisé en agriculture uniquement. Posez-moi une question sur les cultures, plantes ou techniques agricoles.";
    
    this.messages.push({
      text: finalText,
      isUser: false,
      time: new Date(),
      isAgricultureRelated
    });
    this.isLoading = false;
    this.scrollToBottom();
  }

  private addMessage(text: string, isUser: boolean): void {
    this.messages.push({
      text,
      isUser,
      time: new Date(),
      isAgricultureRelated: isUser ? true : this.checkAgricultureRelated(text)
    });
    this.scrollToBottom();
  }

  private checkAgricultureRelated(text: string): boolean {
    const lowerText = text.toLowerCase();
    return this.agricultureKeywords.some(keyword => lowerText.includes(keyword));
  }

  private formatAgricultureResponse(text: string): string {
    const emojiMap: Record<string, string> = {
      'agriculture': '🚜',
      'cultiver': '🌾',
      'plante': '🌱',
      'sol': '🌍',
      'eau': '💧',
      'engrais': '🧪',
      'récolte': '🪓',
      'conseil': '💡',
      'agriculteur': '👨‍🌾',
      'maladie': '🦠',
      'semence': '🌰',
      'serre': '🏡',
      'tracteur': '🚜',
      'compost': '♻️',
      'irrigation': '⛲'
    };

    return text.split(' ').map(word => {
      const emoji = emojiMap[word.toLowerCase()];
      return emoji ? `${emoji} ${word}` : word;
    }).join(' ');
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.askAI();
    }
  }

  suggestQuestion(question: string): void {
    this.prompt = question;
    this.askAI();
  }
}