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
import { FactureClientComponent } from './pages/livraison/facture-client/facture-client.component';
import { LivraisonClientComponent } from './pages/livraison/livraison-client/livraison-client.component';
import { LivraisonClientdetailsComponent } from './pages/livraison/livraison-clientdetails/livraison-clientdetails.component';
import { FactureClientdetailsComponent } from './pages/livraison/facture-clientdetails/facture-clientdetails.component';
<<<<<<< Updated upstream
=======
import { MapComponent } from './pages/livraison/map/map.component';
>>>>>>> Stashed changes

const routes: Routes = [

  { path: '', component:HomeComponent },
  { path: 'blog', component: BlogComponent },
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
    { path:'livraison-client-details/:id',  component: LivraisonClientdetailsComponent},
    { path:'facture-client-details/:id',  component: FactureClientdetailsComponent},
<<<<<<< Updated upstream
=======
    { path:'suivrelivraison/:id',  component: MapComponent},

>>>>>>> Stashed changes

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontofficeRoutingModule { }
