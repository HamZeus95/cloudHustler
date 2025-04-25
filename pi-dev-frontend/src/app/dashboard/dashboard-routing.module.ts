// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { BillingComponent } from './billing/billing.component';
// import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
// import { DashboardComponent } from './dashboard.component';
// import { CommonModule } from '@angular/common';
// import { TablesComponent } from './tables/tables.component';
// import { JobsDashboardComponent } from './jobs-dashboard/jobs-dashboard.component';
// import { JobsRequestsDashboardComponent } from './jobs-requests-dashboard/jobs-requests-dashboard.component';
// import { DipslayComponent } from '../dipslay/dipslay.component';
// import { QuizComponent } from './jobs-dashboard/quiz/quiz.component';
// import { NavbarComponent } from '../navbar/navbar.component';

// import { FrontTakeQuizComponent } from './jobs-dashboard/quiz/front-take-quiz/front-take-quiz.component';

// const routes: Routes = [
//   {
//     path: '', // Empty because it's already 'dashboard' in the main router
//     component: DashboardComponent,
//     children: [
//       { path: 'layout', component: DashboardLayoutComponent },
//       { path: 'billing', component: BillingComponent },
//       {path :'tables',component:TablesComponent},
//       {path:'hiring',component:JobsDashboardComponent},
//       {path:'jobsRequests', component:JobsRequestsDashboardComponent},
//       { path: 'cv/:cvUrl', component: DipslayComponent }, // Route pour afficher le CV

//       { path: 'quiz/:id', component: QuizComponent },
//       { path: 'take-quiz/:id', component: FrontTakeQuizComponent }, // Front-office quiz

//  // La route qui reçoit l'ID du service

//     ]
//   }



// ];

// @NgModule({
//   imports: [
//     RouterModule.forChild(routes),
//     CommonModule

//   ],
//   exports: [RouterModule],

// })
// export class DashboardRoutingModule { }
