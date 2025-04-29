import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ChatMessage, MessageType } from '../../models';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent {
  @Input() message!: ChatMessage;
  @Input() isFromCurrentUser: boolean = false;
  @Input() showSender: boolean = false;
  @Output() deleteMessageEvent = new EventEmitter<string>();
  
  showOptions: boolean = false;
  MessageType = MessageType; // Make enum available in template

  constructor() {}

  // Format message timestamp
  formatTime(timestamp: string): string {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }

  // Check if message content is a URL
  isUrl(content: string): boolean {
    if (!content) return false;
    try {
      new URL(content);
      return true;
    } catch {
      return false;
    }
  }

  // Extract file name from URL
  getFileNameFromUrl(url?: string): string {
    if (!url) return 'File';
    try {
      const pathname = new URL(url).pathname;
      return pathname.substring(pathname.lastIndexOf('/') + 1);
    } catch {
      // If URL parsing fails, get the last part of the string after the last '/'
      const parts = url.split('/');
      return parts[parts.length - 1];
    }
  }

  // Toggle message options menu
  toggleOptions(): void {
    this.showOptions = !this.showOptions;
  }

  // Delete message
  deleteMessage(): void {
    this.deleteMessageEvent.emit(this.message.id);
    this.showOptions = false;
  }
}
