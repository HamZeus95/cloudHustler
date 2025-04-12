import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { BillingComponent } from './billing/billing.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import {  HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { TablesComponent } from './tables/tables.component';
import { FarmService } from '../core/services/farm.service';
import { CropService } from '../core/services/crop.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FarmDetailsComponent } from '../farms/farm-details/farm-details.component';
import { TaskManagementComponent } from './task-management/task-management.component';



@NgModule({
  declarations: [
    DashboardComponent,
    BillingComponent,
    DashboardLayoutComponent,
    SideBarComponent,
    TablesComponent,
    FarmDetailsComponent,
    TaskManagementComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    FormsModule
    
    

    

  ],
  providers: [FarmService,CropService],
})
export class DashboardModule { }
