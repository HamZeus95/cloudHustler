import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BlogComponent } from './pages/blog/blog.component';
import { AboutComponent } from './pages/about/about.component';
import { MarketComponent } from './pages/market/market.component';
import { EventComponent } from './pages/event/event.component';
import { JobsComponent } from './pages/jobs/jobs.component';
import { ContactComponent } from './pages/contact/contact.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PostComponent } from './components/posts/post-list/post.component';
import { AddPostComponent } from './components/posts/add-post/add-post.component';
import { PostDetailsComponent } from './components/posts/post-details/post-details.component';
import { EditPostComponent } from './components/posts/edit-post/edit-post.component';
import { AddCommentComponent } from './components/comment/add-comment/add-comment.component';
import { EditCommentComponent } from './components/comment/edit-comment/edit-comment.component';
import { PostBackComponent } from '../backoffice/components/post-back/post-back.component';
import { ChatAiComponent } from './components/chat-ai/chat-ai.component';
const routes: Routes = [


     { path :"post",component: PostComponent },
      { path :"add-comment",component: AddCommentComponent},
      { path :"add-post",component: AddPostComponent },
      { path :"edit-post/:id",component: EditPostComponent },
      { path :"posts/:postId",component: PostDetailsComponent },
      { 
        path: 'post/:postId/edit-comment/:commentId', 
        component: EditCommentComponent 
      },
      {path: "post-back",component: PostBackComponent},
      {path: 'ia', component: ChatAiComponent},

  { path: '', component:HomeComponent },
  { path: 'blog', component: BlogComponent },
    {path:"about",component:AboutComponent},
    {path:"home",component:HomeComponent},
    {path:'market', component: MarketComponent},
    {path:'event',component:EventComponent},
    {path:'jobs',component:JobsComponent},
    {path:'contact',component:ContactComponent},
    {path: 'not-found', component: NotFoundComponent},
];

@NgModule({
  imports: [
    
    RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FrontofficeRoutingModule { }
