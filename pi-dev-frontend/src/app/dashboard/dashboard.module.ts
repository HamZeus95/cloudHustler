import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { BillingComponent } from './billing/billing.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import {  HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DashboardComponent } from './dashboard.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { TablesComponent } from './tables/tables.component';
import { DetailsFactureComponent } from './livraison/details-facture/details-facture.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { LivraisonComponent } from './livraison/livraisons/livraisons.component';
import { NgChartsModule } from 'ng2-charts';
import { DetailsLivraisonComponent } from './livraison/details-livraison/details-livraison.component';
import { FactureComponent } from './livraison/factures/factures.component';


@NgModule({
  declarations: [
    DashboardComponent,
    BillingComponent,
    DashboardLayoutComponent,
    SideBarComponent,
    TablesComponent,
    FactureComponent,
    DetailsFactureComponent,
    LivraisonComponent,
    DetailsLivraisonComponent,
    
  
    
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    HttpClientModule,
    RouterModule,
    MatIconModule,
    FormsModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatButtonModule,
    NgChartsModule,
    RouterModule,
    

    

  ],
  providers: [
    DatePipe
  ]
})
export class DashboardModule { }
