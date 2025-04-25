import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CoreDirectivesModule } from "../core/directives/directives";
import { EventComponent } from "./components/event/event.component";
import { FooterComponent } from "./components/footer/footer.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { FrontofficeRoutingModule } from "./frontoffice-routing.module";
import { AboutComponent } from "./pages/about/about.component";
import { ForgotPasswordComponent } from "./pages/auth/forgot-password/forgot-password.component";
import { LoginComponent } from "./pages/auth/login/login.component";
import { LogoutComponent } from "./pages/auth/logout/logout.component";
import { OtpComponent } from "./pages/auth/otp/otp.component";
import { RegisterComponent } from "./pages/auth/register/register.component";
import { ResetPasswordComponent } from "./pages/auth/reset-password/reset-password.component";
import { BlogComponent } from "./pages/blog/blog.component";
import { ContactComponent } from "./pages/contact/contact.component";
import { HomeComponent } from "./pages/home/home.component";
import { NotFoundComponent } from "./pages/not-found/not-found.component";
import { MarketComponent } from "./pages/market/market.component";
import { JobsComponent } from "./pages/jobs/jobs.component";
import { PostComponent } from "./components/posts/post-list/post.component";
import { AddPostComponent } from "./components/posts/add-post/add-post.component";
import { AddReactionComponent } from "./components/reaction/add-reaction/add-reaction.component";
import { AddCommentComponent } from "./components/comment/add-comment/add-comment.component";
import { ListCommentComponent } from "./components/comment/list-comment/list-comment.component";
import { ChatAiComponent } from "./components/chat-ai/chat-ai.component";



@NgModule({
  declarations: [
    AboutComponent,
    HomeComponent,
    NotFoundComponent,
    FooterComponent,  
    ContactComponent, 
    LoginComponent,
    RegisterComponent,
    OtpComponent,
    LogoutComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    NavbarComponent, 
    MarketComponent,
    JobsComponent,
    EventComponent,
    BlogComponent,
    PostComponent,
    AddPostComponent,
    AddReactionComponent,
    AddCommentComponent,
    ListCommentComponent,
    ChatAiComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    CoreDirectivesModule, 
    FrontofficeRoutingModule,
    FormsModule,  
  ]
})
export class FrontofficeModule { }
