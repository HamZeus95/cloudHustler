import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventComponent } from '../frontoffice/components/event/event.component';
import { EventServiceService } from '../core/services/event-service.service';
import { AddEventComponent } from './components/events/add-event/add-event.component';
import { BillingComponent } from './components/events/billing/billing.component';
import { EditEventComponent } from './components/events/edit-event/edit-event.component';

const routes: Routes = [
    { path: 'backEvent', component: BillingComponent },
    { path: 'add-event', component: AddEventComponent },
    { path: 'edit-event/:id', component: EditEventComponent }
];
    @NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
        providers: [EventServiceService]
      })
      export class BackofficeRoutingModule { }
  
  
  
