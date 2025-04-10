import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostComponent } from './posts/post-list/post.component';
import { AddPostComponent } from './posts/add-post/add-post.component';
import { PostDetailsComponent } from './posts/post-details/post-details.component';
import { AddCommentComponent } from './comment/add-comment/add-comment.component';

const routes: Routes = [
  { path :"home",component: PostComponent },
  { path :"add-comment",component: AddCommentComponent},
  { path :"add-post",component: AddPostComponent },
  { path :"edit-post/:postId",component: AddPostComponent },
  { path :"posts/:postId",component: PostDetailsComponent },



  { path: '', redirectTo: '/home', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
