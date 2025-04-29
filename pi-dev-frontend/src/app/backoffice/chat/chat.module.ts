//import '../core/polyfills/global.polyfill';
import "../../core/polyfills/global.polyfill";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { ChatSidebarComponent } from './components/chat-sidebar/chat-sidebar.component';
import { ChatConversationComponent } from './components/chat-conversation/chat-conversation.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { ChatRequestsComponent } from './components/chat-requests/chat-requests.component';
import { ChatEmptyStateComponent } from './components/chat-empty-state/chat-empty-state.component'; 
import { SharedLayoutsModule } from '../shared/shared-layouts.module';
import { ChatsComponent } from './components/chat-sidebar/chats/chats.component';
import { RequestsComponent } from './components/chat-sidebar/requests/requests.component';
import { GroupsComponent } from './components/chat-sidebar/groups/groups.component';
import { BlockedComponent } from './components/chat-sidebar/blocked/blocked.component'; 

@NgModule({
  declarations: [
    ChatPageComponent,
    ChatSidebarComponent,
    ChatConversationComponent,
    ChatMessageComponent,
    ChatRequestsComponent,
    ChatEmptyStateComponent,
    ChatsComponent,
    RequestsComponent,
    GroupsComponent,
    BlockedComponent, 
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChatRoutingModule,
    SharedLayoutsModule
  ]
})
export class ChatModule { }
