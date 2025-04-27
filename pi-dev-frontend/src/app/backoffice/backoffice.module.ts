import { DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule, DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { RouterModule } from "@angular/router";
import { DialogModule } from "primeng/dialog";
import { CoreDirectivesModule } from "../core/directives/directives";
import { BannerComponent } from "./components/banner/banner.component";
import { BillingComponent } from "./components/events/billing/billing.component";
import { CommentBackComponent } from "./components/comment-back/comment-back.component";
import { CropDiseaseDetectorComponent } from "./components/crop-disease-detector/crop-disease-detector.component";
import { DashboardCardsComponent } from "./components/dashboard-cards/dashboard-cards.component";
import { AddEventComponent } from "./components/events/add-event/add-event.component";
import { EditEventComponent } from "./components/events/edit-event/edit-event.component";
import { FarmDetailsComponent } from "./components/farm-details/farm-details.component";
import { FarmTableComponent } from "./components/farm-table/farm-table.component";
import { MapDialogComponent } from "./components/map-dialog/map-dialog.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { PostBackComponent } from "./components/post-back/post-back.component";
import { SettingsPanelComponent } from "./components/settings-panel/settings-panel.component";
import { SideBarComponent } from "./components/side-bar/side-bar.component";
import { StatsComponent } from "./components/stats/stats.component";
import { TablesComponent } from "./components/tables/tables.component";
import { TaskManagementComponent } from "./components/task-management/task-management.component";
import { WeatherComponent } from "./components/weather/weather.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
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
import { BackofficeRoutingModule } from './backoffice-routing.module';
import { MarketplaceManagementComponent } from './pages/marketplace-management/marketplace-management.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductslistComponent } from './components/productslist/productslist.component';
import { ProductCategorieslistComponent } from './components/product-categorieslist/product-categorieslist.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { TopSellingProductsComponent } from './components/top-selling-products/top-selling-products.component';
import { NgChartsModule } from 'ng2-charts';
import { JobsBackComponent } from "./pages/hiring/jobs-back/jobs-back.component";
import { JobsFormComponent } from "./pages/hiring/jobs-form/jobs-form.component";
import { JobsRequestsDashboardComponent } from "./pages/hiring/jobs-requests-dashboard/jobs-requests-dashboard.component";
import { DipslayComponent } from "./pages/hiring/dipslay/dipslay.component";
import { EmailJobsComponent } from "./pages/hiring/email-jobs/email-jobs.component";
import { QuizComponent } from "./pages/hiring/quiz/quiz.component";
import { CreateQuizComponent } from "./pages/hiring/quiz/create-quiz/create-quiz.component";
import { UpdateQuestionsComponent } from "./pages/hiring/quiz/update-questions/update-questions.component";
 

@NgModule({
  declarations: [
    BillingComponent,
    EditEventComponent,
    AddEventComponent,
    DashboardCardsComponent,
    SideBarComponent,
    NavbarComponent,
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
    BannerComponent,
    PostBackComponent,
    CommentBackComponent,
    StatsComponent,
    AdminLayoutComponent,
    MarketplaceManagementComponent,
    ProductslistComponent,
    ProductCategorieslistComponent,
    OrderListComponent,
    TopSellingProductsComponent,
    JobsBackComponent,
    JobsFormComponent,
    JobsRequestsDashboardComponent,
    DipslayComponent,
    EmailJobsComponent,
    QuizComponent,
    CreateQuizComponent,
    UpdateQuestionsComponent
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

  ],
  providers: [
    DatePipe
  ],

  exports: [
    SideBarComponent,
    NavbarComponent,
    BannerComponent,
    AdminLayoutComponent
  ]
})
export class BackofficeModule { }
