import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { GeminiService } from '../../../core/services/gemini.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface Message {
  text: string;
  isUser: boolean;
  time: Date;
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
  toggleChat() {
    this.isOpen = !this.isOpen;
  }
  prompt = '';
  isLoading = false;
  messages: Message[] = [
    {
      text: 'Bonjour ! Je suis votre assistant taher. Comment puis-je vous aider ?',
      isUser: false,
      time: new Date()
    }
  ];

  constructor(private geminiService: GeminiService) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
    this.adjustTextareaHeight();
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

  this.geminiService.askGemini(userMessage).subscribe({
    next: (res) => {
      this.addMessage(res.response || 'No response received', false);
      this.isLoading = false;
    },
    error: (err) => {
      this.addMessage(err.error || 'Error processing request', false);
      this.isLoading = false;
    }
  });
}

private addMessage(text: string, isUser: boolean): void {
  this.messages.push({
    text,
    isUser,
    time: new Date()
  });
}


  private addUserMessage(text: string): void {
    this.messages.push({
      text,
      isUser: true,
      time: new Date()
    });
  }

  private addBotMessage(response: any): void {
    let messageText = 'Pas de réponse';
    
    if (typeof response === 'string') {
      messageText = response;
    } else if (response?.response) {
      messageText = response.response;
    } else if (response?.error) {
      messageText = `Erreur: ${response.error}`;
    }

    this.messages.push({
      text: messageText,
      isUser: false,
      time: new Date()
    });
    this.isLoading = false;
  }

  private addErrorMessage(error: any): void {
    this.messages.push({
      text: `Erreur: ${error.message || 'Erreur inconnue'}`,
      isUser: false,
      time: new Date()
    });
    this.isLoading = false;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.askAI();
    }
  }
}