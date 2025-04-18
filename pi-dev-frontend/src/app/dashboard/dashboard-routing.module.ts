import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillingComponent } from './billing/billing.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { DashboardComponent } from './dashboard.component';
import { CommonModule } from '@angular/common';
import { TablesComponent } from './tables/tables.component';

const routes: Routes = [
  {
    path: '', // Empty because it's already 'dashboard' in the main router
    component: DashboardComponent,
    children: [
      { path: 'layout', component: DashboardLayoutComponent },
      { path: 'billing', component: BillingComponent },
      {path :'tables',component:TablesComponent},
    ]
  }



];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule

  ],
  exports: [RouterModule],

})
export class DashboardRoutingModule { }
