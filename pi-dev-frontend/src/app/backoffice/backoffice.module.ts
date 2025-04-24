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
  ],
  imports: [
    CommonModule,
    BackofficeRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    CoreDirectivesModule
    
  ]
  //styles



})
export class BackofficeModule { }
