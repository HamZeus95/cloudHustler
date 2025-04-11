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
import { AddEventComponent } from './add-event/add-event.component';
import { FormsModule } from '@angular/forms';
import { EditEventComponent } from './edit-event/edit-event.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DashboardComponent,
    BillingComponent,
    DashboardLayoutComponent,
    SideBarComponent,
    TablesComponent,
    AddEventComponent,
    AddEventComponent,
    EditEventComponent,
 
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    HttpClientModule,
    RouterModule,
    FormsModule ,
    ReactiveFormsModule
    

    

  ]
})
export class DashboardModule { }
