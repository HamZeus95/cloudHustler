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
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CoreDirectivesModule } from "../core/directives/directives";
import { BackofficeRoutingModule } from "./backoffice-routing.module";
import { BannerComponent } from "./components/banner/banner.component";
import { CropDiseaseDetectorComponent } from "./components/crop-disease-detector/crop-disease-detector.component";
import { DashboardCardsComponent } from "./components/dashboard-cards/dashboard-cards.component";
import { AddEventComponent } from "./components/events/add-event/add-event.component";
import { BillingComponent } from "./components/events/billing/billing.component";
import { EditEventComponent } from "./components/events/edit-event/edit-event.component";
import { FarmDetailsComponent } from "./components/farm-details/farm-details.component";
import { FarmTableComponent } from "./components/farm-table/farm-table.component";
import { MapDialogComponent } from "./components/map-dialog/map-dialog.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { SettingsPanelComponent } from "./components/settings-panel/settings-panel.component";
import { SideBarComponent } from "./components/side-bar/side-bar.component";
import { TablesComponent } from "./components/tables/tables.component";
import { TaskManagementComponent } from "./components/task-management/task-management.component";
import { WeatherComponent } from "./components/weather/weather.component";
import { BlogManagmentComponent } from "./pages/blog-managment/blog-managment.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { EventComponent } from "./pages/event/event.component";
import { FarmManagmentComponent } from "./pages/farm-managment/farm-managment.component";
import { EditProfileComponent } from "./pages/profile/edit-profile/edit-profile.component";
import { ManageProfileComponent } from "./pages/profile/manage-profile/manage-profile.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { PostBackComponent } from "./components/post-back/post-back.component";
import { CommentBackComponent } from "./components/comment-back/comment-back.component";
import { StatsComponent } from "./components/stats/stats.component";
// Import the AdminLayoutComponent
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";

@NgModule({
  declarations: [
    BillingComponent,
    EditEventComponent,
    AddEventComponent,
    DashboardCardsComponent,
    SideBarComponent,
    NavbarComponent,
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
  DetailsFactureComponent,
  FactureComponent,
  DetailsLivraisonComponent,
  LivraisonComponent
    MapDialogComponent,
    //declarations of pages
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
    // Add the AdminLayoutComponent
    AdminLayoutComponent
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



    ReactiveFormsModule,
    FormsModule,
    DragDropModule,
    CoreDirectivesModule
  ],
  exports: [
    // Export components that might be used outside this module
    SideBarComponent,
    NavbarComponent,
    BannerComponent,
    AdminLayoutComponent
  ]
})
export class BackofficeModule { }
