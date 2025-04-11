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
import { JobsDashboardComponent } from './jobs-dashboard/jobs-dashboard.component';
import { FormComponent } from './jobs-dashboard/form/form.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DashboardComponent,
    BillingComponent,
    DashboardLayoutComponent,
    SideBarComponent,
    TablesComponent,
    JobsDashboardComponent,
    FormComponent,
    

  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    HttpClientModule,
    RouterModule,
    FormsModule,  // <-- Add FormsModule here


    

  ]
})
export class DashboardModule { }
