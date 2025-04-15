import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { MarketComponent } from './market/market.component';
import { BlogComponent } from './blog/blog.component';
import { EventComponent } from './event/event.component';
import { JobsComponent } from './jobs/jobs.component';
import { ContactComponent } from './contact/contact.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { FactureClientComponent } from './livraison/facture-client/facture-client.component';
import { LivraisonClientComponent } from './livraison/livraison-client/livraison-client.component';



const routes: Routes = [
  //{ path: 'facture/:id', component: DetailsFactureComponent },
  //{ path: 'livraison/:id', component: DetailsLivraisonComponent },

  {path:"about",component:AboutComponent},
  {path:"home",component:HomeComponent},
  {path:'market', component: MarketComponent},
  {path: 'blog', component: BlogComponent},
  {path:'event',component:EventComponent},
  {path:'jobs',component:JobsComponent},
  {path:'contact',component:ContactComponent},
  {path: 'not-found', component: NotFoundComponent},
  { path:'factures',  component: FactureClientComponent},
  { path:'livraisons',  component: LivraisonClientComponent},

  {path: 'farms', loadChildren: () => import('./farms/farms.module').then(m => m.FarmsModule)},  
  {path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
  {path: '',redirectTo: 'home',pathMatch: 'full'},
  {path: '**', redirectTo: 'not-found'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
