import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FarmsRoutingModule } from './farms-routing.module';
import { FarmsListComponent } from './farms-list/farms-list.component';
import { AddFarmComponent } from './add-farm/add-farm.component';
import { FarmService } from './services/farm.service';


@NgModule({
  declarations: [
    FarmsListComponent,
    AddFarmComponent
  ],
  imports: [
    CommonModule,
    FarmsRoutingModule
  ],
  providers: [
    FarmService
  ],
})
export class FarmsModule { }
