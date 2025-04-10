import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PostComponent } from './posts/post-list/post.component';
import { HttpClientModule } from '@angular/common/http';
import { AddPostComponent } from './posts/add-post/add-post.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostDetailsComponent } from './posts/post-details/post-details.component';
import { ListCommentComponent } from './comment/list-comment/list-comment.component';
import { AddCommentComponent } from './comment/add-comment/add-comment.component';
import { AddReactionComponent } from './reaction/add-reaction/add-reaction.component';
import { EditPostComponent } from './posts/edit-post/edit-post.component';


@NgModule({
  declarations: [
    AppComponent,
    PostComponent,
    AddPostComponent,
    PostDetailsComponent,
    ListCommentComponent,
    AddCommentComponent,
    AddReactionComponent,
    EditPostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
