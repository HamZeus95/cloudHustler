import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BackofficeRoutingModule } from './backoffice-routing.module';
import { WebcamModule } from 'ngx-webcam'; // Import the WebcamModule
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDialogModule } from "@angular/material/dialog"; // Import MatDialogModule
import { MatFormFieldModule } from "@angular/material/form-field"; // Import MatFormFieldModule
import { MatInputModule } from "@angular/material/input"; // Import MatInputModule
import { RouterModule } from "@angular/router";
import { DialogModule } from "primeng/dialog";
import { CoreDirectivesModule } from "../core/directives/directives";
import { BillingComponent } from "./components/events/billing/billing.component";
import { CommentBackComponent } from "./components/comment-back/comment-back.component";
import { CropDiseaseDetectorComponent } from "./components/crop-disease-detector/crop-disease-detector.component";
import { DashboardCardsComponent } from "./components/dashboard-cards/dashboard-cards.component";
import { AddEventComponent } from "./components/events/add-event/add-event.component";
import { EditEventComponent } from "./components/events/edit-event/edit-event.component";
import { FarmDetailsComponent } from "./components/farm-details/farm-details.component";
import { FarmTableComponent } from "./components/farm-table/farm-table.component";
import { MapDialogComponent } from "./components/map-dialog/map-dialog.component";
import { PostBackComponent } from "./components/post-back/post-back.component";
import { SettingsPanelComponent } from "./components/settings-panel/settings-panel.component";
import { StatsComponent } from "./components/stats/stats.component";
import { TablesComponent } from "./components/tables/tables.component";
import { TaskManagementComponent } from "./components/task-management/task-management.component";
import { WeatherComponent } from "./components/weather/weather.component";
import { BlogManagmentComponent } from "./pages/blog-managment/blog-managment.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { EventComponent } from "./pages/event/event.component";
import { FarmManagmentComponent } from "./pages/farm-managment/farm-managment.component";
import { DetailsFactureComponent } from "./pages/livraison/details-facture/details-facture.component";
import { DetailsLivraisonComponent } from "./pages/livraison/details-livraison/details-livraison.component";
import { FactureComponent } from "./pages/livraison/factures/factures.component";
import { LivraisonComponent } from "./pages/livraison/livraisons/livraisons.component";
import { EditProfileComponent } from "./pages/profile/edit-profile/edit-profile.component";
import { ManageProfileComponent } from "./pages/profile/manage-profile/manage-profile.component";
import { MarketplaceManagementComponent } from './pages/marketplace-management/marketplace-management.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductslistComponent } from './components/productslist/productslist.component';
import { ProductCategorieslistComponent } from './components/product-categorieslist/product-categorieslist.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { TopSellingProductsComponent } from './components/top-selling-products/top-selling-products.component';
import { NgChartsModule } from 'ng2-charts';
import { DatePipe } from '@angular/common';
import { GroupDialogComponent } from './chat/components/group-dialog/group-dialog.component';
import { SharedLayoutsModule } from './shared/shared-layouts.module';
import { JobsBackComponent } from "./pages/hiring/jobs-back/jobs-back.component";
import { JobsFormComponent } from "./pages/hiring/jobs-form/jobs-form.component";
import { JobsRequestsDashboardComponent } from "./pages/hiring/jobs-requests-dashboard/jobs-requests-dashboard.component";
import { DipslayComponent } from "./pages/hiring/dipslay/dipslay.component";
import { EmailJobsComponent } from "./pages/hiring/email-jobs/email-jobs.component";
import { QuizComponent } from "./pages/hiring/quiz/quiz.component";
import { CreateQuizComponent } from "./pages/hiring/quiz/create-quiz/create-quiz.component";
import { UpdateQuestionsComponent } from "./pages/hiring/quiz/update-questions/update-questions.component";
import { IaFarmDashComponent } from './pages/ia-farm-dash/ia-farm-dash.component';
import { Farm3DComponent } from "./components/farm3d/farm3d.component";



@NgModule({
  declarations: [
    BillingComponent,
    EditEventComponent,
    AddEventComponent,
    DashboardCardsComponent,
    FarmDetailsComponent, 
    TablesComponent,
    TaskManagementComponent, 
    SettingsPanelComponent,
    FarmTableComponent,
    DetailsFactureComponent,
    FactureComponent,
    DetailsLivraisonComponent,
    LivraisonComponent,
    MapDialogComponent,
    FarmManagmentComponent,
    EventComponent,
    BlogManagmentComponent,
    CropDiseaseDetectorComponent,
    WeatherComponent,
    DashboardComponent,
    EditProfileComponent,
    ManageProfileComponent,
    PostBackComponent,
    CommentBackComponent,
    StatsComponent,
    MarketplaceManagementComponent,
    ProductslistComponent,
    ProductCategorieslistComponent,
    OrderListComponent,
    TopSellingProductsComponent,
    GroupDialogComponent, 
    JobsBackComponent,
    JobsFormComponent,
    JobsRequestsDashboardComponent,
    DipslayComponent,
    EmailJobsComponent,
    QuizComponent,
    CreateQuizComponent,
    UpdateQuestionsComponent,
    IaFarmDashComponent,
    Farm3DComponent,
  ],
  imports: [
    CommonModule,
    BackofficeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    RouterModule,
    DialogModule,
    NgChartsModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,  
    CoreDirectivesModule,
    HttpClientModule,
    SharedLayoutsModule,
    WebcamModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule, 

  ],
  providers: [
    DatePipe
  ]
})
export class BackofficeModule { }
