import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceeComponent } from './servicee/servicee.component';
import { ServiceRequestsComponent } from './service-requests/service-requests.component';

const routes: Routes = [
  { path: '', redirectTo: '/services', pathMatch: 'full' },  // Redirection vers /services si aucune route n'est spécifiée
  { path: 'services', component: ServiceeComponent},  // Route pour afficher les services
  { path: 'servicesRequests', component: ServiceRequestsComponent },  // Route pour afficher les demandes de service
  { path: 'service-request/:uuid', component: ServiceRequestsComponent },  // Détails d'une demande de service par UUID,  // Détails d'une demande de service par UUID
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
 }
