import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventComponent } from '../frontoffice/components/event/event.component';
import { BackofficeRoutingModule } from './backoffice-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BillingComponent } from './components/events/billing/billing.component';
import { EditEventComponent } from './components/events/edit-event/edit-event.component';
import { AddEventComponent } from './components/events/add-event/add-event.component';
import { DashboardCardsComponent } from './components/events/dashboard-cards/dashboard-cards.component';
import { SideBarComponent } from './components/events/side-bar/side-bar.component';
import { NavbarComponent } from './components/navbar/navbar.component';



@NgModule({
  declarations: [
    BillingComponent,
    EditEventComponent,
    AddEventComponent,
    DashboardCardsComponent,
    SideBarComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    BackofficeRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class BackofficeModule { }
