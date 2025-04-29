import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { EventComponent } from '../frontoffice/components/event/event.component';
import { FarmService } from '../core/services/farm-managment/farm.service';
import { CropService } from '../core/services/farm-managment/crop.service';
import { FarmManagmentComponent } from './pages/farm-managment/farm-managment.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component'; 
import { TaskManagementComponent } from './components/task-management/task-management.component';
import { WeatherComponent } from './components/weather/weather.component';
import { CropDiseaseDetectorComponent } from "./components/crop-disease-detector/crop-disease-detector.component"
import { AddEventComponent } from './components/events/add-event/add-event.component';
import { EditEventComponent } from './components/events/edit-event/edit-event.component';
import { EditProfileComponent } from './pages/profile/edit-profile/edit-profile.component';
import { ManageProfileComponent } from './pages/profile/manage-profile/manage-profile.component'; 
import { WeatherService } from '../core/services/farm-managment/weather.service';
import { BlogManagmentComponent } from './pages/blog-managment/blog-managment.component';
import { DetailsFactureComponent } from './pages/livraison/details-facture/details-facture.component';
import { DetailsLivraisonComponent } from './pages/livraison/details-livraison/details-livraison.component';
import { FactureComponent } from './pages/livraison/factures/factures.component';
import { LivraisonComponent } from './pages/livraison/livraisons/livraisons.component';
import { SuiviLivraisonComponent } from './pages/livraison/suivilivraisons/suivilivraisons.component';
import { MarketplaceManagementComponent } from './pages/marketplace-management/marketplace-management.component';
import { BillingComponent } from './components/events/billing/billing.component';
import { ChatPageComponent } from './chat/pages/chat-page/chat-page.component';
import { JobsBackComponent } from './pages/hiring/jobs-back/jobs-back.component';
import { JobsRequestsDashboardComponent } from './pages/hiring/jobs-requests-dashboard/jobs-requests-dashboard.component';
import { DipslayComponent } from './pages/hiring/dipslay/dipslay.component';
import { EmailJobsComponent } from './pages/hiring/email-jobs/email-jobs.component';
import { QuizComponent } from './pages/hiring/quiz/quiz.component';
import { RessourceService } from '../core/services/farm-managment/ressource.service';
import { ExpenseService } from '../core/services/farm-managment/expense.service';
import { IaFarmDashComponent } from './pages/ia-farm-dash/ia-farm-dash.component';


const routes: Routes = [
    { path: '', component: DashboardComponent },
  //auth routes
    { path: 'profile/edit-profile/:uuid', component: EditProfileComponent},
    { path: 'profile/manage-profile/:uuid', component: ManageProfileComponent},
  //farm routes
    { path: 'farm', component: FarmManagmentComponent },
    { path: 'task', component: TaskManagementComponent },
    {path:"crop",component:CropDiseaseDetectorComponent},
    {path:"weather",component:WeatherComponent},
    {path:"farm-ia",component:IaFarmDashComponent},
  //event routes
    { path: 'backEvent', component: BillingComponent },
    { path: 'add-event', component: AddEventComponent },
    { path: 'edit-event/:id', component: EditEventComponent },
  //blog routes
    { path: 'blog', component: BlogManagmentComponent },
  //livraison routes
    { path: 'facture/:id', component: DetailsFactureComponent },
    { path: 'livraison/:id', component: DetailsLivraisonComponent },
    { path:'factures',  component: FactureComponent},
    { path:'livraisons',  component: LivraisonComponent},
    { path:'suivilivraison',  component: SuiviLivraisonComponent},
  //market routes
    { path: 'market', component: MarketplaceManagementComponent },
    // { path: 'chat', component: ChatPageComponent },
  //chat routes
    { path: 'chat', loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule) },
    {path:'jobs',component:JobsBackComponent},
    {path:'jobsRequests',component:JobsRequestsDashboardComponent},
    { path: 'display-cv/:cvurl', component: DipslayComponent },
    {path:'email',component:EmailJobsComponent},
    {path:'quiz/:id',component:QuizComponent}



];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [FarmService,CropService,RessourceService,ExpenseService,WeatherService]
})
export class BackofficeRoutingModule { }
