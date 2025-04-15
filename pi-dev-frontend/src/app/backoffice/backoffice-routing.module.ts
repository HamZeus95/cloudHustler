import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FarmService } from '../core/services/farm.service';
import { CropService } from '../core/services/crop.service';
import { FarmManagmentComponent } from './pages/farm-managment/farm-managment.component';
import { EventComponent } from './pages/event/event.component';
import { TaskManagementComponent } from './components/task-management/task-management.component';
import { DetailsFactureComponent } from './pages/livraison/details-facture/details-facture.component';
import { DetailsLivraisonComponent } from './pages/livraison/details-livraison/details-livraison.component';
import { FactureComponent } from './pages/livraison/factures/factures.component';
import { LivraisonComponent } from './pages/livraison/livraisons/livraisons.component';
import { SuiviLivraisonComponent } from './pages/livraison/suivilivraisons/suivilivraisons.component';

const routes: Routes = [
  { path: '', component: FarmManagmentComponent },
  { path: 'event', component: EventComponent },
  { path: 'blog', component: EventComponent },
  { path: 'task', component: TaskManagementComponent },
  { path: 'facture/:id', component: DetailsFactureComponent },
  { path: 'livraison/:id', component: DetailsLivraisonComponent },
  { path:'factures',  component: FactureComponent},
  { path:'livraisons',  component: LivraisonComponent},
  { path:'suivilivraison',  component: SuiviLivraisonComponent},

  


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [FarmService,CropService]
})
export class BackofficeRoutingModule { }
