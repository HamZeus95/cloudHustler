import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { AuthService } from 'src/app/auth/service/authentication.service';
import { TokenStorageService } from "src/app/auth/service/token-storage.service";

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit, OnDestroy {
  activeSection: string = 'chats';
  currentUser: any;
  token?: string = undefined;
  isAuthenticated = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private tokenStorageService: TokenStorageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get current user
    this.authService.isAuthenticated().subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        this.currentUser = this.tokenStorageService.getCurrentUser();
        this.token = this.tokenStorageService.getToken() || undefined;
      }
       
    });

    // Subscribe to user changes
    this.tokenStorageService.getUser().subscribe(user => {
      this.currentUser = user;
    });

    
  //  console.log("first user", this.currentUser);
    
  //   // Connect to WebSocket
  //   this.chatService.connectWebSocket(this.token || undefined, this.currentUser.userUUID);

  //   // Check if there's a user ID in the route
  //   this.subscriptions.push(
  //     this.route.queryParams.subscribe(params => {
  //       if (params['userId']) {
  //         this.chatService.canChatWithUser(params['userId']).subscribe(
  //           canChat => {
  //             if (canChat) {
  //               this.chatService.setActiveConversation({ userId: params['userId'] });
  //             }
  //           }
  //         );
  //       }
  //     })
  //   );
  }

  ngOnDestroy(): void {
    // Disconnect WebSocket and unsubscribe from observables
    // this.chatService.disconnectWebSocket();
    // this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  switchSection(section: string): void {
    this.activeSection = section;
  }
}
