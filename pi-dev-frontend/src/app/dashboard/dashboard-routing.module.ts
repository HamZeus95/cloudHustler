import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillingComponent } from './billing/billing.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { DashboardComponent } from './dashboard.component';
import { CommonModule } from '@angular/common';
import { TablesComponent } from './tables/tables.component';
import { AddEventComponent } from './add-event/add-event.component';
import { EditEventComponent } from './edit-event/edit-event.component';

const routes: Routes = [
  {
    path: '', // Empty because it's already 'dashboard' in the main router
    component: DashboardComponent,
    children: [
      { path: 'layout', component: DashboardLayoutComponent },
      { path: 'billing', component: BillingComponent },
      {path :'tables',component:TablesComponent},
      { path :'add-event',component:AddEventComponent },
      { path: 'edit-event/:id', component: EditEventComponent }
    ]
  },
   



];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule

  ],
  exports: [RouterModule],

})
export class DashboardRoutingModule { }
