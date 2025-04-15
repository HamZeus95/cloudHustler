import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillingComponent } from './billing/billing.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { DashboardComponent } from './dashboard.component';
import { CommonModule } from '@angular/common';
import { TablesComponent } from './tables/tables.component';
import { DetailsFactureComponent } from './livraison/details-facture/details-facture.component';
import { DetailsLivraisonComponent } from './livraison/details-livraison/details-livraison.component';
import { FactureComponent } from './livraison/factures/factures.component';
import { LivraisonComponent } from './livraison/livraisons/livraisons.component';
import { SuiviLivraisonComponent } from './livraison/suivilivraisons/suivilivraisons.component';

const routes: Routes = [
  {
    path: '', // Empty because it's already 'dashboard' in the main router
    component: DashboardComponent,
    children: [
      { path: 'layout', component: DashboardLayoutComponent },
      { path: 'billing', component: BillingComponent },
      {path :'tables',component:TablesComponent},
      { path: 'facture/:id', component: DetailsFactureComponent },
      { path: 'livraison/:id', component: DetailsLivraisonComponent },
      { path:'factures',  component: FactureComponent},
      { path:'livraisons',  component: LivraisonComponent},
      { path:'suivilivraison',  component: SuiviLivraisonComponent},
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
