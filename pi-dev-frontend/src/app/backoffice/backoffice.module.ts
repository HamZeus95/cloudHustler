import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    BlogManagmentComponent
  ],
  imports: [
    CommonModule,
    BackofficeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    
  ]
  //styles



})
export class BackofficeModule { }
