import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventComponent } from '../frontoffice/components/event/event.component';
import { FarmManagmentComponent } from './pages/farm-managment/farm-managment.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TaskManagementComponent } from './components/task-management/task-management.component';
import { WeatherComponent } from './components/weather/weather.component';
import { CropDiseaseDetectorComponent } from "./components/crop-disease-detector/crop-disease-detector.component"
import { AddEventComponent } from './components/events/add-event/add-event.component';
import { BillingComponent } from './components/events/billing/billing.component';
import { EditEventComponent } from './components/events/edit-event/edit-event.component';
import { EditProfileComponent } from './pages/profile/edit-profile/edit-profile.component';
import { ManageProfileComponent } from './pages/profile/manage-profile/manage-profile.component';
import { FarmService } from '../core/services/farm.service';
import { RessourceService } from '../core/services/ressource.service';
import { ExpenseService } from '../core/services/expense.service';
import { CropService } from '../core/services/crop.service';
import { WeatherService } from '../core/services/weather.service';
import { BlogManagmentComponent } from './pages/blog-managment/blog-managment.component';
import { DetailsFactureComponent } from './pages/livraison/details-facture/details-facture.component';
import { DetailsLivraisonComponent } from './pages/livraison/details-livraison/details-livraison.component';
import { FactureComponent } from './pages/livraison/factures/factures.component';
import { LivraisonComponent } from './pages/livraison/livraisons/livraisons.component';
import { SuiviLivraisonComponent } from './pages/livraison/suivilivraisons/suivilivraisons.component';

const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'backEvent', component: BillingComponent },
    { path: 'add-event', component: AddEventComponent },
    { path: 'edit-event/:id', component: EditEventComponent },
    { path: 'farm', component: FarmManagmentComponent },
    // { path: 'event', component: EventComponent },
    { path: 'blog', component: BlogManagmentComponent },
    { path: 'task', component: TaskManagementComponent },
    {path:"crop",component:CropDiseaseDetectorComponent},
    {path:"weather",component:WeatherComponent},
    { path: 'profile/edit-profile/:uuid', component: EditProfileComponent},
    { path: 'profile/manage-profile/:uuid', component: ManageProfileComponent},
  { path: 'facture/:id', component: DetailsFactureComponent },
  { path: 'livraison/:id', component: DetailsLivraisonComponent },
  { path:'factures',  component: FactureComponent},
  { path:'livraisons',  component: LivraisonComponent},
  { path:'suivilivraison',  component: SuiviLivraisonComponent},

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [FarmService,CropService,RessourceService,ExpenseService,WeatherService]
})
export class BackofficeRoutingModule { }
