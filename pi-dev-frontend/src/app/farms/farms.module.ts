import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FarmsRoutingModule } from './farms-routing.module';
import { FarmsListComponent } from './farms-list/farms-list.component';
import { AddFarmComponent } from './add-farm/add-farm.component';
import { FarmService } from './services/farm.service';
import { FarmDetailsComponent } from './farm-details/farm-details.component';

@NgModule({
  declarations: [
    FarmsListComponent,
    AddFarmComponent,
    FarmDetailsComponent
  ],
  imports: [
    CommonModule,
    FarmsRoutingModule,
    ReactiveFormsModule 
  ],
  providers: [
    FarmService
  ],
})
export class FarmsModule { }
