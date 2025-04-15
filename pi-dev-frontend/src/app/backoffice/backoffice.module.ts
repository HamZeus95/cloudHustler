import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BackofficeRoutingModule } from './backoffice-routing.module';
import { BillingComponent } from './components/billing/billing.component';
import { TablesComponent } from './components/tables/tables.component';
import { TaskManagementComponent } from './components/task-management/task-management.component';
import { FarmDetailsComponent } from './components/farm-details/farm-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { DashboardCardsComponent } from './components/dashboard-cards/dashboard-cards.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SettingsPanelComponent } from './components/settings-panel/settings-panel.component';
import { EventComponent } from './pages/event/event.component';
import { FarmManagmentComponent } from './pages/farm-managment/farm-managment.component';
import { FarmTableComponent } from './components/farm-table/farm-table.component';
import { BlogManagmentComponent } from './pages/blog-managment/blog-managment.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DetailsFactureComponent } from './pages/livraison/details-facture/details-facture.component';
import { FactureComponent } from './pages/livraison/factures/factures.component';
import { DetailsLivraisonComponent } from './pages/livraison/details-livraison/details-livraison.component';
import { LivraisonComponent } from './pages/livraison/livraisons/livraisons.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { DialogModule } from 'primeng/dialog';


@NgModule({
  declarations: [
    //declarations of components
    FarmDetailsComponent,
    SideBarComponent,
    BillingComponent,
    TablesComponent,
    TaskManagementComponent,
    DashboardCardsComponent,
    NavbarComponent,
    SettingsPanelComponent,
    FarmTableComponent,
    //declarations of pages
    FarmManagmentComponent,
    EventComponent,
    BlogManagmentComponent,
    DetailsFactureComponent,
    FactureComponent,
    DetailsLivraisonComponent,
    LivraisonComponent

  ],
  imports: [
    CommonModule,
    BackofficeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    RouterModule,
    DialogModule,
    //BrowserAnimationsModule,
    NgChartsModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    
  ],
  providers: [
    DatePipe
  ]
  //styles



})
export class BackofficeModule { }
