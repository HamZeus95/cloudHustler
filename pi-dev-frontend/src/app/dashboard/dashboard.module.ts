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
import { FarmService } from '../farms/services/farm.service';
import { CropService } from '../farms/services/crop.service';
import { FormsModule } from '@angular/forms';
import { FarmDetailsComponent } from '../farms/farm-details/farm-details.component';



@NgModule({
  declarations: [
    DashboardComponent,
    BillingComponent,
    DashboardLayoutComponent,
    SideBarComponent,
    TablesComponent,
    FarmDetailsComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    HttpClientModule,
    RouterModule,
    FormsModule
    
    

    

  ],
  providers: [FarmService,CropService],
})
export class DashboardModule { }
