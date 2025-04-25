import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FrontofficeRoutingModule } from './frontoffice-routing.module';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AboutComponent } from './pages/about/about.component';
import { BlogComponent } from './pages/blog/blog.component';
import { ContactComponent } from './pages/contact/contact.component';
import { EventComponent } from './pages/event/event.component';
import { HomeComponent } from './pages/home/home.component';
import { JobsComponent } from './pages/jobs/jobs.component';
import { MarketComponent } from './pages/market/market.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { FactureClientComponent } from './pages/livraison/facture-client/facture-client.component';
import { LivraisonClientComponent } from './pages/livraison/livraison-client/livraison-client.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar'; 
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { DialogModule } from 'primeng/dialog';
import { LivraisonClientdetailsComponent } from './pages/livraison/livraison-clientdetails/livraison-clientdetails.component';
import { FactureClientdetailsComponent } from './pages/livraison/facture-clientdetails/facture-clientdetails.component';

import { MapComponent } from './pages/livraison/map/map.component';
import { LivraisondriverComponent } from './pages/livraison/livraisondriver/livraisondriver.component'; 
import { ReactiveFormsModule } from "@angular/forms";
import { CoreDirectivesModule } from "../core/directives/directives";   
import { ForgotPasswordComponent } from "./pages/auth/forgot-password/forgot-password.component";
import { LoginComponent } from "./pages/auth/login/login.component";
import { LogoutComponent } from "./pages/auth/logout/logout.component";
import { OtpComponent } from "./pages/auth/otp/otp.component";
import { RegisterComponent } from "./pages/auth/register/register.component";
import { ResetPasswordComponent } from "./pages/auth/reset-password/reset-password.component";   
import { PostComponent } from "./components/posts/post-list/post.component";
import { AddPostComponent } from "./components/posts/add-post/add-post.component";
import { AddReactionComponent } from "./components/reaction/add-reaction/add-reaction.component";
import { AddCommentComponent } from "./components/comment/add-comment/add-comment.component";
import { ListCommentComponent } from "./components/comment/list-comment/list-comment.component";
import { ChatAiComponent } from "./components/chat-ai/chat-ai.component";



@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
    AboutComponent,
    BlogComponent,
    ContactComponent,
    EventComponent,
    HomeComponent,
    JobsComponent,
    MarketComponent,
    NotFoundComponent,
    FactureClientComponent,
    LivraisonClientComponent,
    LivraisonClientdetailsComponent,
    FactureClientdetailsComponent, 
    MapComponent,
    LivraisondriverComponent,   
    LoginComponent,
    RegisterComponent,
    OtpComponent,
    LogoutComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,  
    PostComponent,
    AddPostComponent,
    AddReactionComponent,
    AddCommentComponent,
    ListCommentComponent,
    ChatAiComponent

  ],
  imports: [
    CommonModule,
    FormsModule,
    FrontofficeRoutingModule,
    RouterModule,
    DialogModule,
    NgChartsModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule, 
    ReactiveFormsModule,
    CoreDirectivesModule, 

  ],
  providers: [] 
 
})
export class FrontofficeModule { }
