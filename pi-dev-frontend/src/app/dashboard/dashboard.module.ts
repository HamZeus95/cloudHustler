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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuizComponent } from './jobs-dashboard/quiz/quiz.component';
import { CreateQuizComponent } from './jobs-dashboard/quiz/create-quiz/create-quiz.component';
import { UpdateQuestionsComponent } from './jobs-dashboard/quiz/update-questions/update-questions.component';
 

@NgModule({
  declarations: [
    DashboardComponent,
    BillingComponent,
    DashboardLayoutComponent,
    SideBarComponent,
    TablesComponent,
    JobsDashboardComponent,
    FormComponent,
    QuizComponent,
    CreateQuizComponent,
    UpdateQuestionsComponent,
     

  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    HttpClientModule,
    RouterModule,
    FormsModule,  // <-- Add FormsModule here
    ReactiveFormsModule // ✅ À ajouter ici


    

  ]
})
export class DashboardModule { }
