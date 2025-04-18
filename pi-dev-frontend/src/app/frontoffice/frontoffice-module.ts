import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FrontofficeRoutingModule } from './frontoffice-routing.module';

import { NgModule } from '@angular/core';

import { NavbarComponent } from '../frontoffice/components/navbar/navbar.component';
import { FooterComponent } from '../frontoffice/components/footer/footer.component';
import { HomeComponent } from '../frontoffice/pages/home/home.component';
import { AboutComponent } from '../frontoffice/pages/about/about.component';
import { NotFoundComponent } from '../frontoffice/pages/not-found/not-found.component';
import { MarketComponent } from '../frontoffice/pages/market/market.component';
import { BlogComponent } from '../frontoffice/pages/blog/blog.component';
import { EventComponent } from '../frontoffice/pages/event/event.component';
import { JobsComponent } from '../frontoffice/pages/jobs/jobs.component';
import { ContactComponent } from '../frontoffice/pages/contact/contact.component';
import { PostComponent } from '../frontoffice/components/posts/post-list/post.component';
import { AddPostComponent } from '../frontoffice/components/posts/add-post/add-post.component';
import { PostDetailsComponent } from '../frontoffice/components/posts/post-details/post-details.component';
import { ListCommentComponent } from '../frontoffice/components/comment/list-comment/list-comment.component';
import { AddCommentComponent } from '../frontoffice/components/comment/add-comment/add-comment.component';
import { AddReactionComponent } from '../frontoffice/components/reaction/add-reaction/add-reaction.component';
import { EditPostComponent } from '../frontoffice/components/posts/edit-post/edit-post.component';
import { EditCommentComponent } from '../frontoffice/components/comment/edit-comment/edit-comment.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChatAiComponent } from './components/chat-ai/chat-ai.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    
        NavbarComponent,
        FooterComponent,
        HomeComponent,
        AboutComponent,
        NotFoundComponent,
        MarketComponent,
        BlogComponent,
        EventComponent,
        JobsComponent,
        ContactComponent,
        PostComponent,
        AddPostComponent,
        PostDetailsComponent,
        ListCommentComponent,
        AddCommentComponent,
        AddReactionComponent,
        EditPostComponent,
        EditCommentComponent,
        ListCommentComponent,
        ChatAiComponent,
        
  ],

    imports: [
      HttpClientModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }),
  

    CommonModule,
    FrontofficeRoutingModule,
    FormsModule,        // Required for Template-Driven Forms (ngModel)
    ReactiveFormsModule
    
    
  ]
})
export class FrontofficeModule { }
