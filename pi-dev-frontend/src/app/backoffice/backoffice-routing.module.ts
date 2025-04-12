import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FarmService } from '../core/services/farm.service';
import { CropService } from '../core/services/crop.service';
import { FarmManagmentComponent } from './pages/farm-managment/farm-managment.component';
import { EventComponent } from './pages/event/event.component';

const routes: Routes = [
  { path: '', component: FarmManagmentComponent },
  { path: 'event', component: EventComponent },
  { path: 'blog', component: EventComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [FarmService,CropService]
})
export class BackofficeRoutingModule { }
