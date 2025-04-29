import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BlogComponent } from './pages/blog/blog.component';
import { AboutComponent } from './pages/about/about.component';
import { MarketComponent } from './pages/market/market.component';
import { JobsComponent } from './pages/jobs/jobs.component';
import { ContactComponent } from './pages/contact/contact.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { FactureClientComponent } from './pages/livraison/facture-client/facture-client.component';
import { LivraisonClientComponent } from './pages/livraison/livraison-client/livraison-client.component';
import { LivraisonClientdetailsComponent } from './pages/livraison/livraison-clientdetails/livraison-clientdetails.component';
import { FactureClientdetailsComponent } from './pages/livraison/facture-clientdetails/facture-clientdetails.component';
import { MapComponent } from './pages/livraison/map/map.component';
import { LivraisondriverComponent } from './pages/livraison/livraisondriver/livraisondriver.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { OtpComponent } from './pages/auth/otp/otp.component';
import { LogoutComponent } from './pages/auth/logout/logout.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import {PublicGuard} from '../auth/guards/public.guard';
import { AuthGuard } from "../auth/guards/auth.guard";
import { JobRequestsComponent } from './pages/job-requests/job-requests.component';
import { FrontTakeQuizComponent } from './pages/front-take-quiz/front-take-quiz.component';


import { EventComponent } from './pages/event/event.component';
import { EditCommentComponent } from './components/comment/edit-comment/edit-comment.component';
import { EditPostComponent } from './components/posts/edit-post/edit-post.component';


const routes: Routes = [

    {path: '', component:HomeComponent },
    { path: 'blog', component: BlogComponent },
    {path:"about",component:AboutComponent},
    {path:"home",component:HomeComponent},
    {path:'market', component: MarketComponent},
    {path: 'blog', component: BlogComponent},
    {path:'event',component:EventComponent},
    {path:'jobs',component:JobsComponent},
    {path:'contact',component:ContactComponent},
    {path: 'not-found', component: NotFoundComponent},
    { path:'factures', component: FactureClientComponent, canActivate: [AuthGuard]},
    { path:'livraisons', component: LivraisonClientComponent, canActivate: [AuthGuard]},
    { path:'livraison-client-details/:id', component: LivraisonClientdetailsComponent, canActivate: [AuthGuard]},
    { path:'facture-client-details/:id', component: FactureClientdetailsComponent, canActivate: [AuthGuard]},
    { path:'suivrelivraison/:id', component: MapComponent, canActivate: [AuthGuard]},
    { path:'livraisonsDriver', component: LivraisondriverComponent, canActivate: [AuthGuard]},
    {path: 'login', component: LoginComponent, canActivate: [PublicGuard]},
    {path: 'register', component: RegisterComponent, canActivate: [PublicGuard]},
    {path: "verify-email", component: OtpComponent},
    {path: 'logout', component: LogoutComponent},
    {path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [PublicGuard]},
    {path: 'reset-password', component: ResetPasswordComponent, canActivate: [PublicGuard]},
    {path: 'not-found', component: NotFoundComponent},
  //event routes
    {path:'event',component:EventComponent},
  //blog routes
    { path: 'blog', component: BlogComponent },
  {
    path: 'post/:id',
    component: EditPostComponent,
  },
  {path: 'not-found', component: NotFoundComponent},

  {
    path: 'post/:postId/edit-comment/:commentId',
    component: EditCommentComponent
  },
  //livraison routes
    { path:'factures',  component: FactureClientComponent}, // ya hamza rodeha ken el user connectee
    { path:'livraisons',  component: LivraisonClientComponent}, // ya hamza rodeha ken el user connectee
    { path:'livraison-client-details/:id',  component: LivraisonClientdetailsComponent},// ya hamza rodeha ken el user connectee
    { path:'facture-client-details/:id',  component: FactureClientdetailsComponent}, // ya hamza rodeha ken el user connectee
    { path:'suivrelivraison/:id',  component: MapComponent}, // ya hamza rodeha ken el user connectee
    { path:'livraisonsDriver',  component: LivraisondriverComponent}, // ya hamza rodeha ken el user connectee w driver
  //market routes
    {path:'market', component: MarketComponent},
  //hiring routes
    {path:'jobs',component:JobsComponent},
    { path: 'job-request/:jobId', component: JobRequestsComponent },
    { path: 'take-quiz/:id', component: FrontTakeQuizComponent }, // Front-office quiz


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontofficeRoutingModule { }
