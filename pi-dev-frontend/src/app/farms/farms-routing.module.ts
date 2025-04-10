import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FarmsListComponent } from './farms-list/farms-list.component';
import { AddFarmComponent } from './add-farm/add-farm.component';
import { FarmDetailsComponent } from './farm-details/farm-details.component';

const routes: Routes = [
  { path: '', component: FarmsListComponent },
  {path: 'details/:id', component: FarmDetailsComponent},
  {path:'add', component: AddFarmComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FarmsRoutingModule { }
