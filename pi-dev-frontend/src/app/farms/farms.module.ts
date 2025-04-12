import { For } from './../../../node_modules/@babel/types/lib/index-legacy.d';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FarmsRoutingModule } from './farms-routing.module';
import { FarmsListComponent } from './farms-list/farms-list.component';
import { AddFarmComponent } from './add-farm/add-farm.component';
import { FarmService } from '../core/services/farm.service';

@NgModule({
  declarations: [
    FarmsListComponent,
    AddFarmComponent,
  ],
  imports: [
    CommonModule,
    FarmsRoutingModule,
    ReactiveFormsModule ,
    FormsModule
  ],
  providers: [
    FarmService
  ],
})
export class FarmsModule { }
