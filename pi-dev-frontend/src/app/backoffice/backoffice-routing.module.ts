import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FarmService } from '../core/services/farm.service';
import { CropService } from '../core/services/crop.service';
import { FarmManagmentComponent } from './pages/farm-managment/farm-managment.component';
import { EventComponent } from './pages/event/event.component';
import { TaskManagementComponent } from './components/task-management/task-management.component';
import { CropDiseaseDetectorComponent } from './components/crop-disease-detector/crop-disease-detector.component';
import { RessourceService } from '../core/services/ressource.service';
import { ExpenseService } from '../core/services/expense.service';
import { WeatherService } from '../core/services/weather.service';
import { WeatherComponent } from './components/weather/weather.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EditProfileComponent } from './pages/profile/edit-profile/edit-profile.component';
import { ManageProfileComponent } from './pages/profile/manage-profile/manage-profile.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'farm', component: FarmManagmentComponent },
  { path: 'event', component: EventComponent },
  { path: 'blog', component: EventComponent },
  { path: 'task', component: TaskManagementComponent },
  {path:"crop",component:CropDiseaseDetectorComponent},
  {path:"weather",component:WeatherComponent},
  { path: 'profile/edit-profile/:uuid', component: EditProfileComponent},
  { path: 'profile/manage-profile/:uuid', component: ManageProfileComponent}

  


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [FarmService,CropService,RessourceService,ExpenseService,WeatherService]
})
export class BackofficeRoutingModule { }
