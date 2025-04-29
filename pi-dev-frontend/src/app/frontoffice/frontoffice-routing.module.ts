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
import { EventComponent } from './pages/event/event.component';
import { PaymentComponent } from './components/payment/payment.component';


const routes: Routes = [
    {path: '', component:HomeComponent },
    {path:"about",component:AboutComponent},
    {path:"home",component:HomeComponent},
    {path:'contact',component:ContactComponent},
    {path: 'not-found', component: NotFoundComponent},
  //auth routes
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: "verify-email", component: OtpComponent},
    {path: 'logout', component: LogoutComponent},
    {path: 'forgot-password', component: ForgotPasswordComponent},
    {path: 'reset-password', component: ResetPasswordComponent},
  //event routes
    {path:'event',component:EventComponent},
  //blog routes
    { path: 'blog', component: BlogComponent },
  //livraison routes
    { path:'factures',  component: FactureClientComponent},
    { path:'livraisons',  component: LivraisonClientComponent},
    { path:'livraison-client-details/:id',  component: LivraisonClientdetailsComponent},
    { path:'facture-client-details/:id',  component: FactureClientdetailsComponent},
    { path:'suivrelivraison/:id',  component: MapComponent},
    { path:'livraisonsDriver',  component: LivraisondriverComponent},
  //market routes
    {path:'market', component: MarketComponent},
    {path:'payment', component: PaymentComponent},
  //hiring routes
    {path:'jobs',component:JobsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontofficeRoutingModule { }
