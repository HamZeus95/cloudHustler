import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-empty-state',
  templateUrl: './chat-empty-state.component.html',
  styleUrls: ['./chat-empty-state.component.css']
})
export class ChatEmptyStateComponent {
  @Input() stateType: string = 'chats';

  getEmptyStateMessage(): string {
    switch(this.stateType) {
      case 'chats':
        return 'Select a conversation or search for someone to start chatting';
      case 'requests':
        return 'Here you can see and manage chat requests from other users';
      case 'groups':
        return 'Join a group or create a new one to start group discussions';
      case 'blocked':
        return 'Users you have blocked will appear here';
      default:
        return 'Select a conversation to start chatting';
    }
  }

  getEmptyStateIcon(): string {
    switch(this.stateType) {
      case 'chats':
        return 'fa-comment-dots';
      case 'requests':
        return 'fa-user-plus';
      case 'groups':
        return 'fa-users';
      case 'blocked':
        return 'fa-ban';
      default:
        return 'fa-comment-dots';
    }
  }
}
