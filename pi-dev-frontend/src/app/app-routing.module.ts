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
import { FactureComponent } from './dashboard/livraison/factures/factures.component';
import { LivraisonComponent } from './dashboard/livraison/livraisons/livraisons.component';
import { CreatefactureComponent } from './dashboard/livraison/createfacture/createfacture.component';
import { CreatelivraisonComponent } from './dashboard/livraison/createlivraison/createlivraison.component';
import { SuiviLivraisonComponent } from './dashboard/livraison/suivilivraisons/suivilivraisons.component';

const routes: Routes = [
  
  {path:"about",component:AboutComponent},
  {path:"home",component:HomeComponent},
  {path:'market', component: MarketComponent},
  {path: 'blog', component: BlogComponent},
  {path:'event',component:EventComponent},
  {path:'jobs',component:JobsComponent},
  {path:'contact',component:ContactComponent},
  {path: 'not-found', component: NotFoundComponent},
  { path:'factures',  component: FactureComponent},
  { path:'factures/add/:id',  component: FactureComponent},
  { path:'livraisons',  component: LivraisonComponent},
  { path:'livraisons/add',  component: LivraisonComponent},
  { path:'livraisons/update/:id',  component: LivraisonComponent},
  { path:'livraisons/details/:id', component: LivraisonComponent},
  { path:'suivilivraison',  component: SuiviLivraisonComponent},
  { path: 'facture/ajouter', component: CreatefactureComponent },
  { path: 'facture/modifier/:id', component: CreatefactureComponent },
  { path: 'livraison/ajouter', component: CreatelivraisonComponent },
  { path: 'livraison/modifier/:id', component: CreatelivraisonComponent },

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
